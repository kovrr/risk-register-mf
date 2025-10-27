import { CisV8SafeguardsImplementation } from 'options/cisV8Controls';
import { ImplementationLevel } from 'types/sphereForm';
import type { ROCIIntegrationType } from './integrations';

export const COMPANY_DATA_KEY = 'company_base_details';
export const MINIMAL_SPHERE_KEY = 'sphere_data';
export const INTEGRATION_SOURCE_KEY = 'integration_source';
export const SECURITY_POSTURE_KEY = 'security_posture';
export const INTEGRATION_CONFIG_KEY = 'integration_config';
export const CONTINUE_RUN_KEY = 'continue_run';
export const CIS_V8_CONTROLS_KEY = 'cis_v8_implementation_level';

export const ControlScopes = {
  CONTROL: 'control',
  THEME: 'theme',
  MATURITY: 'maturity',
} as const;

export type ControlScope = (typeof ControlScopes)[keyof typeof ControlScopes];

type Option<T> = { label: string; value: T };
export type StringOption = Option<string>;

export type ROCICompanyForm = {
  name: string;
  domains: string;
  industries: StringOption[];
  countries: StringOption[];
  currency: StringOption;
  revenue: string;
  employees: StringOption;
};

export type ROCISphereData = {
  total_personal_data_records: number;
  cloud_infra_ratio: number;
  outage_duration: number;
  average_time_to_recover_for_outage: number;
  average_time_to_recover_for_outage_cloud?: number;
  outage_duration_cloud?: number;
  manual_cloud_providers?: StringOption[];
};

export type ROCISecurityPosture = {
  scope: Option<ControlScope>;
  controls: {
    [CIS_V8_CONTROLS_KEY]: {
      by_control: ImplementationLevel;
      by_theme: ImplementationLevel;
      by_maturity: CisV8SafeguardsImplementation;
    };
  };
  controls_cloud?: {
    [CIS_V8_CONTROLS_KEY]: {
      by_control: ImplementationLevel;
      by_theme: ImplementationLevel;
      by_maturity: CisV8SafeguardsImplementation;
    };
  };
};

export type AlloyIntegrationDetails = {
  provider: ROCIIntegrationType;
  client_id: string;
  client_secret: string;
  site_id: string;
  domain: string;
};

export type ROCIIntegrationConfig = {
  name: ROCIIntegrationType;
  is_validated: boolean;
  integration_details: AlloyIntegrationDetails;
};

export type ContinueRunUpdateConfig = {
  continue_run: boolean;
  integration_config?: ROCIIntegrationConfig;
};

export type ROCICompanyCreationFormData = {
  [COMPANY_DATA_KEY]: ROCICompanyForm;
  [MINIMAL_SPHERE_KEY]: ROCISphereData;
  [INTEGRATION_SOURCE_KEY]: ROCIIntegrationType[];
  [SECURITY_POSTURE_KEY]: ROCISecurityPosture;
  [INTEGRATION_CONFIG_KEY]?: ROCIIntegrationConfig;
};

export type ROCICompanyApiData = Omit<
  ROCICompanyForm,
  'domains' | 'employees' | 'industries' | 'currency' | 'countries'
> & {
  domains: string[];
  industries: string[];
  countries: string[];
  currency: string;
  employees: string;
};

export type ROCISecurityPostureApiData = Omit<ROCISecurityPosture, 'scope'> & {
  scope: ControlScope;
};

export type ROCISphereApiData = Omit<
  ROCISphereData,
  'manual_cloud_providers'
> & {
  [SECURITY_POSTURE_KEY]: ROCISecurityPostureApiData;
  manual_cloud_providers?: string[];
};

export type MinimalInput = {
  [COMPANY_DATA_KEY]: ROCICompanyApiData;
  [MINIMAL_SPHERE_KEY]: ROCISphereApiData;
};

export type ROCICompanyCreationDataForSubmit = {
  company_minimal_input: MinimalInput;
  [INTEGRATION_CONFIG_KEY]?: ROCIIntegrationConfig;
  [CONTINUE_RUN_KEY]: boolean;
  company_id?: string | null;
};
