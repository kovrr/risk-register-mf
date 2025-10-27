// this should help building matching FQ and company that play well togather, you can add customizations and overrides as you see fit

import {
  cisResultsFQ,
  cisResultsFQNewSchema,
  cisV8ResultsFQNewSchema,
  mockCisInputData,
  mockCisV8InputData,
  mockNistInputData,
  nistResultsFQ,
  nistResultsFQNewSchema,
} from 'mocks/data/fqResults';
import { pastRuns, pastRunsOld } from 'mocks/data/pastRuns';
import { CompanyApiData, CompanyData } from 'types/companyForm';
import { QuantificationOld } from 'types/quantificationData';
import { CISNameToCode } from './cisBuilder';
import {
  buildNistSecurityProfiles,
  buildSphere,
  buildCompanyWithLastFq,
  buildCisSecurityProfiles,
  buildCompanyWithSphere,
  buildCisV8SecurityProfiles,
} from './companyBuilder';
import {
  buildResultsWithNistControlsScenarios,
  buildQuantification,
  buildResultsWithCisControlsScenarios,
} from './quantificationBuilders';
import {
  extractRecommendationData,
  extractRecommendationDataNewSchema,
  extractWhatIfTableData,
} from './tableBuilders';
import { chance } from 'mocks/builders/buildingUtils';
import { SecControlsFramework } from 'options/constants';
import { CisV8Abbreviation, cisV8AbbrToCode } from 'options/cisV8Controls';
import { buildVendorData } from './fqInputDataBuilders';

export const buildNistCompanyAndFq = ({
  companySpecifics,
  fqSpecifics,
}: {
  companySpecifics?: Partial<CompanyData>;
  fqSpecifics?: Partial<QuantificationOld>;
} = {}) => {
  const nistResults = buildResultsWithNistControlsScenarios();
  const nistSecurityProfiles = buildNistSecurityProfiles(
    Object.values(nistResults.asset_group_information!)
  );
  const sphere = {
    ...buildSphere(),
    security_profiles: nistSecurityProfiles,
  };
  const nistCompany = buildCompanyWithLastFq({
    sec_controls_framework: 'NIST',
    sphere,
    ...companySpecifics,
  });
  const fq = buildQuantification({
    results: nistResults,
    input_data: {
      sphere,
      vendor_data: buildVendorData(),
      sec_controls_framework: 'NIST',
    },
  });
  const tableWhatIfData = extractWhatIfTableData(
    fq.results!.control_scenarios!.by_control_to_minimal,
    SecControlsFramework.NIST
  ).sort((prev, current) =>
    prev.averageEffect > current.averageEffect ? -1 : 1
  );
  const tableRecommendationData = extractRecommendationData(fq.results!);
  return {
    company: nistCompany,
    fq,
    tableWhatIfData,
    tableRecommendationData,
  };
};

export const buildCisCompanyAndFq = ({
  companySpecifics,
  fqSpecifics,
}: {
  companySpecifics?: Partial<CompanyApiData>;
  fqSpecifics?: Partial<QuantificationOld>;
} = {}) => {
  const results = buildResultsWithCisControlsScenarios();
  const securityProfiles = buildCisSecurityProfiles(
    Object.values(results.asset_group_information!)
  );
  const sphere = {
    ...buildSphere(),
    security_profiles: securityProfiles,
  };
  const company = buildCompanyWithLastFq({
    sec_controls_framework: 'CIS',
    sphere,
    ...companySpecifics,
  });
  const fq = buildQuantification({
    results: results,
    input_data: {
      sphere,
      vendor_data: buildVendorData(),
      sec_controls_framework: 'CIS',
    },
  });
  const tableWhatIfData = extractWhatIfTableData(
    fq.results!.control_scenarios!.by_control_to_minimal,
    SecControlsFramework.CIS
  ).sort((prev, current) =>
    prev.averageEffect > current.averageEffect ? -1 : 1
  );
  const tableRecommendationData = extractRecommendationData(fq.results!);

  return {
    company: company,
    fq,
    tableWhatIfData,
    tableRecommendationData,
  };
};
export const buildCisV8CompanyAndFq = ({
  companySpecifics,
  fqSpecifics,
}: {
  companySpecifics?: Partial<CompanyApiData>;
  fqSpecifics?: Partial<QuantificationOld>;
} = {}) => {
  const results = buildResultsWithCisControlsScenarios({
    controlsFrameWork: 'cis_v8',
  });
  const securityProfiles = buildCisV8SecurityProfiles(
    Object.values(results.asset_group_information!)
  );
  const sphere = {
    ...buildSphere(),
    security_profiles: securityProfiles,
  };
  const company = buildCompanyWithLastFq({
    sec_controls_framework: SecControlsFramework.CISv8,
    sphere,
    ...companySpecifics,
  });
  const fq = buildQuantification({
    results: results,
    input_data: {
      sphere,
      vendor_data: buildVendorData(),
      sec_controls_framework: SecControlsFramework.CISv8,
    },
  });
  const tableWhatIfData = extractWhatIfTableData(
    fq.results!.control_scenarios!.by_control_to_minimal,
    SecControlsFramework.CISv8
  ).sort((prev, current) =>
    prev.averageEffect > current.averageEffect ? -1 : 1
  );
  const tableRecommendationData = extractRecommendationData(fq.results!);

  return {
    company: company,
    fq,
    tableWhatIfData,
    tableRecommendationData,
  };
};

export const buildCisCompanyAndResultsNarrative = ({
  companySpecifics,
  fqSpecifics,
}: {
  companySpecifics?: Partial<CompanyApiData>;
  fqSpecifics?: Partial<QuantificationOld>;
} = {}) => {
  const results = buildResultsWithCisControlsScenarios();
  const securityProfiles = buildCisSecurityProfiles(
    Object.values(results.asset_group_information!)
  );
  const sphere = {
    ...buildSphere(),
    security_profiles: securityProfiles,
  };
  const company = buildCompanyWithLastFq({
    sec_controls_framework: 'CIS',
    sphere,
    ...companySpecifics,
  });
  const fq = buildQuantification({
    id: 'new-schema-cis-fq-id',
    results_narrative: cisResultsFQNewSchema,
    results: cisResultsFQ,
    input_data: mockCisInputData,
  });
  const tableWhatIfData = extractWhatIfTableData(
    fq.results_narrative!.control_scenarios.by_control_to_minimal,
    SecControlsFramework.CIS
  ).sort((prev, current) =>
    prev.averageEffect > current.averageEffect ? -1 : 1
  );

  const tableRecommendationData = extractRecommendationDataNewSchema({
    byAssetGroup: fq.results_narrative?.control_scenarios.by_asset_group,
    assetGroupInformation:
      fq.results_narrative?.input_stats.asset_group_information,
  });

  return {
    company,
    fq,
    tableWhatIfData,
    tableRecommendationData,
  };
};
export const buildCisV8CompanyAndResultsNarrative = ({
  companySpecifics,
  fqSpecifics,
}: {
  companySpecifics?: Partial<CompanyApiData>;
  fqSpecifics?: Partial<QuantificationOld>;
} = {}) => {
  const results = buildResultsWithCisControlsScenarios({
    controlsFrameWork: 'cis_v8',
  });
  const securityProfiles = buildCisV8SecurityProfiles(
    Object.values(results.asset_group_information!)
  );
  const sphere = {
    ...buildSphere(),
    security_profiles: securityProfiles,
  };
  const company = buildCompanyWithLastFq({
    sec_controls_framework: SecControlsFramework.CISv8,
    sphere,
    ...companySpecifics,
  });
  const fq = buildQuantification({
    id: 'new-schema-cis-fq-id',
    results_narrative: cisV8ResultsFQNewSchema,
    results: cisResultsFQ,
    input_data: mockCisV8InputData,
  });
  const tableWhatIfData = extractWhatIfTableData(
    fq.results_narrative!.control_scenarios.by_control_to_minimal,
    SecControlsFramework.CISv8
  ).sort((prev, current) =>
    prev.averageEffect > current.averageEffect ? -1 : 1
  );

  const tableRecommendationData = extractRecommendationDataNewSchema({
    byAssetGroup: fq.results_narrative?.control_scenarios.by_asset_group,
    assetGroupInformation:
      fq.results_narrative?.input_stats.asset_group_information,
  });

  return {
    company,
    fq,
    tableWhatIfData,
    tableRecommendationData,
  };
};
export const buildNistCompanyAndResultsNarrative = ({
  companySpecifics,
  fqSpecifics,
}: {
  companySpecifics?: Partial<CompanyData>;
  fqSpecifics?: Partial<QuantificationOld>;
} = {}) => {
  const results = buildResultsWithCisControlsScenarios();
  const securityProfiles = buildCisSecurityProfiles(
    Object.values(results.asset_group_information!)
  );
  const sphere = {
    ...buildSphere(),
    security_profiles: securityProfiles,
  };
  const company = buildCompanyWithLastFq({
    sec_controls_framework: 'NIST',
    sphere,
    ...companySpecifics,
  });
  const fq = buildQuantification({
    id: 'new-schema-nist-fq-id',
    results_narrative: nistResultsFQNewSchema,
    results: nistResultsFQ,
    input_data: mockNistInputData,
  });
  const tableWhatIfData = extractWhatIfTableData(
    fq.results_narrative!.control_scenarios.by_control_to_minimal,
    SecControlsFramework.NIST
  ).sort((prev, current) =>
    prev.averageEffect > current.averageEffect ? -1 : 1
  );

  const tableRecommendationData = extractRecommendationDataNewSchema({
    byAssetGroup: fq.results_narrative?.control_scenarios.by_asset_group,
    assetGroupInformation:
      fq.results_narrative?.input_stats.asset_group_information,
  });

  return {
    company,
    fq,
    tableWhatIfData,
    tableRecommendationData,
  };
};

export const buildISOCompanyAndResultsNarrative = ({
  companySpecifics,
  fqSpecifics,
}: {
  companySpecifics?: Partial<CompanyData>;
  fqSpecifics?: Partial<QuantificationOld>;
} = {}) => {
  const results = buildResultsWithCisControlsScenarios();
  const securityProfiles = buildCisSecurityProfiles(
    Object.values(results.asset_group_information!)
  );
  const sphere = {
    ...buildSphere(),
    security_profiles: securityProfiles,
  };
  const company = buildCompanyWithLastFq({
    sec_controls_framework: SecControlsFramework.ISO27001,
    sphere,
    ...companySpecifics,
  });
  const fq = buildQuantification({
    id: 'new-schema-iso-fq-id',
    results_narrative: nistResultsFQNewSchema,
    results: nistResultsFQ,
    input_data: mockNistInputData,
  });
  const tableWhatIfData = extractWhatIfTableData(
    fq.results_narrative!.control_scenarios.by_control_to_minimal,
    SecControlsFramework.ISO27001
  ).sort((prev, current) =>
    prev.averageEffect > current.averageEffect ? -1 : 1
  );

  const tableRecommendationData = extractRecommendationDataNewSchema({
    byAssetGroup: fq.results_narrative?.control_scenarios.by_asset_group,
    assetGroupInformation:
      fq.results_narrative?.input_stats.asset_group_information,
  });

  return {
    company,
    fq,
    tableWhatIfData,
    tableRecommendationData,
  };
};

export const indicators = {
  CIS: {
    getName: (control: string) => `CIS Control ${CISNameToCode[control]}`,
    maxControlText: 'IG3',
  },
  CISv8: {
    getName: (control: string) =>
      `CIS Control ${cisV8AbbrToCode(control as CisV8Abbreviation)}`,
    maxControlText: 'IG3',
  },
  NIST: {
    getName: (control: string) => control.replace('_', '.'),
    maxControlText: 'Optimized',
  },
};

export const buildCompaniesForTableNavigation = ({
  includeResultsNarrative,
}: {
  includeResultsNarrative: boolean;
}) => {
  const modelVersion = chance.pickone(['v2022.4.2', 'v2022.4.1']);
  const company = buildCompanyWithSphere();

  const [pastFqs, fqConfig] = includeResultsNarrative
    ? [
        pastRuns('cis'),
        {
          id: 'new-schema-cis-fq-id',
          results_narrative: cisResultsFQNewSchema,
          results: cisResultsFQ,
          input_data: mockCisInputData,
          model_version: modelVersion,
        },
      ]
    : [
        pastRunsOld,
        {
          id: 'old-schema-cis-fq-id',
          results: cisResultsFQ,
          input_data: mockCisInputData,
          model_version: modelVersion,
        },
      ];
  const fq = buildQuantification({ ...fqConfig });
  company.quantification_ids = [fq.id, ...pastFqs.items.map(({ id }) => id)];
  company.last_quantification = {
    id: fq.id,
    status: 'Success',
    created_at: '2020-01-01T00:00:00.000Z',
    updated_at: '2020-01-01T00:00:00.000Z',
    include_results_narrative: includeResultsNarrative,
  };

  return { company, fq, pastFqs };
};
