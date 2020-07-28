import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QueryResult } from '../components/query_editor/query_text_editor/query_text_editor';
import { UUID } from '@phosphor/coreutils';

export interface QueryEditorState {
  queries: { [key: string]: QueryResult };
  starterQueries: { [key: string]: string };
}

export type QueryId = string;

interface QueryStarter {
  queryId: QueryId;
  starterQuery: string;
}

const DEFAULT_INIT_QUERY_STATE = {
  content: [],
  labels: [],
  bytesProcessed: null,
  queryId: null,
};

const initialState: QueryEditorState = {
  queries: {},
  starterQueries: {},
};

export function generateQueryId() {
  return UUID.uuid4();
}

const queryEditorTabSlice = createSlice({
  name: 'queryEditorTab',
  initialState,
  reducers: {
    updateQueryResult(state, action: PayloadAction<QueryResult>) {
      const queryResult = action.payload;
      const queryId = queryResult.queryId;
      let newQueryState = state.queries[queryId];

      if (!newQueryState) {
        newQueryState = Object.assign(
          {},
          DEFAULT_INIT_QUERY_STATE
        ) as QueryResult;
      }

      newQueryState.content = newQueryState.content.concat(queryResult.content);
      newQueryState.labels = queryResult.labels;
      newQueryState.bytesProcessed = queryResult.bytesProcessed;
      newQueryState.queryId = queryId;

      state.queries = { ...state.queries, [queryId]: newQueryState };
    },
    resetQueryResult(state, action: PayloadAction<QueryId>) {
      const queryId = action.payload;
      const newQueryState = Object.assign(
        {},
        DEFAULT_INIT_QUERY_STATE
      ) as QueryResult;
      newQueryState.queryId = queryId;
      state.queries = { ...state.queries, [queryId]: newQueryState };
    },
    deleteQueryEntry(state, action: PayloadAction<QueryId>) {
      const queryId = action.payload;
      delete state.queries[queryId];
    },
    updateStarterQuery(state, action: PayloadAction<QueryStarter>) {
      const queryStarter = action.payload;
      state.starterQueries[queryStarter.queryId] = queryStarter.starterQuery;
    },
  },
});

export const {
  updateQueryResult,
  resetQueryResult,
  deleteQueryEntry,
} = queryEditorTabSlice.actions;

export default queryEditorTabSlice.reducer;
