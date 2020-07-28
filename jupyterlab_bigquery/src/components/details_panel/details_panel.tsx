import * as React from 'react';

import {
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  withStyles,
} from '@material-ui/core';
import { stylesheet } from 'typestyle';
import { SchemaField } from './service/list_table_details';
import { ModelSchema } from './service/list_model_details';
import { StripedRows } from '../shared/striped_rows';

export const localStyles = stylesheet({
  header: {
    borderBottom: 'var(--jp-border-width) solid var(--jp-border-color2)',
    fontSize: '18px',
    margin: 0,
    padding: '8px 12px 8px 24px',
  },
  title: {
    fontSize: '16px',
    marginBottom: '8px',
  },
  panel: {
    backgroundColor: 'white',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  detailsBody: {
    fontSize: '13px',
    marginTop: '24px',
  },
  labelContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: '4px',
    },
  },
  rowTitle: {
    width: '200px',
  },
  row: {
    display: 'flex',
    padding: '6px',
  },
});

export const TableHeadCell: React.ComponentType<any> = withStyles({
  root: {
    backgroundColor: '#f0f0f0',
  },
})(TableCell);

const formatFieldName = name => {
  if (name.includes('.')) {
    const child = name.substr(name.lastIndexOf('.') + 1);
    const parents = name.substr(0, name.lastIndexOf('.') + 1);
    return (
      <div>
        {parents} <b>{child}</b>
      </div>
    );
  } else {
    return <b>{name}</b>;
  }
};

interface SharedDetails {
  id: string;
  description: string;
  labels: string[];
  name: string;
  schema?: SchemaField[];
  schema_labels?: ModelSchema[];
  feature_columns?: ModelSchema[];
}

interface Props {
  details: SharedDetails;
  rows: any[];
  // TODO(cxjia): figure out a shared typing for these rows
  detailsType: string;
}

export const DetailsPanel: React.SFC<Props> = props => {
  const { details, rows, detailsType } = props;

  return (
    <div className={localStyles.panel}>
      <div className={localStyles.detailsBody}>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <div className={localStyles.title}>Description</div>
            <div>{details.description ? details.description : 'None'}</div>
          </Grid>

          <Grid item xs={6}>
            <div>
              <div className={localStyles.title}>Labels</div>
              {details.labels ? (
                <div className={localStyles.labelContainer}>
                  {details.labels.map((value, index) => {
                    return <Chip size="small" key={index} label={value} />;
                  })}
                </div>
              ) : (
                'None'
              )}
            </div>
          </Grid>

          <Grid item xs={12}>
            <div className={localStyles.title}>
              {detailsType === 'table' ? 'Table' : 'Dataset'} info
            </div>
            <StripedRows rows={rows} />
          </Grid>
        </Grid>

        {detailsType === 'MODEL' && (
          <div>
            <div className={localStyles.title} style={{ marginTop: '32px' }}>
              Training options
            </div>
            <div>training stuff here</div>
          </div>
        )}

        {detailsType === 'table' && (
          <div className={localStyles.title} style={{ marginTop: '32px' }}>
            Schema
          </div>
        )}

        {detailsType === 'table' && (
          <div>
            {details.schema && details.schema.length > 0 ? (
              <Table
                size="small"
                style={{ width: 'auto', tableLayout: 'auto' }}
              >
                <TableHead>
                  <TableRow>
                    <TableHeadCell>Field name</TableHeadCell>
                    <TableHeadCell>Type</TableHeadCell>
                    <TableHeadCell>Mode</TableHeadCell>
                    <TableHeadCell>Description</TableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {details.schema.map((field, index) => {
                    return (
                      <TableRow key={`schema_row_${index}`}>
                        <TableCell>{formatFieldName(field.name)}</TableCell>
                        <TableCell>{field.type}</TableCell>
                        <TableCell>{field.mode}</TableCell>
                        <TableCell>{field.description ?? ''}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              'Table does not have a schema.'
            )}
          </div>
        )}

        {detailsType === 'MODEL' && (
          <div>
            <div className={localStyles.title} style={{ marginTop: '32px' }}>
              Label columns
            </div>
            <div>
              {details.schema_labels && details.schema_labels.length > 0 ? (
                <Table
                  size="small"
                  style={{ width: 'auto', tableLayout: 'auto' }}
                >
                  <TableHead>
                    <TableRow>
                      <TableHeadCell>Field name</TableHeadCell>
                      <TableHeadCell>Type</TableHeadCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {details.schema_labels.map((field, index) => {
                      return (
                        <TableRow key={`schema_label_row_${index}`}>
                          <TableCell>{field.name}</TableCell>
                          <TableCell>{field.type}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                'Model does not have any label columns.'
              )}
            </div>
            <div className={localStyles.title} style={{ marginTop: '24px' }}>
              Feature columns
            </div>
            <div>
              {details.feature_columns && details.feature_columns.length > 0 ? (
                <Table
                  size="small"
                  style={{ width: 'auto', tableLayout: 'auto' }}
                >
                  <TableHead>
                    <TableRow>
                      <TableHeadCell>Field name</TableHeadCell>
                      <TableHeadCell>Type</TableHeadCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {details.feature_columns.map((field, index) => {
                      return (
                        <TableRow key={`schema_feature_row_${index}`}>
                          <TableCell>{field.name}</TableCell>
                          <TableCell>{field.type}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                'Model does not have any feature columns.'
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
