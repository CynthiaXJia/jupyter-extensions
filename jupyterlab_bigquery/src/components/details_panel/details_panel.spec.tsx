import * as React from 'react';
import { shallow } from 'enzyme';
import { Settings } from 'luxon';

import { DetailsPanel } from './details_panel';
import {
  FakeDatasetDetailsFull,
  FakeDatasetDetailsEmpty,
  FakeTableDetailsFull,
  FakeTableDetailsEmpty,
  FakeViewDetailsFull,
  FakeModelDetailsSingleRun,
} from './test_helpers';

describe('DetailsPanel', () => {
  const fakeRows = [
    { name: 'name', value: 'value' },
    { name: 'another name', value: 'another value' },
  ];

  const fakeTrainingRows = [
    { name: 'training option', value: 'training value' },
  ];

  beforeEach(() => {
    Settings.defaultZoneName = 'America/Los_Angeles';
  });

  afterEach(() => {
    Settings.defaultZoneName = 'local';
  });

  it('Renders for datasets with description and labels', () => {
    const component = shallow(
      <DetailsPanel
        details={FakeDatasetDetailsFull}
        rows={fakeRows}
        detailsType="DATASET"
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('Renders for datasets without description and labels', () => {
    const component = shallow(
      <DetailsPanel
        details={FakeDatasetDetailsEmpty}
        rows={fakeRows}
        detailsType="DATASET"
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('Renders for tables with all values populated', () => {
    const component = shallow(
      <DetailsPanel
        details={FakeTableDetailsFull}
        rows={fakeRows}
        detailsType="TABLE"
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('Renders for tables with some empty details', () => {
    const component = shallow(
      <DetailsPanel
        details={FakeTableDetailsEmpty}
        rows={fakeRows}
        detailsType="TABLE"
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('Renders for views', () => {
    const component = shallow(
      <DetailsPanel
        details={FakeViewDetailsFull}
        rows={fakeRows}
        detailsType="VIEW"
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('Renders a read-only editor for views', () => {
    const component = shallow(
      <DetailsPanel
        details={FakeViewDetailsFull}
        rows={fakeRows}
        detailsType="VIEW"
      />
    );
    expect(component.find('ReadOnlyEditor').exists()).toBeTruthy();
  });

  it('Renders for models', () => {
    const component = shallow(
      <DetailsPanel
        details={FakeModelDetailsSingleRun}
        rows={fakeRows}
        trainingRows={fakeTrainingRows}
        detailsType="MODEL"
      />
    );
    expect(component).toMatchSnapshot();
  });
});
