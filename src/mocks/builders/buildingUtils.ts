import { Chance } from 'chance';

export const chance = Chance();
export const fracionValue = () => chance.floating({ min: 0, max: 1, fixed: 4 });
