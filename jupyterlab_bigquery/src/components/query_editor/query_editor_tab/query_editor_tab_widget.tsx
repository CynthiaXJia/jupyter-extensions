import QueryEditorTab from './query_editor_tab';
import * as React from 'react';
// import { stylesheet } from 'typestyle';
import { ReduxReactWidget } from '../../../utils/widgetManager/redux_react_widget';

// const localStyles = stylesheet({
//   panel: {
//     backgroundColor: 'var(--jp-layout-color1)',
//     height: '100%',
//   },
// });

export class QueryEditorTabWidget extends ReduxReactWidget {
  id = 'query-editor-tab';

  constructor(
    private editorNumber: number,
    private queryId: string,
    private iniQuery: string
  ) {
    super();
    this.title.label = `Query Editor ${this.editorNumber}`;
    this.title.iconClass = 'jp-Icon jp-Icon-20 jp-BigQueryIcon';
    this.title.closable = true;
  }

  renderReact() {
    return (
      // <div className={localStyles.panel}>
        <QueryEditorTab
          isVisible={this.isVisible}
          queryId={this.queryId}
          iniQuery={this.iniQuery}
        />
      // </div>
    );
  }
}
