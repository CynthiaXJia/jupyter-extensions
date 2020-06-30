import React, { Component } from 'react';
import { stylesheet } from 'typestyle';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  IconButton,
} from '@material-ui/core';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  FirstPage,
  LastPage,
} from '@material-ui/icons';
import { connect } from 'react-redux';
import { QueryResult } from '../query_text_editor/service/query';

const localStyles = stylesheet({
  header: {
    borderBottom: 'var(--jp-border-width) solid var(--jp-border-color2)',
    fontSize: '18px',
    margin: 0,
    padding: '8px 12px 8px 24px',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    color: 'black',
  },
  tableCell: {
    border: 'var(--jp-border-width) solid var(--jp-border-color2)',
  },
  pagination: {
    position: 'fixed',
    bottom: 30,
    backgroundColor: 'white',
    fontSize: '13px',
  },
  resultsContainer: {
    // overflowY: 'auto',
    // overflowX: 'auto',
    overflow: 'auto',
    height: '-webkit-calc(50% - 50px)',
    width: '100%',
  },
});

interface QueryResultsState {
  page: number;
  rowsPerPage: number;
}

interface QueryResultsProps {
  queryResult: QueryResult;
}

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onChangePage: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div style={{ display: 'flex', fontSize: '13px' }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        <FirstPage />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        <LastPage />
      </IconButton>
    </div>
  );
}

class QueryResults extends Component<QueryResultsProps, QueryResultsState> {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 10,
    };
  }

  handleChangePage(event, newPage) {
    this.setState({ page: newPage });
  }

  handleChangeRowsPerPage(event) {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10) });
    this.setState({ page: 0 });
  }

  render() {
    console.log(this.props.queryResult);

    const fields = ['Row', ...this.props.queryResult.labels];
    const rows = this.props.queryResult.content;

    const { rowsPerPage, page } = this.state;

    return (
      <div className={localStyles.resultsContainer}>
        <div className={localStyles.header}>Query results</div>
        <Table size="small" style={{ width: 'auto', tableLayout: 'auto' }}>
          <TableHead className={localStyles.tableHeader}>
            <TableRow>
              {this.props.queryResult.labels.length !== 0 &&
                fields.map(field => <TableCell>{field}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, rowIndex) => (
                <TableRow key={'big_query_query_result_row' + rowIndex}>
                  <TableCell>{page * rowsPerPage + rowIndex + 1}</TableCell>
                  {row.map((cell, cellIndex) => (
                    <TableCell
                      className={localStyles.tableCell}
                      key={
                        'big_query_query_result_row_' +
                        rowIndex +
                        '_cell' +
                        cellIndex
                      }
                    >
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          className={localStyles.pagination}
          rowsPerPageOptions={[10, 30, 50, 100, 200]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={this.handleChangePage.bind(this)}
          onChangeRowsPerPage={this.handleChangeRowsPerPage.bind(this)}
          ActionsComponent={TablePaginationActions}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { queryResult: state.queryEditorTab.queryResult };
};

export default connect(mapStateToProps)(QueryResults);
