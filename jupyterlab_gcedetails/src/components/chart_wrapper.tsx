import * as React from 'react';
import { AreaChart, Area, Tooltip, CartesianGrid, YAxis } from 'recharts';

interface ChartProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  dataKey: string;
  title: string;
  titleClass: string;
  areaChartProps: {};
  areaProps: {};
  cartesianGridProps: {};
  yAxisProps: {};
}

export function AreaChartWrapper(props: ChartProps) {
  const {
    data,
    dataKey,
    title,
    titleClass,
    areaChartProps,
    areaProps,
    cartesianGridProps,
    yAxisProps,
  } = props;
  return (
    <span>
      <h1 className={titleClass}>{title}</h1>
      <AreaChart {...areaChartProps} data={data}>
        <Area {...areaProps} dataKey={dataKey} />
        <Tooltip />
        <CartesianGrid {...cartesianGridProps} />
        <YAxis {...yAxisProps} />
      </AreaChart>
    </span>
  );
}
