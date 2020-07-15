# Lint as: python3
"""Tests for details panel handlers."""
import unittest
import datetime
from unittest.mock import Mock, MagicMock, patch

from jupyterlab_bigquery import handlers

import pprint

pp = pprint.PrettyPrinter(indent=2)

class TestDatasetDetails(unittest.TestCase):
  def testGetDatasetDetailsFull(self):
    client = Mock()
    dataset = Mock(
        project = 'project_id',
        dataset_id = 'dataset_id',
        description = 'description of dataset',
        labels = {'label_0': 'value_0', 'label_1': 'value_1'},
        created = datetime.datetime(2020, 7, 14, 13, 23, 45, 67, tzinfo=None),
        default_table_expiration_ms = 17280000000,
        location = 'US',
        modified = datetime.datetime(2020, 7, 15, 15, 11, 23, 32, tzinfo=None),
        self_link = 'https://bigquery.googleapis.com/bigquery/v2/projects/project_id/datasets/dataset_id'
    )
    client.get_dataset = Mock(return_value = dataset)

    expected = {
        'details': {
            'id': 'project_id.dataset_id',
            'name': 'dataset_id',
            'description': 'description of dataset',
            'labels': ['label_0: value_0', 'label_1: value_1'],
            'date_created': 'Jul 14, 2020,  1:23:45 PM',
            'default_expiration': 17280000000,
            'location': 'US',
            'last_modified': 'Jul 15, 2020,  3:11:23 PM',
            'project': 'project_id',
            'link': 'https://bigquery.googleapis.com/bigquery/v2/projects/project_id/datasets/dataset_id'
        }
    }

    result = handlers.get_dataset_details(client, 'some_dataset_id')
    self.assertEqual(expected, result)

  def testGetDatasetDetailsEmptyFields(self):
    client = Mock()
    dataset = Mock(
        project = 'project_id',
        dataset_id = 'dataset_id',
        description = None,
        labels = {},
        created = datetime.datetime(2020, 7, 14, 13, 23, 45, 67, tzinfo=None),
        default_table_expiration_ms = None,
        location = 'US',
        modified = datetime.datetime(2020, 7, 15, 15, 11, 23, 32, tzinfo=None),
        self_link = 'https://bigquery.googleapis.com/bigquery/v2/projects/project_id/datasets/dataset_id'
    )
    client.get_dataset = Mock(return_value = dataset)

    expected = {
        'details': {
            'id': 'project_id.dataset_id',
            'name': 'dataset_id',
            'description': None,
            'labels': None,
            'date_created': 'Jul 14, 2020,  1:23:45 PM',
            'default_expiration': None,
            'location': 'US',
            'last_modified': 'Jul 15, 2020,  3:11:23 PM',
            'project': 'project_id',
            'link': 'https://bigquery.googleapis.com/bigquery/v2/projects/project_id/datasets/dataset_id'
        }
    }

    self.maxDiff = None

    result = handlers.get_dataset_details(client, 'some_dataset_id')
    self.assertEqual(expected, result)

class TestTableDetails(unittest.TestCase):
  def testGetTableDetailsFull(self):
    client = Mock()

    schema_field_0 = Mock(
        field_type = 'STRING', 
        description = 'this field is a string', 
        mode = 'NULLABLE'
    )
    schema_field_0.name = 'field_name_0'

    schema_field_1 = Mock(
        field_type = 'INTEGER', 
        description = 'this field is an integer', 
        mode = 'NULLABLE'
    )
    schema_field_1.name = 'field_name_1'
    
    table = Mock(
        project = 'project_id',
        dataset_id = 'dataset_id',
        table_id = 'table_id',
        description = 'description of table',
        labels = {'label_0': 'value_0', 'label_1': 'value_1'},
        created = datetime.datetime(2020, 7, 14, 13, 23, 45, 67, tzinfo=None),
        expires = datetime.datetime(2021, 7, 14, 13, 23, 45, 67, tzinfo=None),
        location = 'US',
        modified = datetime.datetime(2020, 7, 15, 15, 11, 23, 32, tzinfo=None),
        self_link = 'https://bigquery.googleapis.com/bigquery/v2/projects/project_id/datasets/dataset_id',
        num_rows = 123456,
        num_bytes = 2000000,
        schema = [schema_field_0, schema_field_1]
    )
    client.get_table = Mock(return_value = table)

    expected = {
        'details': {
            'id': 'project_id.dataset_id.table_id',
            'name': 'table_id',
            'description': 'description of table',
            'labels': ['label_0: value_0', 'label_1: value_1'],
            'date_created': 'Jul 14, 2020,  1:23:45 PM',
            'expires': 'Jul 14, 2021,  1:23:45 PM',
            'location': 'US',
            'last_modified': 'Jul 15, 2020,  3:11:23 PM',
            'project': 'project_id',
            'dataset': 'dataset_id',
            'link': 'https://bigquery.googleapis.com/bigquery/v2/projects/project_id/datasets/dataset_id',
            'num_rows': 123456,
            'num_bytes': 2000000,
            'schema': [{
                'name': 'field_name_0', 
                'type': 'STRING', 
                'description': 'this field is a string', 
                'mode': 'NULLABLE'
              }, {
                'name': 'field_name_1', 
                'type': 'INTEGER', 
                'description': 'this field is an integer', 
                'mode': 'NULLABLE'
              }
            ]
        }
    }

    result = handlers.get_table_details(client, 'some_table_id')
    self.assertEqual(expected, result)

  def testGetTableDetailsEmptyFields(self):
    client = Mock()
    
    table = Mock(
        project = 'project_id',
        dataset_id = 'dataset_id',
        table_id = 'table_id',
        description = None,
        labels = {},
        created = datetime.datetime(2020, 7, 14, 13, 23, 45, 67, tzinfo=None),
        expires = None,
        location = 'US',
        modified = datetime.datetime(2020, 7, 15, 15, 11, 23, 32, tzinfo=None),
        self_link = 'https://bigquery.googleapis.com/bigquery/v2/projects/project_id/datasets/dataset_id',
        num_rows = 0,
        num_bytes = 0,
        schema = []
    )
    client.get_table = Mock(return_value = table)

    expected = {
        'details': {
            'id': 'project_id.dataset_id.table_id',
            'name': 'table_id',
            'description': None,
            'labels': None,
            'date_created': 'Jul 14, 2020,  1:23:45 PM',
            'expires': None,
            'location': 'US',
            'last_modified': 'Jul 15, 2020,  3:11:23 PM',
            'project': 'project_id',
            'dataset': 'dataset_id',
            'link': 'https://bigquery.googleapis.com/bigquery/v2/projects/project_id/datasets/dataset_id',
            'num_rows': 0,
            'num_bytes': 0,
            'schema': []
        }
    }

    result = handlers.get_table_details(client, 'some_table_id')
    self.assertEqual(expected, result)

if __name__ == '__main__':
  unittest.main()
