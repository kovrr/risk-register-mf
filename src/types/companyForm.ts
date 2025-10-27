import { MinimalInput } from '_pages/ROCI/CompanyCreation/Form/utils/types';
import { IntegrationData, IntegrationTypes } from './integrations/integrations';
import { Hazard, Quantification } from './quantificationData';
import { MultipleSelectType } from '@/types/quantificationForm';
import { SphereForm } from '@/types/sphereForm';

export enum CompanyStatus {
  COMPLETED = 'completed_fq',
  READY_FOR_RUN = 'ready_for_fq',
  IN_PROGRESS = 'running_fq',
  ERROR = 'error',
  DATA_COLLECTION = 'data_collection',
  READY_FOR_DATA_COLLECTION = 'ready_for_data_collection',
}
export interface BusinessProfileForm {
  name: string;
  domains: MultipleSelectType[];
  revenue: number;
  currency: string;
  employees: string;
  certificates?: string[];
}

export interface ZonesOfOperation {
  countries: string[];
  states?: string[];
  industries: string[];
  ot_risk?: boolean;
  use_all_states?: boolean;
}

interface SphereData {
  sphere?: SphereForm;
}

export interface InsuranceForm {
  limit?: number;
  deductible?: number;
  premium?: number;
}

export type UserGeneratedHazard = {
  [key in HazardCollectionType]: string[];
};

export interface NewCompanyForm
  extends BusinessProfileForm,
  ZonesOfOperation,
  SphereData {
  regulations: string[];
  sec_controls_framework: SecControlsType;
  cyber_insurance?: InsuranceForm;
  hazard?: Hazard;
  user_generated_hazard?: UserGeneratedHazard;
}

export interface LastFQ {
  id: string;
  status: 'Running' | 'Success' | 'Failed';
  created_at: string;
  updated_at: string;
  aal?: number;
  include_results_narrative?: boolean;
  results_narrative?: Quantification;
}

export const E2EStatuses = {
  Sent: 'Sent',
  Success: 'Success',
  Failed: 'Failed',
  Running: 'Running',
  Other: 'Other',
  PendingRerun: 'Pending Rerun',
  WaitForContinueRun: 'Wait For Continue Run',
} as const;

export type E2EStatus = (typeof E2EStatuses)[keyof typeof E2EStatuses];

export type LastE2E = {
  id: string;
  status: E2EStatus;
  created_at: string;
  updated_at: string;
  company_minimal_input: MinimalInput;
};

export type HazardCollectionType = 'technologies' | 'providers';
export type HazardItemType = 'technology' | 'provider';
export type SecControlsType = 'CIS' | 'NIST' | 'ASB' | 'ISO27001' | 'CISv8' | 'NIST_CSF_v2';

export type IntegrationsDetails<T extends IntegrationTypes> = {
  hazard: boolean;
  sphere: boolean;
  data?: IntegrationData<T>;
};
export interface Integrations {
  integrations?: { [K in IntegrationTypes]?: IntegrationsDetails<K> };
}

export interface CompanyFormData
  extends ZonesOfOperation,
  BusinessProfileForm,
  Integrations {
  id: string;
  quantification_ids: string[];
  last_quantification?: LastFQ;
  last_e2e_run?: LastE2E;
  hazard?: Hazard;
  status: CompanyStatus;
  user_generated_hazard?: { [key in HazardCollectionType]: string[] };
  is_sphere_valid?: boolean;
  sphere?: SphereForm;
  regulations: string[];
  sec_controls_framework: SecControlsType;
  cyber_insurance: InsuranceForm;
  error_details?: ErrorDetails;
}

export interface CompanyData
  extends Omit<CompanyFormData, 'domains'>,
  Integrations {
  domains: string[];
}
export interface CompanyApiData
  extends Omit<CompanyFormData, 'domains'>,
  Integrations {
  domains: string[];
  tenant_id: string;
}

interface ErrorDetails {
  error_ag_name: string;
  error_field: string;
  error_group: string;
  error_description?: string;
}

export interface CompanyWithError {
  id: string;
  name: string;
  errors: string[];
  has_errors: boolean;
  is_error: true;
}

export type CompanyApiResponseItem = CompanyApiData | CompanyWithError;

export const basicCompanyFields = [
  'id',
  'domains',
  'tenant_id',
  'name',
  'status',
  'created_at',
  'updated_at',
  'integrations',
  'currency',
  'revenue',
  'industries',
  'countries',
  'states',
  'employees',
  'quantification_ids',
  'is_sphere_valid',
  'last_quantification.id',
  'last_quantification.status',
  'last_quantification.created_at',
  'last_quantification.updated_at',
  'last_quantification.aal',
  'last_quantification.include_results_narrative',
];
