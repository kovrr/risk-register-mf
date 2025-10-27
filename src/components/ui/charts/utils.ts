import { useTheme } from '@chakra-ui/react';
import { PointStyle } from 'chart.js';
import { ThemeProperties } from 'theme/baseTheme';

export const convertToInternationalCurrencySystemToFixed = (
  value: number,
  fixedPoint = 1
): { value: string; suffix: string } => {
  if (value >= 1e9) {
    return { value: (Math.abs(value) / 1e9).toFixed(fixedPoint), suffix: 'B' };
  } else if (value >= 1e6) {
    return { value: (Math.abs(value) / 1e6).toFixed(fixedPoint), suffix: 'M' };
  } else if (value >= 1e3) {
    return { value: (Math.abs(value) / 1e3).toFixed(fixedPoint), suffix: 'K' };
  } else {
    return { value: Math.abs(value).toFixed(fixedPoint), suffix: '' };
  }
};

export function shortenNumberWithSuffix(num: number, fixedPoint = 1) {
  const { value, suffix } = convertToInternationalCurrencySystemToFixed(
    num,
    fixedPoint
  );
  return `${Number(value)}${suffix}`;
}

export const parseYAxisTicks = (value: string | number) => {
  const { value: amount, suffix } = convertToInternationalCurrencySystemToFixed(
    Number(value)
  );
  return Number(Number(amount).toFixed(2)) + suffix;
};

interface useMetricsGraphOptionsConfig {
  beginAtZero?: boolean;
  tickFormatter?: (value: string | number) => string;
  max?: number;
}

export const useMetricsGraphOptions: (
  config?: useMetricsGraphOptionsConfig
) => any = (config) => {
  const {
    beginAtZero = false,
    tickFormatter = parseYAxisTicks,
    max,
  } = config || {};
  const theme = useTheme<ThemeProperties>();

  return {
    responsive: true,
    maintainAspectRatio: true,
    bezierCurve: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      zoom: {
        enabled: false,
      },
      mode: 'interpolate' as any,
      intersect: false,
      crosshair: false,
      usePointStyle: true,
      tooltip: {
        callbacks: {
          labelPointStyle: () => {
            return {
              pointStyle: 'circle' as PointStyle,
              rotation: 0,
            };
          },
          labelColor: () => {
            return {
              borderColor: 'white',
              backgroundColor: theme.colors.brand.v2.purple,
              borderWidth: 2,
            };
          },
        },
      },
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        beginAtZero,
        max,
        border: {
          display: false,
        },
        grid: {
          display: true,
          drawBorder: false,
          color: 'black',
          z: 2,
        },
        ticks: {
          callback: tickFormatter,
          count: 2,
        },
      },
    },
  };
};
