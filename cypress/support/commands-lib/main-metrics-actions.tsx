import { convertToInternationalCurrencySystemToFixed } from 'components/ui/charts/utils';
import { PastQuantificationItem } from 'types/quantificationData';
import { InitialAttackVector } from 'types/riskDrivers/attackVectors';
import { ClickableEventTypes } from 'types/riskDrivers/eventTypes';
import { RiskDriverType, RiskDriverTypes } from 'types/riskDrivers/riskDrivers';

export const getAnnualEventsLikelihoodMetrics = (
  pastFqs: PastQuantificationItem[],
  currentFqId: string
) => {
  const currentLossIndex =
    pastFqs!.findIndex(({ id }) => id === currentFqId) || 0;
  const currentRate =
    pastFqs[currentLossIndex]!.results_narrative!.simulation_exposure
      .targeted_annual_rate;
  const lastFqIndex = (pastFqs.length || 1) - 1;
  const pastRate =
    currentLossIndex !== lastFqIndex
      ? pastFqs[currentLossIndex + 1]!.results_narrative?.simulation_exposure
          .targeted_annual_rate
      : undefined;
  const currentSimulationExposure = pastFqs![currentLossIndex];

  const diff =
    pastRate !== undefined ? (currentRate / pastRate - 1) * 100 : undefined;

  const { targeted_annual_rate, targeted_benchmark_annual_rate } =
    currentSimulationExposure!.results_narrative!.simulation_exposure;

  return { diff, targeted_annual_rate, targeted_benchmark_annual_rate };
};

export const getMainMetricsCardsMetrics = (
  pastFqs: PastQuantificationItem[],
  currentFqId: string
) => {
  const currentSimulationExposure = pastFqs!.filter(
    (pastFq) => pastFq.id === currentFqId
  )[0];
  const { value: aalValue, suffix: aalOrder } =
    convertToInternationalCurrencySystemToFixed(
      currentSimulationExposure!.results_narrative!.simulation_exposure.aal,
      2
    );
  const { value: highOrderLossValue, suffix: highOrderLossOrder } =
    convertToInternationalCurrencySystemToFixed(
      currentSimulationExposure!.results_narrative?.simulation_exposure
        .high_exposure_loss ||
        currentSimulationExposure.result?.overall_exposure.highlights.maximum,
      2
    );
  return { aalValue, aalOrder, highOrderLossValue, highOrderLossOrder };
};

export const getRiskEvalutationActions = () => ({
  getTargetedAal: (fq: PastQuantificationItem) =>
    fq.results_narrative?.simulation_exposure?.targeted_annual_rate || 0,

  getTargetedBenchmarkAal: (fq: PastQuantificationItem) =>
    fq.results_narrative?.simulation_exposure?.targeted_benchmark_annual_rate ||
    0,

  getQuantificationAal: (fq: PastQuantificationItem) =>
    fq.results_narrative?.simulation_exposure.aal ||
    fq.result?.overall_exposure.highlights.medium ||
    0,

  getQuantificationHighExposureLoss: (fq: PastQuantificationItem) =>
    fq.results_narrative?.simulation_exposure.high_exposure_loss ||
    fq.result?.overall_exposure.highlights.maximum ||
    0,
});

export const getRiskDriverActions = (riskDriverType: RiskDriverType) => {
  const actions = {
    [RiskDriverTypes.event]: {
      getTargetedAal: (fq: PastQuantificationItem) =>
        fq.results_narrative?.by_event_type_exposure[
          riskDriverType as ClickableEventTypes
        ]?.targeted_annual_rate || 0,
      getTargetedBenchmarkAal: (fq: PastQuantificationItem) =>
        fq.results_narrative?.by_event_type_exposure[
          riskDriverType as ClickableEventTypes
        ]?.targeted_benchmark_annual_rate || 0,
      getQuantificationAal: (fq: PastQuantificationItem) =>
        fq.results_narrative?.by_event_type_exposure[
          riskDriverType as ClickableEventTypes
        ]?.aal || 0,
      getQuantificationHighExposureLoss: (fq: PastQuantificationItem) =>
        fq.results_narrative?.by_event_type_exposure[
          riskDriverType as ClickableEventTypes
        ]?.high_exposure_loss || 0,
    },
    [RiskDriverTypes.attackVector]: {
      getTargetedAal: (fq: PastQuantificationItem) =>
        fq.results_narrative?.by_initial_vector_exposure[
          riskDriverType as InitialAttackVector
        ]?.targeted_annual_rate || 0,
      getTargetedBenchmarkAal: (fq: PastQuantificationItem) =>
        fq.results_narrative?.by_initial_vector_exposure[
          riskDriverType as InitialAttackVector
        ]?.targeted_benchmark_annual_rate || 0,
      getQuantificationAal: (fq: PastQuantificationItem) =>
        fq.results_narrative?.by_initial_vector_exposure[
          riskDriverType as InitialAttackVector
        ]?.aal || 0,
      getQuantificationHighExposureLoss: (fq: PastQuantificationItem) =>
        fq.results_narrative?.by_initial_vector_exposure[
          riskDriverType as InitialAttackVector
        ]?.high_exposure_loss || 0,
    },
  };

  return actions[riskDriverType];
};
