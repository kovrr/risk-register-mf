export interface FeatureToggle {
  name: string;
  value: boolean;
}

export interface TenantData {
  id: string;
  name: string;
  feature_toggles: FeatureToggle[];
}
