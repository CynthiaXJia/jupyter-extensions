"""Services for AutoML extension that get reponses from the uCAIP API"""

import base64
import hashlib
import json
import uuid
from enum import Enum

from gcp_jupyterlab_shared.handlers import AuthProvider
from google.cloud import aiplatform_v1alpha1, exceptions, storage
from google.protobuf import json_format
from googleapiclient.discovery import build

API_ENDPOINT = "us-central1-aiplatform.googleapis.com"
TABLES_METADATA_SCHEMA = "gs://google-cloud-aiplatform/schema/dataset/metadata/tables_1.0.0.yaml"


def parse_dataset_type(dataset):
  key = "aiplatform.googleapis.com/dataset_metadata_schema"
  for dt in DatasetType:
    if dt.value == dict(dataset.labels)[key]:
      return dt
  return DatasetType.OTHER


class DatasetType(Enum):
  OTHER = "OTHER"
  TABLE = "TABLE"
  IMAGE = "IMAGE"


class ManagementService:
  """Provides an authenicated Service Management Client"""

  _instance = None

  @classmethod
  def get(cls):
    if not cls._instance:
      cls._instance = ManagementService()
    return cls._instance

  def get_managed_services(self):
    consumer_id = "project:" + AuthProvider.get().project
    service = build("servicemanagement", "v1").services()
    request = service.list(consumerId=consumer_id)
    return request.execute()

  def get_project(self):
    return AuthProvider.get().project


class AutoMLService:
  """Provides an authenticated AutoML Client and project info"""

  _instance = None

  def __init__(self):
    client_options = {"api_endpoint": API_ENDPOINT}
    self._dataset_client = aiplatform_v1alpha1.DatasetServiceClient(
        client_options=client_options)
    self._model_client = aiplatform_v1alpha1.ModelServiceClient(
        client_options=client_options)
    self._pipeline_client = aiplatform_v1alpha1.PipelineServiceClient(
        client_options=client_options)
    self._gcs_client = storage.Client()

    self._project = AuthProvider.get().project

    self._parent = "projects/{}/locations/us-central1".format(self._project)
    self._time_format = "%B %d, %Y, %I:%M%p"
    self._gcs_bucket = "jupyterlab-ucaip-data-{}".format(
        hashlib.md5(self._project.encode('utf-8')).hexdigest())

  @property
  def dataset_client(self):
    return self._dataset_client

  @property
  def model_client(self):
    return self._model_client

  @classmethod
  def get(cls):
    if not cls._instance:
      cls._instance = AutoMLService()
    return cls._instance

  def get_models(self):
    models = self._model_client.list_models(parent=self._parent).models
    return {
        "models": [{
            "id": model.name,
            "displayName": model.display_name,
            "pipelineId": model.training_pipeline,
            "createTime": model.create_time.strftime(self._time_format),
            "updateTime": model.update_time.strftime(self._time_format),
            "etag": model.etag,
        } for model in models]
    }

  def _get_feature_transformations(self, response):
    transformations = []
    for column in response:
      for data_type in column.keys():
        transformations.append({
            "dataType": data_type.capitalize(),
            "columnName": column[data_type]["columnName"]
        })
    return transformations

  def get_pipeline(self, pipeline_id):
    pipeline = self._pipeline_client.get_training_pipeline(name=pipeline_id)
    training_task_inputs = json_format.MessageToDict(
        pipeline._pb.training_task_inputs)
    transformation_options = self._get_feature_transformations(
        training_task_inputs['transformations'])
    return {
        "id": pipeline.name,
        "displayName": pipeline.display_name,
        "createTime": pipeline.create_time.strftime(self._time_format),
        "updateTime": pipeline.update_time.strftime(self._time_format),
        "elapsedTime": (pipeline.end_time - pipeline.start_time).seconds,
        "budget": training_task_inputs['trainBudgetMilliNodeHours'],
        "datasetId": pipeline.input_data_config.dataset_id,
        "targetColumn": training_task_inputs['targetColumn'],
        "transformationOptions": transformation_options,
        "objective": training_task_inputs['predictionType'],
        "optimizedFor": training_task_inputs['optimizationObjective'],
    }

  def get_datasets(self):
    datasets = []
    for dataset in self._dataset_client.list_datasets(
        parent=self._parent).datasets:
      dataset_type = parse_dataset_type(dataset)
      if dataset_type != DatasetType.OTHER:
        datasets.append({
            "id": dataset.name,
            "displayName": dataset.display_name,
            "createTime": dataset.create_time.strftime(self._time_format),
            "updateTime": dataset.update_time.strftime(self._time_format),
            "datasetType": dataset_type.value,
            "etag": dataset.etag,
            "metadata": json_format.MessageToDict(dataset._pb.metadata),
        })
    return {"datasets": datasets}

  def get_table_specs(self, dataset_id):
    return []

  def create_dataset(self, display_name, gcs_uri=None, bigquery_uri=None):
    input_config = {}

    if not display_name:
      raise ValueError("Display name must not be empty")

    if gcs_uri:
      input_config["gcsSource"] = {"uri": [gcs_uri]}
    elif bigquery_uri:
      input_config["bigquerySource"] = {"uri": bigquery_uri}
    else:
      raise ValueError("Must provide either gcs uri or bigquery uri")

    ds = aiplatform_v1alpha1.Dataset(display_name=display_name,
                                     metadata_schema_uri=TABLES_METADATA_SCHEMA,
                                     metadata={"inputConfig": input_config})

    created = self._dataset_client.create_dataset(parent=self._parent,
                                                  dataset=ds).result()
    return created

  def create_dataset_from_file(self, display_name, file_name, file_data):
    try:
      bucket = self._gcs_client.create_bucket(self._gcs_bucket)
    except exceptions.Conflict:
      # Bucket already exists
      bucket = self._gcs_client.bucket(self._gcs_bucket)

    key = "{}-{}".format(str(uuid.uuid4()), file_name)
    # Possible improvement: prepend md5 hash of file instead of uuid to
    # skip uploading the same existing file
    decoded = base64.decodebytes(file_data.encode("ascii"))
    bucket.blob(key).upload_from_string(decoded)
    return self.create_dataset(display_name,
                               gcs_uri="gs://{}/{}".format(
                                   self._gcs_bucket, key))
