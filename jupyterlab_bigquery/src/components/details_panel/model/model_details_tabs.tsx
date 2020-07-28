import * as React from 'react';

import { ModelDetailsService } from '../service/list_model_details';
import LoadingPanel from '../../loading_panel';
import ModelDetailsPanel from '../model_details_panel';

import { Header } from '../../shared/header';
import { StyledTabs, StyledTab, TabPanel } from '../../shared/tabs';
import { localStyles } from '../table_details_tabs';

interface Props {
  modelDetailsService: ModelDetailsService;
  isVisible: boolean;
  model_id: string;
  model_name: string;
}

interface State {
  hasLoaded: boolean;
  isLoading: boolean;
  currentTab: number;
}

enum TabInds {
  details = 0,
  schema,
}

export default class TableDetailsTabs extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasLoaded: false,
      isLoading: false,
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
          <Header text={this.props.model_name} />
          <div className={localStyles.body}>
            <StyledTabs
              value={this.state.currentTab}
              onChange={this.handleChange.bind(this)}
            >
              <StyledTab label="Details" />
              <StyledTab label="Schema" />
            </StyledTabs>
            <TabPanel value={this.state.currentTab} index={TabInds.details}>
              <ModelDetailsPanel
                tableId={this.props.model_id}
                isVisible={this.props.isVisible}
                modelDetailsService={this.props.modelDetailsService}
              />
            </TabPanel>
            <TabPanel value={this.state.currentTab} index={TabInds.schema}>
              <div>Model schema will go here</div>
            </TabPanel>
          </div>
        </div>
      );
    }
  }
}
