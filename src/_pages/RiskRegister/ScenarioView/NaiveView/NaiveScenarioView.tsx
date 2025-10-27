import { Card } from '@/components/atoms/card';
import { useCurrentRiskRegisterScenario } from '@/services/hooks';
import { AverageFinancialLossMetric } from '../../ScenarioDrillDown/DataBreachDuePhishing/components/AverageFinancialLossMetric';
import { ImpactDistributionCard } from '../../ScenarioDrillDown/DataBreachDuePhishing/components/ImpactDistributionCard';
import { NaiveAALMetric } from '../../ScenarioDrillDown/DataBreachDuePhishing/components/NaiveAALMetric';
import { QuantitativeMetricsHeader } from '../../ScenarioDrillDown/DataBreachDuePhishing/components/QuantitativeMetricsHeader';
import { ScenarioHeader } from '../../ScenarioDrillDown/DataBreachDuePhishing/ScenarioHeader';
import { ScenarioContainer } from '../ScenarioContainer';

export const NaiveScenarioView = () => {
  const { data: scenario } = useCurrentRiskRegisterScenario();

  return (
    <ScenarioContainer>
      {scenario && <ScenarioHeader scenario={scenario} />}
      <Card className='flex flex-1 flex-col gap-5 rounded-br-none bg-fill-base-1'>
        <QuantitativeMetricsHeader />
        <div className='flex flex-row gap-5'>
          <NaiveAALMetric />
          <AverageFinancialLossMetric />
        </div>
        <ImpactDistributionCard
          distribution={scenario?.scenario_data.impact_distribution}
          currency={scenario?.scenario_data.average_loss_currency}
          averageLoss={scenario?.scenario_data.average_loss}
        />
      </Card>
    </ScenarioContainer>
  );
};
