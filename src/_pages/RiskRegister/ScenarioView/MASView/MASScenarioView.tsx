import { Card } from '@/components/atoms/card';
import {
  useCurrentRiskRegisterScenario,
  useMetricHistory,
} from '@/services/hooks';
import type { ImpactDistribution } from '@/types/riskRegister';
import { RiskDriverDamageTypes } from '../../ScenarioDrillDown/DamageTypes/index';
import { CrqAALMetric } from '../../ScenarioDrillDown/DataBreachDuePhishing/components/CrqAALMetric';
import { CrqAverageFinancialLossMetric } from '../../ScenarioDrillDown/DataBreachDuePhishing/components/CrqAverageFinancialLossMetric';
import { QuantitativeMetricsHeader } from '../../ScenarioDrillDown/DataBreachDuePhishing/components/QuantitativeMetricsHeader';
import { ScenarioRobustness } from '../../ScenarioDrillDown/DataBreachDuePhishing/components/ScenarioRobustness';
import { ScenarioHeader } from '../../ScenarioDrillDown/DataBreachDuePhishing/ScenarioHeader';
import SimulationExamples from '../../ScenarioDrillDown/SimulationExamples/index';
import { TopActions } from '../../ScenarioDrillDown/TopActions/index';
import { ScenarioContainer } from '../ScenarioContainer';
import { MasGenericTabs } from './MasGenericTabs';

export const MASScenarioView = () => {
  const { data: scenario, isLoading } = useCurrentRiskRegisterScenario();
  const { data: scenarioMetricsHistory, isLoading: isLoadingMetricsHistory } =
    useMetricHistory(scenario?.scenario_id ?? '');

  const byControlToMinimal =
    scenario?.scenario_data.crq_data?.results?.control_scenarios
      ?.by_control_to_minimal;

  const aal =
    scenario?.scenario_data.crq_data?.results?.lean_simulation_exposure
      ?.top_simulation_stats.event_loss.avg;

  const costComponentsBreakdown =
    scenario?.scenario_data.crq_data?.results?.cost_components_breakdown;

  const exampleEvents =
    scenario?.scenario_data.crq_data?.results?.example_events;

  // Extract percentiles from CRQ data
  const percentiles =
    scenario?.scenario_data?.crq_data?.results?.lean_simulation_exposure
      ?.top_simulation_stats?.event_loss?.percentiles;

  const impactDistribution: ImpactDistribution | undefined = percentiles
    ? {
      ninety_nine: percentiles['1'],
      seventy_five: percentiles['25'],
      fifty: percentiles['50'],
      twenty_five: percentiles['75'],
      one: percentiles['99'],
    }
    : undefined;

  return (
    <ScenarioContainer>
      {scenario && <ScenarioHeader scenario={scenario} />}
      <Card className='flex flex-1 flex-col gap-5 rounded-br-none bg-fill-base-1'>
        <QuantitativeMetricsHeader />
        {scenario && <ScenarioRobustness scenario={scenario} />}
        <div className='max flex shrink-0 gap-5'>
          <div className='flex-1'>
            <CrqAALMetric
              metricsHistory={scenarioMetricsHistory ?? null}
              isLoading={isLoadingMetricsHistory}
            />
          </div>
          <div className='flex-1'>
            <CrqAverageFinancialLossMetric
              metricsHistory={scenarioMetricsHistory ?? null}
              isLoading={isLoadingMetricsHistory}
              impactDistribution={impactDistribution}
            />
          </div>
        </div>
        <MasGenericTabs
          defaultTab='controls-recommendations'
          testIdPrefix='controls-recommendations'
          tabsClassName='space-y-0'
          tabsListClassName='flex justify-start gap-4 rounded-b-none rounded-t-3xl bg-white pl-4'
          tabsContentClassName='rounded-b-3xl rounded-t-none border-t-0 bg-white'
          tabs={[
            {
              label: 'Controls Recommendations',
              key: 'controls-recommendations',
              content:
                isLoading || !scenario ? (
                  <div>Loading...</div>
                ) : (
                  <>
                    {byControlToMinimal && aal !== undefined && (
                      <TopActions
                        currency={
                          scenario?.scenario_data.average_loss_currency ?? 'USD'
                        }
                        controlsFramework={
                          scenario?.scenario_data.sec_controls_framework
                        }
                        byControlToMinimal={byControlToMinimal}
                        aal={aal}
                      />
                    )}
                  </>
                ),
            },
            {
              label: 'Damage Types',
              key: 'damage-types',
              content: (
                <>
                  {costComponentsBreakdown &&
                    Object.keys(costComponentsBreakdown).length > 0 &&
                    aal !== undefined ? (
                    <RiskDriverDamageTypes
                      exposure={costComponentsBreakdown}
                      title='Damage Types'
                      inDrawer={false}
                      aal={aal}
                    />
                  ) : (
                    <div className='flex justify-center p-8 text-sm text-gray-500'>
                      There are currently no damage types for this scenario
                    </div>
                  )}
                </>
              ),
            },
            {
              label: 'Simulation Event Examples',
              key: 'simulation-event-examples',
              content: (
                <>
                  {exampleEvents && (
                    <SimulationExamples
                      exampleEvents={exampleEvents}
                      currency={
                        scenario?.scenario_data.average_loss_currency ?? 'USD'
                      }
                    />
                  )}
                </>
              ),
            },
          ]}
        />
      </Card>
    </ScenarioContainer>
  );
};
