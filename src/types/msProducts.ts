import { ControlScenario, ControlType } from './security-controls';

export const MSProducts = {
  CSPM: 'CSPM',
  microsoft_defender_for_office_365_plan_1:
    'microsoft_defender_for_office_365_plan_1',
  microsoft_defender_for_office_365_plan_2:
    'microsoft_defender_for_office_365_plan_2',
  microsoft_entra_id_plan_1: 'microsoft_entra_id_plan_1',
  microsoft_intune_plan_1: 'microsoft_intune_plan_1',
  microsoft_defender_for_endpoint_plan_1:
    'microsoft_defender_for_endpoint_plan_1',
  microsoft_defender_firewall: 'microsoft_defender_firewall',
  multi_factor_authentication: 'multi_factor_authentication',
  endpoint_dlp: 'endpoint_dlp',
  microsoft_defender_for_endpoint_plan_2:
    'microsoft_defender_for_endpoint_plan_2',
  microsoft_defender_for_identity: 'microsoft_defender_for_identity',
  microsoft_defender_for_cloud_apps: 'microsoft_defender_for_cloud_apps',
  microsoft_entra_id_plan_2: 'microsoft_entra_id_plan_2',
  privileged_identity_management: 'privileged_identity_management',
} as const;

export type MSProduct = (typeof MSProducts)[keyof typeof MSProducts];

export type ByMSProductScenario = {
  current_status: MSProduct;
  effective_controls?: ControlType[];
} & Omit<ControlScenario, 'current_status'>;

export type ByMSProduct = Record<MSProduct, ByMSProductScenario>;
