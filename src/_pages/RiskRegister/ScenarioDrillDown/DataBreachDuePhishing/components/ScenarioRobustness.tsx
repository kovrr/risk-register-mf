import { Card } from '@/components/atoms/card';
import { Lightbulb } from '@/_pages/RiskRegister/components/icons/Lightbulb';
import { RadialChartWithLabel } from '@/components/molecules/RadialChartWithLabel';
import type { RiskRegisterResponse } from '@/types/riskRegister';
import type { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';

type Props = {
  scenario: RiskRegisterResponse;
};

const FormulaText: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className='mt-2 text-sm'>
    <div className='font-bold'>Formula:</div>
    {children}
  </div>
);

export const ScenarioRobustness: FC<Props> = ({ scenario }) => {
  const { t } = useTranslation('riskRegister', {
    keyPrefix: 'scenarioDrillDown.dataBreachPhishing',
  });

  const matchCount =
    scenario.scenario_data?.crq_data?.results?.lean_simulation_exposure
      ?.match_count;
  const diversityScore =
    scenario.scenario_data?.crq_data?.results?.lean_simulation_exposure
      ?.diversity_score;

  if (!matchCount || !diversityScore) return null;

  const normalizedMatchCount = Number((matchCount * 100).toFixed());
  const normalizedDiversityScore = Number((diversityScore * 100).toFixed());

  return (
    <Card className='rounded-[15px] border-l-4 border-fill-information-info bg-fill-base-2 p-5'>
      <div className='flex justify-between'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <Lightbulb />
            <h2 className='text-sm font-bold text-fill-information-info'>
              {t('scenarioRobustness')}
            </h2>
          </div>
          <p className='text-sm text-fill-information-info'>
            {t('scenarioRobustnessDescription')}
          </p>
        </div>
        <RadialChartWithLabel
          label={t('matchCount')}
          info={
            <Trans
              i18nKey='scenarioDrillDown.dataBreachPhishing.matchCountInfo'
              ns='riskRegister'
              components={{
                FormulaTag: <FormulaText>{t('matchCountInfo')}</FormulaText>,
              }}
            />
          }
          chartProps={{ value: normalizedMatchCount }}
        />
        <RadialChartWithLabel
          label={t('diversityScore')}
          info={
            <Trans
              i18nKey='scenarioDrillDown.dataBreachPhishing.diversityScoreInfo'
              ns='riskRegister'
              components={{
                FormulaTag: (
                  <FormulaText>{t('diversityScoreInfo')}</FormulaText>
                ),
              }}
            />
          }
          chartProps={{ value: normalizedDiversityScore }}
        />
      </div>
    </Card>
  );
};
