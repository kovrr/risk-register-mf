import { CostComponent, CostComponents } from 'types/riskDrivers/damageTypes';

export const getTestId = (damageType: CostComponent) =>
  `damage-type-${damageType}`;

export const toCamelCase = (str: string): string => {
  return str
    .toLowerCase()
    .split('_')
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join('');
};

export const getDamageTypeDetails = (
  damageType: string,
  isCustomDamageType: boolean,
  t: (key: string) => string,
) => {
  if (!isCustomDamageType) {
    return {
      title:
        t(`damageTypes.tooltips.${toCamelCase(damageType)}.title`) ||
        damageType,
      info: t(`damageTypes.tooltips.${toCamelCase(damageType)}.description`),
      lossImpactList: CostComponents[damageType.replace(' ', '_')].eventTypes,
    };
  }

  return {
    title: damageType,
    info: undefined,
  };
};
