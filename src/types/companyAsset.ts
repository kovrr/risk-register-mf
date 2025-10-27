export interface CompanyAsset {
  id: string;
  name: string;
  tags: string[];
  criticality?: 'low' | 'medium' | 'high';
  asset_group_type: string; // should be cloud / infrastructure / endpoint
  group_name: string;
  operating_system: string;
  technologies: string[];
  integration: string;
  cis_score?: number;
  risk_score?: number;
}
