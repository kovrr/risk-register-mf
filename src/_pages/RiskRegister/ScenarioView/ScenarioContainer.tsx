import { Skeleton } from '@/components/atoms/skeleton';
import BackWithLabel from '@/components/molecules/BackWithLabel';
import { useCurrentRiskRegisterScenario } from '@/services/hooks';
import type React from 'react';
import ControlsPreview from '../ScenarioDrillDown/ControlsModal/ControlsPreview';
import RiskManagement from '../ScenarioDrillDown/RiskManagement/RiskManagementForm';
import { MasGenericTabs } from './MASView/MasGenericTabs';
import { Notes } from './Notes';

type Props = {
  children: React.ReactNode;
};

export const ScenarioContainer: React.FC<Props> = ({ children }) => {
  const { data: scenario, isLoading } = useCurrentRiskRegisterScenario();
  return (
    <div className='flex flex-col gap-5'>
      <BackWithLabel label='Back to all risks' />
      <div className='grid grid-cols-[1fr_450px] gap-6 rounded-3xl bg-white p-6'>
        {/* Left Column - Scenario Data */}
        <div className='flex flex-col gap-6'>{children}</div>

        {/* Right Column - Tabbed Panel */}
        <div className='sticky top-6 h-fit'>
          <MasGenericTabs
            defaultTab='risk-management'
            testIdPrefix='risk-management'
            tabsContentClassName='max-h-[calc(100vh-250px)] overflow-y-auto p-6'
            tabsClassName='flex flex-col'
            tabsListClassName='border-b border-fill-specific-divider px-6'
            tabs={[
              {
                label: 'Risk Management',
                key: 'risk-management',
                content:
                  isLoading || !scenario ? (
                    <div className='flex flex-col gap-4'>
                      {Array.from({ length: 3 }).map((_, index) => (
                        <Skeleton
                          key={index}
                          className='mb-10 h-[100px] w-full rounded-lg '
                        />
                      ))}
                    </div>
                  ) : (
                    <RiskManagement scenario={scenario} />
                  ),
              },
              {
                label: 'Relevant Controls',
                key: 'relevant-controls',
                content: <ControlsPreview />,
              },
              {
                label: 'Notes',
                key: 'notes',
                content: <Notes />,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};
