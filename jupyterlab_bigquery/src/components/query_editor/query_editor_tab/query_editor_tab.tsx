import React from 'react';
import QueryTextEditor from '../query_text_editor/query_text_editor';
import QueryResults from './query_editor_results';
import {
  QueryId,
  generateQueryId,
} from '../../../reducers/queryEditorTabSlice';
import { TextField, Button } from '@material-ui/core';
import { WidgetManager } from '../../../utils/widgetManager/widget_manager';

interface QueryEditorTabProps {
  isVisible: boolean;
  queryId?: string;
  iniQuery?: string;
}

interface QueryEditorTabState {
  title: string;
  isVisible: boolean;
}

class QueryEditorTab extends React.Component<
  QueryEditorTabProps,
  QueryEditorTabState
> {
  queryId: QueryId;

  constructor(props) {
    super(props);
    this.state = {
      isVisible: props.isVisible,
      title: '',
    };

    console.log('query id passed', this.props.queryId);

    this.queryId = this.props.queryId ?? generateQueryId();
  }

  handleSubmit = event => {
    WidgetManager.getInstance().updateTitle(this.queryId, this.state.title);
  };

  handleChange = event => {
    this.setState({ title: event.target.value });
  };

  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          height: '100%',
        }}
      >
        <form onSubmit={this.handleSubmit}>
          <TextField onChange={this.handleChange} />
          <Button onClick={this.handleSubmit}>Save</Button>
        </form>
        <QueryTextEditor
          queryId={this.queryId}
          iniQuery={this.props.iniQuery}
        />
        <QueryResults queryId={this.queryId} />
      </div>
    );
  }
}

export default QueryEditorTab;
