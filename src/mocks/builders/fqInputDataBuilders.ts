// @ts-nocheck
import { Chance } from 'chance';
import { VendorData } from 'types/sphereForm';
import { CIS_ABBR_NAMES } from '../../options/cisControls';
import {
  CyberInsuranceForm,
  DataRecordsForm,
  ECISControl,
  NewQuantificationForm,
  PastEventsRow,
  RegulationForm,
  RelianceOnNetworkForm,
} from '../../types/quantificationForm';

export const buildNewQuantificationForm = ({
  ...specifics
}: Partial<NewQuantificationForm> = {}): NewQuantificationForm => {
  return {
    dataRecords: buildDataRecordsForm(),
    regulation: buildRegulationForm(),
    relianceOnNetwork: buildRelianceOnNetworkForm(),
    cyberInsurance: buildCyberInsuranceForm(),
    pastEvents: [buildPastEventsRow()],
    ...specifics,
  };
};

export const buildDataRecordsForm = ({
  ...specifics
}: Partial<DataRecordsForm> = {}): DataRecordsForm => {
  return {
    pii: Chance().string(),
    pci: Chance().string(),
    phi: Chance().string(),
    otherTypes: Chance().string(),
    storedTogether: Chance().integer(),
    ...specifics,
  };
};

export const buildRegulationForm = ({
  ...specifics
}: Partial<RegulationForm> = {}): RegulationForm => {
  return {
    securityCertifications: [Chance().string()],
    securityMechanisms: CIS_ABBR_NAMES.reduce((acc: any, cur) => {
      acc[cur] = ECISControl.UNKNOWN;
      return acc;
    }, {}),
    regulatoryRequirements: [Chance().string()],
    ...specifics,
  };
};

export const buildRelianceOnNetworkForm = ({
  ...specifics
}: Partial<RelianceOnNetworkForm> = {}): RelianceOnNetworkForm => {
  return {
    restoreHours: Chance().integer(),
    productivityPercentage: Chance().integer(),
    incomePercentage: Chance().integer(),
    outageDuration: Chance().integer(),
    endpoints: Chance().integer(),
    ...specifics,
  };
};

export const buildCyberInsuranceForm = ({
  ...specifics
}: Partial<CyberInsuranceForm> = {}): CyberInsuranceForm => {
  return {
    deductible: Chance().integer(),
    limit: Chance().integer(),
    attachmentPoint: Chance().integer(),
    premium: Chance().integer(),
    ...specifics,
  };
};

export const buildPastEventsRow = ({
  ...specifics
}: Partial<PastEventsRow> = {}): PastEventsRow => {
  return {
    damageType: Chance().string(),
    financialLoss: Chance().integer(),
    details: Chance().string(),
    date: Chance().string(),
    ...specifics,
  };
};

export const buildVendorData = ({
  ...specifics
}: Partial<VendorData> = {}): VendorData => {
  return {
    ...specifics,
    security_scores: {
      bitsight_security_rating: null,
      security_scorecard_security_rating: null,
      panorays_security_rating: Chance().integer({ min: 0, max: 100 }),
    },
    postures: {
      panorays_posture: {
        id: '5d878d27234bda7861d04e5c',
        grade: Chance().integer({ min: 0, max: 100 }),
        categories: [
          {
            name: 'human',
            text: 'Human',
            grade: Chance().integer({ min: 0, max: 100 }),
            sub_categories: [
              {
                name: 'employee',
                text: 'Employee Attack Surface',
                grade: Chance().integer({ min: 0, max: 100 }),
              },
              {
                name: 'security_team',
                text: 'Security Team',
                grade: Chance().integer({ min: 0, max: 100 }),
              },
              {
                name: 'social_posture',
                text: 'Social Posture',
                grade: -1,
              },
              {
                name: 'dynamics',
                text: 'Responsiveness',
                grade: Chance().integer({ min: 0, max: 100 }),
              },
            ],
          },
          {
            name: 'application',
            text: 'Application',
            grade: Chance().integer({ min: 0, max: 100 }),
            sub_categories: [
              {
                name: 'techs',
                text: 'Technologies',
                grade: Chance().integer({ min: 0, max: 100 }),
              },
              {
                name: 'application_security',
                text: 'Application Security',
                grade: Chance().integer({ min: 0, max: 100 }),
              },
              {
                name: 'domain_attacks',
                text: 'Domain Attacks',
                grade: Chance().integer({ min: 0, max: 100 }),
              },
              {
                name: 'exposed_services',
                text: 'Exposed Services',
                grade: Chance().integer({ min: 0, max: 100 }),
              },
            ],
          },
          {
            name: 'it',
            text: 'Network and IT',
            grade: Chance().integer({ min: 0, max: 100 }),
            sub_categories: [
              {
                name: 'dns',
                text: 'DNS',
                grade: Chance().integer({ min: 0, max: 100 }),
              },
              {
                name: 'mail_server',
                text: 'Mail Server',
                grade: Chance().integer({ min: 0, max: 100 }),
              },
              {
                name: 'asset_reputation',
                text: 'Asset Reputation',
                grade: Chance().integer({ min: 0, max: 100 }),
              },
              {
                name: 'web_server',
                text: 'Web Server',
                grade: Chance().integer({ min: 0, max: 100 }),
              },
              {
                name: 'tls',
                text: 'TLS',
                grade: Chance().integer({ min: 0, max: 100 }),
              },
              {
                name: 'cloud',
                text: 'Cloud',
                grade: Chance().integer({ min: 0, max: 100 }),
              },
              {
                name: 'endpoint',
                text: 'Endpoint',
                grade: Chance().integer({ min: 0, max: 100 }),
              },
            ],
          },
        ],
      },
    },
    ids: {
      panorays_id: '5d878d27234bda7861d04e5c',
    },
  };
};
