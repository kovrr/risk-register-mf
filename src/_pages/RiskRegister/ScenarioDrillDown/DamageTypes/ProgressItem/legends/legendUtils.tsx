export const LEGEND_DESCRIPTIONS = {
  attritional: 'riskDrivers.eventTypes.legend.attritionalLosses',
} as const;

export type LegendDescriptionKey = keyof typeof LEGEND_DESCRIPTIONS;

export const isLegendDescriptionKey = (
  label: any,
): label is LegendDescriptionKey => {
  return typeof label === 'string' && label in LEGEND_DESCRIPTIONS;
};
