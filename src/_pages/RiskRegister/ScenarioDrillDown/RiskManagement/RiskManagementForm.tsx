import { Card } from '@/components/atoms/card';
import { Input } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import type { Option } from '@/components/molecules/Dropdown';
import { DemoExperienceContext } from '@/contexts/DemoExperienceContext';
import { cn } from '@/lib/utils';
import { useUpdateRiskRegisterScenarioField } from '@/services/hooks';
import {
  type RiskRegisterPriority,
  type RiskRegisterResponse,
  type RiskRegisterResponsePlan,
  type RiskRegisterRow,
  scenarioTypes,
} from '@/types/riskRegister';
import { format } from 'date-fns';
import debounce from 'lodash/debounce';
import { LinkIcon } from 'lucide-react';
import { useIsGuestUser } from 'permissions/use-permissions';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { DateField } from '../../components/CustomFields/fields';
import { MitigationCostField } from '../../components/MitigationCostField';
import { PriorityDropdown } from '../../components/PriorityDropdown';
import { ResponsePlanDropdown } from '../../components/ResponsePlanDropdown';
import { RiskOwnerDropdownMutate } from '../../components/RiskOwner';
import { CustomFieldsSection } from './CustomFields';

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
  // Get company_id for both CRQ and naive scenarios
  const entityId: string | undefined =
    scenario.scenario_type === scenarioTypes.CRQ
      ? scenario.scenario_data.crq_data?.company_id
      : scenario.scenario_data.company_id;

  return {
    id: scenario.id,
    scenarioId: scenario.scenario_id,
    version: scenario.version,
    customerScenarioId: scenario.customer_scenario_id,
    scenario: null,
    scenarioTitle: scenario.name,
    scenarioDescription: scenario.description,
    entity: entityId,
    company_id: scenario.scenario_data.company_id,
    company_name: scenario.company_name,
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

export default function RiskManagementForm({
  scenario,
}: RiskManagementFormProps) {
  const { t } = useTranslation('riskRegister', {
    keyPrefix: 'scenarioDrillDown.riskManagement',
  });
  const isGuestUser = useIsGuestUser();
  const { showDemoModal } = useContext(DemoExperienceContext);
  const { mutateAsync: updateRiskRegisterScenario, isLoading } =
    useUpdateRiskRegisterScenarioField({
      onSuccess: () => {
        setTicketState('valid');
      },
    });
  const [ticketState, setTicketState] = useState<
    'valid' | 'loading' | 'invalid'
  >('valid');

  const handlePriorityChange = async (option: Option) => {
    if (isGuestUser) {
      showDemoModal({ title: t('demo.editRiskPriority') });
      return;
    }
    await updateRiskRegisterScenario({
      risk_priority: option.value as RiskRegisterPriority,
    });
  };

  const handleResponsePlanChange = async (option: Option) => {
    if (isGuestUser) {
      showDemoModal({ title: t('demo.editResponsePlan') });
      return;
    }
    await updateRiskRegisterScenario({
      response_plan: option.value as RiskRegisterResponsePlan,
    });
  };

  const handleTicketUrlChange = useCallback(
    async (value: string) => {
      if (isGuestUser) {
        showDemoModal({ title: t('demo.editTicketUrl') });
        return;
      }

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
    [updateRiskRegisterScenario, isGuestUser, showDemoModal, t],
  );

  const debouncedTicketChange = useMemo(
    () =>
      debounce((value: string) => {
        void handleTicketUrlChange(value);
      }, 1000),
    [handleTicketUrlChange],
  );

  const handleLinkChange = (value: string) => {
    if (isGuestUser) {
      showDemoModal({ title: t('demo.editTicketUrl') });
      return;
    }
    setTicketState('loading');
    debouncedTicketChange(value);
  };

  const debouncedSubCategoryChange = useMemo(
    () =>
      debounce(async (value: string) => {
        if (isGuestUser) {
          showDemoModal({ title: t('demo.editSubCategory') });
          return;
        }
        await updateRiskRegisterScenario({
          sub_category: value || undefined,
        });
      }, 2000),
    [updateRiskRegisterScenario, isGuestUser, showDemoModal, t],
  );

  const debouncedMitigationCostChange = useMemo(
    () =>
      debounce(async (value: string) => {
        if (isGuestUser) {
          showDemoModal({ title: t('demo.editMitigationCost') });
          return;
        }
        await updateRiskRegisterScenario({
          mitigation_cost: value ? Number(value) : undefined,
        });
      }, 2000),
    [updateRiskRegisterScenario, isGuestUser, showDemoModal, t],
  );

  const handleReviewDateChange = async (value: string) => {
    if (isGuestUser) {
      showDemoModal({ title: t('editReviewDate') });
      return;
    }
    await updateRiskRegisterScenario({
      review_date: value || undefined,
    });
  };

  return (
    <Card className='flex flex-col gap-6 space-y-[20px] p-[20px]'>
      <div className='grid grid-cols-[2fr_3fr] gap-[5px] gap-y-[15px]'>
        <Label className={labelClassName}>{t('labels.riskPriority')}</Label>
        <div>
          <PriorityDropdown
            value={scenario.scenario_data.risk_priority}
            onChange={handlePriorityChange}
            key={scenario.scenario_id}
            disabled={isLoading || isGuestUser}
          />
        </div>

        <Label className={labelClassName}>{t('labels.subCategory')}</Label>
        <div className='relative w-full'>
          <Input
            onChange={(e) => debouncedSubCategoryChange(e.target.value)}
            defaultValue={scenario.scenario_data.sub_category || ''}
            disabled={isLoading || isGuestUser}
            name='sub-category'
          />
        </div>

        <Label className={labelClassName}>{t('labels.riskOwner')}</Label>
        <div>
          <RiskOwnerDropdownMutate
            value={scenario.scenario_data.risk_owner}
            rowData={registerToRowData(scenario)}
            disabled={isLoading || isGuestUser}
          />
        </div>
      </div>
      <div className='grid grid-cols-[2fr_3fr] gap-[5px] gap-y-[15px]'>
        <Label className={labelClassName}>{t('labels.responsePlan')}</Label>
        <div>
          <ResponsePlanDropdown
            value={scenario.scenario_data.response_plan}
            onChange={handleResponsePlanChange}
            key={scenario.scenario_id}
            disabled={isLoading || isGuestUser}
          />
        </div>

        <Label className={labelClassName}>{t('labels.ticket')}</Label>
        <div className='relative w-full'>
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
            disabled={isLoading || isGuestUser}
          />
        </div>

        <Label className={labelClassName}>{t('labels.reviewDate')}</Label>
        <DateField
          value={scenario.scenario_data.review_date}
          onChange={handleReviewDateChange}
        />

        <MitigationCostField
          label={t('labels.mitigationCost')}
          value={scenario.scenario_data.mitigation_cost}
          labelClassName={labelClassName}
          onChange={debouncedMitigationCostChange}
          scenario={scenario}
          disabled={isGuestUser}
        />
      </div>
      <div className='grid grid-cols-[2fr_3fr] gap-[5px] gap-y-[15px]'>
        <Label className={labelClassName}>{t('labels.creationDate')}</Label>
        <span className='font-[14px] italic text-gray-500'>
          {format(new Date(scenario.created_at), 'MMMM d, yyyy')}
        </span>

        <Label className={labelClassName}>{t('labels.lastEdited')}</Label>
        <span className='font-[14px] italic text-gray-500'>
          {format(new Date(scenario.updated_at), 'MMMM d, yyyy')}
        </span>
      </div>
      <div className='mt-8 border-t pt-8'>
        <CustomFieldsSection scenario={scenario} />
      </div>
    </Card>
  );
}
