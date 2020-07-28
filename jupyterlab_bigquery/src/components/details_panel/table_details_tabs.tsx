import * as React from 'react';

import {
  TableDetailsService,
  TableDetails,
} from './service/list_table_details';
import { Header } from '../shared/header';
import { StyledTabs, StyledTab, TabPanel } from '../shared/tabs';
import LoadingPanel from '../loading_panel';
import TableDetailsPanel from './table_details_panel';
import TablePreviewPanel from './table_preview';
import { stylesheet } from 'typestyle';

export const localStyles = stylesheet({
  body: {
    margin: '24px',
    marginBottom: 0,
    fontSize: '13px',
    flex: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
  },
});

interface Props {
  tableDetailsService: TableDetailsService;
  isVisible: boolean;
  table_id: string;
  table_name: string;
}

interface State {
  hasLoaded: boolean;
  isLoading: boolean;
  details: TableDetails;
  rows: DetailRow[];
  currentTab: number;
}

interface DetailRow {
  name: string;
  value: string | number;
}

enum TabInds {
  details = 0,
  preview,
}

export default class TableDetailsTabs extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasLoaded: false,
      isLoading: false,
      details: { details: {} } as TableDetails,
      rows: [],
      currentTab: TabInds.details,
    };
  }

  handleChange(event: React.ChangeEvent<{}>, newValue: number) {
    this.setState({ currentTab: newValue });
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingPanel />;
    } else {
      return (
        <div style={{ display: 'flex', flexFlow: 'column', height: '100%' }}>
          <Header text={this.props.table_name} />
          <div className={localStyles.body}>
            <StyledTabs
              value={this.state.currentTab}
              onChange={this.handleChange.bind(this)}
            >
              <StyledTab label="Details" />
              <StyledTab label="Preview" />
            </StyledTabs>
            <TabPanel value={this.state.currentTab} index={TabInds.details}>
              <TableDetailsPanel
                tableId={this.props.table_id}
                isVisible={this.props.isVisible}
                tableDetailsService={this.props.tableDetailsService}
              />
            </TabPanel>
            <TabPanel value={this.state.currentTab} index={TabInds.preview}>
              <TablePreviewPanel
                tableId={this.props.table_id}
                isVisible={this.props.isVisible}
                tableDetailsService={this.props.tableDetailsService}
              />
            </TabPanel>
          </div>
        </div>
      );
    }
  }
}
