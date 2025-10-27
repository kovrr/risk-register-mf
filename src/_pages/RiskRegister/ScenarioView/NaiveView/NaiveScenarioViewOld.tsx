import { Toaster } from '@/components/atoms/sonner';
import BackButton from '@/components/molecules/BackButton';
import { useMixpanel } from '@/hooks/useMixpanel';
import { useCurrentRiskRegisterScenario } from '@/services/hooks';
import { useEffect } from 'react';
import ControlsPreview from '../../ScenarioDrillDown/ControlsModal/ControlsPreview';
import MainAAL from '../../ScenarioDrillDown/DataBreachDuePhishing/MainAAL';
import RiskManagementFormOld from '../../ScenarioDrillDown/RiskManagement/RiskManagementFormOld';
import { MethodologyInsight } from '../MethodologyInsights/MethodologyInsights';
import { Notes } from '../Notes';
import { ScenarioActionMenu } from '../ScenarioActionMenu';

export const NaiveScenarioViewOld = () => {
  const { data: scenario } = useCurrentRiskRegisterScenario();

  const { track: trackEvent } = useMixpanel();

  useEffect(() => {
    trackEvent({
      name: 'risk_register.naive_scenario.view',
    });
  }, [trackEvent]);

  return (
    <div className='min-h-screen min-w-[1195px]'>
      <div className='container px-4 py-8'>
        <div className='flex items-start gap-5'>
          <BackButton />
          <div className='flex-1'>
            <div className='flex flex-row gap-[40px]'>
              <div className='flex flex-1 flex-col gap-4'>
                {scenario && <MainAAL data={scenario} />}
                {scenario && <RiskManagementFormOld scenario={scenario} />}
              </div>
              <div className='flex flex-1 flex-col gap-4'>
                <MethodologyInsight
                  initialMethodology={
                    scenario?.scenario_data?.methodology_insights ?? ''
                  }
                />
                <ControlsPreview />
                <Notes />
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
