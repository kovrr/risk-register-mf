import {
  riskRegisterImpacts,
  riskRegisterLikelihoods,
  scenarioTypes,
} from '@/types/riskRegister';
import { z } from 'zod';

const baseScenarioSchema = z.object({
  customer_scenario_id: z.string().min(1, 'Scenario ID is required'),
  name: z.string().min(1, 'Scenario Name is required'),
  description: z.string().min(1, 'Description is required'),
  likelihood: z.string().min(1, 'Likelihood is required'),
  impact: z.string().min(1, 'Impact is required'),
  group_id: z.string().optional(),
});

export const simpleScenarioFormSchema = baseScenarioSchema.extend({
  scenario_type: z.literal(scenarioTypes.MANUAL),
  company_id: z.string().optional(),
  annual_likelihood: z.number().optional(),
  peer_base_rate: z.number().optional(),
  average_loss: z.number().optional(),
  average_loss_currency: z.string(),
  scenario_category: z.array(z.string()).optional(),
  ai_assets: z.array(z.string()).optional(),
  tactics: z.array(z.string()).optional(),
  event_types: z.array(z.string()).optional(),
  impact_types: z.array(z.string()).optional(),
  impact_distribution: z.object({
    one: z.number().optional(),
    twenty_five: z.number().optional(),
    fifty: z.number().optional(),
    seventy_five: z.number().optional(),
    ninety_nine: z.number().optional(),
  }),
  data_exposure: z
    .object({
      pii: z.number().optional(),
      pci: z.number().optional(),
      phi: z.number().optional(),
    })
    .optional(),
});

export const crqScenarioFormSchema = baseScenarioSchema.extend({
  scenario_type: z.literal(scenarioTypes.CRQ),
  likelihood: z.string().optional().nullable(),
  impact: z.string().optional().nullable(),
  crq_data: z.object({
    company_id: z.string().min(1, 'Modeling Entity is required'),
    fq_id: z.string().optional().nullable(),
    filters: z.object({
      initial_vector_filter: z.array(z.string()).optional().nullable(),
      event_type_filter: z.array(z.string()).optional().nullable(),
      impact_type_filter: z.array(z.string()).optional().nullable(),
      duration_percentiles_filter_min_value: z
        .number()
        .min(0)
        .optional()
        .nullable(),
      duration_percentiles_filter_max_value: z
        .number()
        .min(0)
        .optional()
        .nullable(),
      affected_records_percentiles_filter_min_val: z
        .number()
        .min(0)
        .optional()
        .nullable(),
      affected_records_percentiles_filter_max_val: z
        .number()
        .min(0)
        .optional()
        .nullable(),
      asset_groups_filter: z.array(z.string()).optional().nullable(),
      min_damage_filter: z.number().min(0).optional().nullable(),
      max_damage_filter: z.number().min(0).optional().nullable(),
      min_number_of_records_filter: z.number().min(0).optional().nullable(),
      max_number_of_records_filter: z.number().min(0).optional().nullable(),
      min_duration_filter: z.number().min(0).optional().nullable(),
      max_duration_filter: z.number().min(0).optional().nullable(),
      records_filter_enabled: z.boolean().optional(),
      duration_filter_enabled: z.boolean().optional(),
      damage_filter_enabled: z.boolean().optional(),
    }),
  }),
});

export type BaseScenarioFormValues = z.infer<typeof baseScenarioSchema>;
export type SimpleScenarioFormValues = z.infer<typeof simpleScenarioFormSchema>;
export type CRQScenarioFormValues = z.infer<typeof crqScenarioFormSchema>;

export const LIKELIHOOD_OPTIONS = [
  {
    value: riskRegisterLikelihoods.Expected,
    label: 'select.options.likelihood.expected',
  },
  {
    value: riskRegisterLikelihoods.Likely,
    label: 'select.options.likelihood.likely',
  },
  {
    value: riskRegisterLikelihoods.Possible,
    label: 'select.options.likelihood.possible',
  },
  {
    value: riskRegisterLikelihoods.Unlikely,
    label: 'select.options.likelihood.unlikely',
  },
  {
    value: riskRegisterLikelihoods.Rare,
    label: 'select.options.likelihood.rare',
  },
] as const;

export const IMPACT_OPTIONS = [
  { value: riskRegisterImpacts.Severe, label: 'select.options.impact.severe' },
  {
    value: riskRegisterImpacts.Significant,
    label: 'select.options.impact.significant',
  },
  {
    value: riskRegisterImpacts.Moderate,
    label: 'select.options.impact.moderate',
  },
  { value: riskRegisterImpacts.Minor, label: 'select.options.impact.minor' },
  {
    value: riskRegisterImpacts.Negligible,
    label: 'select.options.impact.negligible',
  },
] as const;
