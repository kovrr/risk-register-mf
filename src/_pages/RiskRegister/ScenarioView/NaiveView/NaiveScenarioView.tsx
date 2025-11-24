import { useCurrentRiskRegisterScenario } from '@/services/hooks';
import { ScenarioHeader } from '../../ScenarioDrillDown/DataBreachDuePhishing/ScenarioHeader';
import { QualitativeMetricsCard } from '../components/QualitativeMetricsCard';
import { QuantitativeMetricsCard } from '../components/QuantitativeMetricsCard';
import { ScenarioContainer } from '../ScenarioContainer';

export const NaiveScenarioView = () => {
  const { data: scenario } = useCurrentRiskRegisterScenario();

  if (!scenario) return null;

  return (
    <ScenarioContainer>
      <ScenarioHeader scenario={scenario} />
      <QuantitativeMetricsCard scenario={scenario} />
      <QualitativeMetricsCard
        distribution={scenario.scenario_data.impact_distribution}
        currency={scenario.scenario_data.average_loss_currency}
        averageLoss={scenario.scenario_data.average_loss}
        />
    </ScenarioContainer>
  );
};
