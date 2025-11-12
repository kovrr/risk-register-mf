// @ts-nocheck
import type {
  ByEventTypeExposureMetrics,
  ByScenarioExposureMetrics,
  ChangeLog,
  ChangeLogEntry,
  Changes,
  DetailedChange,
  FQMetrics,
  RiskScenariosMetrics,
} from '@/types/pastRuns';
import { Scenario } from 'types/quantificationData';
import { BasicEventType, type EventTypes } from 'types/riskDrivers/eventTypes';
import { chance } from './buildingUtils';

const modelVersions = [
  'v2023.1.123',
  'v2023.2.234',
  'v2023.3.34534',
  'v2022.9.2342',
  'v2022.8.234',
];

const buildDetailedChanges = (
  detailedChanged: Partial<DetailedChange> = {},
): DetailedChange => {
  return {
    op: chance.pickone(['add', 'remove', 'replace']),
    path: chance.string(),
    value: chance.string(),
    previousValue: chance.string(),
    ...detailedChanged,
  };
};

const buildChanges = (changes: Partial<Changes> = {}): Changes => {
  return {
    company: {
      total_changes: chance.integer({ min: 0, max: 10 }),
      actual_changes: Array.from(
        { length: chance.integer({ min: 0, max: 10 }) },
        () => buildDetailedChanges(),
      ),
      custom_changes: ['custom change 1', 'custom change 2'],
      ...changes?.company,
    },
    asset_groups: {
      creations: chance.integer({ min: 0, max: 10 }),
      deletions: chance.integer({ min: 0, max: 10 }),
      modifications: chance.integer({ min: 0, max: 10 }),
      modified_asset_groups: chance.integer({ min: 0, max: 10 }),
      total_changes: chance.integer({ min: 0, max: 10 }),
      actual_changes: Array.from(
        { length: chance.integer({ min: 0, max: 10 }) },
        () => buildDetailedChanges(),
      ),
      custom_changes: [],
      ...changes?.asset_groups,
    },
    security_profiles: {
      control_changes: chance.integer({ min: 0, max: 10 }),
      other_changes: chance.integer({ min: 0, max: 10 }),
      total_affected_asset_groups: chance.integer({ min: 0, max: 10 }),
      total_changed_security_profiles: chance.integer({ min: 0, max: 10 }),
      total_changes: chance.integer({ min: 0, max: 10 }),
      actual_changes: Array.from(
        { length: chance.integer({ min: 0, max: 10 }) },
        () => buildDetailedChanges(),
      ),
      changes_unavailable: chance.bool({ likelihood: 20 }),
      custom_changes: ['custom change 1', 'custom change 2'],
      ...changes?.security_profiles,
    },
    damage_types: {
      total_affected_asset_groups: chance.integer({ min: 0, max: 10 }),
      total_changes: chance.integer({ min: 0, max: 10 }),
      total_changed_damage_types: chance.integer({ min: 0, max: 10 }),
      actual_changes: Array.from(
        { length: chance.integer({ min: 0, max: 10 }) },
        () => buildDetailedChanges(),
      ),
      changes_unavailable: chance.bool({ likelihood: 20 }),
      custom_changes: [],
      ...changes?.damage_types,
    },
  };
};

const buildRiskScenarios = ({
  ...overrides
}: Partial<RiskScenariosMetrics>) => {
  return {
    BASELINE: {
      aal_damage: chance.integer({ min: 0, max: 1 * 1e10 }),
      pml_damage: chance.integer({ min: 0, max: 5 * 1e10 }),
      ...overrides?.BASELINE,
    },
    MINIMAL: {
      aal_damage: chance.integer({ min: 0, max: 1 * 1e10 }),
      pml_damage: chance.integer({ min: 0, max: 5 * 1e10 }),
      ...overrides?.MINIMAL,
    },
  };
};

const buildByScenarioExposureMetrics = ({
  ...overrides
}: Partial<ByScenarioExposureMetrics>) => {
  return Object.fromEntries(
    [
      Scenario.BI,
      Scenario.CONTINGENT_BI,
      Scenario.EXTORTION,
      Scenario.LIABILITY,
      Scenario.PRIVACY,
      Scenario.REGULATORY,
    ].map((scenario) => [
      scenario,
      {
        aal: chance.integer({ min: 0, max: 1 * 1e10 }),
        high_exposure_loss: chance.integer({ min: 0, max: 5 * 1e10 }),
        ...(overrides?.[scenario] || {}),
      },
    ]),
  ) as ByScenarioExposureMetrics;
};

const buildByEventTypeExposure = ({
  ...override
}: Partial<ByEventTypeExposureMetrics>): ByEventTypeExposureMetrics => {
  return Object.fromEntries(
    Object.values(BasicEventType).map((eventType) => [
      eventType,
      {
        aal: chance.integer({ min: 0, max: 1 * 1e10 }),
        high_exposure_loss: chance.integer({ min: 0, max: 1 * 1e10 }),
        ...(override?.[eventType as EventTypes] || {}),
      },
    ]),
  ) as ByEventTypeExposureMetrics;
};

const buildRunMetrics = ({
  ...overrides
}: Partial<FQMetrics> = {}): FQMetrics => {
  return {
    id: chance.guid(),
    model_version: chance.pickone(modelVersions),
    simulation_exposure: {
      aal: chance.integer({ min: 0, max: 1 * 1e10 }),
      high_exposure_loss: chance.integer({ min: 0, max: 1 * 1e10 }),
    },
    risk_scenarios: buildRiskScenarios({ ...overrides?.risk_scenarios }),
    by_scenario_exposure: buildByScenarioExposureMetrics({
      ...overrides?.by_scenario_exposure,
    }),
    by_event_type_exposure: buildByEventTypeExposure({
      ...overrides?.by_event_type_exposure,
    }),
    ...overrides,
  };
};

export const buildChangeLog = (numberOfFqs: number): ChangeLog => {
  const changeLogEntries = Array.from({ length: numberOfFqs }, (_, index) => {
    const currentRun = buildRunMetrics();
    const previousRun = buildRunMetrics();
    return index !== numberOfFqs - 1
      ? ({
        date: chance.date(),
        changes: buildChanges(),
        current_run: currentRun,
        previous_run: previousRun,
      } as ChangeLogEntry)
      : ({
        date: chance.date(),
        current_run: currentRun,
      } as ChangeLogEntry);
  });
  return {
    total: numberOfFqs,
    size: numberOfFqs,
    page: 1,
    items: changeLogEntries,
  };
};
