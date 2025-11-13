import InfoPopover from '@/components/molecules/info-popover';
import { isCompanyWithError } from '@/components/molecules/CompanyErrorRow';
import type { CompanyApiData, CompanyData } from '@/types/companyForm';
import { InitialAttackVectors } from '@/types/riskDrivers/attackVectors';
import {
  ClickableEventType,
  EVENT_TYPE_TO_TEXT,
} from '@/types/riskDrivers/eventTypes';
import { ImpactTypes } from '@/types/riskDrivers/impactTypes';
import { useMemo } from 'react';
import type { Control } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MultiSelectField } from './multi-select-field';
import type { CRQScenarioFormValues } from './form-config';

const SCENARIO_CATEGORY_OPTIONS = [
  'Strategic Risk',
  'Operational Risk',
  'Technical Risk',
  'Privacy Risk',
  'Security Risk',
  'Ethical Risk',
  'Fairness/Bias Risk',
  'Legal/Compliance Risk',
  'Safety Risk',
  'Reputational Risk',
  'Environmental Risk',
] as const;

type CategorizationSectionProps = {
  control: Control<CRQScenarioFormValues>;
  company?: CompanyApiData | CompanyData | null;
  isEditMode?: boolean;
};

export function CategorizationSection({
  control,
  company,
  isEditMode,
}: CategorizationSectionProps) {
  const { t } = useTranslation('riskRegister', { keyPrefix: 'modal' });

  const selectedAiAssets = useWatch({
    control,
    name: 'ai_assets',
  }) as string[] | undefined;

  const assetGroupOptions = useMemo(() => {
    if (!company || isCompanyWithError(company) || !company.sphere) {
      return [] as { label: string; value: string }[];
    }

    const groupNames = new Set<string>(selectedAiAssets ?? []);
    const sections = [
      company.sphere.employee_endpoints,
      company.sphere.infrastructure,
      company.sphere.cloud,
      company.sphere.ot,
    ];

    sections.forEach((section) => {
      if (!Array.isArray(section)) {
        return;
      }
      section.forEach((group) => {
        if (
          group &&
          typeof group === 'object' &&
          'group_name' in group &&
          typeof group.group_name === 'string'
        ) {
          groupNames.add(group.group_name);
        }
      });
    });

    return Array.from(groupNames).map((name) => ({
      label: name,
      value: name,
    }));
  }, [company, selectedAiAssets]);

  const availableVectors = useMemo(() => {
    if (!company || isCompanyWithError(company)) {
      return [] as string[];
    }
    const vectorKeys = Object.keys(InitialAttackVectors).map(
      (key) => InitialAttackVectors[key as keyof typeof InitialAttackVectors],
    );

    const exposureByVector =
      company.last_quantification?.results_narrative?.by_initial_vector_exposure;

    if (!exposureByVector) {
      return vectorKeys;
    }

    const available = Object.keys(exposureByVector);
    const normalizedAvailable = available.map((vector) => vector.toLowerCase());

    return vectorKeys.filter((vector) =>
      normalizedAvailable.includes(vector.toLowerCase()),
    );
  }, [company]);

  const initialAccessOptions = useMemo(() => {
    const vectors =
      availableVectors.length > 0
        ? availableVectors
        : Object.values(InitialAttackVectors);
    return vectors.map((vector) => ({
      label: toTitleCase(vector),
      value: vector,
    }));
  }, [availableVectors]);

  const eventTypeOptions = useMemo(() => {
    return [
      ClickableEventType.ransomware,
      ClickableEventType.interruption,
      ClickableEventType.dataBreach,
    ].map((eventType) => ({
      label: EVENT_TYPE_TO_TEXT[eventType],
      value: eventType,
    }));
  }, []);

  const impactTypeOptions = useMemo(() => {
    return Object.values(ImpactTypes).flatMap((impactType) => {
      return impactType.value.map((value) => ({
        label:
          impactType.value.length > 1
            ? `${impactType.label} (${toTitleCase(value)})`
            : impactType.label,
        value,
        group: impactType.label,
      }));
    });
  }, []);

  return (
    <div className='grid gap-6 lg:grid-cols-2'>
      <MultiSelectField
        control={control}
        name='scenario_category'
        label='Scenario Category'
        placeholder='Select categories'
        options={SCENARIO_CATEGORY_OPTIONS.map((category) => {
          return {
            label: category,
            value: category,
          };
        })}
        info={
          <InfoPopover content='Select one or more categories describing the AI risk scenario.' />
        }
        disabled={isEditMode}
        data-testid='scenario-category-select'
      />

      <MultiSelectField
        control={control}
        name='ai_assets'
        label='AI Asset / System / Component'
        placeholder={
          assetGroupOptions.length > 0
            ? 'Select asset groups'
            : 'No asset groups available'
        }
        options={assetGroupOptions}
        info={
          <InfoPopover content='Associate the scenario with relevant AI assets or components.' />
        }
        disabled={isEditMode || assetGroupOptions.length === 0}
        data-testid='ai-asset-select'
      />

      <MultiSelectField
        control={control}
        name='crq_data.filters.initial_vector_filter'
        label='Initial Access Tactics (MITRE ATLAS)'
        placeholder='Select tactics'
        options={initialAccessOptions}
        info={
          <InfoPopover content={t('labels.initialAccessVectorsInformation')} />
        }
        disabled={isEditMode}
        data-testid='initial-access-select'
      />

      <MultiSelectField
        control={control}
        name='crq_data.filters.event_type_filter'
        label='Cyber Event Type'
        placeholder='Select event types'
        options={eventTypeOptions}
        info={<InfoPopover content={t('labels.crqEventTypesInformation')} />}
        disabled={isEditMode}
        data-testid='event-types-select'
      />

      <MultiSelectField
        control={control}
        name='crq_data.filters.impact_type_filter'
        label='Impact Type'
        placeholder='Select impact types'
        options={impactTypeOptions}
        info={<InfoPopover content={t('labels.crqImpactTypesInformation')} />}
        disabled={isEditMode}
        data-testid='impact-types-select'
      />
    </div>
  );
}

function toTitleCase(value: string) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

