import { Card, CardHeader, CardTitle } from '@/components/atoms/card';
import { Input } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import type { Option } from '@/components/molecules/Dropdown';
import { cn } from '@/lib/utils';
import { useUpdateRiskRegisterScenarioField } from '@/services/hooks';
import type {
  RiskRegisterPriority,
  RiskRegisterResponse,
  RiskRegisterResponsePlan,
  RiskRegisterRow,
} from '@/types/riskRegister';
import { format } from 'date-fns';
import debounce from 'lodash/debounce';
import { LinkIcon } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { PriorityDropdown } from '../../components/PriorityDropdown';
import { ResponsePlanDropdown } from '../../components/ResponsePlanDropdown';
import { RiskOwnerDropdownMutate } from '../../components/RiskOwner';

type RiskManagementFormProps = {
  scenario: RiskRegisterResponse;
};

const labelClassName = 'text-[14px] text-base-primary font[400]';

const urlSchema = z.union([
  z.string().url(),
  z
    .string()
    .length(0), // Allow empty string
]);

export const registerToRowData: (
  scenario: RiskRegisterResponse,
) => RiskRegisterRow = (scenario) => {
  return {
    id: scenario.id,
    scenarioId: scenario.scenario_id,
    version: scenario.version,
    customerScenarioId: scenario.customer_scenario_id,
    scenario: null,
    scenarioTitle: scenario.name,
    scenarioDescription: scenario.description,
    likelihood: scenario.scenario_data.likelihood,
    impact: scenario.scenario_data.impact,
    priority: scenario.scenario_data.risk_priority,
    responsePlan: scenario.scenario_data.response_plan,
    lastUpdated: scenario.updated_at,
    owner: scenario.scenario_data.risk_owner,
    scenarioType: scenario.scenario_type,
    tableOptions: null,
    crqData: scenario.scenario_data.crq_data,
    status: scenario.status,
  };
};

export default function RiskManagementFormOld({
  scenario,
}: RiskManagementFormProps) {
  const { t } = useTranslation('riskRegister', {
    keyPrefix: 'scenarioDrillDown.riskManagement',
  });
  const { mutateAsync: updateRiskRegisterScenario, isPending } =
    useUpdateRiskRegisterScenarioField({
      onSuccess: () => {
        setTicketState('valid');
      },
    });
  const [ticketState, setTicketState] = useState<
    'valid' | 'loading' | 'invalid'
  >('valid');

  const handlePriorityChange = async (option: Option) => {
    await updateRiskRegisterScenario({
      risk_priority: option.value as RiskRegisterPriority,
    });
  };

  const handleResponsePlanChange = async (option: Option) => {
    await updateRiskRegisterScenario({
      response_plan: option.value as RiskRegisterResponsePlan,
    });
  };

  const handleTicketUrlChange = useCallback(
    async (value: string) => {
      const result = urlSchema.safeParse(value);

      if (!result.success) {
        setTicketState('invalid');
        console.warn('Invalid URL provided:', value);
        return;
      }

      setTicketState('loading');
      await updateRiskRegisterScenario({
        ticket: value || undefined,
      });
      setTicketState('valid');
    },
    [updateRiskRegisterScenario],
  );

  const debouncedTicketChange = useMemo(
    () =>
      debounce((value: string) => {
        void handleTicketUrlChange(value);
      }, 1000),
    [handleTicketUrlChange],
  );

  const handleLinkChange = (value: string) => {
    setTicketState('loading');
    debouncedTicketChange(value);
  };

  return (
    <Card className='min-w-[400px] space-y-[20px] p-[20px]'>
      <CardHeader>
        <CardTitle className='text-[17px]'>{t('title')}</CardTitle>
      </CardHeader>

      <div className='grid grid-cols-[2fr_3fr] gap-[5px] gap-y-[15px]'>
        <Label className={labelClassName}>{t('labels.riskPriority')}</Label>
        <div>
          <PriorityDropdown
            value={scenario.scenario_data.risk_priority}
            onChange={handlePriorityChange}
            key={scenario.scenario_id}
            disabled={isPending}
          />
        </div>

        <Label className={labelClassName}>{t('labels.responsePlan')}</Label>
        <div>
          <ResponsePlanDropdown
            value={scenario.scenario_data.response_plan}
            onChange={handleResponsePlanChange}
            key={scenario.scenario_id}
            disabled={isPending}
          />
        </div>

        <Label className={labelClassName}>{t('labels.riskOwner')}</Label>
        <div>
          <RiskOwnerDropdownMutate
            value={scenario.scenario_data.risk_owner}
            rowData={registerToRowData(scenario)}
            disabled={isPending}
          />
        </div>

        <Label className={labelClassName}>{t('labels.ticket')}</Label>
        <div className='relative w-full max-w-md'>
          <div className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
            <LinkIcon
              className={cn(
                'h-4 w-4 text-text-brand-primary',
                ticketState === 'loading' || !scenario.scenario_data.ticket
                  ? 'text-base-primary'
                  : 'text-text-brand-primary',
                ticketState === 'invalid' && 'text-red-500',
              )}
            />
          </div>
          <Input
            type='url'
            placeholder={t('placeholders.ticketUrl')}
            className={cn(
              'pl-9 text-text-brand-primary',
              ticketState === 'loading' && 'text-base-primary',
              ticketState === 'invalid' && 'text-red-500',
            )}
            onChange={(e) => handleLinkChange(e.target.value)}
            defaultValue={scenario.scenario_data.ticket || ''}
            disabled={isPending}
          />
        </div>

        <Label className={labelClassName}>{t('labels.creationDate')}</Label>
        <span className='font-[14px] italic text-gray-500'>
          {format(new Date(scenario.created_at), 'MMMM d, yyyy')}
        </span>

        <Label className={labelClassName}>{t('labels.lastEdited')}</Label>
        <span className='font-[14px] italic text-gray-500'>
          {format(new Date(scenario.updated_at), 'MMMM d, yyyy')}
        </span>
      </div>
    </Card>
  );
}
