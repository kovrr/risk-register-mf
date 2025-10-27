import { useMetricsGraphOptions } from '@/components/charts/utils';
import type { ScenarioMetricsHistory } from '@/types/riskRegister';
import 'chart.js/auto';
import { type FC, useMemo } from 'react';
import { Line } from 'react-chartjs-2';

const getCSSVariable = (variableName: string, fallback = '#5551f7'): string => {
  if (typeof window !== 'undefined') {
    return (
      getComputedStyle(document.documentElement).getPropertyValue(
        variableName,
      ) || fallback
    );
  }
  return fallback;
};

type CrqAALMetricFooterProps = {
  metricsHistory: ScenarioMetricsHistory;
};

export const CrqAALMetricFooter: FC<CrqAALMetricFooterProps> = ({
  metricsHistory,
}) => {
  const mainMetricsGraphOptions = useMetricsGraphOptions();

  const { labels, percentages } = useMemo(() => {
    const labels = metricsHistory.metrics_history.map(
      (_, index) => `Period ${index + 1}`,
    );
    const percentages = metricsHistory.metrics_history.map(
      (metric) => (metric.annual_likelihood ?? 0) * 100,
    );
    return { labels, percentages };
  }, [metricsHistory]);

  const graphOptions = useMemo(
    () => ({
      ...mainMetricsGraphOptions,
      plugins: {
        ...mainMetricsGraphOptions.plugins,
        tooltip: {
          ...mainMetricsGraphOptions.plugins.tooltip,
          usePointStyle: true,
          callbacks: {
            ...mainMetricsGraphOptions.plugins.tooltip.callbacks,
            label: (context: any) => {
              return `Annual Likelihood: ${context.parsed.y.toFixed(2)}%`;
            },
          },
        },
      },
      maintainAspectRatio: false,
      scales: {
        ...mainMetricsGraphOptions.scales,
        y: {
          ...mainMetricsGraphOptions.scales.y,
          beginAtZero: true,
          max: Math.max(...percentages) * 1.05,
        },
      },
    }),
    [mainMetricsGraphOptions, percentages],
  );

  // Get colors from CSS variables
  const primaryColor = getCSSVariable('--primary');
  const primaryColorTransparent = getCSSVariable(
    '--fill-brand-primary-transparent',
  );

  const graphData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          data: percentages,
          fill: true,
          lineTension: 0.2,
          borderColor: primaryColor,
          backgroundColor: primaryColorTransparent,
          pointBackgroundColor: primaryColor,
          pointBorderColor: primaryColor,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    }),
    [labels, percentages, primaryColor, primaryColorTransparent],
  );

  return (
    <div className='h-[120px] w-full pb-4' data-testid='crq-aal-chart'>
      <Line options={graphOptions} data={graphData} height={120} />
    </div>
  );
};
