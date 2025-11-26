import { Card } from '@/components/atoms/card';
import { useCurrentRiskRegisterScenario } from '@/services/hooks';
import { ScenarioHeader } from '../../ScenarioDrillDown/DataBreachDuePhishing/ScenarioHeader';
import { AverageFinancialLossMetric } from '../../ScenarioDrillDown/DataBreachDuePhishing/components/AverageFinancialLossMetric';
import { ImpactDistributionCard } from '../../ScenarioDrillDown/DataBreachDuePhishing/components/ImpactDistributionCard';
import { NaiveAALMetric } from '../../ScenarioDrillDown/DataBreachDuePhishing/components/NaiveAALMetric';
import { QuantitativeMetricsHeader } from '../../ScenarioDrillDown/DataBreachDuePhishing/components/QuantitativeMetricsHeader';
import { DataExposureSection } from '../components/DataExposureSection';
import { ScenarioContainer } from '../ScenarioContainer';

export const NaiveScenarioView = () => {
  const { data: scenario } = useCurrentRiskRegisterScenario();

  if (!scenario) return null;

  return (
    <ScenarioContainer>
      <ScenarioHeader scenario={scenario} />
      <Card className='flex flex-1 flex-col gap-6 rounded-br-none bg-fill-base-1 p-6'>
        <QuantitativeMetricsHeader />
        <div className='flex flex-col gap-5 lg:flex-row'>
          <NaiveAALMetric />
          <AverageFinancialLossMetric />
        </div>
        <ImpactDistributionCard
          distribution={scenario.scenario_data.impact_distribution}
          currency={scenario.scenario_data.average_loss_currency}
          averageLoss={scenario.scenario_data.average_loss}
        />
      </Card>
      <Card className='p-6 shadow-sm'>
        <DataExposureSection scenario={scenario} />
      </Card>
    </ScenarioContainer>
  );
};
