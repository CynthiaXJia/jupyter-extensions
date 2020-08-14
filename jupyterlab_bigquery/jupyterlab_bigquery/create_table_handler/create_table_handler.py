# Lint as: python3
"""Request handler classes for creating a new table."""

from notebook.base.handlers import APIHandler, app_log
from google.cloud import bigquery

SCOPE = ("https://www.googleapis.com/auth/cloud-platform",)


def create_bigquery_client():
  return bigquery.Client()


def create_table(client, table_id):
  schema = []
  print(table_id)
  table = bigquery.Table(table_id, schema=schema)
  table = client.create_table(table)


class CreateTableHandler(APIHandler):
  """Handles requests for a new table."""
  bigquery_client = None

  def post(self, *args, **kwargs):
    try:
      self.bigquery_client = create_bigquery_client()
      post_body = self.get_json_body()

      self.finish(create_table(self.bigquery_client, post_body['tableId']))

    except Exception as e:
      app_log.exception(str(e))
      self.set_status(500, str(e))
      self.finish({'error': {'message': str(e)}})