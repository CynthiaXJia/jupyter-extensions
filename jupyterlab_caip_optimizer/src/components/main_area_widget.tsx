import * as React from 'react';
import { ReactWidget } from '@jupyterlab/apputils';
import { store, RootState } from '../store/store';
import { Provider, connect } from 'react-redux';
import { close, ViewType } from '../store/view';

const mapStateToProps = (state: RootState) => ({
  data: state.view.data,
});

/**
 * ViewManager acts as the extensions router for various views.
 */
export const ViewManager = ({ data }: { data: ViewType }) => {
  // TODO: add custom components
  if (data.view === 'dashboard') {
    return <>Dashboard</>;
  } else if (data.view === 'createStudy') {
    return <>Create A Study</>;
  } else if (data.view === 'studyDetails') {
    return <>Study ID: {data.studyId}</>;
  }
};

const WrappedViewManager = connect(mapStateToProps)(ViewManager);

/**
 * Provides redux store for ViewManager and sub components.
 * Hooks into redux to maintain that view.isVisible is in sync with component creation/deletion.
 */
export class MainAreaWidget extends ReactWidget {
  constructor(private readonly reduxStore: typeof store) {
    super();
    this.id = 'optimizer:main-area';
    this.title.label = 'GCP Optimizer';
    this.title.closable = true;
  }

  onCloseRequest() {
    this.reduxStore.dispatch(close());
    this.dispose();
  }

  render() {
    return (
      <Provider store={this.reduxStore}>
        <WrappedViewManager />
      </Provider>
    );
  }
}
