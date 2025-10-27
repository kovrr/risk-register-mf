export type CurrencyCode =
  | 'USD'
  | 'EUR'
  | 'CRC'
  | 'GBP'
  | 'ILS'
  | 'INR'
  | 'JPY'
  | 'KRW'
  | 'NGN'
  | 'PHP'
  | 'PLN'
  | 'PYG'
  | 'THB'
  | 'UAH'
  | 'VND'
  | 'TRY'
  | 'ZAR'
  | 'CHF'
  | 'CAD'
  | 'RUB'
  | 'SEK'
  | 'SGD'
  | 'AUD'
  | 'BGN'
  | 'BRL'
  | 'CNY'
  | 'DKK'
  | 'HKD'
  | 'HRK'
  | 'HUF'
  | 'IDR'
  | 'ISK'
  | 'MXN'
  | 'MYR'
  | 'NOK'
  | 'NZD'
  | 'ROL'
  | 'RON';

export const convertCurrencyLettersToSign = (
  currencyInLetters: CurrencyCode
): string => {
  const conversionMap: { [key in CurrencyCode]: string } = {
    USD: '$',
    EUR: '€',
    CRC: '₡',
    GBP: '£',
    ILS: '₪',
    INR: '₹',
    JPY: '¥',
    KRW: '₩',
    NGN: '₦',
    PHP: '₱',
    PLN: 'zł',
    PYG: '₲',
    THB: '฿',
    UAH: '₴',
    VND: '₫',
    TRY: '₺',
    ZAR: 'R',
    CHF: 'CHF',
    CAD: '$',
    RUB: '₽',
    SEK: 'kr',
    SGD: '$',
    AUD: '$',
    BGN: 'лв',
    BRL: 'R$',
    CNY: '¥',
    DKK: 'kr',
    HKD: '$',
    HRK: 'kn',
    HUF: 'Ft',
    IDR: 'Rp',
    ISK: 'kr',
    MXN: '$',
    MYR: 'RM',
    NOK: 'kr',
    NZD: '$',
    ROL: 'lei',
    RON: 'lei',
  };

  return conversionMap[currencyInLetters] || '';
};

export const ccToNameConvertor: { [key: string]: string } = {
  bi: 'Business Interruption',
  contingent_bi: 'Third Party Service Provider Failure',
  extortion: 'Ransomware & Extortion',
  liability: 'Third Party Liability',
  privacy: 'Data Theft & Privacy',
  regulatory: 'Regulation & Compliance',
  bi_forensics: 'Business Interruption Forensics',
  bi_recovery_expenses: 'Business Interruption Recovery Expenses',
  lost_income: 'Lost Income',
  public_relations_repairment: 'Public Relations Repairment',
  extortion_payment: 'Extortion Payment',
  extortion_recovery_expenses: 'Extortion Recovery Expenses',
  data_recovery: 'Data Recovery',
  regulatory_fines: 'Regulatory Fines',
};

export const eventNameToTitle: { [key: string]: string } = {
  provider: 'Systemic Service Provider',
  tech: 'Systemic Tech Provider',
  targeted: 'Targeted Events',
  attritional: 'Attritional Events',
};
