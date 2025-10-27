import {
  convertToInternationalCurrencySystemToFixed,
  useMetricsGraphOptions,
} from '@/components/charts/utils';
import type {
  ImpactDistribution,
  ScenarioMetricsHistory,
} from '@/types/riskRegister';
import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import 'chart.js/auto';
import { type FC, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { ImpactDistributionCard as ImpactDistributionComponent } from '../ImpactDistributionCard';

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

type CrqAverageFinancialLossMetricFooterProps = {
  metricsHistory: ScenarioMetricsHistory;
  impactDistribution?: ImpactDistribution;
};

export const CrqAverageFinancialLossMetricFooter: FC<
  CrqAverageFinancialLossMetricFooterProps
> = ({ metricsHistory, impactDistribution }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mainMetricsGraphOptions = useMetricsGraphOptions();

  const { labels, losses } = useMemo(() => {
    const labels = metricsHistory.metrics_history.map(
      (_, index) => `Period ${index + 1}`,
    );
    const losses = metricsHistory.metrics_history.map(
      (metric) => metric.average_loss ?? 0,
    );
    return { labels, losses };
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
              const { value: displayValue, suffix } =
                convertToInternationalCurrencySystemToFixed(
                  context.parsed.y,
                  2,
                );
              return `Average Loss: ${displayValue}${suffix}`;
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
          max: Math.max(...losses) * 1.05,
        },
      },
    }),
    [mainMetricsGraphOptions, losses],
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
          data: losses,
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
    [labels, losses, primaryColor, primaryColorTransparent],
  );

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className='h-[120px] w-full pb-4'
        data-testid='crq-average-loss-chart'
      >
        <Line options={graphOptions} data={graphData} height={120} />
        <Box textAlign='right' alignSelf='end' marginBottom='15px'>
          <Text
            fontSize='14px'
            color='brand.purple'
            textDecoration='underline'
            _hover={{ cursor: 'pointer' }}
            marginTop='5px'
            onClick={openModal}
          >
            Full Impact Distribution
          </Text>
        </Box>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} size='6xl' isCentered>
        <ModalOverlay />
        <ModalContent borderRadius='2xl' p='8' width='80%' maxWidth='1200px'>
          <ModalCloseButton />
          <ModalBody>
            <ImpactDistributionComponent
              distribution={impactDistribution}
              currency={
                metricsHistory?.metrics_history[0]?.currency ?? undefined
              }
              averageLoss={
                metricsHistory?.metrics_history[0]?.average_loss ?? undefined
              }
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
