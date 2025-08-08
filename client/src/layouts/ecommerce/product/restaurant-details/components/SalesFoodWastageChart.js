import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

// Register required chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const SalesFoodWastageChart = () => {
  // Sample data for the chart
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'], // X-axis labels
    datasets: [
      {
        label: 'Sales',
        data: [200000, 220000, 240000, 230000, 250000], // Sales data
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#007bff',
      },
      {
        label: 'Food Cost',
        data: [150000, 160000, 170000, 165000, 180000], // Food cost data
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.2)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#28a745',
      },
      {
        label: 'Wastage',
        data: [5000, 4500, 4000, 4200, 3800], // Wastage data
        borderColor: '#dc3545',
        backgroundColor: 'rgba(220, 53, 69, 0.2)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#dc3545',
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
          },
          color: '#333',
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#f8f9fa',
        titleColor: '#333',
        bodyColor: '#333',
        borderColor: '#ddd',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Months',
          font: {
            size: 14,
          },
          color: '#333',
        },
        ticks: {
          color: '#555',
        },
        grid: {
          color: '#e9ecef',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Values',
          font: {
            size: 14,
          },
          color: '#333',
        },
        ticks: {
          color: '#555',
        },
        grid: {
          color: '#e9ecef',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div
      style={{
        width: '100%',
        height: '400px',
        marginTop: '1rem',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h3 style={{ textAlign: 'left', marginBottom: '1rem', color: '#333', fontSize: '18px', fontWeight: 'bold' }}>
        Sales vs Food Cost Trend vs Wastage
      </h3>
      <Line data={data} options={options} />
    </div>
  );
};

export default SalesFoodWastageChart;
