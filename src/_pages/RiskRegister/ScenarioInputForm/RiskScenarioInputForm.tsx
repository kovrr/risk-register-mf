import { Button } from '@/components/atoms/button';
import { Form } from '@/components/atoms/form';
import { Toaster } from '@/components/atoms/sonner';
import { DemoExperienceContext } from '@/contexts/DemoExperienceContext';
import { useToast } from '@/hooks/use-toast';
import { useMixpanel } from '@/hooks/useMixpanel';
import { useIsGuestUser } from '@/permissions/use-permissions';
import {
  useCreateRiskRegisterScenario,
  useCurrentRiskRegisterScenarioIdIfExists,
  useUpdateRiskRegisterScenario,
} from '@/services/hooks';
import {
  type RiskRegisterResponse,
  type ScenarioCreateRequest,
  type SimpleScenarioUpdateRequest,
  scenarioTypes,
} from '@/types/riskRegister';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AxiosError } from 'axios';
import { isEqual } from 'lodash';
import { type FC, useContext, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ErrorDialog } from '../components/ErrorDialog';
import { useUpdateRiskRegisterQueries } from '../RiskRegisterTable/useUpdateRiskRegisterQueries';
import BasicScenarioInfo from './components/basic-scenario-info';
import {
  type SimpleScenarioFormValues,
  simpleScenarioFormSchema,
} from './components/form-config';
import ImpactDistributionInputs from './components/impact-distribution-inputs';
import QualitativeMetrics from './components/qualitative-metrics';
import QuantitativeMetrics from './components/quantitative-metrics';
import SimpleEntitySelect from './components/simple-entity-select';

type Props = {
  scenario?: RiskRegisterResponse;
  onSuccess: () => void;
};

export const RiskScenarioInputForm: FC<Props> = ({ scenario, onSuccess }) => {
  const currentScenarioId = useCurrentRiskRegisterScenarioIdIfExists();
  const { track: trackEvent } = useMixpanel();
  const { toast } = useToast();
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const isGuestUser = useIsGuestUser();
  const {
    invalidateLatestGetScenariosQuery,
    updateQueriesWithNewRow,
    invalidateCurrentScenarioQuery,
  } = useUpdateRiskRegisterQueries();
  const { showDemoModal } = useContext(DemoExperienceContext);
  const { t } = useTranslation('riskRegister', { keyPrefix: 'modal' });
  const { mutateAsync: createRiskRegisterScenario, isPending: isCreating } =
    useCreateRiskRegisterScenario({
      onSuccess: async () => {
        toast({
          title: 'Success',
          description: 'The risk scenario has been created successfully',
        });
        onSuccess();
        form.reset();
        await invalidateLatestGetScenariosQuery();
      },
      onError: (error: unknown) => {
        const axiosError = error as AxiosError<{ detail: string }>;
        const errorData = axiosError.response?.data as { detail: string };
        setErrorMessage(errorData.detail || 'An error occurred');
        setIsErrorDialogOpen(true);
      },
    });
  const { mutateAsync: updateRiskRegisterScenario, isPending: isUpdating } =
    useUpdateRiskRegisterScenario(scenario?.scenario_id || '', {
      onSuccess: async (updatedScenario) => {
        toast({
          title: 'Success',
          description: 'The risk scenario has been updated successfully',
        });
        onSuccess();
        if (isInScenarioViewPage) {
          await invalidateCurrentScenarioQuery(scenario?.scenario_id || '');
          return;
        }
        updateQueriesWithNewRow(updatedScenario);
      },
      onError: (error) => {
        setErrorMessage(error.response?.data.detail || 'An error occurred');
        setIsErrorDialogOpen(true);
      },
    });

  const initialValues = useMemo(() => {
    return scenario
      ? {
        scenario_type: scenario.scenario_type,
        customer_scenario_id: scenario.customer_scenario_id,
        name: scenario.name,
        description: scenario.description,
        likelihood: scenario.scenario_data.likelihood,
        impact: scenario.scenario_data.impact,
        company_id: scenario.scenario_data.company_id || undefined,
        annual_likelihood:
          scenario.scenario_data.annual_likelihood || undefined,
        peer_base_rate: scenario.scenario_data.peer_base_rate || undefined,
        average_loss: scenario.scenario_data.average_loss || undefined,
        average_loss_currency:
          scenario.scenario_data.average_loss_currency || 'USD',
        impact_distribution: {
          one: scenario.scenario_data.impact_distribution?.one || undefined,
          twenty_five:
            scenario.scenario_data.impact_distribution?.twenty_five ||
            undefined,
          fifty:
            scenario.scenario_data.impact_distribution?.fifty || undefined,
          seventy_five:
            scenario.scenario_data.impact_distribution?.seventy_five ||
            undefined,
          ninety_nine:
            scenario.scenario_data.impact_distribution?.ninety_nine ||
            undefined,
        },
      }
      : {
        scenario_type: scenarioTypes.MANUAL,
        customer_scenario_id: '',
        name: '',
        description: '',
        likelihood: '',
        impact: '',
        company_id: undefined,
        annual_likelihood: undefined,
        peer_base_rate: undefined,
        average_loss: undefined,
        average_loss_currency: 'USD',
        impact_distribution: {
          one: undefined,
          twenty_five: undefined,
          fifty: undefined,
          seventy_five: undefined,
          ninety_nine: undefined,
        },
      };
  }, [scenario]);

  const form = useForm<SimpleScenarioFormValues>({
    resolver: zodResolver(simpleScenarioFormSchema),
    defaultValues: initialValues as SimpleScenarioFormValues,
  });

  const isEditMode = !!scenario;
  const formValues = form.watch();
  const isInScenarioViewPage = !!currentScenarioId;

  const hasFormChanged = useMemo(
    () => !isEqual(formValues, initialValues),
    [formValues, initialValues],
  );

  async function onSubmit(values: SimpleScenarioFormValues) {
    if (isGuestUser) {
      onSuccess();
      showDemoModal({ title: t('demo.addScenario') });
      return;
    }
    trackEvent('risk_register.naive_scenario_input_form.submit');
    if (isEditMode) {
      return await updateRiskRegisterScenario(
        values as SimpleScenarioUpdateRequest,
      );
    }
    return await createRiskRegisterScenario(values as ScenarioCreateRequest);
  }

  useEffect(() => {
    trackEvent('risk_register.naive_scenario_input_form.view');
  }, [trackEvent]);

  const isLoading = isCreating || isUpdating;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='space-y-[20px]'>
          <div className='flex flex-col gap-2'>
            <SimpleEntitySelect
              control={form.control}
              isEditMode={isEditMode}
            />
            <BasicScenarioInfo control={form.control} isEditMode={isEditMode} />
          </div>
          <QualitativeMetrics control={form.control} />
          <QuantitativeMetrics
            control={form.control}
            currency={form.watch('average_loss_currency')}
          />
          <ImpactDistributionInputs
            control={form.control}
            currency={form.watch('average_loss_currency')}
          />
          <div className='flex justify-end'>
            <Button
              type='submit'
              loading={isLoading}
              disabled={isEditMode && !hasFormChanged}
            >
              {isEditMode ? t('button.update') : t('button.create')}
            </Button>
          </div>
        </div>
      </form>
      <Toaster />
      <ErrorDialog
        isOpen={isErrorDialogOpen}
        onOpenChange={setIsErrorDialogOpen}
        errorMessage={errorMessage}
      />
    </Form>
  );
};
