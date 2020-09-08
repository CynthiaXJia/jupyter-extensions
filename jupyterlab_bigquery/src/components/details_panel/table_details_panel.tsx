import * as React from 'react';
import {
  TableDetailsService,
  TableDetails,
  TableDetailsObject,
} from './service/list_table_details';
import LoadingPanel from '../loading_panel';
import { DetailsPanel } from './details_panel';
import { formatDate, formatBytes } from '../../utils/formatters';

interface Props {
  tableDetailsService: TableDetailsService;
  isVisible: boolean;
  tableId: string;
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

export function prepTableDetailsRows(details: TableDetailsObject) {
  return [
    { name: 'Table ID', value: details.id },
    {
      name: 'Table size',
      value: formatBytes(details.num_bytes),
    },
    {
      name: 'Number of rows',
      value: details.num_rows.toLocaleString(),
    },
    { name: 'Created', value: formatDate(details.date_created) },
    {
      name: 'Table expiration',
      value: details.expires ? formatDate(details.expires) : 'Never',
    },
    {
      name: 'Last modified',
      value: formatDate(details.last_modified),
    },
    {
      name: 'Data location',
      value: details.location ? details.location : 'None',
    },
  ];
}

export default class TableDetailsPanel extends React.Component<Props, State> {
  private mounted = false;
  constructor(props: Props) {
    super(props);
    this.state = {
      hasLoaded: false,
      isLoading: false,
      details: { details: {} } as TableDetails,
      rows: [],
    };
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
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
      if (this.mounted) {
        this.setState({ isLoading: true });
      }

      const details = await this.props.tableDetailsService.listTableDetails(
        this.props.tableId
      );

      const detailsObj = details.details;
      const rows = prepTableDetailsRows(detailsObj);
      if (this.mounted) {
        this.setState({ hasLoaded: true, details, rows });
      }
    } catch (err) {
      console.warn('Error retrieving table details', err);
    } finally {
      if (this.mounted) {
        this.setState({ isLoading: false });
      }
    }
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingPanel />;
    } else {
      return (
        <DetailsPanel
          details={this.state.details.details}
          rows={this.state.rows}
          detailsType="TABLE"
        />
      );
    }
  }
}
