import * as React from 'react';
import { shallow } from 'enzyme';
import { Settings } from 'luxon';

import { DetailsPanel } from './details_panel';
import { prepDatasetDetailsRows } from './dataset_details_panel';
import { prepTableDetailsRows } from './table_details_panel';
import { prepViewDetailsRows } from './view_details_panel';
import {
  prepModelDetailsRows,
  prepTrainingRunDetailsRows,
} from './model_details_panel';
import {
  MockDatasetDetailsFull,
  MockDatasetDetailsEmpty,
  MockTableDetailsFull,
  MockTableDetailsEmpty,
  MockViewDetailsFull,
  MockModelDetailsSingleRun,
  MockTrainingRunDetails,
} from './test_helpers';

describe('DetailsPanel', () => {
  beforeEach(() => {
    Settings.defaultZoneName = 'America/Los_Angeles';
  });

  afterEach(() => {
    Settings.defaultZoneName = 'local';
  });

  it('Renders for datasets with description and labels', () => {
    const mockDatasetDetails = MockDatasetDetailsFull;
    const mockRows = prepDatasetDetailsRows(mockDatasetDetails);
    const component = shallow(
      <DetailsPanel
        details={mockDatasetDetails}
        rows={mockRows}
        detailsType="DATASET"
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('Renders for datasets without description and labels', () => {
    const mockDatasetDetails = MockDatasetDetailsEmpty;
    const mockRows = prepDatasetDetailsRows(mockDatasetDetails);
    const component = shallow(
      <DetailsPanel
        details={mockDatasetDetails}
        rows={mockRows}
        detailsType="DATASET"
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('Renders for tables with all values populated', () => {
    const mockTableDetails = MockTableDetailsFull;
    const mockRows = prepTableDetailsRows(mockTableDetails);
    const component = shallow(
      <DetailsPanel
        details={mockTableDetails}
        rows={mockRows}
        detailsType="TABLE"
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('Renders for tables with some empty details', () => {
    const mockTableDetails = MockTableDetailsEmpty;
    const mockRows = prepTableDetailsRows(mockTableDetails);
    const component = shallow(
      <DetailsPanel
        details={mockTableDetails}
        rows={mockRows}
        detailsType="TABLE"
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('Renders for views', () => {
    const mockViewDetails = MockViewDetailsFull;
    const mockRows = prepViewDetailsRows(mockViewDetails);
    const component = shallow(
      <DetailsPanel
        details={mockViewDetails}
        rows={mockRows}
        detailsType="VIEW"
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('Renders a read-only editor for views', () => {
    const mockViewDetails = MockViewDetailsFull;
    const mockRows = prepViewDetailsRows(mockViewDetails);
    const component = shallow(
      <DetailsPanel
        details={mockViewDetails}
        rows={mockRows}
        detailsType="VIEW"
      />
    );
    expect(component.find('ReadOnlyEditor').exists()).toBeTruthy();
  });

  it('Renders for models', () => {
    const mockModelDetails = MockModelDetailsSingleRun;
    const mockRows = prepModelDetailsRows(mockModelDetails);
    const mockTrainingRows = prepTrainingRunDetailsRows(MockTrainingRunDetails);
    const component = shallow(
      <DetailsPanel
        details={mockModelDetails}
        rows={mockRows}
        trainingRows={mockTrainingRows}
        detailsType="MODEL"
      />
    );
    expect(component).toMatchSnapshot();
  });
});
