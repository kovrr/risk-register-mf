// @ts-nocheck
// @ts-nocheck
import {
  buildNewPastRunResult,
  buildPastRunResult,
} from 'mocks/builders/quantificationBuilders';
import {
  cisResultsFQNewSchema,
  cisV8ResultsFQNewSchema,
  iso27001ResultsFQNewSchema,
  mockCisInputData,
  nistResultsFQNewSchema,
} from './fqResults';
import { QuantificationStatus } from 'types/quantificationData';

export const pastRunsOld = {
  items: [
    {
      id: '399b70f3f-eafe-4111-ad2d-72a38a2fd8e7',
      status: QuantificationStatus.Success,
      created_at: '2022-03-20T15:20:01.360590',
      updated_at: '2022-06-19T15:41:44.157308',
      period: 'Q1 2022',
      result: {
        overall_exposure: {
          highlights: {
            minimum: 100,
            medium: 100,
            maximum: 52581500,
          },
        },
        by_scenario_exposure: {
          contingent_bi: {
            highlights: {
              minimum: 6900,
              medium: 934455,
              maximum: 482700,
            },
            scenario_impact: 0.011462831148140383,
            probability: 0.01,
            type_distribution: {
              attacks: 0,
              failures: 1,
            },
            scale_distribution: {
              specific: 0,
              systemic: 1,
            },
            damage_types: [
              'bi_recovery_expenses',
              'public_relations_repairment',
              'lost_income',
            ],
          },
          privacy: {
            highlights: {
              minimum: 8000,
              medium: 8000.0,
              maximum: 28453500,
            },
            scenario_impact: 0.44293629713834987,
            probability: 0.01,
            type_distribution: {
              attacks: 0.9026765467188094,
              failures: 0.09732345328119063,
            },
            scale_distribution: {
              specific: 0.6852365077384304,
              systemic: 0.31476349226156963,
            },
            damage_types: [
              'monitoring_services',
              'data_recovery',
              'forensics',
              'public_relations_repairment',
              'notifications',
            ],
          },
          liability: {
            highlights: {
              minimum: 8100,
              medium: 468055,
              maximum: 23203500,
            },
            scenario_impact: 0.35955645921935153,
            probability: 0.01,
            type_distribution: {
              attacks: 0.8704647890678902,
              failures: 0.12953521093210985,
            },
            scale_distribution: {
              specific: 0.6885694554258632,
              systemic: 0.31143054457413677,
            },
            damage_types: ['legal_defense', 'settlements'],
          },
          bi: {
            highlights: {
              minimum: 23600,
              medium: 644400.0,
              maximum: 5177800,
            },
            scenario_impact: 0.08285742641141712,
            probability: 0.01,
            type_distribution: {
              attacks: 1,
              failures: 0,
            },
            scale_distribution: {
              specific: 0.6968127747986999,
              systemic: 0.30318722520130015,
            },
            damage_types: [
              'bi_recovery_expenses',
              'bi_forensics',
              'public_relations_repairment',
              'lost_income',
            ],
          },
          regulatory: {
            highlights: {
              minimum: 8100,
              medium: 379400.0,
              maximum: 248900,
            },
            scenario_impact: 0.00853978005028824,
            probability: 0.01,
            type_distribution: {
              attacks: 0.8770231247825631,
              failures: 0.12297687521743694,
            },
            scale_distribution: {
              specific: 0.7864377210904413,
              systemic: 0.2135622789095587,
            },
            damage_types: ['regulatory_legal_defense', 'regulatory_fines'],
          },
          extortion: {
            highlights: {
              minimum: 8300,
              medium: 479900.0,
              maximum: 5678100,
            },
            scenario_impact: 0.0946471744326472,
            probability: 0.01,
            type_distribution: {
              attacks: 1,
              failures: 0,
            },
            scale_distribution: {
              specific: 0.7360146583146413,
              systemic: 0.2639853416853587,
            },
            damage_types: ['extortion_recovery_expenses', 'extortion_payment'],
          },
        },
      },
      model_version: 'v0.0.0',
    },
    {
      id: '685ae1e0-2b50-46d7-8078-7f4a02531d80',
      status: QuantificationStatus.Success,
      created_at: '2022-05-20T15:20:01.360590',
      updated_at: '2022-05-20T15:41:44.157308',
      period: 'Q1 2022',
      result: {
        overall_exposure: {
          highlights: {
            minimum: 97800,
            medium: 90,
            maximum: 52581500,
          },
        },
        by_scenario_exposure: {
          contingent_bi: {
            highlights: {
              minimum: 6900,
              medium: 115,
              maximum: 482700,
            },
            scenario_impact: 0.011462831148140383,
            probability: 0.01,
            type_distribution: {
              attacks: 0,
              failures: 1,
            },
            scale_distribution: {
              specific: 0,
              systemic: 1,
            },
            damage_types: [
              'bi_recovery_expenses',
              'public_relations_repairment',
              'lost_income',
            ],
          },
          privacy: {
            highlights: {
              minimum: 8000,
              medium: 1518000.0,
              maximum: 28453500,
            },
            scenario_impact: 0.44293629713834987,
            probability: 0.01,
            type_distribution: {
              attacks: 0.9026765467188094,
              failures: 0.09732345328119063,
            },
            scale_distribution: {
              specific: 0.6852365077384304,
              systemic: 0.31476349226156963,
            },
            damage_types: [
              'monitoring_services',
              'data_recovery',
              'forensics',
              'public_relations_repairment',
              'notifications',
            ],
          },
          liability: {
            highlights: {
              minimum: 8100,
              medium: 1232300.0,
              maximum: 23203500,
            },
            scenario_impact: 0.35955645921935153,
            probability: 0.01,
            type_distribution: {
              attacks: 0.8704647890678902,
              failures: 0.12953521093210985,
            },
            scale_distribution: {
              specific: 0.6885694554258632,
              systemic: 0.31143054457413677,
            },
            damage_types: ['legal_defense', 'settlements'],
          },
          bi: {
            highlights: {
              minimum: 23600,
              medium: 284000.0,
              maximum: 5177800,
            },
            scenario_impact: 0.08285742641141712,
            probability: 0.01,
            type_distribution: {
              attacks: 1,
              failures: 0,
            },
            scale_distribution: {
              specific: 0.6968127747986999,
              systemic: 0.30318722520130015,
            },
            damage_types: [
              'bi_recovery_expenses',
              'bi_forensics',
              'public_relations_repairment',
              'lost_income',
            ],
          },
          regulatory: {
            highlights: {
              minimum: 8100,
              medium: 29300.0,
              maximum: 248900,
            },
            scenario_impact: 0.00853978005028824,
            probability: 0.01,
            type_distribution: {
              attacks: 0.8770231247825631,
              failures: 0.12297687521743694,
            },
            scale_distribution: {
              specific: 0.7864377210904413,
              systemic: 0.2135622789095587,
            },
            damage_types: ['regulatory_legal_defense', 'regulatory_fines'],
          },
          extortion: {
            highlights: {
              minimum: 8300,
              medium: 324400.0,
              maximum: 5678100,
            },
            scenario_impact: 0.0946471744326472,
            probability: 0.01,
            type_distribution: {
              attacks: 1,
              failures: 0,
            },
            scale_distribution: {
              specific: 0.7360146583146413,
              systemic: 0.2639853416853587,
            },
            damage_types: ['extortion_recovery_expenses', 'extortion_payment'],
          },
        },
      },
      model_version: 'v1.0.0',
    },
    {
      id: '299b70f3f-eafe-4111-ad2d-72a38a2fd8e7',
      status: QuantificationStatus.Success,
      created_at: '2022-08-21T15:20:01.360590',
      updated_at: '2022-05-20T16:41:44.157308',
      period: 'Q1 2022',
      result: {
        overall_exposure: {
          highlights: {
            minimum: 97800,
            medium: 165,
            maximum: 52581500,
          },
        },
        by_scenario_exposure: {
          contingent_bi: {
            highlights: {
              minimum: 6900,
              medium: 200,
              maximum: 482700,
            },
            scenario_impact: 0.011462831148140383,
            probability: 0.01,
            type_distribution: {
              attacks: 0,
              failures: 1,
            },
            scale_distribution: {
              specific: 0,
              systemic: 1,
            },
            damage_types: [
              'bi_recovery_expenses',
              'public_relations_repairment',
              'lost_income',
            ],
          },
          privacy: {
            highlights: {
              minimum: 8000,
              medium: 1018000.0,
              maximum: 28453500,
            },
            scenario_impact: 0.44293629713834987,
            probability: 0.01,
            type_distribution: {
              attacks: 0.9026765467188094,
              failures: 0.09732345328119063,
            },
            scale_distribution: {
              specific: 0.6852365077384304,
              systemic: 0.31476349226156963,
            },
            damage_types: [
              'monitoring_services',
              'data_recovery',
              'forensics',
              'public_relations_repairment',
              'notifications',
            ],
          },
          liability: {
            highlights: {
              minimum: 8100,
              medium: 345300.0,
              maximum: 23203500,
            },
            scenario_impact: 0.35955645921935153,
            probability: 0.01,
            type_distribution: {
              attacks: 0.8704647890678902,
              failures: 0.12953521093210985,
            },
            scale_distribution: {
              specific: 0.6885694554258632,
              systemic: 0.31143054457413677,
            },
            damage_types: ['legal_defense', 'settlements'],
          },
          bi: {
            highlights: {
              minimum: 23600,
              medium: 657000.0,
              maximum: 5177800,
            },
            scenario_impact: 0.08285742641141712,
            probability: 0.01,
            type_distribution: {
              attacks: 1,
              failures: 0,
            },
            scale_distribution: {
              specific: 0.6968127747986999,
              systemic: 0.30318722520130015,
            },
            damage_types: [
              'bi_recovery_expenses',
              'bi_forensics',
              'public_relations_repairment',
              'lost_income',
            ],
          },
          regulatory: {
            highlights: {
              minimum: 8100,
              medium: 89300.0,
              maximum: 248900,
            },
            scenario_impact: 0.00853978005028824,
            probability: 0.01,
            type_distribution: {
              attacks: 0.8770231247825631,
              failures: 0.12297687521743694,
            },
            scale_distribution: {
              specific: 0.7864377210904413,
              systemic: 0.2135622789095587,
            },
            damage_types: ['regulatory_legal_defense', 'regulatory_fines'],
          },
          extortion: {
            highlights: {
              minimum: 8300,
              medium: 478900.0,
              maximum: 5678100,
            },
            scenario_impact: 0.0946471744326472,
            probability: 0.01,
            type_distribution: {
              attacks: 1,
              failures: 0,
            },
            scale_distribution: {
              specific: 0.7360146583146413,
              systemic: 0.2639853416853587,
            },
            damage_types: ['extortion_recovery_expenses', 'extortion_payment'],
          },
        },
      },
      model_version: 'v2.0.0',
    },
    {
      id: '111b70f3f-eafe-4323-ad2d-72a38a2fd8e7',
      status: QuantificationStatus.Success,
      created_at: '2021-10-21T15:20:01.360590',
      updated_at: '2021-09-20T16:41:44.157308',
      period: 'Q4 2021',
      result: {
        overall_exposure: {
          highlights: {
            minimum: 20800,
            medium: 995,
            maximum: 82581500,
          },
        },
        by_scenario_exposure: {
          contingent_bi: {
            highlights: {
              minimum: 7900,
              medium: 400,
              maximum: 982700,
            },
            scenario_impact: 0.0214628,
            probability: 0.01,
            type_distribution: {
              attacks: 0,
              failures: 1,
            },
            scale_distribution: {
              specific: 0,
              systemic: 1,
            },
            damage_types: [
              'bi_recovery_expenses',
              'public_relations_repairment',
              'lost_income',
            ],
          },
          privacy: {
            highlights: {
              minimum: 9000,
              medium: 2018000.0,
              maximum: 48453500,
            },
            scenario_impact: 0.492936,
            probability: 0.01,
            type_distribution: {
              attacks: 0.9026765467188094,
              failures: 0.09732345328119063,
            },
            scale_distribution: {
              specific: 0.6852365077384304,
              systemic: 0.31476349226156963,
            },
            damage_types: [
              'monitoring_services',
              'data_recovery',
              'forensics',
              'public_relations_repairment',
              'notifications',
            ],
          },
          liability: {
            highlights: {
              minimum: 8100,
              medium: 345300.0,
              maximum: 23203500,
            },
            scenario_impact: 0.35955645921935153,
            probability: 0.01,
            type_distribution: {
              attacks: 0.8704647890678902,
              failures: 0.12953521093210985,
            },
            scale_distribution: {
              specific: 0.6885694554258632,
              systemic: 0.31143054457413677,
            },
            damage_types: ['legal_defense', 'settlements'],
          },
          bi: {
            highlights: {
              minimum: 23600,
              medium: 657000.0,
              maximum: 5177800,
            },
            scenario_impact: 0.08285742641141712,
            probability: 0.01,
            type_distribution: {
              attacks: 1,
              failures: 0,
            },
            scale_distribution: {
              specific: 0.6968127747986999,
              systemic: 0.30318722520130015,
            },
            damage_types: [
              'bi_recovery_expenses',
              'bi_forensics',
              'public_relations_repairment',
              'lost_income',
            ],
          },
          regulatory: {
            highlights: {
              minimum: 8100,
              medium: 89300.0,
              maximum: 248900,
            },
            scenario_impact: 0.00853978005028824,
            probability: 0.01,
            type_distribution: {
              attacks: 0.8770231247825631,
              failures: 0.12297687521743694,
            },
            scale_distribution: {
              specific: 0.7864377210904413,
              systemic: 0.2135622789095587,
            },
            damage_types: ['regulatory_legal_defense', 'regulatory_fines'],
          },
          extortion: {
            highlights: {
              minimum: 8300,
              medium: 478900.0,
              maximum: 5678100,
            },
            scenario_impact: 0.0946471744326472,
            probability: 0.01,
            type_distribution: {
              attacks: 1,
              failures: 0,
            },
            scale_distribution: {
              specific: 0.7360146583146413,
              systemic: 0.2639853416853587,
            },
            damage_types: ['extortion_recovery_expenses', 'extortion_payment'],
          },
        },
      },
      model_version: 'v3.0.0',
    },
  ],
};

const [pastRun4, pastRun3, pastRun2, pastRun1] = [
  buildNewPastRunResult(),
  buildNewPastRunResult(),
  buildPastRunResult(),
  buildPastRunResult(),
];

const resultsFqSchema = {
  cis: cisResultsFQNewSchema,
  nist: nistResultsFQNewSchema,
  iso27001: iso27001ResultsFQNewSchema,
  cis_v8: cisV8ResultsFQNewSchema,
};

export const pastRuns = (
  sec_controls_framework: 'cis' | 'nist' | 'iso27001' | 'cis_v8'
) => {
  const currentRun = resultsFqSchema[sec_controls_framework]
    ? resultsFqSchema[sec_controls_framework]
    : undefined;
  const pastRun5 = {
    ...currentRun,
  };
  return {
    items: [
      {
        company_id: 'company-id',
        id: '685ae1e0-2b50-46d7-1111-7f4a02531d80',
        status: QuantificationStatus.Success,
        created_at: '2023-09-20T10:24:12.645683',
        updated_at: '2023-09-20T10:32:52.544808',
        period: 'Q1 2022',
        results_narrative: pastRun5,
        result: pastRunsOld.items[1].result,
        model_version: 'v2023.3.3',
        input_data: mockCisInputData,
      },
      {
        company_id: 'company-id',
        id: '685ae1e0-2b50-46d7-8078-7f4a02531d80',
        status: QuantificationStatus.Success,
        created_at: '2023-06-20T10:24:12.645683',
        updated_at: '2023-06-20T10:32:52.544808',
        period: 'Q1 2022',
        results_narrative: pastRun4,
        result: pastRunsOld.items[1].result,
        model_version: 'v2023.3.1',
        input_data: mockCisInputData,
      },
      {
        company_id: 'company-id',
        id: `new-schema-${sec_controls_framework}-fq-id`,
        status: QuantificationStatus.Success,
        created_at: '2023-06-19T13:46:32.575733',
        updated_at: '2023-06-19T13:55:54.223868',
        period: 'Q1 2022',
        results_narrative: pastRun3,
        result: pastRunsOld.items[0].result,
        model_version: 'v2023.2.1',
        input_data: mockCisInputData,
      },
      {
        company_id: 'company-id',
        id: `old-schema-${sec_controls_framework}-fq-id`,
        status: QuantificationStatus.Success,
        created_at: '2021-02-18T15:20:01.360590',
        updated_at: '2021-04-18T15:41:44.157308',
        period: 'Q1 2022',
        result: pastRunsOld.items[3].result,
        results_narrative: pastRun2,
        model_version: 'v2022.3.12',
        input_data: mockCisInputData,
      },
      {
        company_id: 'company-id',
        id: `299b70f3f-eafe-4111-ad2d-72a38a2fd8e7 `,
        status: QuantificationStatus.Success,
        created_at: '2023-01-17T14:57:44.801030',
        updated_at: '2023-01-17T15:07:46.636863',
        period: 'Q1 2022',
        results_narrative: pastRun1,
        result: pastRunsOld.items[2].result,
        model_version: 'sha-gegege',
        input_data: mockCisInputData,
      },
      {
        company_id: 'company-id',
        id: `299b70f3f-eafe-4111-ad2d-72a38a2fd8e7 `,
        status: QuantificationStatus.Success,
        created_at: '2023-01-17T14:57:44.801030',
        updated_at: '2023-01-17T15:07:46.636863',
        period: 'Q1 2022',
        result: pastRunsOld.items[3].result,
        model_version: 'v2022.2',
        input_data: mockCisInputData,
      },
    ],
  };
};

export const pastRunsFirstResultNarrativeSecondOld = (
  sec_controls_framework: 'cis' | 'nist'
) => {
  return {
    items: [
      {
        id: `old-schema-${sec_controls_framework}-fq-id`,
        status: QuantificationStatus.Success,
        created_at: '2022-08-21T15:20:01.360590',
        updated_at: '2022-05-17T16:41:44.157308',
        period: 'Q1 2022',
        result: pastRunsOld.items[3].result,
        model_version: 'v0.0.0',
        input_data: mockCisInputData,
      },
      {
        id: `68599999-2b50-46d7-8078-7f4a02531d84`,
        status: QuantificationStatus.Success,
        created_at: '2021-02-20T15:20:01.360590',
        updated_at: '2021-04-19T15:41:44.157308',
        period: 'Q1 2022',
        result: pastRunsOld.items[0].result,
        results_narrative: pastRun1,
        model_version: 'v1.0.0',
        input_data: mockCisInputData,
      },
    ],
  };
};
