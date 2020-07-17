// Ensure styles are loaded by webpack
import '../style/index.css';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';
import { IJupyterWidgetRegistry } from '@jupyter-widgets/base';
import * as QueryEditorInCellWidgetsExport from './components/query_editor/query_editor_incell/query_editor_incell_widget';

import ListItemsWidget from './components/list_items_panel/list_tree_item_widget';
import { ListProjectsService } from './components/list_items_panel/service/list_items';
import { WidgetManager } from './utils/widgetManager/widget_manager';
import { ReduxReactWidget } from './utils/widgetManager/redux_react_widget';

async function activate(
  app: JupyterFrontEnd,
  registry: IJupyterWidgetRegistry
) {
  WidgetManager.initInstance(app);
  const manager = WidgetManager.getInstance();
  const context = { app: app, manager: manager };
  const listProjectsService = new ListProjectsService();
  manager.launchWidget(
    ListItemsWidget,
    'left',
    'ListItemWidget',
    (widget: ReduxReactWidget) => {
      widget.addClass('jp-BigQueryIcon');
    },
    [listProjectsService, context],
    { rank: 100 }
  );

  registry.registerWidget({
    name: 'bigQuery-query-incell-editor',
    version: '0.0.1',
    exports: QueryEditorInCellWidgetsExport,
  });
}

/**
 * The JupyterLab plugin.
 */
const BigQueryPlugin: JupyterFrontEndPlugin<void> = {
  id: 'bigquery:bigquery',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requires: [IJupyterWidgetRegistry as any],
  activate: activate,
  autoStart: true,
};

/**
 * Export the plugin as default.
 */
export default [BigQueryPlugin];
