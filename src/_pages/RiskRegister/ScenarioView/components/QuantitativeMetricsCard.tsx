import { Card } from '@/components/atoms/card';
import { LikelihoodBadge } from '@/components/molecules/LikelihoodBadge';
import { SeverityBullet } from '@/components/molecules/SeverityBullet';
import { DemoExperienceContext } from '@/contexts/DemoExperienceContext';
import type { RiskRegisterResponse } from '@/types/riskRegister';
import { Pencil } from 'lucide-react';
import { useIsGuestUser } from 'permissions/use-permissions';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ScenarioInputForm from '../../ScenarioInputForm/ScenarioInputModal';

type Props = {
  scenario: RiskRegisterResponse;
};

export const QuantitativeMetricsCard: React.FC<Props> = ({ scenario }) => {
  const [open, setOpen] = useState(false);
  const isGuestUser = useIsGuestUser();
  const { showDemoModal } = useContext(DemoExperienceContext);
  const { t } = useTranslation('riskRegister');

  const handleEditClick = () => {
    if (isGuestUser) {
      showDemoModal({ title: t('demo.editScenario') });
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <Card className='p-6 shadow-sm'>
        <div className='grid grid-cols-2 gap-6'>
          {/* Impact Section */}
          <div className='flex flex-col gap-3'>
            <div className='flex items-center justify-between'>
              <h3 className='text-base font-semibold text-text-base-primary'>
                Impact
              </h3>
              <button
                onClick={handleEditClick}
                className='flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-gray-100 hover:text-foreground'
                type='button'
              >
                <Pencil className='h-4 w-4' />
              </button>
            </div>
            <div className='flex items-center gap-3'>
              {scenario.scenario_data.impact ? (
                <SeverityBullet value={scenario.scenario_data.impact} />
              ) : (
                <span className='text-sm italic text-text-base-secondary'>
                  Not estimated
                </span>
              )}
            </div>
          </div>

          {/* Likelihood Section */}
          <div className='flex flex-col gap-3'>
            <div className='flex items-center justify-between'>
              <h3 className='text-base font-semibold text-text-base-primary'>
                Likelihood
              </h3>
              <button
                onClick={handleEditClick}
                className='flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-gray-100 hover:text-foreground'
                type='button'
              >
                <Pencil className='h-4 w-4' />
              </button>
            </div>
            <div className='flex items-center gap-3'>
              {scenario.scenario_data.likelihood ? (
                <LikelihoodBadge value={scenario.scenario_data.likelihood} />
              ) : (
                <span className='text-sm italic text-text-base-secondary'>
                  Not estimated
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>

      <ScenarioInputForm
        open={open}
        onOpenChange={setOpen}
        scenario={scenario}
        scenarioType={scenario.scenario_type}
      />
    </>
  );
};

