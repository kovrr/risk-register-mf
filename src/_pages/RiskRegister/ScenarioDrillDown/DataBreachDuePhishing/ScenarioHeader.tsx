import { Badge } from '@/components/atoms/badge';
import { Card } from '@/components/atoms/card';
import { DemoExperienceContext } from '@/contexts/DemoExperienceContext';
import type { RiskRegisterResponse } from '@/types/riskRegister';
import { useIsGuestUser } from 'permissions/use-permissions';
import { type FC, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PencilIcon from '../../../../components/icons/pencil.svg';
import ScenarioInputForm from '../../ScenarioInputForm/ScenarioInputModal';

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
        <div className='flex items-start justify-between gap-4'>
          <div className='flex flex-1 flex-col gap-4'>
            {/* Scenario ID */}
            <div className='flex items-center gap-2'>
              <span className='text-sm font-bold text-text-brand-primary'>
                {scenario.customer_scenario_id}
              </span>
              <span className='text-muted-foreground'>/</span>
            </div>

            {/* Scenario Title */}
            <h1 className='text-2xl font-bold text-text-base-primary'>
              {scenario.name}
            </h1>

            {/* Description */}
            <p className='text-sm font-normal leading-relaxed text-text-base-secondary'>
                {scenario.description}
              </p>

            {/* Category Tags */}
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

          {/* Edit Button */}
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
