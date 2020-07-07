import React from 'react';
import Editor from '@monaco-editor/react';
import { connect } from 'react-redux';
import {
  updateQueryResult,
  resetQueryResult,
} from '../../../reducers/queryEditorTabSlice';

import { editor } from 'monaco-editor/esm/vs/editor/editor.api';

import { Button, CircularProgress, Typography } from '@material-ui/core';
import { stylesheet } from 'typestyle';
import { QueryService } from './service/query';
import PagedService, { JobState } from '../../../utils/pagedAPI/paged_service';
import PagedJob from '../../../utils/pagedAPI/pagedJob';

interface QueryTextEditorState {
  buttonState: ButtonStates;
}

interface QueryTextEditorProps {
  updateQueryResult: any;
  resetQueryResult: any;
}

interface QueryResponseType {
  content: string;
  labels: string;
}

interface QueryRequestBodyType {
  query: string;
  jobConfig: {};
}

const SQL_EDITOR_OPTIONS: editor.IEditorConstructionOptions = {
  lineNumbers: 'on',
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
  wordWrapColumn: 80,
  wordWrap: 'bounded',
  wrappingIndent: 'same',
  wrappingStrategy: 'advanced',
};

const styleSheet = stylesheet({
  queryButton: { float: 'right', width: '100px', maxWidth: '200px' },
});

enum ButtonStates {
  READY,
  PENDING,
  ERROR,
}

class QueryTextEditor extends React.Component<
  QueryTextEditorProps,
  QueryTextEditorState
> {
  queryService: QueryService;
  editor: editor.IStandaloneCodeEditor;
  job: PagedJob<QueryRequestBodyType, QueryResponseType> = null;

  pagedQueryService: PagedService<QueryRequestBodyType, QueryResponseType>;

  constructor(props) {
    super(props);
    this.state = {
      buttonState: ButtonStates.READY,
    };
    this.queryService = new QueryService();

    this.pagedQueryService = new PagedService('query');
  }

  handleButtonClick() {
    switch (this.state.buttonState) {
      case ButtonStates.READY:
      case ButtonStates.ERROR:
        this.handleQuery();
        break;
      case ButtonStates.PENDING:
        this.handleCancel();
    }
  }

  handleCancel() {
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!this.job) {
      this.job.cancel();
    }
  }

  handleQuery() {
    this.props.resetQueryResult();
    const query = this.editor.getValue();

    this.setState({ buttonState: ButtonStates.PENDING });

    this.job = this.pagedQueryService.request(
      { query, jobConfig: {} },
      (state, _, response) => {
        if (state === JobState.Pending) {
          Object.keys(response).map(key => {
            response[key] = JSON.parse(response[key]);
          });

          this.props.updateQueryResult(response);
        } else if (state === JobState.Fail) {
          this.setState({ buttonState: ButtonStates.ERROR });

          // switch to normal button after certain time
          setTimeout(() => {
            this.setState({ buttonState: ButtonStates.READY });
          }, 2000);
        } else if (state === JobState.Done) {
          this.setState({ buttonState: ButtonStates.READY });
        }
      },
      2000
    );
  }

  handleEditorDidMount(_, editor) {
    this.editor = editor;
  }

  renderButton(buttonState: ButtonStates) {
    let color = undefined;
    let content = undefined;

    switch (buttonState) {
      case ButtonStates.PENDING:
        color = 'default';
        content = (
          <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <CircularProgress size="75%" style={{ alignSelf: 'center' }} />
            <Typography variant="button">Cancel</Typography>
          </div>
        );
        break;
      case ButtonStates.READY:
        color = 'primary';
        content = 'Submit';
        break;
      case ButtonStates.ERROR:
        color = 'secondary';
        content = 'Error';
        break;
    }

    return (
      <Button
        color={color}
        variant="contained"
        onClick={this.handleButtonClick.bind(this)}
        className={styleSheet.queryButton}
      >
        {content}
      </Button>
    );
  }

  render() {
    return (
      <div>
        <Editor
          width="100vw"
          height="40vh"
          theme={'light'}
          language={'sql'}
          value={
            'SELECT * FROM `jupyterlab-interns-sandbox.covid19_public_forecasts.county_14d` LIMIT 10'
          }
          editorDidMount={this.handleEditorDidMount.bind(this)}
          options={SQL_EDITOR_OPTIONS}
        />
        {this.renderButton(this.state.buttonState)}
      </div>
    );
  }
}

const mapStateToProps = _ => {
  return {};
};

const mapDispatchToProps = { updateQueryResult, resetQueryResult };

export default connect(mapStateToProps, mapDispatchToProps)(QueryTextEditor);
