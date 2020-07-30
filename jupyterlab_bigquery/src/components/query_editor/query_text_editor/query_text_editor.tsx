import React from 'react';
import Editor, { monaco, Monaco } from '@monaco-editor/react';
import { connect } from 'react-redux';
import {
  updateQueryResult,
  resetQueryResult,
  deleteQueryEntry,
  QueryId,
} from '../../../reducers/queryEditorTabSlice';

import { editor } from 'monaco-editor/esm/vs/editor/editor.api';

import {
  PlayCircleFilledRounded,
  PauseCircleOutline,
} from '@material-ui/icons';
import { Button, CircularProgress, Typography } from '@material-ui/core';
import { stylesheet } from 'typestyle';
import PagedService, { JobState } from '../../../utils/pagedAPI/paged_service';
import PagedJob from '../../../utils/pagedAPI/pagedJob';
import { QueryEditorType } from '../query_editor_tab/query_editor_results';

interface QueryTextEditorState {
  buttonState: ButtonStates;
  bytesProcessed: number | null;
  errorMsg: string | null;
}

interface QueryTextEditorProps {
  updateQueryResult: any;
  resetQueryResult: any;
  deleteQueryEntry: any;
  queryId: QueryId;
  iniQuery?: string;
  editorType?: QueryEditorType;
  queryFlags?: { [keys: string]: any };
}

interface QueryResponseType {
  content: string;
  labels: string;
  bytesProcessed: number;
}

export interface QueryResult {
  content: Array<Array<unknown>>;
  labels: Array<string>;
  bytesProcessed: number;
  queryId: QueryId;
}

interface QueryRequestBodyType {
  query: string;
  jobConfig: {};
  dryRunOnly: boolean;
}

const SQL_EDITOR_OPTIONS: editor.IEditorConstructionOptions = {
  lineNumbers: 'on',
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
  wordWrap: 'on',
  wrappingIndent: 'same',
  wrappingStrategy: 'advanced',
  minimap: { enabled: false },
};

const styleSheet = stylesheet({
  queryButton: {
    marginTop: ' 2px',
    marginBottom: ' 2px',
    marginRight: '20px',
    fontSize: '10px',
  },
  buttonText: {
    alignSelf: 'center',
    justifySelf: 'center',
    textTransform: 'none',
    fontWeight: 'bold',
  },
  queryTextEditor: {
    minHeight: '200px',
    flex: 1,
  },
  queryTextEditorInCell: {
    minHeight: '300px',
    height: '30vh',
  },
  wholeEditor: {
    // 4/9 of panel height (in relation to results)
    flex: 4,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    // borderBottom: 'var(--jp-border-width) solid var(--jp-border-color2)',
    border: '1px solid rgb(218, 220, 224)',
  },
  wholeEditorInCell: {
    // borderBottom: 'var(--jp-border-width) solid var(--jp-border-color2)',
    border: '1px solid rgb(218, 220, 224)',
  },
  optionalText: {
    marginRight: '10px',
    marginLeft: '10px',
    alignSelf: 'center',
    justifySelf: 'center',
  },
  pendingStatus: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  buttonInfoBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: '5px',
    paddingBottom: '5px',
    paddingLeft: '10px',
    paddingRight: '10px',
    backgroundColor: 'rgb(248, 249, 250)',
    // borderBlockColor: 'rgb(218, 220, 224)',
    // borderStyle: 'solid',
    borderBottom: '1px solid rgb(218, 220, 224)',
  },
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
  editor: editor.IStandaloneCodeEditor;
  monacoInstance: Monaco;
  job: PagedJob<QueryRequestBodyType, QueryResponseType>;
  timeoutAlarm: NodeJS.Timeout;
  queryId: QueryId;

  pagedQueryService: PagedService<QueryRequestBodyType, QueryResponseType>;

  constructor(props) {
    super(props);
    this.state = {
      buttonState: ButtonStates.READY,
      bytesProcessed: null,
      errorMsg: null,
    };
    this.pagedQueryService = new PagedService('query');
    this.timeoutAlarm = null;
    this.queryId = props.queryId;

    monaco
      .init()
      .then(monacoInstance => (this.monacoInstance = monacoInstance));
  }

  componentWillUnmount() {
    this.props.deleteQueryEntry(this.queryId);
  }

  handleButtonClick() {
    switch (this.state.buttonState) {
      case ButtonStates.READY:
      case ButtonStates.ERROR:
        this.handleQuery();
        break;
    }
  }

  handleCancel() {
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!this.job) {
      this.job.cancel();
    }
  }

  handleQuery() {
    this.props.resetQueryResult(this.props.queryId);
    const query = this.editor.getValue();

    this.setState({
      buttonState: ButtonStates.PENDING,
      bytesProcessed: null,
      errorMsg: null,
    });

    this.job = this.pagedQueryService.request(
      { query, jobConfig: this.props.queryFlags, dryRunOnly: false },
      (state, _, response) => {
        if (state === JobState.Pending) {
          response = response as QueryResponseType;

          Object.keys(response).map(key => {
            response[key] = JSON.parse(response[key]);
          });

          this.setState({ bytesProcessed: response.bytesProcessed });
          const processed = (response as unknown) as QueryResult;
          processed.queryId = this.queryId;

          this.props.updateQueryResult(processed);
        } else if (state === JobState.Fail) {
          this.setState({
            buttonState: ButtonStates.ERROR,
            errorMsg: response as string,
          });

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

    this.editor.onKeyUp(() => {
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!this.timeoutAlarm) {
        clearTimeout(this.timeoutAlarm);
        this.setState({ errorMsg: null });
      }
      this.timeoutAlarm = setTimeout(this.checkSQL.bind(this), 1500);
      this.resetMarkers();
    });

    // initial check
    this.checkSQL();
  }

  checkSQL() {
    const query = this.editor.getValue();

    if (!query) {
      return;
    }

    this.pagedQueryService.request(
      { query, jobConfig: this.props.queryFlags, dryRunOnly: true },
      (state, _, response) => {
        if (state === JobState.Fail) {
          const res = response as string;

          // deal with errors
          this.handleSyntaxError(res);
          this.handleNotFound(res);
        }
      }
    );
  }

  async handleNotFound(response: string) {
    const prompt = 'Not found:';
    response = response.trim();
    if (!response.startsWith(prompt)) {
      return;
    }

    const body = response;
    // response follow the format "not found: [Table, Dataset, etc] xxx:name"
    const errStr = response
      .split(' ')[3]
      .split(':')
      .pop();
    const model = this.editor.getModel();
    const texts = model.getValue().split('\n');

    let line = -1;
    let pos = -1;

    for (let i = 0; i < texts.length; i++) {
      const text = texts[i];
      const indx = text.indexOf(errStr);
      if (indx !== -1) {
        line = i + 1;
        pos = indx;
      }
    }

    const startPos = pos;
    const endPos = pos + errStr.length;

    this.monacoInstance.editor.setModelMarkers(model, 'owner', [
      {
        startLineNumber: line,
        endLineNumber: line,
        startColumn: startPos,
        endColumn: endPos,
        message: body,
        severity: this.monacoInstance.MarkerSeverity.Error,
      },
    ]);
  }

  async handleSyntaxError(response: string) {
    const prompt = 'Syntax error:';
    response = response.trim();
    if (!response.startsWith(prompt)) {
      return;
    }

    // error message follows the format xxxx at [row:column]
    const body = response.substring(prompt.length, response.lastIndexOf('at'));
    const posStr = response.substring(
      response.lastIndexOf('[') + 1,
      response.lastIndexOf(']')
    );

    const [line, pos] = posStr.split(':').map(x => parseInt(x, 10));
    const model = this.editor.getModel();
    const text = model.getValue().split('\n')[line - 1];

    const startPos = pos;
    const errLen = text.substring(pos).indexOf(' ');
    const endPos = errLen !== -1 ? errLen + pos + 1 : text.length + 1;
    this.monacoInstance.editor.setModelMarkers(model, 'owner', [
      {
        startLineNumber: line,
        endLineNumber: line,
        startColumn: startPos,
        endColumn: endPos,
        message: body,
        severity: this.monacoInstance.MarkerSeverity.Error,
      },
    ]);
  }

  resetMarkers() {
    const model = this.editor.getModel();
    this.monacoInstance.editor.setModelMarkers(model, 'owner', []);
  }

  readableBytes(bytes: number) {
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
  }

  renderButton() {
    const buttonState = this.state.buttonState;
    let content = undefined;
    let startIcon = undefined;

    switch (buttonState) {
      case ButtonStates.PENDING:
        content = 'Running';
        startIcon = (
          <CircularProgress size="1rem" thickness={5} color="secondary" />
        );
        break;
      case ButtonStates.READY:
      case ButtonStates.ERROR:
        content = 'Submit query';
        startIcon = <PlayCircleFilledRounded />;
        break;
    }

    return (
      <Button
        color="primary"
        size="small"
        variant="contained"
        onClick={this.handleButtonClick.bind(this)}
        className={styleSheet.queryButton}
        startIcon={startIcon}
      >
        {this.renderButtontext(content)}
      </Button>
    );
  }

  renderCancelButton() {
    const buttonState = this.state.buttonState;
    if (buttonState !== ButtonStates.PENDING) {
      return undefined;
    }

    return (
      <Button
        onClick={this.handleCancel.bind(this)}
        size="small"
        startIcon={<PauseCircleOutline />}
      >
        {this.renderButtontext('stop')}
      </Button>
    );
  }

  renderButtontext(text) {
    return (
      <Typography
        style={{ fontSize: '0.8rem' }}
        className={styleSheet.buttonText}
      >
        {text}
      </Typography>
    );
  }

  renderOptionalText(text, config = {}) {
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!text) {
      return (
        <Typography
          className={styleSheet.optionalText}
          variant="body1"
          style={{ marginRight: '10px' }}
          {...config}
        >
          {text}
        </Typography>
      );
    }

    return undefined;
  }

  render() {
    const { iniQuery } = this.props;

    // eslint-disable-next-line no-extra-boolean-cast
    const readableSize = !!this.state.bytesProcessed
      ? 'Processed ' + this.readableBytes(this.state.bytesProcessed)
      : null;

    const errMsg = this.state.errorMsg;

    // eslint-disable-next-line no-extra-boolean-cast
    const queryValue = !!iniQuery ? iniQuery : 'SELECT * FROM *';

    return (
      <div
        className={
          this.props.editorType === 'IN_CELL'
            ? styleSheet.wholeEditorInCell
            : styleSheet.wholeEditor
        }
      >
        <div className={styleSheet.buttonInfoBar}>
          <div>
            {this.renderButton()}
            {this.renderCancelButton()}
          </div>
          <div>
            {this.renderOptionalText(errMsg, {
              variant: 'caption',
              color: 'error',
            })}
            {this.renderOptionalText(readableSize)}
          </div>
        </div>

        <div
          className={
            this.props.editorType === 'IN_CELL'
              ? styleSheet.queryTextEditorInCell
              : styleSheet.queryTextEditor
          }
        >
          <Editor
            width="100%"
            height="100%"
            theme={'light'}
            language={'sql'}
            value={queryValue}
            editorDidMount={this.handleEditorDidMount.bind(this)}
            options={SQL_EDITOR_OPTIONS}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = _ => {
  return {};
};

const mapDispatchToProps = {
  updateQueryResult,
  resetQueryResult,
  deleteQueryEntry,
};

export default connect(mapStateToProps, mapDispatchToProps)(QueryTextEditor);
