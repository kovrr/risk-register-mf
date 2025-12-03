import { Badge } from '@/components/atoms/badge';
import { Card } from '@/components/atoms/card';
import { Input } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import type { Option } from '@/components/molecules/Dropdown';
import { StatusBadge } from '@/components/ui/Badge/StatusBadge';
import { DemoExperienceContext } from '@/contexts/DemoExperienceContext';
import { cn } from '@/lib/utils';
import { useUpdateRiskScenarioField } from '@/services/hooks';
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

const labelClassName = 'text-sm font-bold text-text-base-primary min-w-[140px]';
const valueClassName = 'text-sm text-text-base-primary';

const createKeyedList = (values: string[]) =>
  values.map((value, index) => ({
    key: `${value}-${index}`,
    value,
  }));

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
    id: scenario.scenario_id,
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
  const { mutateAsync: updateRiskScenarioField, isPending } =
    useUpdateRiskScenarioField({
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
    await updateRiskScenarioField({
      risk_priority: option.value as RiskRegisterPriority,
    });
  };

  const handleResponsePlanChange = async (option: Option) => {
    if (isGuestUser) {
      showDemoModal({ title: t('demo.editResponsePlan') });
      return;
    }
    await updateRiskScenarioField({
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
      await updateRiskScenarioField({
        ticket: value || undefined,
      });
      setTicketState('valid');
    },
    [updateRiskScenarioField, isGuestUser, showDemoModal, t],
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

  const debouncedMitigationCostChange = useMemo(
    () =>
      debounce(async (value: string) => {
        if (isGuestUser) {
          showDemoModal({ title: t('demo.editMitigationCost') });
          return;
        }
        await updateRiskScenarioField({
          mitigation_cost: value ? Number(value) : undefined,
        });
      }, 2000),
    [updateRiskScenarioField, isGuestUser, showDemoModal, t],
  );

  const handleReviewDateChange = async (value: string) => {
    if (isGuestUser) {
      showDemoModal({ title: t('editReviewDate') });
      return;
    }
    await updateRiskScenarioField({
      review_date: value || undefined,
    });
  };

  const aiAssets = scenario.scenario_data.ai_assets || [];
  const tactics = scenario.scenario_data.tactics || [];
  const eventTypes = scenario.scenario_data.event_types || [];
  const impactTypes = scenario.scenario_data.impact_types || [];
  const riskSubcategories = scenario.scenario_data.risk_subcategory || [];
  const riskOrigins = scenario.scenario_data.risk_origin || [];
  const aiLifecycles = scenario.scenario_data.ai_lifecycle || [];
  const stakeholdersAffected =
    scenario.scenario_data.stakeholders_affected || [];

  const aiAssetBadges = useMemo(() => createKeyedList(aiAssets), [aiAssets]);
  const tacticBadges = useMemo(() => createKeyedList(tactics), [tactics]);
  const eventTypeBadges = useMemo(
    () => createKeyedList(eventTypes),
    [eventTypes],
  );
  const impactTypeBadges = useMemo(
    () => createKeyedList(impactTypes),
    [impactTypes],
  );
  const riskSubcategoryBadges = useMemo(
    () => createKeyedList(riskSubcategories),
    [riskSubcategories],
  );
  const riskOriginBadges = useMemo(
    () => createKeyedList(riskOrigins),
    [riskOrigins],
  );
  const aiLifecycleBadges = useMemo(
    () => createKeyedList(aiLifecycles),
    [aiLifecycles],
  );
  const stakeholderBadges = useMemo(
    () => createKeyedList(stakeholdersAffected),
    [stakeholdersAffected],
  );

  return (
    <Card className='flex flex-col gap-6 rounded-none bg-transparent p-0 shadow-none'>
      <div className='space-y-6'>
        {/* Risk Priority */}
        <div className='flex items-start gap-4'>
          <Label className={labelClassName}>{t('labels.riskPriority')}</Label>
          <div className='flex-1'>
            <PriorityDropdown
              value={scenario.scenario_data.risk_priority}
              onChange={handlePriorityChange}
              key={scenario.scenario_id}
              disabled={isPending || isGuestUser}
            />
          </div>
        </div>

        {/* AI Assets / Systems */}
        <div className='flex items-start gap-4'>
          <Label className={labelClassName}>AI Assets / Systems</Label>
          <div className='flex flex-1 flex-wrap gap-2'>
            {aiAssetBadges.length > 0 ? (
              aiAssetBadges.map(({ key, value }) => (
                <Badge
                  key={key}
                  variant='secondary'
                  className='rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700'
                >
                  {value}
                </Badge>
              ))
            ) : (
              <span className={cn(valueClassName, 'italic text-gray-500')}>
                Not set
              </span>
            )}
          </div>
        </div>

        {/* Initial Access (MITRE) */}
        <div className='flex items-start gap-4'>
          <Label className={labelClassName}>Initial Access</Label>
          <div className='flex flex-1 flex-wrap gap-2'>
            {tacticBadges.length > 0 ? (
              tacticBadges.map(({ key, value }) => (
                <Badge
                  key={key}
                  variant='secondary'
                  className='rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700'
                >
                  {value}
                </Badge>
              ))
            ) : (
              <span className={cn(valueClassName, 'italic text-gray-500')}>
                Not set
              </span>
            )}
          </div>
        </div>

        {/* Cyber Event Type */}
        <div className='flex items-start gap-4'>
          <Label className={labelClassName}>Cyber Event Type</Label>
          <div className='flex flex-1 flex-wrap gap-2'>
            {eventTypeBadges.length > 0 ? (
              eventTypeBadges.map(({ key, value }) => (
                <Badge
                  key={key}
                  variant='secondary'
                  className='rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700'
                >
                  {value}
                </Badge>
              ))
            ) : (
              <span className={cn(valueClassName, 'italic text-gray-500')}>
                Not set
              </span>
            )}
          </div>
        </div>

        {/* Impact Type */}
        <div className='flex items-start gap-4'>
          <Label className={labelClassName}>Impact Type</Label>
          <div className='flex flex-1 flex-wrap gap-2'>
            {impactTypeBadges.length > 0 ? (
              impactTypeBadges.map(({ key, value }) => (
                <Badge
                  key={key}
                  variant='secondary'
                  className='rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700'
                >
                  {value}
                </Badge>
              ))
            ) : (
              <span className={cn(valueClassName, 'italic text-gray-500')}>
                Not set
              </span>
            )}
          </div>
        </div>

        {/* Risk Subcategory */}
        <div className='flex items-start gap-4'>
          <Label className={labelClassName}>Risk Subcategory</Label>
          <div className='flex flex-1 flex-wrap gap-2'>
            {riskSubcategoryBadges.length > 0 ? (
              riskSubcategoryBadges.map(({ key, value }) => (
                <Badge
                  key={key}
                  variant='secondary'
                  className='rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700'
                >
                  {value}
                </Badge>
              ))
            ) : (
              <span className={cn(valueClassName, 'italic text-gray-500')}>
                Not set
              </span>
            )}
          </div>
        </div>

        {/* Risk Origin */}
        <div className='flex items-start gap-4'>
          <Label className={labelClassName}>Risk Origin</Label>
          <div className='flex flex-1 flex-wrap gap-2'>
            {riskOriginBadges.length > 0 ? (
              riskOriginBadges.map(({ key, value }) => (
                <Badge
                  key={key}
                  variant='secondary'
                  className='rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700'
                >
                  {value}
                </Badge>
              ))
            ) : (
              <span className={cn(valueClassName, 'italic text-gray-500')}>
                Not set
              </span>
            )}
          </div>
        </div>

        {/* AI Lifecycle */}
        <div className='flex items-start gap-4'>
          <Label className={labelClassName}>AI Lifecycle</Label>
          <div className='flex flex-1 flex-wrap gap-2'>
            {aiLifecycleBadges.length > 0 ? (
              aiLifecycleBadges.map(({ key, value }) => (
                <Badge
                  key={key}
                  variant='secondary'
                  className='rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700'
                >
                  {value}
                </Badge>
              ))
            ) : (
              <span className={cn(valueClassName, 'italic text-gray-500')}>
                Not set
              </span>
            )}
          </div>
        </div>

        {/* Stakeholders Affected */}
        <div className='flex items-start gap-4'>
          <Label className={labelClassName}>Stakeholders Affected</Label>
          <div className='flex flex-1 flex-wrap gap-2'>
            {stakeholderBadges.length > 0 ? (
              stakeholderBadges.map(({ key, value }) => (
                <Badge
                  key={key}
                  variant='secondary'
                  className='rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700'
                >
                  {value}
                </Badge>
              ))
            ) : (
              <span className={cn(valueClassName, 'italic text-gray-500')}>
                Not set
              </span>
            )}
          </div>
        </div>

        {/* Risk Owner */}
        <div className='flex items-start gap-4'>
          <Label className={labelClassName}>{t('labels.riskOwner')}</Label>
          <div className='flex-1'>
            <RiskOwnerDropdownMutate
              value={scenario.scenario_data.risk_owner}
              rowData={registerToRowData(scenario)}
              disabled={isPending || isGuestUser}
            />
          </div>
        </div>

        {/* Status */}
        <div className='flex items-start gap-4'>
          <Label className={labelClassName}>Status</Label>
          <div className='flex-1'>
            <StatusBadge status={scenario.status || 'Draft'} />
          </div>
        </div>

        {/* Response Plan */}
        <div className='flex items-start gap-4'>
          <Label className={labelClassName}>{t('labels.responsePlan')}</Label>
          <div className='flex-1'>
            <ResponsePlanDropdown
              value={scenario.scenario_data.response_plan}
              onChange={handleResponsePlanChange}
              key={scenario.scenario_id}
              disabled={isPending || isGuestUser}
            />
          </div>
        </div>

        {/* Ticket */}
        <div className='flex items-start gap-4'>
          <Label className={labelClassName}>{t('labels.ticket')}</Label>
          <div className='relative flex-1'>
            <div className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
              <LinkIcon
                className={cn(
                  'h-4 w-4',
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
                'pl-9',
                ticketState === 'loading' && 'text-base-primary',
                ticketState === 'invalid' && 'text-red-500',
              )}
              onChange={(e) => handleLinkChange(e.target.value)}
              defaultValue={scenario.scenario_data.ticket || ''}
              disabled={isPending || isGuestUser}
            />
          </div>
        </div>

        {/* Review Date */}
        <div className='flex items-start gap-4'>
          <Label className={labelClassName}>{t('labels.reviewDate')}</Label>
          <div className='flex-1'>
            <DateField
              value={scenario.scenario_data.review_date}
              onChange={handleReviewDateChange}
            />
          </div>
        </div>

        {/* Mitigation Cost */}
        <div className='flex items-start gap-4'>
          <MitigationCostField
            label={t('labels.mitigationCost')}
            value={scenario.scenario_data.mitigation_cost}
            labelClassName={labelClassName}
            onChange={debouncedMitigationCostChange}
            scenario={scenario}
            disabled={isGuestUser}
          />
        </div>

        {/* Creation Date */}
        <div className='flex items-start gap-4'>
          <Label className={labelClassName}>{t('labels.creationDate')}</Label>
          <span className={cn(valueClassName, 'italic text-gray-500')}>
            {format(new Date(scenario.created_at), 'MMMM d, yyyy')}
          </span>
        </div>

        {/* Last Edited On */}
        <div className='flex items-start gap-4'>
          <Label className={labelClassName}>{t('labels.lastEdited')}</Label>
          <span className={cn(valueClassName, 'italic text-gray-500')}>
            {format(new Date(scenario.updated_at), 'MMMM d, yyyy')}
          </span>
        </div>
      </div>

      {/* Custom Fields Section */}
      <div className='mt-6 border-t pt-6'>
        <CustomFieldsSection scenario={scenario} />
      </div>
    </Card>
  );
}
