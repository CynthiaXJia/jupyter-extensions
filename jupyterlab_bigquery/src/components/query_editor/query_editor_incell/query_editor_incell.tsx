import React, { Component } from 'react';
import QueryTextEditor, {
  QueryResult,
} from '../query_text_editor/query_text_editor';
import { connect } from 'react-redux';
import QueryResults from '../query_editor_tab/query_editor_results';
import {
  QueryId,
  generateQueryId,
} from '../../../reducers/queryEditorTabSlice';
import { DOMWidgetView } from '@jupyter-widgets/base';

interface QueryEditorInCellProps {
  queries: { [key: string]: QueryResult };
  ipyView: DOMWidgetView;
  sidePanelIsOpen: boolean;
}

export class QueryEditorInCell extends Component<QueryEditorInCellProps, {}> {
  queryId: QueryId;
  iniQuery: string;

  constructor(pros) {
    super(pros, QueryEditorInCell);

    this.queryId = generateQueryId();
    this.iniQuery = this.props.ipyView.model.get('query') as string;

    const ipyView = this.props.ipyView;
    ipyView.model.once('change:query', this.queryChange, ipyView);
  }

  queryChange() {
    // TODO: handle python query change
  }

  updateDimensions() {
    console.log('resized');
  }

  componentDidUpdate(prevProps: QueryEditorInCellProps) {
    if (prevProps.sidePanelIsOpen !== this.props.sidePanelIsOpen) {
      // console.log(
      //   'previously open: ',
      //   prevProps.sidePanelIsOpen,
      //   ' now: ',
      //   this.props.sidePanelIsOpen
      // );
      this.updateDimensions.bind(this);
    }
  }

  render() {
    const { queries } = this.props;
    const queryResult = queries[this.queryId];

    // eslint-disable-next-line no-extra-boolean-cast
    const showResult = !!queryResult;

    return (
      <div style={{ width: '100%' }}>
        <QueryTextEditor
          queryId={this.queryId}
          iniQuery={this.iniQuery}
          editorType="IN_CELL"
        />
        {showResult ? (
          <QueryResults queryId={this.queryId} editorType="IN_CELL" />
        ) : (
          undefined
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    queries: state.queryEditorTab.queries,
    sidePanelIsOpen: state.dataTree.isOpen,
  };
};

export default connect(mapStateToProps)(QueryEditorInCell);
