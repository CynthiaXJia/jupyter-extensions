/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Dialog } from '@material-ui/core';
import * as React from 'react';
import { HardwareScalingForm } from './hardware_scaling_form';
import {
  HardwareConfiguration,
  Details,
  detailsToHardwareConfiguration,
} from '../data';
import { ConfirmationPage } from './confirmation_page';

enum View {
  FORM,
  CONFIRMATION,
}

interface Props {
  open: boolean;
  onClose: () => void;
  details?: Details;
}

interface State {
  view: View;
  hardwareConfiguration: HardwareConfiguration;
}

/** Funtional Component for a common dialog interface with cancel and submit buttons. */
export class HardwareScalingDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      view: View.FORM,
      hardwareConfiguration: null,
    };
  }

  render() {
    const { open } = this.props;

    return <Dialog open={open}>{this.getDisplay()}</Dialog>;
  }

  private onFormSubmit(newConfiguration: HardwareConfiguration) {
    this.setState({
      view: View.CONFIRMATION,
      hardwareConfiguration: newConfiguration,
    });
  }

  private getDisplay() {
    const { onClose, details } = this.props;
    const { view, hardwareConfiguration } = this.state;

    switch (view) {
      case View.FORM:
        return (
          <HardwareScalingForm
            onDialogClose={onClose}
            onSubmit={(configuration: HardwareConfiguration) =>
              this.onFormSubmit(configuration)
            }
          />
        );
      case View.CONFIRMATION:
        return (
          <ConfirmationPage
            onDialogClose={onClose}
            formData={hardwareConfiguration}
            currentConfiguration={
              details && detailsToHardwareConfiguration(details)
            }
          />
        );
    }
  }
}
