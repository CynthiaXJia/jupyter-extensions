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

import { Option } from './data';

/*
 * Machine type returned when fetching from gcloud compute command-line tool
 */
export interface MachineType {
  name: string;
  description: string;
}

export function optionToMachineType(option: Option): MachineType {
  return {
    name: option.value as string,
    description: option.text,
  };
}

export function machineTypeToOption(machineType: MachineType): Option {
  return {
    value: machineType.name,
    text: machineType.description,
    disabled: false,
  };
}

/**
 * AI Platform Machine types.
 * https://cloud.google.com/ai-platform/training/docs/machine-types#compare-machine-types
 */
export interface MachineTypeConfiguration {
  base: Option;
  configurations: Option[];
}

export const MACHINE_TYPES: MachineTypeConfiguration[] = [
  {
    base: {
      value: 'n1-standard-',
      text: 'N1 standard',
    },
    configurations: [
      { value: 'n1-standard-1', text: '1 vCPUs, 3.75 GB RAM' },
      { value: 'n1-standard-2', text: '2 vCPUs, 7.5 GB RAM' },
      { value: 'n1-standard-4', text: '4 vCPUs, 15 GB RAM' },
      { value: 'n1-standard-8', text: '8 vCPUs, 30 GB RAM' },
      { value: 'n1-standard-16', text: '16 vCPUs, 60 GB RAM' },
      { value: 'n1-standard-32', text: '32 vCPUs, 120 GB RAM' },
      { value: 'n1-standard-64', text: '64 vCPUs, 240 GB RAM' },
      { value: 'n1-standard-96', text: '96 vCPUs, 360 GB RAM' },
    ],
  },
  {
    base: {
      value: 'n1-highcpu-',
      text: 'N1 high-CPU',
    },
    configurations: [
      { value: 'n1-highcpu-2', text: '2 vCPUs, 1.8 GB RAM' },
      { value: 'n1-highcpu-4', text: '4 vCPUs, 3.6 GB RAM' },
      { value: 'n1-highcpu-8', text: '8 vCPUs, 7.2 GB RAM' },
      { value: 'n1-highcpu-16', text: '16 vCPUs, 14.4 GB RAM' },
      { value: 'n1-highcpu-32', text: '32 vCPUs, 28.8 GB RAM' },
      { value: 'n1-highcpu-64', text: '64 vCPUs, 57.6 GB RAM' },
      { value: 'n1-highcpu-96', text: '96 vCPUs, 86 GB RAM' },
    ],
  },
  {
    base: {
      value: 'n1-highmem-',
      text: 'N1 high-memory',
    },
    configurations: [
      { value: 'n1-highmem-2', text: '2 vCPUs, 13 GB RAM' },
      { value: 'n1-highmem-4', text: '4 vCPUs, 26 GB RAM' },
      { value: 'n1-highmem-8', text: '8 vCPUs, 52 GB RAM' },
      { value: 'n1-highmem-16', text: '16 vCPUs, 104 GB RAM' },
      { value: 'n1-highmem-32', text: '32 vCPUs, 208 GB RAM' },
      { value: 'n1-highmem-64', text: '64 vCPUs, 416 GB RAM' },
      { value: 'n1-highmem-96', text: '96 vCPUs, 624 GB RAM' },
    ],
  },
  {
    base: {
      value: 'n1-megamem-',
      text: 'N1 megamem',
    },
    configurations: [{ value: 'n1-megamem-96', text: '96 vCPUs, 1.4 TB RAM' }],
  },
  {
    base: {
      value: 'n1-ultramem-',
      text: 'N1 ultramem',
    },
    configurations: [
      { value: 'n1-ultramem-40', text: '40 vCPUs, 961 GB RAM' },
      { value: 'n1-ultramem-80', text: '80 vCPUs, 1922 GB RAM' },
      { value: 'n1-ultramem-160', text: '160 vCPUs, 3844 GB RAM' },
    ],
  },
  {
    base: {
      value: 'n2-highcpu-',
      text: 'N2 high-CPU',
    },
    configurations: [
      { value: 'n2-highcpu-2', text: '2 vCPUs, 2 GB RAM' },
      { value: 'n2-highcpu-4', text: '4 vCPUs, 4 GB RAM' },
      { value: 'n2-highcpu-8', text: '8 vCPUs, 8 GB RAM' },
      { value: 'n2-highcpu-16', text: '16 vCPUs, 16 GB RAM' },
      { value: 'n2-highcpu-32', text: '32 vCPUs, 32 GB RAM' },
      { value: 'n2-highcpu-48', text: '48 vCPUs, 48 GB RAM' },
      { value: 'n2-highcpu-64', text: '64 vCPUs, 64 GB RAM' },
      { value: 'n2-highcpu-80', text: '80 vCPUs, 80 GB RAM' },
    ],
  },
  {
    base: {
      value: 'n2-highmem-',
      text: 'N2 high-memory',
    },
    configurations: [
      { value: 'n2-highmem-2', text: '2 vCPUs, 16 GB RAM' },
      { value: 'n2-highmem-4', text: '4 vCPUs, 32 GB RAM' },
      { value: 'n2-highmem-8', text: '8 vCPUs, 64 GB RAM' },
      { value: 'n2-highmem-16', text: '16 vCPUs, 128 GB RAM' },
      { value: 'n2-highmem-32', text: '32 vCPUs, 256 GB RAM' },
      { value: 'n2-highmem-48', text: '48 vCPUs, 384 GB RAM' },
      { value: 'n2-highmem-64', text: '64 vCPUs, 512 GB RAM' },
      { value: 'n2-highmem-80', text: '80 vCPUs, 640 GB RAM' },
    ],
  },
  {
    base: {
      value: 'n2-standard-',
      text: 'N2 standard',
    },
    configurations: [
      { value: 'n2-standard-2', text: '2 vCPUs, 8 GB RAM' },
      { value: 'n2-standard-4', text: '4 vCPUs, 16 GB RAM' },
      { value: 'n2-standard-8', text: '8 vCPUs, 32 GB RAM' },
      { value: 'n2-standard-16', text: '16 vCPUs, 64 GB RAM' },
      { value: 'n2-standard-32', text: '32 vCPUs, 128 GB RAM' },
      { value: 'n2-standard-48', text: '48 vCPUs, 192 GB RAM' },
      { value: 'n2-standard-64', text: '64 vCPUs, 256 GB RAM' },
      { value: 'n2-standard-80', text: '80 vCPUs, 320 GB RAM' },
    ],
  },
  {
    base: {
      value: 'm1-ultramem-',
      text: 'Memory-optimized',
    },
    configurations: [
      { value: 'm1-ultramem-40', text: '40 vCPUs, 961 GB RAM' },
      { value: 'm1-ultramem-80', text: '80 vCPUs, 1922 GB RAM' },
      { value: 'm1-ultramem-96', text: '96 vCPUs, 1.4 TB RAM' },
      { value: 'm1-ultramem-160', text: '160 vCPUs, 3844 GB RAM' },
    ],
  },
];

/*
 * Get description text from Machine Type value
 */
export function getMachineTypeText(value: string) {
  const machineType = MACHINE_TYPES.find(machineType =>
    value.startsWith(machineType.base.value as string)
  );

  return machineType
    ? machineType.configurations.find(
        configuration => configuration.value === value
      ).text
    : null;
}
