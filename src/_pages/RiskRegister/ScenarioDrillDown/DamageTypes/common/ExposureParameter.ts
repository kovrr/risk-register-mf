import { InitialAttackVector } from 'types/riskDrivers/attackVectors';
import { CostComponent } from 'types/riskDrivers/damageTypes';
import {
  BasicEventTypes,
  ClickableEventTypes,
} from 'types/riskDrivers/eventTypes';

export type ExposureParameterType<T extends string> = {
  [k in T]?: {
    aal: number;
    targeted_annual_rate: number;
  } & { [key: string]: any };
};

export type EventTypeExposure = ExposureParameterType<
  BasicEventTypes | ClickableEventTypes
>;

export type InitialVectorExposure = ExposureParameterType<InitialAttackVector>;

export type DamageTypesExposure = {
  [key in CostComponent]: number;
};
