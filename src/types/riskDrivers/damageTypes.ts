export const CostComponents: Record<
  string,
  {
    label: string;
    eventTypes: readonly string[];
  }
> = {
  lost_income: {
    label: 'lost income',
    eventTypes: [
      'Business Interruption',
      'Third Party Service Provider Failure',
    ],
  },
  bi_recovery_expenses: {
    label: 'bi recovery expenses',
    eventTypes: [
      'Business Interruption',
      'Third Party Service Provider Failure',
    ],
  },
  extortion_recovery_expenses: {
    label: 'extortion recovery expenses',
    eventTypes: ['Ransomware & Extortion'],
  },
  bi_forensics: {
    label: 'bi forensics',
    eventTypes: ['Business Interruption'],
  },
  data_related_forensics: {
    label: 'data related forensics',
    eventTypes: ['Data Theft & Privacy'],
  },
  public_relations_repairment: {
    label: 'public relations repairment',
    eventTypes: [
      'Business Interruption',
      'Third Party Service Provider Failure',
    ],
  },
  monitoring_services: {
    label: 'monitoring services',
    eventTypes: ['Data Theft & Privacy'],
  },
  notifications: {
    label: 'notifications',
    eventTypes: ['Data Theft & Privacy'],
  },
  data_recovery: {
    label: 'data recovery',
    eventTypes: ['Data Theft & Privacy'],
  },
  regulatory_fines: {
    label: 'regulatory fines',
    eventTypes: ['Third Party Liability'],
  },
  regulatory_legal_defense: {
    label: 'regulatory legal defense',
    eventTypes: ['Third Party Liability'],
  },
  extortion_payment: {
    label: 'extortion payment',
    eventTypes: ['Ransomware & Extortion'],
  },
  settlements: {
    label: 'settlements',
    eventTypes: ['Third Party Liability'],
  },
  legal_defense: {
    label: 'legal defense',
    eventTypes: ['Third Party Liability'],
  },
  attritional_damage_bi: {
    label: 'attritional damage bi',
    eventTypes: [
      'Business Interruption',
      'Third Party Service Provider Failure',
      'Data Theft & Privacy',
      'Third Party Liability',
      'Regulation & Compliance',
      'Ransomware & Extortion',
    ],
  },
  attritional_damage_contingent_bi: {
    label: 'attritional damage contingent bi',
    eventTypes: [
      'Business Interruption',
      'Third Party Service Provider Failure',
      'Data Theft & Privacy',
      'Third Party Liability',
      'Regulation & Compliance',
      'Ransomware & Extortion',
    ],
  },
  attritional_damage_privacy: {
    label: 'attritional damage privacy',
    eventTypes: [
      'Business Interruption',
      'Third Party Service Provider Failure',
      'Data Theft & Privacy',
      'Third Party Liability',
      'Regulation & Compliance',
      'Ransomware & Extortion',
    ],
  },
  attritional_damage_liability: {
    label: 'attritional damage liability',
    eventTypes: [
      'Business Interruption',
      'Third Party Service Provider Failure',
      'Data Theft & Privacy',
      'Third Party Liability',
      'Regulation & Compliance',
      'Ransomware & Extortion',
    ],
  },
  attritional_damage_regulatory: {
    label: 'attritional damage regulatory',
    eventTypes: [
      'Business Interruption',
      'Third Party Service Provider Failure',
      'Data Theft & Privacy',
      'Third Party Liability',
      'Regulation & Compliance',
      'Ransomware & Extortion',
    ],
  },
  attritional_damage_extortion: {
    label: 'attritional damage extortion',
    eventTypes: [
      'Business Interruption',
      'Third Party Service Provider Failure',
      'Data Theft & Privacy',
      'Third Party Liability',
      'Regulation & Compliance',
      'Ransomware & Extortion',
    ],
  },
  attritional: {
    label: 'attritional',
    eventTypes: [
      'Business Interruption',
      'Third Party Service Provider Failure',
      'Data Theft & Privacy',
      'Third Party Liability',
      'Regulation & Compliance',
      'Ransomware & Extortion',
    ],
  },
} as const;

export type CostComponent = keyof typeof CostComponents;

export const DamageTypesAsStringArray = Object.values(CostComponents).map(
  (component) => component.label,
);

export interface RiskDriverDamageTypesProps {
  inDrawer: boolean;
  aal?: number;
}

export const impactToLabels = {
  liability: 'Third Party Liability',
  regulatory: 'Regulation & Compliance',
  privacy: 'Data Theft & Privacy',
  extortion: 'Ransomware & Extortion',
  bi: 'Business Interruption',
  contingent_bi: 'Third Party Service Provider Failure',
};
