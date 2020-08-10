import * as React from 'react';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import { AxisPropsList } from '../trial_visualization';

d3.tip = d3Tip;

interface Data {
  [key: string]: any;
}

interface Props {
  width: number;
  height: number;
  axisProps: AxisPropsList;
  trialData: Data[];
  selectedParam: string;
  selectedMetric: string;
}

// TODO - move these duplicate setup's to common graphs-util folder

export const Scatterplot = (props: Props) => {
  const d3ContainerScatterplot = React.useRef(null);
  const axisProps = props.axisProps;
  const width = props.width;
  const height = props.height;
  const trialData = props.trialData;
  const selectedParam = props.selectedParam;
  const selectedMetric = props.selectedMetric;
  const padding = 70;
  const topPadding = padding * 0.5;

  React.useEffect(() => {
    if (
      props.trialData &&
      d3ContainerScatterplot.current &&
      selectedParam &&
      selectedMetric &&
      width > 0 &&
      height > 0
    ) {
      const svg = d3.select(d3ContainerScatterplot.current);
      svg.selectAll('*').remove();

      let xScale;
      // populate the parameter axis (x-axis)
      const paramInfo = axisProps[selectedParam];
      switch (paramInfo.type) {
        case 'INTEGER':
        case 'DOUBLE': {
          // normal scatterplot (continuous parameter)
          const axisMin = 'minVal' in paramInfo ? paramInfo.minVal : 0;
          const axisMax = 'maxVal' in paramInfo ? paramInfo.maxVal : 0;
          xScale = d3
            .scaleLinear()
            .domain([axisMin, axisMax])
            .range([padding, width - padding]);
          break;
        }
        case 'DISCRETE':
        case 'CATEGORICAL': {
          // vertically grouped scatterplot (discontinous parameter)
          const axisValues = 'values' in paramInfo ? paramInfo.values : [];
          xScale = d3
            .scaleBand()
            .domain(axisValues)
            .range([padding, width - padding])
            .padding(1); // needed to align the dots with the axis
        }
      }
      const xAxis = d3.axisBottom().scale(xScale);
      svg
        .append('g')
        .attr('transform', `translate(0,${height - padding})`)
        .attr('class', 'xAxis')
        .attr('id', `${selectedParam}`)
        .call(xAxis);
      // populate the metric axis (y-axis)
      const yScale = d3
        .scaleLinear()
        .domain([
          axisProps[selectedMetric]['maxVal'],
          axisProps[selectedMetric]['minVal'],
        ])
        .range([topPadding, height - padding]);
      const yAxis = d3.axisLeft().scale(yScale);
      svg
        .append('g')
        .attr('transform', `translate(${padding},0)`)
        .attr('class', 'yAxis')
        .attr('id', `${selectedMetric}`)
        .call(yAxis);

      const getTooltipHTML = data => {
        const keys = Object.keys(data);
        const dataList = keys.map(key => `${key}: ${data[key]}`);
        return dataList.join('<br/>');
      };

      // Set up tooltip
      const tip = d3
        .tip()
        .attr('class', 'd3-tip')
        .html(function(d) {
          return getTooltipHTML(d);
        });

      // plot the trials
      svg
        .append('g')
        .selectAll('dot')
        .data(trialData)
        .enter()
        .append('circle')
        .attr('cx', function(d) {
          return xScale(d[selectedParam]);
        })
        .attr('cy', function(d) {
          return yScale(d[selectedMetric]);
        })
        .attr('r', 4)
        .attr('fill', 'rgba(63, 81, 181, 0.5)')
        .on('mouseenter', tip.show)
        .on('mouseleave', tip.hide);
      // Tooltip style & add to svg
      tip
        .style('font-size', '12px')
        .style('font-family', 'Roboto')
        .style('background', 'rgba(199, 199, 199, 0.8)')
        .style('padding', '5px')
        .style('border-radius', '8px');
      svg.call(tip);
      // label for axes
      svg
        .append('text')
        .attr('x', `${width / 2}`)
        .attr('y', `${height - padding / 2}`)
        .attr('font-family', 'Roboto')
        .attr('text-anchor', 'middle')
        .text(selectedParam);
      svg
        .append('text')
        .attr('x', `${(-1 * height) / 2}`)
        .attr('y', `${padding / 2}`)
        .attr('transform', `translate(${topPadding},0)`)
        .attr('transform', 'rotate(270)')
        .attr('font-family', 'Roboto')
        .attr('text-anchor', 'middle')
        .text(selectedMetric);
    }
  }, [
    props.trialData,
    axisProps,
    selectedParam,
    selectedMetric,
    width,
    height,
    padding,
    trialData,
  ]);

  return (
    <svg
      className="d3-scatterplot"
      width={width}
      height={height}
      ref={d3ContainerScatterplot}
    />
  );
};
