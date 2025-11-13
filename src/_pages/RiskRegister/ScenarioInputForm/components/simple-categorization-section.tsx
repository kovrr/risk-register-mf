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
  isEditMode,
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
        disabled={isEditMode}
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
        disabled={isEditMode}
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
        disabled={isEditMode}
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
        disabled={isEditMode}
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
    </div>
  );
}
