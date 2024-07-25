// src/components/PieChart.tsx
import React from 'react';
import { Chart } from 'react-google-charts';

interface User {
  id: number;
  city: string;
}

interface PieChartProps {
  users: User[];
}

const PieChart: React.FC<PieChartProps> = ({ users }) => {
  const cityCounts = users.reduce((acc: Record<string, number>, user) => {
    acc[user.city] = (acc[user.city] || 0) + 1;
    return acc;
  }, {});

  const data = [
    ['City', 'Number of Users'],
    ...Object.entries(cityCounts),
  ];

  const options = {
    is3D: true,
    legend: { position: 'right' },
  };

  return (
    <div className="w-full max-w-md">
      <Chart
        chartType="PieChart"
        data={data}
        options={options}
        width={'500px'}
        height={'500px'}
      />
    </div>
  );
};

export default PieChart;
