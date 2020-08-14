import * as React from 'react';
import { Button, Drawer } from '@material-ui/core';

import {
  DatasetDetailsService,
  DatasetDetails,
} from './service/list_dataset_details';
import { Header } from '../shared/header';
import LoadingPanel from '../loading_panel';
import { DetailsPanel } from './details_panel';
import { stylesheet } from 'typestyle';
import { formatDate } from '../../utils/formatters';
import { CreateTableService } from './service/create_table';

export const localStyles = stylesheet({
  body: {
    marginRight: '24px',
    marginLeft: '24px',
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  formSection: {
    marginBottom: '30px',
  },
  formHeader: {
    fontSize: '15px',
  },
});

interface Props {
  datasetDetailsService: DatasetDetailsService;
  isVisible: boolean;
  dataset_id: string;
}

interface State {
  hasLoaded: boolean;
  isLoading: boolean;
  drawerOpen: boolean;
  details: DatasetDetails;
  rows: DetailRow[];
  source: string;
  projectId: string;
  tableId: string;
  datasetId: string;
}

interface DetailRow {
  name: string;
  value: string;
}

export default class DatasetDetailsPanel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasLoaded: false,
      isLoading: false,
      drawerOpen: false,
      source: 'empty',
      details: { details: {} } as DatasetDetails,
      rows: [],
      projectId: null,
      tableId: null,
      datasetId: null,
    };
  }

  componentDidUpdate(prevProps: Props) {
    const isFirstLoad =
      !(this.state.hasLoaded || prevProps.isVisible) && this.props.isVisible;
    if (isFirstLoad) {
      this.getDetails();
    }
  }

  formatMs(ms) {
    const days = ms / 86400000;
    return `${days} day${days > 1 ? 's' : ''} 0 hr`;
  }

  private async getDetails() {
    try {
      this.setState({ isLoading: true });
      const details = await this.props.datasetDetailsService.listDatasetDetails(
        this.props.dataset_id
      );

      const detailsObj = details.details;
      const rows = [
        { name: 'Dataset ID', value: detailsObj.id },
        { name: 'Created', value: formatDate(detailsObj.date_created) },
        {
          name: 'Default table expiration',
          value: detailsObj.default_expiration
            ? this.formatMs(detailsObj.default_expiration)
            : 'Never',
        },
        {
          name: 'Last modified',
          value: formatDate(detailsObj.last_modified),
        },
        {
          name: 'Data location',
          value: detailsObj.location ? detailsObj.location : 'None',
        },
      ];

      this.setState({ hasLoaded: true, details, rows });
    } catch (err) {
      console.warn('Error retrieving dataset details', err);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingPanel />;
    } else {
      return (
        <div className={localStyles.container}>
          <Drawer anchor="right" open={this.state.drawerOpen}>
            <div style={{ margin: '24px' }}>
              <div>Create table</div>
              <form
                onSubmit={() => {
                  const service = new CreateTableService();
                  service.createTable(
                    `${this.state.projectId}.${this.state.datasetId}.${this.state.tableId}`
                  );
                }}
              >
                <div className={localStyles.formSection}>
                  <div className={localStyles.formHeader}>Source</div>
                  <label>
                    Create table from:
                    <select
                      onChange={event => {
                        this.setState({ source: event.target.value as string });
                      }}
                      value={this.state.source}
                    >
                      <option value="empty">Empty table</option>
                    </select>
                  </label>
                </div>

                <div className={localStyles.formSection}>
                  <div className={localStyles.formHeader}>Destination</div>
                  <div>
                    <label>
                      Project name:
                      <input
                        type="text"
                        value={this.state.projectId}
                        onChange={event => {
                          this.setState({ projectId: event.target.value });
                        }}
                      />
                    </label>
                    <label>
                      Dataset name:
                      <input
                        type="text"
                        value={this.state.datasetId}
                        onChange={event => {
                          this.setState({ datasetId: event.target.value });
                        }}
                      />
                    </label>
                  </div>
                  <label>
                    Table name:
                    <input
                      type="text"
                      value={this.state.tableId}
                      placeholder="Letters, numbers, and underscores allowed"
                      onChange={event => {
                        this.setState({ tableId: event.target.value });
                      }}
                    />
                  </label>
                </div>

                <div className={localStyles.formSection}>
                  <div className={localStyles.formHeader}>Schema</div>
                </div>

                <div className={localStyles.formSection}>
                  <div className={localStyles.formHeader}>
                    Partition and cluster settings
                  </div>
                  <input type="submit" value="Create table" />
                </div>
              </form>
              <Button
                onClick={() => {
                  this.setState({ drawerOpen: false });
                }}
              >
                Cancel
              </Button>
            </div>
          </Drawer>
          <Header
            text={this.props.dataset_id}
            buttons={[
              <Button
                onClick={() => {
                  this.setState({ drawerOpen: true });
                }}
                style={{ textTransform: 'none' }}
              >
                Create table
              </Button>,
            ]}
          />
          <div className={localStyles.body}>
            <DetailsPanel
              details={this.state.details.details}
              rows={this.state.rows}
              detailsType="DATASET"
            />
          </div>
        </div>
      );
    }
  }
}
