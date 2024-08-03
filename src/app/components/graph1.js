'use client'
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the plugin
import RootLayout from "@/app/components/layout";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels)

const HorizontalGroupedBarChart = () => {
     const names = ['Avinash', 'Ehsan', 'Haleem', 'Helal', 'Pritam', 'Raheel', 'Tanvir'];
  const data = {
    labels: ['India', 'Pakistan', 'Bangladesh', 'UAE'], 
     // Names to display
    datasets: [
      {
        label: 'Avinash',
        data: [12, 19, 8, 20],
        backgroundColor: '#FFDE03',
      },
      {
        label: 'Ehsan',
        data: [22, 29, 15, 15],
        backgroundColor: '#81D4FA',
      },
      {
        label: 'Haleem',
        data: [22, 29, 15, 15],
        backgroundColor: '#DCE775',
      },
      {
        label: 'Helal',
        data: [22, 29, 15, 15],
        backgroundColor: '#F06292',
      },
      {
        label: 'Pritam',
        data: [22, 29, 15, 15],
        backgroundColor: '#AED581',
      },
      {
        label: 'Raheel',
        data: [22, 29, 15, 15],
        backgroundColor: '#9575CD',
      },
      {
        label: 'Tanvir',
        data: [22, 29, 15, 15],
        backgroundColor: '#4FC3F7',
      },
      
    ]
  };

  const options = {
    indexAxis: 'y', 
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return tooltipItem.dataset.label + ': ' + tooltipItem.raw;
          }
        }
      },
      datalabels: {
        display: true,
        anchor: 'start',
        align: 'start',
        color: '#000',
         formatter: (value, context) => {
          const datasetIndex = context.datasetIndex;
          const dataIndex = context.dataIndex;
          const nameIndex = datasetIndex % names.length;
          return names[nameIndex] || '';
        },
        font: {
          weight: 'bold',
          size: 14,
        },
         padding: {
         top: 20,   
          bottom: '2rem',
        },
         
        
        
      }
    },
    scales: {
      x: {
        stacked: false, 
        ticks: {
          beginAtZero: true,
        }
      },
      y: {
        stacked: false,  
      }
    }
  };

  return <Bar data={data} options={options} />
};

export default HorizontalGroupedBarChart;
