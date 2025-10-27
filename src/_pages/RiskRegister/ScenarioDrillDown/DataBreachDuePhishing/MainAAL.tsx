'use client';

import { Card, CardContent, CardHeader } from '@/components/atoms/card';
import { DemoExperienceContext } from '@/contexts/DemoExperienceContext';
import type {
  ImpactDistribution as ImpactDistributionType,
  RiskRegisterResponse,
} from '@/types/riskRegister';
import { useIsGuestUser } from 'permissions/use-permissions';
import { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PencilIcon from '../../../../components/icons/pencil.svg';
import ScenarioInputForm from '../../ScenarioInputForm/ScenarioInputModal';
import { IntroSection } from './components/IntroSection';
import { QuantitativeMetricsOld } from './components/QuantitativeMetricsOld';

interface DataBreachDuePhishingProps {
  data: RiskRegisterResponse;
}

export default function MainAAL({ data }: DataBreachDuePhishingProps) {
  const [open, setOpen] = useState(false);
  const isGuestUser = useIsGuestUser();
  const { showDemoModal } = useContext(DemoExperienceContext);
  const { t } = useTranslation('riskRegister');
  const handleEditScenarioClick = useCallback(() => {
    setOpen(true);
  }, []);

  const impactDistributionFromCrq = () => {
    const curve =
      data.scenario_data.crq_data?.results?.lean_simulation_exposure
        ?.top_simulation_stats.event_loss.percentiles;

    if (!curve) return undefined;
    return {
      ninety_nine: curve[1],
      seventy_five: curve[25],
      fifty: curve[50],
      twenty_five: curve[75],
      one: curve[99],
    };
  };

  const impactDistributionData =
    data.scenario_type === 'manual'
      ? data.scenario_data.impact_distribution
      : impactDistributionFromCrq();
  const formatAnnualLikelihood = (value: number | undefined) => {
    if (value) return value * 100;
    return undefined;
  };
  return (
    <div className='min-w-[400px]'>
      <ScenarioInputForm
        open={open}
        onOpenChange={setOpen}
        scenario={data}
        scenarioType={data.scenario_type}
      />
      <Card>
        <CardHeader>
          <div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-[5px]'>
                <p className='p-0 text-[14px] font-[700] text-text-brand-primary'>
                  {data.customer_scenario_id}
                </p>
                <span className='text-muted-foreground'>/</span>
              </div>
              <button
                className='text-muted-foreground hover:text-foreground'
                onClick={
                  isGuestUser
                    ? () => showDemoModal({ title: t('demo.editScenario') })
                    : handleEditScenarioClick
                }
                type='button'
              >
                <img alt='' src={PencilIcon} className='h-4 w-4' />
              </button>
            </div>
            <IntroSection
              title={data.name}
              description={data.description}
              impact={data.scenario_data.impact}
              likelihood={data.scenario_data.likelihood}
              data={data}
            />
          </div>
        </CardHeader>

        <CardContent className='space-y-8'>
          <QuantitativeMetricsOld
            averageLoss={
              data.scenario_type === 'manual'
                ? data.scenario_data.average_loss
                : data.scenario_data.crq_data?.results?.lean_simulation_exposure
                  ?.top_simulation_stats.event_loss.avg
            }
            averageLossCurrency={data.scenario_data.average_loss_currency}
            annualLikelihood={
              data.scenario_type === 'manual'
                ? data.scenario_data.annual_likelihood
                : formatAnnualLikelihood(
                  data.scenario_data.crq_data?.results
                    ?.lean_simulation_exposure?.targeted_annual_rate,
                )
            }
            peerBaseRate={
              data.scenario_type === 'manual'
                ? data.scenario_data.peer_base_rate
                : data.scenario_data.crq_data?.results?.lean_simulation_exposure
                  ?.targeted_benchmark_annual_rate
            }
            impactDistribution={
              impactDistributionData as ImpactDistributionType
            }
            data={data}
          />
        </CardContent>
      </Card>
    </div>
  );
}
