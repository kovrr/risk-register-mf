import { api } from '@/lib/api-client';

export type ScenarioFieldEnumsResponse = {
  AIAsset: string[];
  ScenarioCategory: string[];
  ScenarioTactic: string[];
  ScenarioEventType: string[];
  ScenarioImpactType: string[];
  Likelihood: string[];
  Impact: string[];
  RiskPriority: string[];
  ResponsePlan: string[];
};

export async function fetchScenarioFieldEnums(): Promise<ScenarioFieldEnumsResponse> {
  const { data } = await api.get('/risk-register/scenarios/enums');
  return data;
}
