'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import { useCurrencySignAdderPredefinedCurrency } from '@/helpers/string';

interface ImpactChart {
  points: number[];
  averageLossCurrency?: string;
  averageLoss?: number;
}

// Register the plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin,
);

export default function ImpactChart({
  points,
  averageLossCurrency,
  averageLoss,
}: ImpactChart) {
  // State to track client-side rendering

  const [isClient, setIsClient] = useState(false);
  const currencySignFormatter = useCurrencySignAdderPredefinedCurrency({
    currency: averageLossCurrency,
    shorten: true,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate percentage drop per point
  const percentageStep = 100 / (points.length > 0 ? points.length - 1 : 1);

  // Create data points with calculated percentages
  const dataPoints = points.map((x, index) => ({
    x,
    y: 100 - percentageStep * index,
  }));
  // Chart data
  const data = {
    labels: dataPoints.map((point) => point.x),
    datasets: [
      {
        label: 'Percentage',
        data: dataPoints.map((point) => point.y),
        borderColor: '#6366f1',
        backgroundColor: '#6366f1',
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#6366f1',
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };

  // Chart options
  const options: ChartOptions<'line'> = {
    animation: {
      duration: 0,
    },
    scales: {
      x: {
        type: 'linear' as const,
        ticks: {
          callback: (value: any) => currencySignFormatter(Number(value)),
        },
        grid: {
          display: false,
        },
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: (value: any) => `${value}%`,
          count: 5,
        },
        grid: {
          color: '#e0e0e0',
        },
        border: {
          display: true,
          color: '#e0e0e0',
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      point: {
        radius: 1.2,
      },
    },
    spanGaps: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      // @ts-expect-error - Could'ent find a way to avoid this
      crosshair: {
        sync: {
          enabled: false,
        },
        line: {
          color: 'transparent', // crosshair line color
          width: 0, // crosshair line width
        },
        zoom: {
          enabled: false,
        },
      },
      tooltip: {
        intersect: true,
        mode: 'point',
        callbacks: {
          label: (context: any) => `${context.parsed.y}%`,
          title: (context: any) => {
            try {
              const value = Number(context[0].label.replaceAll(',', ''));
              return currencySignFormatter(value);
            } catch (error) {
              return 'NaN';
            }
          },
        },
        enabled: true,
      },
      annotation: {
        annotations: {
          averageLine: averageLoss
            ? {
                type: 'line',
                xMin: averageLoss,
                xMax: averageLoss,
                borderColor: 'black',
                borderWidth: 1,
                borderDash: [5, 5],
                label: {
                  display: true,
                  content: 'Average',
                  position: 'center',
                  rotation: 270,
                  font: {
                    size: 16,
                    weight: 'bold',
                  },
                  color: 'black',
                  backgroundColor: 'transparent',
                  padding: 2,
                },
              }
            : undefined,
        },
      },
    },
  };

  if (!isClient) {
    return (
      <div className='flex h-[400px] w-full items-center justify-center'>
        Loading chart...
      </div>
    );
  }

  return <Line data={data} options={options} />;
}
