import { Badge } from '@/components/atoms/badge';
import { Card } from '@/components/atoms/card';
import { Separator } from '@/components/atoms/separator';
import { DemoExperienceContext } from '@/contexts/DemoExperienceContext';
import type { RiskRegisterResponse } from '@/types/riskRegister';
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

  const categories = scenario.scenario_data.scenario_category || [];

  return (
    <>
      <Card className='p-6 shadow-sm'>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-wrap items-start justify-between gap-7'>
            <div className='flex flex-1 flex-col gap-3'>
              <div className='flex flex-wrap items-center gap-3 text-sm font-semibold text-text-base-primary'>
                <span className='text-text-brand-primary'>
                  ID: {scenario.customer_scenario_id}
                </span>
                <span className='text-text-base-tertiary'>|</span>
                <span>
                  Entity:{' '}
                  <span className='text-text-base-secondary'>
                    {scenario.scenario_data.entity ?? '—'}
                  </span>
                </span>
              </div>
              <div className='space-y-2'>
                <h1 className='text-[20px] font-[700] text-text-base-primary'>
                  {scenario.name}
                </h1>
                <p className='text-[13px] font-normal leading-relaxed text-text-base-secondary'>
                  {scenario.description}
                </p>
              </div>
            </div>

            <div className='flex flex-1 flex-wrap items-center gap-6 lg:flex-nowrap'>
              <ScenarioMetric
                type='impact'
                value={scenario.scenario_data.impact}
              />
              <Separator
                orientation='vertical'
                className='hidden h-[68px] bg-fill-specific-divider lg:block'
              />
              <ScenarioMetric
                type='likelihood'
                value={scenario.scenario_data.likelihood}
              />
            </div>

            <button
              className='flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-gray-100 hover:text-foreground'
              onClick={
                isGuestUser
                  ? () => showDemoModal({ title: t('demo.editScenario') })
                  : handleEditScenarioClick
              }
              type='button'
            >
              <img src={PencilIcon} alt='pencil' className='h-4 w-4' />
            </button>
          </div>

          {categories.length > 0 && (
            <div className='flex flex-wrap gap-2'>
              {categories.map((category, index) => (
                <Badge
                  key={index}
                  variant='secondary'
                  className='rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700'
                >
                  {category}
                </Badge>
              ))}
            </div>
          )}
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
