export const ImpactTypes = {
  confidentiality_integrity: {
    label: 'Confidentiality & Integrity',
    value: ['confidentiality', 'integrity'],
    name: 'confidentiality_integrity',
  },
  availability: {
    label: 'Availability',
    value: ['availability'],
    name: 'availability',
  },
  extortion: {
    label: 'Extortion',
    value: ['extortion'],
    name: 'extortion',
  },
};

export const ClickableScenarioType = {
  bi: 'bi',
  contingent_bi: 'contingent_bi',
  extortion: 'extortion',
  privacy: 'privacy',
  regulatory: 'regulatory',
  liability: 'liability',
} as const;

export type ClickableScenariosTypes =
  (typeof ClickableScenarioType)[keyof typeof ClickableScenarioType];

const clickableScenarios = Object.keys(ClickableScenarioType);

export type ImpactType = (typeof ImpactTypes)[keyof typeof ImpactTypes];

export const getImpactScenarioForUrl = (
  impactScenario: ClickableScenariosTypes,
) => {
  if (!clickableScenarios.includes(impactScenario)) {
    return undefined;
  }
  return `by-loss-impact-scenario/${ClickableScenarioType[impactScenario]}`;
};
