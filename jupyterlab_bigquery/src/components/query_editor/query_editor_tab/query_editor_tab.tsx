import React from 'react';
import QueryTextEditor from '../query_text_editor/query_text_editor';
import QueryResults from '../query_text_editor/query_editor_results';
import {
  QueryId,
  generateQueryId,
} from '../../../reducers/queryEditorTabSlice';
import { stylesheet } from 'typestyle';
import { BASE_FONT } from 'gcp_jupyterlab_shared';

const localStyles = stylesheet({
  queryTextEditorRoot: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    height: '100%',
    ...BASE_FONT,
  },
});

interface QueryEditorTabProps {
  isVisible: boolean;
  queryId?: string;
  iniQuery?: string;
  width?: number;
}

class QueryEditorTab extends React.Component<QueryEditorTabProps, {}> {
  queryId: QueryId;

  constructor(props) {
    super(props);
    this.state = {
      isVisible: props.isVisible,
    };

    this.queryId = this.props.queryId ?? generateQueryId();
  }

  render() {
    return (
      <div className={localStyles.queryTextEditorRoot}>
        <QueryTextEditor
          queryId={this.queryId}
          iniQuery={this.props.iniQuery}
          width={this.props.width}
        />
        <QueryResults queryId={this.queryId} />
      </div>
    );
  }
}

export default QueryEditorTab;
