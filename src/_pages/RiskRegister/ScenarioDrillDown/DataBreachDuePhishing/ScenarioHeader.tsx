import { Card } from '@/components/atoms/card';
import { Separator } from '@/components/atoms/separator';
import { DemoExperienceContext } from '@/DemoExperienceContext';
import type { RiskRegisterResponse } from '@/types/riskRegister';
import Image from 'next/image';
import { useIsGuestUser } from 'permissions/use-permissions';
import { type FC, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PencilIcon from '../../../../components/icons/pencil.svg';
import ScenarioInputForm from '../../ScenarioInputForm/ScenarioInputModal';
import { ScenarioMetric } from './ScenarioMetric';

type Props = {
  scenario: RiskRegisterResponse;
};

export const ScenarioHeader: FC<Props> = ({ scenario }) => {
  const [open, setOpen] = useState(false);
  const isGuestUser = useIsGuestUser();
  const { showDemoModal } = useContext(DemoExperienceContext);
  const { t } = useTranslation('riskRegister');

  const handleEditScenarioClick = () => {
    setOpen(true);
  };

  return (
    <>
      <Card>
        <div className='flex items-center justify-between gap-7'>
          <div className='flex max-w-[350px] flex-col gap-1'>
            <div className='flex items-center gap-[5px]'>
              <p className='p-0 text-[14px] font-[700] text-text-brand-primary'>
                {scenario.customer_scenario_id}
              </p>
              <span className='text-muted-foreground'>/</span>
            </div>
            <div>
              <h1 className='mb-2 text-[20px] font-[700]'>{scenario.name}</h1>
              <p className='text-[13px] font-[400] text-text-base-secondary'>
                {scenario.description}
              </p>
            </div>
          </div>
          <ScenarioMetric type='impact' value={scenario.scenario_data.impact} />
          <Separator
            orientation='vertical'
            className='h-[68px] bg-fill-specific-divider'
          />
          <ScenarioMetric
            type='likelihood'
            value={scenario.scenario_data.likelihood}
          />
          <button
            className='self-baseline pt-4 text-muted-foreground hover:text-foreground'
            onClick={
              isGuestUser
                ? () => showDemoModal({ title: t('demo.editScenario') })
                : handleEditScenarioClick
            }
          >
            <Image alt='' src={PencilIcon} className='h-4 w-4' />
          </button>
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
