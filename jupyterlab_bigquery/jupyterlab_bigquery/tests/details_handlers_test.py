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
        self_link = 'https://bigquery.googleapis.com/bigquery/v2/projects/project_id/datasets/dataset_id')

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

#   def testGetDatasetDetailsFull(self):
#     wanted = {
#         'details': {
#           'id': "{}.{}".format(dataset.project, dataset.dataset_id),
#           'name': dataset.dataset_id,
#           'description': dataset.description,
#           'labels': ["\t{}: {}".format(label, value) for label, value in dataset.labels.items()] if dataset.labels else None,
#           'date_created': json.dumps(dataset.created.strftime('%b %e, %G, %l:%M:%S %p'))[1:-1],
#           'default_expiration': dataset.default_table_expiration_ms,
#           'location': dataset.location,
#           'last_modified': json.dumps(dataset.modified.strftime('%b %e, %G, %l:%M:%S %p'))[1:-1],
#           'project': dataset.project,
#           'link': dataset.self_link
#     }

if __name__ == '__main__':
  unittest.main()
