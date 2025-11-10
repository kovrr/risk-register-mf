// @ts-nocheck
import { TopSimulationStats } from 'types/quantificationData';
import { chance } from './buildingUtils';
import { generatePercentiles } from './quantificationBuilders';

export const buildTopSimulationStats = (
  overrides: Partial<TopSimulationStats> = {}
): TopSimulationStats => {
  return {
    num_of_records_affected: {
      avg: chance.integer({ min: 1000000, max: 10000000 }),
      std: chance.integer({ min: 1000000, max: 10000000 }),
      median: chance.integer({ min: 1000000, max: 100000000 }),
      percentiles: generatePercentiles(),
    },
    event_duration: {
      avg: chance.integer({ min: 10, max: 1000 }),
      std: chance.integer({ min: 10, max: 10000 }),
      median: chance.integer({ min: 0, max: 1000 }),
      percentiles: generatePercentiles(),
    },
    event_loss: {
      avg: chance.integer({ min: 1000000, max: 10000000 }),
      std: chance.integer({ min: 1000000, max: 10000000 }),
      median: chance.integer({ min: 1000000, max: 100000000 }),
      percentiles: generatePercentiles(),
    },
    ...overrides,
  };
};
