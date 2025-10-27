import { Toaster } from '@/components/atoms/sonner';
import BackButton from '@/components/molecules/BackButton';
import { useMixpanel } from '@/hooks/useMixpanel';
import { useCurrentRiskRegisterScenario } from '@/services/hooks';
import { type FC, useEffect } from 'react';
import ControlsPreview from '../../ScenarioDrillDown/ControlsModal/ControlsPreview';
import { RiskDriverDamageTypes } from '../../ScenarioDrillDown/DamageTypes/OldIndex';
import MainAAL from '../../ScenarioDrillDown/DataBreachDuePhishing/MainAAL';
import RiskManagementFormOld from '../../ScenarioDrillDown/RiskManagement/RiskManagementFormOld';
import SimulationExamples from '../../ScenarioDrillDown/SimulationExamples/OldIndex';
import { TopActions } from '../../ScenarioDrillDown/TopActions/OldIndex';
import { CrqMethodologyInsight } from '../MethodologyInsights/CrqMetholodgyInsights';
import { Notes } from '../Notes';
import { ScenarioActionMenu } from '../ScenarioActionMenu';

export const MASScenarioOldView: FC = () => {
  const { data: scenario } = useCurrentRiskRegisterScenario();
  const { track: trackEvent } = useMixpanel();

  const exampleEvents =
    scenario?.scenario_data.crq_data?.results?.example_events;

  const byControlToMinimal =
    scenario?.scenario_data.crq_data?.results?.control_scenarios
      ?.by_control_to_minimal;

  const costComponentsBreakdown =
    scenario?.scenario_data.crq_data?.results?.cost_components_breakdown;

  const aal =
    scenario?.scenario_data.crq_data?.results?.lean_simulation_exposure
      ?.top_simulation_stats.event_loss.avg;

  const MethodologyStats = {
    sampleSize:
      scenario?.scenario_data.crq_data?.results?.lean_simulation_exposure
        ?.filtered_num_events ?? 0,
    coefficientOfVariation:
      scenario?.scenario_data.crq_data?.results?.lean_simulation_exposure
        ?.scenario_cv ?? 0,
  };
  useEffect(() => {
    trackEvent({
      name: 'risk_register.crq_scenario.view',
    });
  }, [trackEvent]);

  return (
    <div className='min-h-screen min-w-[1195px]'>
      <div className='px-4 py-8'>
        <div className='flex items-start gap-5'>
          <BackButton />
          <div className='flex-1'>
            <div className='grid grid-cols-2 gap-[40px]'>
              <div className='flex flex-col gap-4'>
                {scenario && <MainAAL data={scenario} />}
                {scenario && <RiskManagementFormOld scenario={scenario} />}
                <Notes includeHeader />
              </div>
              <div className='flex flex-col gap-4'>
                <CrqMethodologyInsight methodologyStats={MethodologyStats} />
                <ControlsPreview includeHeader />
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
                {costComponentsBreakdown &&
                  Object.keys(costComponentsBreakdown).length > 0 &&
                  aal !== undefined && (
                    <RiskDriverDamageTypes
                      exposure={costComponentsBreakdown}
                      title='Damage Types'
                      inDrawer={false}
                      aal={aal}
                    />
                  )}
                {exampleEvents && (
                  <SimulationExamples
                    exampleEvents={exampleEvents}
                    currency={
                      scenario?.scenario_data.average_loss_currency ?? 'USD'
                    }
                  />
                )}
              </div>
            </div>
          </div>
          <ScenarioActionMenu />
        </div>
      </div>
      <Toaster />
    </div>
  );
};
