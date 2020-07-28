import * as React from 'react';
import { ModelDetailsService } from './service/list_model_details';
import LoadingPanel from '../loading_panel';
import { StripedRows } from '../shared/striped_rows';

interface Props {
  modelDetailsService: ModelDetailsService;
  isVisible: boolean;
  modelId: string;
}

interface State {
  hasLoaded: boolean;
  isLoading: boolean;
  rows: DetailRow[];
}

interface DetailRow {
  name: string;
  value: number;
}

export default class ModelEvaluationPanel extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasLoaded: false,
      isLoading: false,
      rows: [],
    };
  }

  componentDidUpdate(prevProps: Props) {
    const isFirstLoad =
      !(this.state.hasLoaded || prevProps.isVisible) && this.props.isVisible;
    if (isFirstLoad) {
      this.getEvaluation();
    }
  }

  private async getEvaluation() {
    try {
      this.setState({ isLoading: true });
      const evaluation = await this.props.modelDetailsService.getModelEvaluation(
        this.props.modelId
      );

      const evalObj = evaluation.evaluation;
      const rows = [
        { name: 'Mean absolute error', value: evalObj.abs_error },
        { name: 'Mean squared error', value: evalObj.mean_sq_error },
        { name: 'Mean squared log error', value: evalObj.mean_sq_log_error },
        { name: 'Median absolute error', value: evalObj.median_abs_error },
        { name: 'R squared', value: evalObj.r_squared },
      ];
      this.setState({ hasLoaded: true, rows });
    } catch (err) {
      console.warn('Error retrieving model evaluation', err);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingPanel />;
    } else {
      return (
        <div style={{ marginTop: '24px' }}>
          <StripedRows rows={this.state.rows} />
        </div>
      );
    }
  }
}
