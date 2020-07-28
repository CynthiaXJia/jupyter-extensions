import { ServerConnection } from '@jupyterlab/services';
import { URLExt } from '@jupyterlab/coreutils';

export interface ModelDetailsObject {
  id: string;
  name: string;
  description: string;
  labels: string[];
  date_created: string;
  expires: string;
  location: string;
  last_modified: string;
  model_type: string;
  loss_type: string;
  schema_labels: ModelSchema[];
  feature_columns: ModelSchema[];
}

export interface ModelSchema {
  name: string;
  type: string;
}

export interface ModelDetails {
  details: ModelDetailsObject;
}

interface ModelEvaluationObject {
  abs_error: number;
  mean_sq_error: number;
  mean_sq_log_error: number;
  median_abs_error: number;
  r_squared: number;
}

interface ModelEvaluation {
  evaluation: ModelEvaluationObject;
}

export class ModelDetailsService {
  async listModelDetails(modelId: string): Promise<ModelDetails> {
    return new Promise((resolve, reject) => {
      const serverSettings = ServerConnection.makeSettings();
      const requestUrl = URLExt.join(
        serverSettings.baseUrl,
        'bigquery/v1/modeldetails'
      );
      const body = { modelId: modelId };
      const requestInit: RequestInit = {
        body: JSON.stringify(body),
        method: 'POST',
      };
      ServerConnection.makeRequest(
        requestUrl,
        requestInit,
        serverSettings
      ).then(response => {
        response.json().then(content => {
          if (content.error) {
            console.error(content.error);
            reject(content.error);
            return [];
          }
          resolve({
            details: content.details,
          });
        });
      });
    });
  }

  async getModelEvaluation(modelId: string): Promise<ModelEvaluation> {
    return new Promise((resolve, reject) => {
      const serverSettings = ServerConnection.makeSettings();
      const requestUrl = URLExt.join(
        serverSettings.baseUrl,
        'bigquery/v1/modelevaluation'
      );
      const body = { modelId: modelId };
      const requestInit: RequestInit = {
        body: JSON.stringify(body),
        method: 'POST',
      };
      ServerConnection.makeRequest(
        requestUrl,
        requestInit,
        serverSettings
      ).then(response => {
        response.json().then(content => {
          if (content.error) {
            console.error(content.error);
            reject(content.error);
            return [];
          }
          resolve({
            evaluation: content.evaluation,
          });
        });
      });
    });
  }
}
