import * as React from 'react';

import {
  TableDetailsService,
  TableDetails,
} from './service/list_table_details';
import LoadingPanel from '../loading_panel';
import { DetailsPanel } from './details_panel';

interface Props {
  tableDetailsService: TableDetailsService;
  isVisible: boolean;
  table_id: string;
}

interface State {
  hasLoaded: boolean;
  isLoading: boolean;
  details: TableDetails;
  rows: DetailRow[];
}

interface DetailRow {
  name: string;
  value: string | number;
}

export default class TableDetailsPanel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasLoaded: false,
      isLoading: false,
      details: { details: {} } as TableDetails,
      rows: [],
    };
  }

  async componentDidMount() {
    try {
      // empty
    } catch (err) {
      console.warn('Unexpected error', err);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const isFirstLoad =
      !(this.state.hasLoaded || prevProps.isVisible) && this.props.isVisible;
    if (isFirstLoad) {
      this.getDetails();
    }
  }

  private async getDetails() {
    try {
      this.setState({ isLoading: true });
      const details = await this.props.tableDetailsService.listTableDetails(
        this.props.table_id
      );

      const detailsObj = details.details;
      const rows = [
        { name: 'Table ID', value: detailsObj.id },
        { name: 'Table size', value: `${detailsObj.num_bytes} Bytes` },
        { name: 'Number of rows', value: detailsObj.num_rows },
        { name: 'Created', value: detailsObj.date_created },
        {
          name: 'Table expiration',
          value: detailsObj.expiration ? detailsObj.expiration : 'Never',
        },
        { name: 'Last modified', value: detailsObj.last_modified },
        {
          name: 'Data location',
          value: detailsObj.location ? detailsObj.location : 'None',
        },
      ];

      this.setState({ hasLoaded: true, details, rows });
    } catch (err) {
      console.warn('Error retrieving table details', err);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingPanel />;
    } else {
      return (
        <div>
          <DetailsPanel
            details={this.state.details}
            rows={this.state.rows}
            type="table"
          />
        </div>
      );
    }
  }
}
