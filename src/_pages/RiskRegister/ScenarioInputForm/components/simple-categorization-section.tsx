import InfoPopover from '@/components/molecules/info-popover';
import type { Control } from 'react-hook-form';
import type { SimpleScenarioFormValues } from './form-config';
import { MultiSelectField } from './multi-select-field';

const SCENARIO_CATEGORY_OPTIONS = [
  'Privacy Risk',
  'Legal/Compliance Risk',
  'Reliability Risk',
  'Ethical Risk',
  'Security Risk',
  'Bias/Fairness Risk',
  'Safety Risk',
  'Transparency Risk',
  'Performance Risk',
] as const;

const AI_ASSET_OPTIONS = [
  'OpenAI - GPT-4 Turbo',
  'OpenAI - GPT-4',
  'Anthropic - Claude 3.5 Sonnet',
  'Google - Gemini 1.5 Pro',
  'Meta - Llama 3.1 (405B)',
] as const;

const INITIAL_ACCESS_OPTIONS = [
  'Drive-by Compromise (AML.T0078)',
  'Exploit Public-Facing Application (AML.T0049)',
  'Phishing (AML.T0052)',
  'Phishing: Spearphishing via Social Engineering LLM (AML.T0052.000)',
  'AI Supply Chain Compromise (AML.T0010)',
  'AI Supply Chain Compromise: Model (AML.T0010.003)',
  'Valid Accounts (AML.T0012)',
  'Evade AI Model (AML.T0015)',
] as const;

const CYBER_EVENT_TYPE_OPTIONS = [
  'Data Exfiltration',
  'Model Integrity',
  'Model Availability',
  'Model Wastage',
] as const;

const IMPACT_TYPE_OPTIONS = [
  'Financial Loss',
  'Physical Harm',
  'Privacy Violation',
  'Reputational Damage',
  'Regulatory Non-Compliance',
  'Data Breach',
] as const;

type SimpleCategorizationSectionProps = {
  control: Control<SimpleScenarioFormValues>;
  isEditMode?: boolean;
};

export function SimpleCategorizationSection({
  control,
  isEditMode,
}: SimpleCategorizationSectionProps) {
  return (
    <div className='space-y-6'>
      <MultiSelectField
        control={control}
        name='scenario_category'
        label='Scenario Category'
        placeholder='Select categories'
        options={SCENARIO_CATEGORY_OPTIONS.map((option) => ({
          label: option,
          value: option,
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
        options={AI_ASSET_OPTIONS.map((option) => ({
          label: option,
          value: option,
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
        options={INITIAL_ACCESS_OPTIONS.map((option) => ({
          label: option,
          value: option,
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
        options={CYBER_EVENT_TYPE_OPTIONS.map((option) => ({
          label: option,
          value: option,
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
        options={IMPACT_TYPE_OPTIONS.map((option) => ({
          label: option,
          value: option,
        }))}
        info={
          <InfoPopover content='Select the potential consequences if this scenario materializes.' />
        }
        data-testid='simple-impact-types-select'
      />
    </div>
  );
}
