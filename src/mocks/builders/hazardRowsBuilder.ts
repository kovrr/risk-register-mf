import { HazardNewRow, Hazard } from 'types/quantificationData';
import { chance } from './buildingUtils';

const PROVIDERS_PRODUCT_TYPES = ['cdn', 'cms', 'crm', 'email_vendor', 'paas'];
const TECHNOLOGIES_PRODUCT_TYPES = [
  'client_app',
  'cms',
  'IoT',
  'mail',
  'remote_access',
  'web',
];

export const hazardRowsBuilder = (): HazardNewRow[] => {
  const companies = ['Oracle', 'MongoDB', 'Linode', 'Salesforce', 'Adobe'];
  return buildHazardRowFromCompanyArray(companies);
};

const buildHazardRowFromCompanyArray = (companies: string[]) => {
  const results: HazardNewRow[] = [];
  companies.forEach((vendor) => {
    for (let i = 0; i < 5; i++) {
      const productType = chance.pickone([
        ...PROVIDERS_PRODUCT_TYPES,
        ...TECHNOLOGIES_PRODUCT_TYPES,
      ]);
      const hazardType = PROVIDERS_PRODUCT_TYPES.includes(productType)
        ? 'technology'
        : 'provider';
      results.push({
        vendor,
        product: `${vendor}-Product-${chance.company()}`,
        product_type: productType,
        hazard_type: hazardType,
      });
    }
  });
  return results;
};

export const buildEmptyHazard = ({
  ...specifics
}: Partial<Hazard> = {}): Hazard => {
  return {
    technologies: {
      client_app: [],
      cms: [],
      db: [],
      dns: [],
      infrastructure: [],
      IoT: [],
      mail: [],
      network_app: [],
      os: [],
      remote_access: [],
      web: [],
      voip: [],
      storage: [],
      security: [],
      printer: [],
      server_app: [],
      camera: [],
      plc_hardware: [],
      analytics: [],
      hmi_hardware: [],
      rtu_hardware: [],
      dcs_hardware: [],
      scada_software: [],
      hmi_software: [],
      ftp: [],
      proxy: [],
      ssl: [],
      ics_software: [],
      wms_hardware: [],
      iacs_hardware: [],
      pam_software: [],
      ied_hardware: [],
      mes_software: [],
    },
    providers: {
      cdn: [],
      cms: [],
      crm: [],
      dns: [],
      email_vendor: [],
      paas: [],
    },
    ...specifics,
  };
};

export const HAZARD_ROWS = hazardRowsBuilder();

export const buildHazardOption = () => {
  const vendor = 'Kovrr-test';
  const productType = chance.pickone([
    ...PROVIDERS_PRODUCT_TYPES,
    ...TECHNOLOGIES_PRODUCT_TYPES,
  ]);
  const hazardType = PROVIDERS_PRODUCT_TYPES.includes(productType)
    ? 'technology'
    : 'provider';
  return {
    vendor,
    product: `${vendor}-Product-${chance.company()}`,
    product_type: productType,
    hazard_type: hazardType,
    is_global: chance.bool(),
  };
};
