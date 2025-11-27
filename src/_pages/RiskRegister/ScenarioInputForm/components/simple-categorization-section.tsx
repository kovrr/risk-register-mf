import InfoPopover from '@/components/molecules/info-popover';
import { useScenarioFieldEnums } from '@/hooks/useScenarioFieldEnums';
import type { Control } from 'react-hook-form';
import type { SimpleScenarioFormValues } from './form-config';
import { MultiSelectField } from './multi-select-field';

type SimpleCategorizationSectionProps = {
  control: Control<SimpleScenarioFormValues>;
  isEditMode?: boolean;
};

export function SimpleCategorizationSection({
  control,
}: SimpleCategorizationSectionProps) {
  const { data: enums, isLoading } = useScenarioFieldEnums();

  if (isLoading || !enums) return null;

  return (
    <div className='space-y-6'>
      <MultiSelectField
        control={control}
        name='scenario_category'
        label='Scenario Category'
        placeholder='Select categories'
        options={enums.ScenarioCategory.map((value) => ({
          label: value,
          value,
        }))}
        info={
          <InfoPopover content='Select one or more categories describing the AI risk scenario.' />
        }
        data-testid='simple-scenario-category-select'
      />

      <MultiSelectField
        control={control}
        name='ai_assets'
        label='AI Asset / System / Component'
        placeholder='Select assets'
        options={(enums.AIAsset ?? []).map((value) => ({
          label: value,
          value,
        }))}
        info={
          <InfoPopover content='Associate the scenario with relevant AI assets or components.' />
        }
        data-testid='simple-ai-asset-select'
      />

      <MultiSelectField
        control={control}
        name='tactics'
        label='Initial Access Tactics (MITRE ATLAS)'
        placeholder='Select tactics'
        options={enums.ScenarioTactic.map((value) => ({
          label: value,
          value,
        }))}
        info={
          <InfoPopover content='Choose the initial access techniques relevant to this scenario.' />
        }
        data-testid='simple-initial-access-select'
      />

      <MultiSelectField
        control={control}
        name='event_types'
        label='Cyber Event Type'
        placeholder='Select event types'
        options={enums.ScenarioEventType.map((value) => ({
          label: value,
          value,
        }))}
        info={
          <InfoPopover content='Identify the cyber events that best match this risk scenario.' />
        }
        data-testid='simple-event-types-select'
      />

      <MultiSelectField
        control={control}
        name='impact_types'
        label='Impact Type'
        placeholder='Select impact types'
        options={enums.ScenarioImpactType.map((value) => ({
          label: value,
          value,
        }))}
        info={
          <InfoPopover content='Select the potential consequences if this scenario materializes.' />
        }
        data-testid='simple-impact-types-select'
      />

      <MultiSelectField
        control={control}
        name='risk_origin'
        label='Risk Origin'
        placeholder='Select risk origins'
        options={(enums.RiskOrigin ?? []).map((value) => ({
          label: value,
          value,
        }))}
        info={
          <InfoPopover content='Identify the sources contributing to this risk.' />
        }
        data-testid='simple-risk-origin-select'
      />

      <MultiSelectField
        control={control}
        name='ai_lifecycle'
        label='AI Lifecycle Phase'
        placeholder='Select lifecycle phases'
        options={(enums.AILifecyclePhase ?? []).map((value) => ({
          label: value,
          value,
        }))}
        info={
          <InfoPopover content='Indicate the AI lifecycle phases impacted by this scenario.' />
        }
        data-testid='simple-ai-lifecycle-select'
      />

      <MultiSelectField
        control={control}
        name='stakeholders_affected'
        label='Stakeholders Affected'
        placeholder='Select stakeholders'
        options={(enums.StakeholderType ?? []).map((value) => ({
          label: value,
          value,
        }))}
        info={
          <InfoPopover content='Select the stakeholders impacted if the scenario occurs.' />
        }
        data-testid='simple-stakeholders-select'
      />
    </div>
  );
}
