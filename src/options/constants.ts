export const CURRENCY_CODES = [
  'USD',
  'EUR',
  // 'AFA',
  // 'ALL',
  // 'DZD',
  // 'AOA',
  // 'ARS',
  // 'AMD',
  // 'AWG',
  'AUD',
  // 'AZN',
  // 'BSD',
  // 'BHD',
  // 'BDT',
  // 'BBD',
  // 'BYR',
  // 'BEF',
  // 'BZD',
  // 'BMD',
  // 'BTN',
  // 'BTC',
  // 'BOB',
  // 'BAM',
  // 'BWP',
  'BRL',
  'GBP',
  // 'BND',
  'BGN',
  // 'BIF',
  // 'KHR',
  'CAD',
  // 'CVE',
  // 'KYD',
  // 'XOF',
  // 'XAF',
  // 'XPF',
  // 'CLP',
  'CNY',
  // 'COP',
  // 'KMF',
  // 'CDF',
  // 'CRC',
  'HRK',
  // 'CUC',
  // 'CZK',
  // 'DKK',
  // 'DJF',
  // 'DOP',
  // 'XCD',
  // 'EGP',
  // 'ERN',
  // 'EEK',
  // 'ETB',
  // 'FKP',
  // 'FJD',
  // 'GMD',
  // 'GEL',
  // 'DEM',
  // 'GHS',
  // 'GIP',
  // 'GRD',
  // 'GTQ',
  // 'GNF',
  // 'GYD',
  // 'HTG',
  // 'HNL',
  // 'HKD',
  'HUF',
  // 'ISK',
  // 'INR',
  'IDR',
  // 'IRR',
  // 'IQD',
  // 'ILS',
  // 'ITL',
  // 'JMD',
  'JPY',
  // 'JOD',
  // 'KZT',
  // 'KES',
  // 'KWD',
  // 'KGS',
  // 'LAK',
  // 'LVL',
  // 'LBP',
  // 'LSL',
  // 'LRD',
  // 'LYD',
  // 'LTL',
  // 'MOP',
  // 'MKD',
  // 'MGA',
  // 'MWK',
  'MYR',
  // 'MVR',
  // 'MRO',
  // 'MUR',
  'MXN',
  // 'MDL',
  // 'MNT',
  // 'MAD',
  // 'MZM',
  // 'MMK',
  // 'NAD',
  // 'NPR',
  // 'ANG',
  // 'TWD',
  // 'NZD',
  // 'NIO',
  // 'NGN',
  // 'KPW',
  // 'NOK',
  // 'OMR',
  // 'PKR',
  // 'PAB',
  // 'PGK',
  // 'PYG',
  // 'PEN',
  'PHP',
  'PLN',
  // 'QAR',
  'RON',
  'RUB',
  // 'RWF',
  // 'SVC',
  // 'WST',
  // 'SAR',
  // 'RSD',
  // 'SCR',
  // 'SLL',
  'SGD',
  // 'SKK',
  // 'SBD',
  // 'SOS',
  // 'ZAR',
  // 'KRW',
  // 'XDR',
  // 'LKR',
  // 'SHP',
  // 'SDG',
  // 'SRD',
  // 'SZL',
  // 'SEK',
  'CHF',
  // 'SYP',
  // 'STD',
  // 'TJS',
  // 'TZS',
  'THB',
  // 'TOP',
  // 'TTD',
  // 'TND',
  'TRY',
  // 'TMT',
  // 'UGX',
  // 'UAH',
  // 'AED',
  // 'UYU',
  // 'UZS',
  // 'VUV',
  // 'VEF',
  // 'VND',
  // 'YER',
  // 'ZMK',
];

export type CurrencyCodeType = (typeof CURRENCY_CODES)[number];

export const EMPLOYEES = [
  '< 10',
  '10 - 50',
  '50 - 100',
  '100 - 500',
  '500 - 1,000',
  '1,000 - 5,000',
  '5,000 - 10,000',
  '10,000 - 50,000',
  '50,000 - 100,000',
  '100,000 +',
];

export const SECURITY_CERTIFICATIONS = [
  {
    label: 'SOC II Type 2',
    value: 'SOC',
  },
  {
    label: 'ISO 27001',
    value: 'ISO',
  },
  {
    label: 'PCI/DSS',
    value: 'PCI_DSS',
  },
  {
    label: 'NIST 800-53',
    value: 'NIST_800',
  },
  {
    label: 'NIST CSF',
    value: 'NIST_CSF',
  },
];

export const REGULATORY_REQUIREMENTS = [
  {
    label: 'U.S. Federal level regulation',
    value: 'USFLR',
  },
  {
    label: 'U.S. State level regulation',
    value: 'USSLR',
  },
  {
    label: 'PCI',
    value: 'PCI',
  },
  {
    label: 'GDPR',
    value: 'GDPR',
  },
  {
    label: 'Other',
    value: 'OTHER',
  },
];

export const MODELED_DAMAGE_TYPES = [
  'lost_income',
  'business_interruption_recovery_expense',
  'lost_income',
  'business_interruption_forensics',
  'bi_recovery_expenses',
  'bi_forensics',
  'data_recovery',
  'extortion_payment',
  'extortion_recovery_expenses',
  'forensics',
  'public_relations_repairment',
  'notifications',
  'settlements',
  'monitoring_services',
  'legal_defense',
  'regulatory_fines',
  'regulatory_legal_defense',
];

export const isModeledDamageType = (damageType: string) => {
  return MODELED_DAMAGE_TYPES.includes(
    damageType.toLowerCase().replace(/ /g, '_'),
  );
};

export const mapSecControlsType: (type: string) => SecControlsFrameworkType = (
  type: string,
) => {
  switch (type) {
    case 'NIST':
      return SecControlsFramework.NIST;
    case 'CIS':
      return SecControlsFramework.CIS;
    case 'ASB':
      return SecControlsFramework.ASB;
    case 'ISO27001':
      return SecControlsFramework.ISO27001;
    case 'CISv8':
      return SecControlsFramework.CISv8;
    case 'NIST_CSF_v2':
      return SecControlsFramework.NIST_CSF_v2;
    default:
      return SecControlsFramework.NIST;
  }
};

export const SecControlsFramework = {
  NIST: 'NIST',
  CIS: 'CIS',
  ASB: 'ASB',
  ISO27001: 'ISO27001',
  CISv8: 'CISv8',
  NIST_CSF_v2: 'NIST_CSF_v2',
} as const;

export type SecControlsFrameworkType =
  (typeof SecControlsFramework)[keyof typeof SecControlsFramework];

export const SEC_CONTROLS_FRAMEWORK_DEFAULT = SecControlsFramework.NIST;
