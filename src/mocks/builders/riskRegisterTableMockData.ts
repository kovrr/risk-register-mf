// @ts-nocheck
import { CURRENCY_CODES } from '@/options/constants';
import {
  RiskRegisterImpact,
  riskRegisterImpacts,
  RiskRegisterLikelihood,
  riskRegisterLikelihoods,
  RiskRegisterPriority,
  riskRegisterPriorities,
  RiskRegisterResponsePlan,
  riskRegisterResponsePlans,
  RiskRegisterRow,
  scenarioTypes,
  scenarioStatus,
} from '@/types/riskRegister';
import { chance } from 'mocks/builders/buildingUtils';

const buildScenarioRow = (
  overrides?: Partial<RiskRegisterRow>,
): RiskRegisterRow => ({
  id: chance.guid(),
  customerScenarioId: chance.guid(),
  scenarioTitle: `${chance.word()} ${chance.word()} ${chance.word()}`,
  scenarioDescription: chance.sentence(),
  likelihood: chance.pickone(
    Object.keys(riskRegisterLikelihoods) as RiskRegisterLikelihood[],
  ),
  impact: chance.pickone(
    Object.keys(riskRegisterImpacts) as RiskRegisterImpact[],
  ),
  annualLikelihood: chance.natural({ min: 1, max: 100 }),
  averageLoss: chance.natural({ min: 1000, max: 10_000_000 }),
  averageLossCurrency: chance.pickone(CURRENCY_CODES),
  priority: chance.pickone(
    Object.keys(riskRegisterPriorities) as RiskRegisterPriority[],
  ),
  responsePlan: chance.pickone(
    Object.keys(riskRegisterResponsePlans) as RiskRegisterResponsePlan[],
  ),
  owner: chance.word(),
  lastUpdated: chance.date().toDateString(),
  scenario: null,
  tableOptions: null,
  scenarioId: chance.guid(),
  version: chance.integer({ min: 1, max: 10 }),
  scenarioType: scenarioTypes.MANUAL,
  status: chance.pickone(Object.values(scenarioStatus)),
  ...overrides,
});

export const riskRegisterMockTableData: RiskRegisterRow[] = Array.from({
  length: chance.integer({ min: 1, max: 10 }),
}).map(() => buildScenarioRow());
