import React from 'react';
import { connect } from 'react-redux';
import { updateQueryResult } from '../../../reducers/queryEditorTabSlice';

import Editor from '@monaco-editor/react';
import { editor } from 'monaco-editor/esm/vs/editor/editor.api';
import { monaco } from '@monaco-editor/react';
import { getSqlCompletionProvider } from './sql_completion';

import { Button } from '@material-ui/core';
import { stylesheet } from 'typestyle';
import { QueryService, QueryResult } from './service/query';

interface QueryTextEditorState {
  buttonState: ButtonStates;
}

interface QueryTextEditorProps {
  updateQueryResult: any;
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
  minimap: {
    enabled: false,
  },
};

const styleSheet = stylesheet({
  queryButton: { float: 'right' },
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
  // editor: editor.IStandaloneCodeEditor;
  editor: any;

  constructor(props) {
    super(props);
    this.state = {
      buttonState: ButtonStates.READY,
    };
    this.queryService = new QueryService();
  }

  async handleSubmit() {
    const query = this.editor.getValue();

    this.queryService
      .query(query)
      .then((res: QueryResult) => {
        //TODO: handle success
        this.props.updateQueryResult(res);
      })
      .catch(err => {
        //TODO: Handle fail query
      });
  }

  handleEditorDidMount(_, editor) {
    // this.editor = editor;
    console.log('editor mounted: ', this.editor);
  }

  componentDidMount() {
    this.editor = monaco
      .init()
      .then(monaco => {
        this.editor = monaco.languages.registerCompletionItemProvider(
          'sql',
          getSqlCompletionProvider(monaco)
        );
        console.log('autocomplete registered', this.editor);
      })
      .catch(error =>
        console.error(
          'An error occurred during initialization of Monaco: ',
          error
        )
      );
  }

  componentWillUnmount() {
    this.editor.dispose();
  }

  render() {
    return (
      <div>
        <Editor
          height="40vh"
          theme={'light'}
          language={'sql'}
          value={'// type your code...'}
          editorDidMount={this.handleEditorDidMount.bind(this)}
          options={SQL_EDITOR_OPTIONS}
        />
        <Button
          color="primary"
          variant="contained"
          onClick={this.handleSubmit.bind(this)}
          className={styleSheet.queryButton}
        >
          Submit
        </Button>
      </div>
    );
  }
}

const mapStateToProps = _ => {
  return {};
};

const mapDispatchToProps = { updateQueryResult };

export default connect(mapStateToProps, mapDispatchToProps)(QueryTextEditor);
