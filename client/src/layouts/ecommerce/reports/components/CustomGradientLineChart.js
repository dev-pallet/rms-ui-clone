import GradientLineChart from '../../../../examples/Charts/LineCharts/GradientLineChart';
import React from 'react';

const CustomGradientLineChart = ({ chartData }) => {
  const dataSet = chartData?.map((e) => {
    return { label: e.label, color: e.color || 'dark', data: e.data || [] };
  });
  return (
    <GradientLineChart
      height="230px"
      chart={{
        labels: chartData[0].labels || [],
        datasets: dataSet,
      }}
    />
  );
};

export default CustomGradientLineChart;
