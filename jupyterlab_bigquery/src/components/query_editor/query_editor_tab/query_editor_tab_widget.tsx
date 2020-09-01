import QueryEditorTab from './query_editor_tab';
import * as React from 'react';
import { ReduxReactWidget } from '../../../utils/widgetManager/redux_react_widget';
import { ThemeProvider } from '@material-ui/core';
import { lightTheme, darkTheme } from '../../shared/theme';

export class QueryEditorTabWidget extends ReduxReactWidget {
  id = 'query-editor-tab';
  theme = null;

  constructor(
    private editorNumber: number,
    private queryId: string,
    private iniQuery: string
  ) {
    super();
    this.title.label = `Query Editor ${this.editorNumber}`;
    this.title.iconClass = 'jp-Icon jp-Icon-20 jp-BigQueryIcon';
    this.title.closable = true;
    this.theme =
      document.body.getAttribute('data-jp-theme-light') === 'true'
        ? lightTheme
        : darkTheme;
  }

  renderReact() {
    return (
      <ThemeProvider theme={lightTheme}>
        <QueryEditorTab
          isVisible={this.isVisible}
          queryId={this.queryId}
          iniQuery={this.iniQuery}
        />
      </ThemeProvider>
    );
  }
}
