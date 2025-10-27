import { convertToInternationalCurrencySystemToFixed } from 'components/ui/charts/utils';
import { QuantificationData } from 'types/quantificationData';

export const getRiskProgressionMetrics = (currentFq: QuantificationData) => {
  const currentAAL = currentFq!.results_narrative!.simulation_exposure!.aal;
  const { value: aalValue, suffix: aalOrder } =
    convertToInternationalCurrencySystemToFixed(currentAAL);
  const { value: baselineAALValue, suffix: baselineAALOrder } =
    convertToInternationalCurrencySystemToFixed(
      currentFq!.results_narrative!.risk_scenarios!.BASELINE.aal_damage
    );
  const { value: minimalAALValue, suffix: minimalAALOrder } =
    convertToInternationalCurrencySystemToFixed(
      currentFq!.results_narrative!.risk_scenarios!.MINIMAL.aal_damage
    );
  return {
    finalAALValue: Number(aalValue),
    aalOrder,
    finalBaselineAALValue: Number(baselineAALValue),
    baselineAALOrder,
    finalMinimalAALValue: Number(minimalAALValue),
    minimalAALOrder,
  };
};

export const getRiskScore = (currentFq: any) => {
  if (currentFq?.results_narrative?.risk_scenarios === undefined) {
    return {
      riskPositionScore: 'N/A',
    };
  }
  const currentAAL = currentFq!.results_narrative!.simulation_exposure!.aal;
  const baselineAAL =
    currentFq!.results_narrative!.risk_scenarios!.BASELINE.aal_damage;
  const minimalAAL =
    currentFq!.results_narrative!.risk_scenarios!.MINIMAL.aal_damage;
  const baselineAALNormalized =
    (baselineAAL - currentAAL) / (baselineAAL - minimalAAL);
  const riskPosition = isFinite(baselineAALNormalized)
    ? baselineAALNormalized
    : 0;
  const riskPositionScore = Math.floor(riskPosition * 100) || 0;
  return {
    riskPositionScore,
  };
};
