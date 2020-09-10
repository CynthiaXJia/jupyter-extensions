// Ensure styles are loaded by webpack
import '../style/index.css';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer,
} from '@jupyterlab/application';
import { WidgetTracker, MainAreaWidget } from '@jupyterlab/apputils';
import { IJupyterWidgetRegistry } from '@jupyter-widgets/base';
import { INotebookTracker } from '@jupyterlab/notebook';
import * as QueryEditorInCellWidgetsExport from './components/query_editor/query_editor_incell/query_editor_incell_widget';

import ListItemsWidget from './components/list_items_panel/list_tree_item_widget';
import { ListProjectsService } from './components/list_items_panel/service/list_items';
import { WidgetManager } from './utils/widgetManager/widget_manager';
import { ReduxReactWidget } from './utils/widgetManager/redux_react_widget';

const NAMESPACE = 'bigquery';

async function activate(
  app: JupyterFrontEnd,
  notebookTrack: INotebookTracker,
  restorer: ILayoutRestorer,
  registry?: IJupyterWidgetRegistry
) {
  const inCellEnabled = !!registry;
  let tracker = new WidgetTracker<MainAreaWidget>({ namespace: NAMESPACE });

  WidgetManager.initInstance(app, inCellEnabled, tracker);
  const manager = WidgetManager.getInstance();
  const context = {
    app: app,
    manager: manager,
    notebookTrack: notebookTrack,
  };
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

  const command: string = 'bigquery:restore';
  app.commands.addCommand(command, {
    // label: 'Bigquery extension',
    execute: id => {
      console.log('in execute command', id);
      // console.log('widgets: ', manager.getWidgets());
      // console.log('tracker ', tracker);
      tracker.forEach(widget => {
        console.log('heres a widget:', widget.id);
        // if (!widget) {
        //   console.log('no widget sad');
        //   const content = new ListItemsWidget(listProjectsService, context);
        //   widget = new MainAreaWidget({ content });
        // }
        // if (!widget.isAttached) {
        //   app.shell.add(widget, 'main');
        // }
      });
    },
  });

  restorer.restore(tracker, {
    command: command,
    name: w => {
      console.log('heres w:', w);
      return w.id;
    },
    args: w => ({
      id: w.id,
    }),
  });

  if (inCellEnabled) {
    registry.registerWidget({
      name: 'bigquery_query_incell_editor',
      version: '0.0.1',
      exports: QueryEditorInCellWidgetsExport,
    });
  }
}

/**
 * The JupyterLab plugin.
 */
const BigQueryPlugin: JupyterFrontEndPlugin<void> = {
  id: 'bigquery:bigquery',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requires: [INotebookTracker, ILayoutRestorer],
  // requires: [INotebookTracker],
  optional: [IJupyterWidgetRegistry as any],
  activate: activate,
  autoStart: true,
};

/**
 * Export the plugin as default.
 */
export default [BigQueryPlugin];
