import * as React from 'react';

import { Grid, Chip, withStyles } from '@material-ui/core';
import { stylesheet } from 'typestyle';

import ReadOnlyEditor from '../shared/read_only_editor';
import { SchemaField } from './service/list_table_details';
import { ModelSchema } from './service/list_model_details';
import { StripedRows } from '../shared/striped_rows';
import { SchemaTable, ModelSchemaTable } from '../shared/schema_table';
import { gColor } from '../shared/styles';

export const localStyles = stylesheet({
  title: {
    fontSize: '16px',
    marginBottom: '10px',
  },
  panel: {
    backgroundColor: 'var(--jp-layout-color0)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  detailsBody: {
    fontSize: '13px',
    marginTop: '24px',
    marginBottom: '24px',
  },
  labelContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      marginRight: '8px',
      marginBottom: '8px',
    },
  },
  rowTitle: {
    width: '150px',
  },
  row: {
    display: 'flex',
    padding: '6px',
  },
  bold: {
    fontWeight: 500,
  },
});

const StyledChip = withStyles({
  root: {
    color:
      document.body.getAttribute('data-jp-theme-light') === 'true'
        ? gColor('BLUE')
        : 'var(--jp-ui-font-color1)',
    backgroundColor:
      document.body.getAttribute('data-jp-theme-light') === 'true'
        ? 'rgba(25, 103, 210, 0.1)'
        : 'rgba(25, 103, 210, 0.24)',
  },
})(Chip);

interface SharedDetails {
  id: string;
  description: string;
  labels: string[];
  name: string;
  schema?: SchemaField[];
  query?: string;
  schema_labels?: ModelSchema[];
  feature_columns?: ModelSchema[];
}

interface Props {
  details: SharedDetails;
  rows: any[];
  // TODO(cxjia): figure out a shared typing for these rows
  detailsType: 'DATASET' | 'TABLE' | 'VIEW' | 'MODEL';
  trainingRows?: any[];
}

const getTitle = type => {
  switch (type) {
    case 'DATASET':
      return 'Dataset info';
    case 'TABLE':
      return 'Table info';
    case 'VIEW':
      return 'View info';
    case 'MODEL':
      return 'Model details';
  }
};

export const DetailsPanel: React.SFC<Props> = props => {
  const { details, rows, detailsType, trainingRows } = props;

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
                    return (
                      <StyledChip size="small" key={index} label={value} />
                    );
                  })}
                </div>
              ) : (
                'None'
              )}
            </div>
          </Grid>

          <Grid item xs={12}>
            <div className={localStyles.title}>{getTitle(detailsType)}</div>
            <StripedRows rows={rows} />
          </Grid>

          {detailsType === 'MODEL' && (
            <Grid item xs={12}>
              <div className={localStyles.title}>Training options</div>
              {trainingRows && <StripedRows rows={trainingRows} />}
            </Grid>
          )}

          {(detailsType === 'TABLE' || detailsType === 'VIEW') && (
            <Grid item xs={12}>
              <div className={localStyles.title}>Schema</div>
              {details.schema && details.schema.length > 0 ? (
                <SchemaTable schema={details.schema} />
              ) : (
                'Table does not have a schema.'
              )}
            </Grid>
          )}

          {detailsType === 'VIEW' && (
            <Grid item xs={12}>
              <div className={localStyles.title}>Query</div>
              <ReadOnlyEditor query={details.query} />
            </Grid>
          )}

          {detailsType === 'MODEL' && (
            <Grid item xs={12}>
              <div className={localStyles.title}>Label columns</div>
              <div>
                {details.schema_labels && details.schema_labels.length > 0 ? (
                  <ModelSchemaTable schema={details.schema_labels} />
                ) : (
                  'Model does not have any label columns.'
                )}
              </div>
            </Grid>
          )}

          {detailsType === 'MODEL' && (
            <Grid item xs={12}>
              <div className={localStyles.title}>Feature columns</div>
              <div>
                {details.feature_columns &&
                details.feature_columns.length > 0 ? (
                  <ModelSchemaTable schema={details.feature_columns} />
                ) : (
                  'Model does not have any feature columns.'
                )}
              </div>
            </Grid>
          )}
        </Grid>
      </div>
    </div>
  );
};
