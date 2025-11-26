import { Button } from '@/components/atoms/button';
import { Form } from '@/components/atoms/form';
import { Toaster } from '@/components/atoms/sonner';
import { useToast } from '@/hooks/use-toast';
import { useMixpanel } from '@/hooks/useMixpanel';
import {
  useCreateCRQRiskScenario,
  useCurrentRiskRegisterScenarioIdIfExists,
  useUpdateRiskScenario,
} from '@/services/hooks';
import {
  type CRQData,
  type CRQScenarioCreateRequest,
  type CRQScenarioFilters,
  type CRQScenarioUpdateRequest,
  type RiskRegisterResponse,
  scenarioTypes,
} from '@/types/riskRegister';
import { zodResolver } from '@hookform/resolvers/zod';
import { isEqual } from 'lodash';
import { type FC, useEffect, useMemo, useState } from 'react';
import { type Control, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ErrorDialog } from '../components/ErrorDialog';
import { useUpdateRiskRegisterQueries } from '../RiskRegisterTable/useUpdateRiskRegisterQueries';
import BasicScenarioInfo from './components/basic-scenario-info';
import CRQEntitySelect from './components/crq-entity-select';
import { EventTypesCheckboxes } from './components/event-types';
import {
  type CRQScenarioFormValues,
  crqScenarioFormSchema,
} from './components/form-config';
import { ImpactMagnitude } from './components/impact-magnitude';
import { ImpactTypesCheckboxes } from './components/impact-types';
import { InitialAccessVectors } from './components/initial-access-vectors';
import QualitativeMetrics from './components/qualitative-metrics';
import { transformToLocalFilters, transformToServerFilters } from './utils';

type Props = {
  scenario?: RiskRegisterResponse;
  onSuccess: () => void;
};

export const CRQRiskScenarioInputForm: FC<Props> = ({
  scenario,
  onSuccess,
}) => {
  const currentScenarioId = useCurrentRiskRegisterScenarioIdIfExists();
  const { track: trackEvent } = useMixpanel();
  const { toast } = useToast();
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { t } = useTranslation('riskRegister', { keyPrefix: 'modal' });
  const {
    invalidateScenarioTableQueries,
    invalidateCurrentScenarioQuery,
    updateQueriesWithNewRow,
  } = useUpdateRiskRegisterQueries();
  const isInScenarioViewPage = !!currentScenarioId;

  const { mutateAsync: createRiskScenario, isPending: isCreating } =
    useCreateCRQRiskScenario({
      onSuccess: async () => {
        onSuccess();
        toast({
          title: 'Success',
          description: 'The risk scenario has been created successfully',
        });
        form.reset();
        await invalidateScenarioTableQueries();
      },
      onError: (error: unknown) => {
        const axiosError = error as { response?: { data: { detail: string } } };
        setErrorMessage(
          axiosError.response?.data.detail || 'An error occurred',
        );
        setIsErrorDialogOpen(true);
      },
    });

  const { mutateAsync: updateRiskScenario, isPending: isUpdating } =
    useUpdateRiskScenario(scenario?.scenario_id || '', {
      onSuccess: async (updatedScenario) => {
        onSuccess();
        toast({
          title: 'Success',
          description: 'The risk scenario has been updated successfully',
        });
        if (isInScenarioViewPage) {
          await invalidateCurrentScenarioQuery(scenario?.scenario_id || '');
          return;
        }
        updateQueriesWithNewRow(updatedScenario);
      },
      onError: (error: unknown) => {
        const axiosError = error as { response?: { data: { detail: string } } };
        setErrorMessage(
          axiosError.response?.data.detail || 'An error occurred',
        );
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
        group_id: scenario.group_id || undefined,
        likelihood: scenario.scenario_data.likelihood,
        impact: scenario.scenario_data.impact,
        crq_data: {
          fq_id: scenario.scenario_data.crq_data?.fq_id,
          company_id: scenario.scenario_data.crq_data?.company_id || '',
          filters: transformToLocalFilters(
            scenario.scenario_data.crq_data?.filters || {},
          ),
        },
      }
      : (() => {
        // Get default group_id from localStorage if available
        let defaultGroupId: string | undefined;
        try {
          const savedGroupId = localStorage.getItem('active_group_id');
          if (savedGroupId) {
            defaultGroupId = savedGroupId;
          }
        } catch (error) {
          console.warn(
            'Failed to read active_group_id from localStorage:',
            error,
          );
        }

        return {
          scenario_type: scenarioTypes.CRQ,
          customer_scenario_id: '',
          name: '',
          description: '',
          group_id: defaultGroupId,
          likelihood: undefined,
          impact: undefined,
          crq_data: {
            fq_id: '',
            company_id: '',
            filters: {},
          },
        };
      })();
  }, [scenario]);

  const form = useForm<CRQScenarioFormValues>({
    resolver: zodResolver(crqScenarioFormSchema),
    defaultValues: initialValues as CRQScenarioFormValues,
  });

  const isEditMode = !!scenario;
  const initialvectors =
    (initialValues.crq_data.filters as CRQScenarioFilters)
      .initial_vector_filter || [];
  const formValues = form.watch();

  const hasFormChanged = useMemo(
    () => !isEqual(formValues, initialValues),
    [formValues, initialValues],
  );

  async function onSubmit(values: CRQScenarioFormValues) {
    // Only track if we have the necessary context
    const scenarioId = scenario?.scenario_id || currentScenarioId;
    if (scenarioId) {
      trackEvent('risk_register.crq_scenario_input_form.submit', {
        scenarioId,
      });
    }

    if (isEditMode) {
      return await updateRiskScenario({
        ...values,
        crq_data: transformToServerFilters(values.crq_data as CRQData),
      } as CRQScenarioUpdateRequest);
    }
    return await createRiskScenario({
      ...values,
      crq_data: transformToServerFilters(values.crq_data as CRQData),
    } as CRQScenarioCreateRequest);
  }

  useEffect(() => {
    // Only track if we have the necessary context
    const scenarioId = scenario?.scenario_id || currentScenarioId;
    if (scenarioId) {
      trackEvent('risk_register.crq_scenario_input_form.view', {
        scenarioId,
      });
    }
  }, [trackEvent, scenario?.scenario_id, currentScenarioId]);

  const isLoading = isCreating || isUpdating;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-10'>
          <div className='flex flex-col gap-2'>
            <CRQEntitySelect control={form.control} isEditMode={isEditMode} />
            <BasicScenarioInfo
              control={
                form.control as unknown as Control<{
                  customer_scenario_id: string;
                  name: string;
                  description: string;
                  likelihood: string;
                  impact: string;
                }>
              }
              isEditMode={isEditMode}
            />
          </div>
          <QualitativeMetrics
            control={
              form.control as unknown as Control<{
                likelihood: string;
                impact: string;
                customer_scenario_id: string;
                name: string;
                description: string;
              }>
            }
            isRequired={false}
          />
          {formValues.crq_data.company_id && (
            <InitialAccessVectors
              companyId={formValues.crq_data.company_id}
              control={form.control}
              isEditMode={isEditMode}
              initialvectors={initialvectors}
            />
          )}
          <EventTypesCheckboxes
            control={form.control}
            isEditMode={isEditMode}
          />
          <ImpactTypesCheckboxes
            control={form.control}
            isEditMode={isEditMode}
          />
          {formValues.crq_data.company_id && (
            <ImpactMagnitude
              control={form.control}
              companyId={formValues.crq_data.company_id}
              isEditMode={isEditMode}
            />
          )}
          <div className='flex justify-end'>
            <Button
              type='submit'
              disabled={(isEditMode && !hasFormChanged) || isLoading}
              loading={isLoading}
              className='px-[16px] py-[8px]'
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
