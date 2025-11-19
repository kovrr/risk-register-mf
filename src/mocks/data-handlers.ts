// @ts-nocheck

import { applicationTypes } from '@/types/applicationTypes';
import { QuantificationStatus } from '@/types/quantificationData';
import type { RiskOwner } from '@/types/riskRegister';
import { rest } from 'msw';
import { fronteggAuthServerUrl } from './fronteggAuthServerUrl';

// Using environment variable instead of urls-defs
const getBaseApiUrl = () =>
  import.meta.env.VITE_API_URL ||
  import.meta.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:8000';

// Use relative base so MSW matches same-origin requests from the app
const getApiBasePath = () => `/api`;
const apiBasePath = getApiBasePath();
const riskScenariosBasePath = `${apiBasePath}/risk-scenarios`;

import { chance } from './builders/buildingUtils';
import {
  allVisibleMenuItemsMock,
  allVisibleMenuItemsV1Mock,
} from './builders/buildMenuItemsPermissions';
import { buildMinimalSphereData } from './builders/e2eBuilders';
import { HAZARD_ROWS } from './builders/hazardRowsBuilder';
import { buildQuantification } from './builders/quantificationBuilders';
import {
  buildCRQRiskRegisterResponse,
  buildMetricsHistory,
  buildMixedRiskRegisterList,
  buildRiskRegisterResponse,
} from './builders/riskRegisterBuilders';
import {
  buildSecurityScorecardCompanyApiResponse,
  buildSecurityScorecardPortfoliosApiResponse,
} from './builders/securityscorecardBuilders';
import { assetsResults } from './data/assetsResults';
import { cisToOtherFrameworks } from './data/cisToOtherFrameworks';
import { companiesResults } from './data/companiesResults';
import {
  cisResultsFQ,
  cisResultsFQNewSchema,
  cisV8ResultsFQNewSchema,
  iso27001ResultsFQNewSchema,
  mockCisInputData,
  mockCisV8InputData,
  mockISOInputData,
  mockNistInputData,
  mockNoAGLevelInputDSata,
  nistResultsFQ,
  nistResultsFQNewSchema,
  resultsLegacy,
} from './data/fqResults';
import {
  pastRuns,
  pastRunsFirstResultNarrativeSecondOld,
} from './data/pastRuns';
import { transparency } from './data/transparencyData';
import {
  getMock,
  getMockWithStatus,
  getPaginatedMock,
  postMock,
} from './handlersUtils';

const ROCI_COMPANY_STATE =
  import.meta.env.VITE_DEV_ROCI_STATE ||
  (import.meta.env.NEXT_PUBLIC_DEV_ROCI_STATE ?? 'company_exists');
const APPLICATION_TYPE =
  import.meta.env.VITE_DEV_APPLICATION_TYPE ||
  (import.meta.env.NEXT_PUBLIC_DEV_APPLICATION_TYPE ?? applicationTypes.FOQUS);
const APPLICATION_SUBTYPE =
  import.meta.env.VITE_DEV_APPLICATION_SUBTYPE ||
  import.meta.env.NEXT_PUBLIC_DEV_APPLICATION_SUBTYPE;

const [latestCompanyBody, latestCompanyStatus] =
  ROCI_COMPANY_STATE === 'company_exists'
    ? [companiesResults[0], 200]
    : [{}, 404];

const tenantId =
  APPLICATION_TYPE === applicationTypes.ROCI ? 'roci-tenant-id' : chance.guid();

export const handlers = [
  getMock(`${getBaseApiUrl()}/api/tenant`, {
    id: tenantId,
    name: 'Kovrr Test Tenant',
    feature_toggles: [
      { name: 'readOnlyUser', value: false },
      { name: 'enable.ServiceNow', value: true },
      { name: 'enable.tenable', value: true },
      { name: 'show.otCompanyAG', value: false },
      { name: 'enable.panaseer', value: true },
      { name: 'enable.crowdstrike', value: true },
      { name: 'enable.axonius', value: true },
      { name: 'enable.cybergrx', value: true },
      { name: 'enable.bitsight', value: true },
      { name: 'enable.forescout', value: true },
      { name: 'enable.rapid7', value: true },
      { name: 'enable.qualys', value: true },
      { name: 'enable.securityscorecard', value: true },
      { name: 'enable.companyLevelPermissions', value: true },
      { name: 'feature.spec.highLevelControls', value: true },
      { name: 'feature.spec.microsoftRoci', value: true },
      { name: 'feature.spec.asbControls', value: true },
      { name: 'enable.spec.riskProgression', value: true },
      { name: 'enable.spec.riskDriverDrillDown', value: true },
      { name: 'enable.spec.materialityAnalysis', value: true },
      { name: 'enable.adminPortal', value: true },
      { name: 'feature.spec.cisV8Controls', value: true },
      { name: 'feature.spec.newRunFQModal', value: true },
      { name: 'enable.riskRegister', value: true },
      { name: 'enable.riskRegister.crq', value: true },
      { name: 'enable.riskRegister.export', value: true },
      { name: 'enable.foqus.reorganize', value: true },
      { name: 'enable.riskRegister.reorganize', value: true },
      { name: 'enable.RiskRegisterTemplate', value: true },
      { name: 'enable.reportsTab', value: true },
      { name: 'enable.cisV8Safeguards', value: true },
      { name: 'enable.nistV2', value: true },
      { name: 'enable.selfAssessment', value: true },
    ],
  }),
  getMock(`${getBaseApiUrl()}/api/tenant_application_details`, {
    application_type: APPLICATION_TYPE,
    application_sub_type: APPLICATION_SUBTYPE,
  }),
  getMock(`${getBaseApiUrl()}/api/tenant/remaining_licenses`, {
    remaining_licenses_amount: chance.integer({ min: 2, max: 12 }),
  }),
  getMock(
    `${getBaseApiUrl()}/api/fq/finished-fq-id`,
    buildQuantification({
      id: 'finished-fq-id',
      results: nistResultsFQ,
      input_data: mockNistInputData,
    }),
  ),
  getMock(
    `${getBaseApiUrl()}/api/fq/finished-cis-fq-id`,
    buildQuantification({
      id: 'finished-cis-fq-id',
      results_narrative: cisResultsFQNewSchema,
      results: cisResultsFQ,
      input_data: mockCisInputData,
    }),
  ),
  getMock(
    `${getBaseApiUrl()}/api/fq/finished-second-cis-fq-id`,
    buildQuantification({
      id: 'finished-second-cis-fq-id',
      results_narrative: cisResultsFQNewSchema,
      results: cisResultsFQ,
      input_data: mockCisInputData,
      created_at: new Date(
        new Date().getTime() - 10 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      status: QuantificationStatus.Success,
      updated_at: new Date(
        new Date().getTime() - 10 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    }),
  ),

  postMock(`http://localhost:3000/next-api/log`, {}),
  getMock(
    `${getBaseApiUrl()}/api/fq/running-fq-id`,
    buildQuantification({
      id: 'running-fq-id',
      input_data: mockCisInputData,
      status: 'Running',
    }),
  ),
  getMock(
    `${getBaseApiUrl()}/api/fq/cis-fq-id`,
    buildQuantification({
      id: 'cis-fq-id',
      results: cisResultsFQ,
      input_data: mockCisInputData,
    }),
  ),
  getMock(
    `${getBaseApiUrl()}/api/fq/nist-fq-id`,
    buildQuantification({
      id: 'nist-fq-id',
      results: nistResultsFQ,
      input_data: mockNistInputData,
    }),
  ),
  getMock(
    `${getBaseApiUrl()}/api/fq/new-schema-cis-fq-id`,
    buildQuantification({
      id: 'cis-fq-id',
      results_narrative: cisResultsFQNewSchema,
      results: cisResultsFQ,
      input_data: mockCisInputData,
    }),
  ),
  getMock(
    `${getBaseApiUrl()}/api/fq/new-schema-cis-v8-fq-id`,
    buildQuantification({
      id: 'cis-v8-fq-id',
      results_narrative: cisV8ResultsFQNewSchema,
      results: cisResultsFQ,
      input_data: mockCisV8InputData,
    }),
  ),
  getMock(
    `${getBaseApiUrl()}/api/fq/new-schema-iso-fq-id`,
    buildQuantification({
      id: 'new-schema-iso-fq-id',
      results_narrative: iso27001ResultsFQNewSchema,
      results: undefined,
      input_data: mockISOInputData,
    }),
  ),
  getMock(
    `${getBaseApiUrl()}/api/fq/new-schema-nist-fq-id`,
    buildQuantification({
      id: 'nist-fq-id',
      results_narrative: nistResultsFQNewSchema,
      results: nistResultsFQ,
      input_data: mockNistInputData,
    }),
  ),
  getMock(
    `${getBaseApiUrl()}/api/fq/legacy-fq-id`,
    buildQuantification({
      id: 'legacy-fq-id',
      results: resultsLegacy,
      input_data: mockNoAGLevelInputDSata,
    }),
  ),
  rest.get(`${getBaseApiUrl()}/api/fq/nearest*`, (req, res, ctx) => {
    return res(ctx.json(pastRuns('nist').items[0]));
  }),
  getMock(
    `${getBaseApiUrl()}/api/fq/:fqId`,
    buildQuantification({
      id: 'old-fq-id',
      results: resultsLegacy,
      input_data: mockNoAGLevelInputDSata,
    }),
  ),
  getMock(`${getBaseApiUrl()}/api/events/token`, { token: 'newToken' }),
  getMock(
    `${fronteggAuthServerUrl}/frontegg/identity/resources/configurations/sessions/v1`,
    {},
  ),
  getMock(`${fronteggAuthServerUrl}/frontegg/flags`, {}),
  getMock(`${fronteggAuthServerUrl}/frontegg/vendors/public`, {}),
  getMock(
    `${fronteggAuthServerUrl}/frontegg/identity/resources/configurations/v1/auth/strategies/public`,
    {},
  ),
  getMock(
    `${fronteggAuthServerUrl}/frontegg/identity/resources/configurations/v1/public`,
    {},
  ),
  getMock(`${fronteggAuthServerUrl}/frontegg/identity/resources/sso/v2`, {}),
  getMock(
    `${fronteggAuthServerUrl}/frontegg/team/resources/sso/v2/configurations/public`,
    {},
  ),
  rest.get(`${getBaseApiUrl()}/api/companies`, (req, res, ctx) => {
    const searchParams = new URLSearchParams(req.url.searchParams);
    const id = searchParams.get('id');
    const page = parseInt(searchParams.get('page') || '1');
    const size = parseInt(searchParams.get('size') || '10');

    const results = id
      ? companiesResults.filter((company) => company.id === id)
      : [...companiesResults];

    const paginatedResults = results.slice((page - 1) * size, page * size);

    return res(
      ctx.json({
        items: paginatedResults,
        total: results.length,
        page,
        size,
      }),
    );
  }),
  // getPaginatedMock(`${getBaseApiUrl()}/api/companies`, companiesResults),
  getMockWithStatus(
    `${getBaseApiUrl()}/api/companies/latest`,
    latestCompanyBody,
    latestCompanyStatus,
  ),
  getPaginatedMock(
    `${getBaseApiUrl()}/api/companies/:companyId/assets`,
    assetsResults,
  ),

  rest.get(`${getBaseApiUrl()}/api/search-hazard`, (req, res, ctx) => {
    const searchParams = new URLSearchParams(req.url.searchParams);
    const vendor = (searchParams.get('vendor') || '').toLowerCase();
    const product = (searchParams.get('product') || '').toLowerCase();
    return res(
      ctx.json(
        HAZARD_ROWS.filter(
          (item) =>
            item.vendor.toLowerCase().includes(vendor) &&
            item.product.toLowerCase().includes(product),
        ),
      ),
    );
  }),
  rest.get(`${getBaseApiUrl()}/api/companies/:companyId`, (req, res, ctx) => {
    return res(
      ctx.json(
        companiesResults.find((item) => item.id === req.params.companyId),
      ),
    );
  }),
  rest.get(
    `${getBaseApiUrl()}/api/companies/:companyId/minimal_input`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          company_base_details: companiesResults.find(
            (item) => item.id === req.params.companyId,
          ),
          sphere_data: buildMinimalSphereData(),
        }),
      );
    },
  ),

  rest.post(`${getBaseApiUrl()}/api/fq`, (req, res, ctx) => {
    return res(ctx.json({ id: 'new-fq-id' }));
  }),
  rest.post(`${getBaseApiUrl()}/api/companies`, (req, res, ctx) => {
    return res(ctx.json({ id: 'new-company-id' }));
  }),
  rest.patch(
    `${getBaseApiUrl()}/api/companies/:companyId`,
    async (req, res, ctx) => {
      const { inputSphere } = await req.json();
      return res(
        ctx.json({
          id: req.params.companyId,
          is_sphere_valid: true,
          sphere: inputSphere,
        }),
      );
    },
  ),
  rest.patch(
    `${getBaseApiUrl()}/api/integrations/panorays/:companyId/refresh_posture`,
    async (req, res, ctx) => {
      return res(
        ctx.json({
          id: req.params.companyId,
        }),
      );
    },
  ),
  rest.get(
    `${getBaseApiUrl()}/api/companies/685ae1e0-2b50-46d7-8078-7f4a02531d84/past-quantifications*`,
    (req, res, ctx) => {
      return res(ctx.json(pastRuns('cis')));
    },
  ),
  rest.get(
    `${getBaseApiUrl()}/api/companies/685ae1e0-2b50-46d7-8078-7f4a02531d82/past-quantifications*`,
    (req, res, ctx) => {
      return res(ctx.json(pastRuns('nist')));
    },
  ),
  rest.get(
    `${getBaseApiUrl()}/api/companies/685ae1e0-2b50-46d7-7777-7f4a02531d844/past-quantifications*`,
    (req, res, ctx) => {
      return res(ctx.json(pastRuns('iso27001')));
    },
  ),
  rest.get(
    `${getBaseApiUrl()}/api/companies/68599999-2b50-46d7-8078-7f4a02531d84/past-quantifications*`,
    (req, res, ctx) => {
      return res(ctx.json(pastRunsFirstResultNarrativeSecondOld('cis')));
    },
  ),
  rest.get(
    `${getBaseApiUrl()}/api/companies/:companyId/past-quantifications*`,
    (req, res, ctx) => {
      return res(ctx.json(pastRuns('nist')));
    },
  ),
  rest.post(
    `${getBaseApiUrl()}/api/companies/new-company-id/custom-hazard-signed-url`,
    (req, res, ctx) => {
      return res(
        ctx.json({ upload_url: `${getBaseApiUrl()}/dummy-upload-url` }),
      );
    },
  ),
  rest.post(
    `${getBaseApiUrl()}/api/companies/new-company-id/hazard`,
    (req, res, ctx) => {
      return res(
        ctx.json({ upload_url: `${getBaseApiUrl()}/dummy-upload-url` }),
      );
    },
  ),
  rest.post(
    `${getBaseApiUrl()}/api/companies/new-company-id/custom-hazard-uploaded`,
    (req, res, ctx) => {
      return res();
    },
  ),
  rest.put(`${getBaseApiUrl()}/dummy-upload-url`, (req, res, ctx) => {
    return res();
  }),

  rest.get(`${getBaseApiUrl()}/api/cis_mappings`, (req, res, ctx) => {
    return res(ctx.json(cisToOtherFrameworks));
  }),
  rest.get(
    `${getBaseApiUrl()}/api/fq/:fqId/transparency`,

    (req, res, ctx) => {
      return res(ctx.json(transparency));
    },
  ),
  rest.post(
    `${getBaseApiUrl()}/api/integrations/securityscorecard/portfolios`,
    (req, res, ctx) => {
      return res(ctx.json(buildSecurityScorecardPortfoliosApiResponse(10)));
    },
  ),
  rest.post(
    `${getBaseApiUrl()}/api/integrations/securityscorecard/portfolios/:portfolio_id/companies`,
    (req, res, ctx) => {
      return res(ctx.json(buildSecurityScorecardCompanyApiResponse(10)));
    },
  ),
  getPaginatedMock(
    `${riskScenariosBasePath}/`,
    buildMixedRiskRegisterList(25),
  ),
  rest.get(
    `${riskScenariosBasePath}/:scenarioId`,
    (req, res, ctx) => {
      // 50% chance for each response type
      const isCRQ = Math.random() < 1;
      return res(
        ctx.json(
          isCRQ ? buildCRQRiskRegisterResponse() : buildRiskRegisterResponse(),
        ),
      );
    },
  ),
  rest.post(
    `${riskScenariosBasePath}/`,
    (req, res, ctx) => {
      return res(ctx.json(buildRiskRegisterResponse()));
    },
  ),
  rest.post(
    `${riskScenariosBasePath}/crq/:scenarioId/update-crq`,
    (req, res, ctx) => {
      return res(ctx.json(buildRiskRegisterResponse()));
    },
  ),
  rest.patch(
    `${riskScenariosBasePath}/:scenarioId`,
    (req, res, ctx) => {
      return res(ctx.json(buildRiskRegisterResponse()));
    },
  ),
  // Unified Notes API
  rest.get(`${getBaseApiUrl()}/api/notes`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        items: [],
        total: 0,
        page: 1,
        size: 50,
      }),
    );
  }),
  rest.post(`${getBaseApiUrl()}/api/notes`, (req, res, ctx) => {
    const body = req.body as any;
    return res(
      ctx.status(201),
      ctx.json({
        id: 'new-note-id',
        parent_type: body?.parent_type,
        parent_id: body?.parent_id,
        content: body?.content,
        user: body?.user,
        created_at: new Date().toISOString(),
      }),
    );
  }),
  rest.patch(`${getBaseApiUrl()}/api/notes/:noteId`, (req, res, ctx) => {
    const body = req.body as any;
    return res(
      ctx.status(200),
      ctx.json({
        id: req.params.noteId,
        content: body?.content,
        user: body?.user,
        created_at: new Date().toISOString(),
      }),
    );
  }),
  rest.delete(`${getBaseApiUrl()}/api/notes/:noteId`, (req, res, ctx) => {
    return res(ctx.status(204));
  }),
  rest.get(`${getBaseApiUrl()}/api/documents/:documentId`, (req, res, ctx) => {
    return res(ctx.json([]));
  }),
  rest.get(
    `${apiBasePath}/tenant/remaining_crq_scenarios_licenses`,
    (req, res, ctx) => {
      return res(ctx.json({ remaining_crq_scenarios_licenses: 10 }));
    },
  ),
  // Tenant info (normalize to relative path)
  rest.get(`${apiBasePath}/tenant`, (req, res, ctx) => {
    return res(
      ctx.json({
        id: 'mock-tenant',
        name: 'Mock Tenant',
      }),
    );
  }),
  rest.get(
    `${riskScenariosBasePath}/:scenarioId/export`,
    (req, res, ctx) => {
      const csvContent = 'Header1,Header2,Header3\nValue1,Value2,Value3';
      return res(
        ctx.set('Content-Type', 'text/csv'),
        ctx.set(
          'Content-Disposition',
          'attachment; filename="risk-register-export.csv"',
        ),
        ctx.body(new Blob([csvContent], { type: 'text/csv' })),
      );
    },
  ),
  rest.get(`${apiBasePath}/tenant/users`, (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: chance.guid(),
          email: chance.email(),
          active_tenant: chance.guid(),
          tenant_ids: [],
        },
        {
          id: chance.guid(),
          email: chance.email(),
          active_tenant: chance.guid(),
          tenant_ids: [],
        },
        {
          id: chance.guid(),
          email: chance.email(),
          active_tenant: chance.guid(),
          tenant_ids: [],
        },
      ] as RiskOwner[]),
    );
  }),
  rest.get(
    `${getBaseApiUrl()}/api/components/fq_menu_items`,
    (req, res, ctx) => {
      return res(ctx.json(allVisibleMenuItemsMock));
    },
  ),
  rest.get(
    `${getBaseApiUrl()}/api/components/fq_menu_items_v1`,
    (req, res, ctx) => {
      return res(ctx.json(allVisibleMenuItemsV1Mock));
    },
  ),
  rest.post(
    `${getBaseApiUrl()}/api/tenant/upgrade-to-full-plan`,
    (req, res, ctx) => {
      return res(ctx.json({ message: 'Upgrade request sent' }));
    },
  ),
  rest.get(
    `${riskScenariosBasePath}/:scenarioId/metrics-history`,
    (req, res, ctx) => {
      return res(ctx.json(buildMetricsHistory()));
    },
  ),
  rest.post(
    `${riskScenariosBasePath}/request-pre-defined-scenario`,
    (req, res, ctx) => {
      return res(ctx.json({ message: 'Request sent successfully' }));
    },
  ),
  rest.post(`${getBaseApiUrl()}/api/report/ask-for-report`, (req, res, ctx) => {
    return res(ctx.json({ message: 'Request sent successfully' }));
  }),
  // DELETE scenario endpoint
  rest.delete(
    `${riskScenariosBasePath}/:scenarioId`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ message: 'Scenario deleted successfully' }),
      );
    },
  ),
  // GET scenario controls endpoint
  rest.get(
    `${riskScenariosBasePath}/:scenarioId/controls`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json([]));
    },
  ),
  // GET scenarios export endpoint
  rest.get(
    `${riskScenariosBasePath}/export`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ message: 'Export completed' }));
    },
  ),
  // POST tenant invite endpoint
  rest.post(`${getBaseApiUrl()}/api/tenant/invite`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ message: 'Invitation sent successfully' }),
    );
  }),
  // GET frameworks endpoint
  getMock(`${getBaseApiUrl()}/api/self-assessment/frameworks`, [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      framework_name: 'CIS',
      framework_version: 'v8',
      title: 'CIS Controls v8',
      type: 'official',
      control_implementation_label: 'control',
      sub_control_implementation_label: 'safeguard',
      framework_handler_type: 'standard',
      accept_inapplicable: true,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      maturity_levels: [
        { id: '1', label: 'Not Implemented', int_value: 0 },
        { id: '2', label: 'Partially Implemented', int_value: 1 },
        { id: '3', label: 'Fully Implemented', int_value: 2 },
      ],
      categories: [
        {
          id: 'CIS-1',
          name: 'Inventory and Control of Enterprise Assets',
          category_num: 1,
          description: 'Actively manage all enterprise assets',
          subcategories: [
            {
              id: 'CIS-1.1',
              name: 'Establish and Maintain Detailed Enterprise Asset Inventory',
              framework_reference: '1.1',
              description:
                'Maintain an up-to-date inventory of all enterprise assets',
            },
            {
              id: 'CIS-1.2',
              name: 'Address Unauthorized Assets',
              framework_reference: '1.2',
              description: 'Address and remove unauthorized assets',
            },
          ],
        },
        {
          id: 'CIS-2',
          name: 'Inventory and Control of Software Assets',
          category_num: 2,
          description: 'Actively manage all software on the network',
          subcategories: [
            {
              id: 'CIS-2.1',
              name: 'Establish and Maintain a Software Inventory',
              framework_reference: '2.1',
              description: 'Maintain an inventory of all software',
            },
          ],
        },
      ],
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      framework_name: 'NIST',
      framework_version: 'v2',
      title: 'NIST CSF v2',
      type: 'official',
      control_implementation_label: 'function',
      sub_control_implementation_label: 'category',
      framework_handler_type: 'grouped',
      accept_inapplicable: true,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      maturity_levels: [
        { id: '1', label: 'Not Implemented', int_value: 0 },
        { id: '2', label: 'Partially Implemented', int_value: 1 },
        { id: '3', label: 'Fully Implemented', int_value: 2 },
      ],
      categories: [
        {
          id: 'GV',
          name: 'Govern',
          category_num: 1,
          description:
            'Develop and implement organizational cybersecurity strategy',
        },
        {
          id: 'ID',
          name: 'Identify',
          category_num: 2,
          description: 'Develop understanding of cybersecurity risk',
        },
        {
          id: 'PR',
          name: 'Protect',
          category_num: 3,
          description: 'Develop and implement safeguards',
        },
      ],
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      framework_name: 'ISO27001',
      framework_version: '2022',
      title: 'ISO/IEC 27001:2022',
      type: 'official',
      control_implementation_label: 'control',
      sub_control_implementation_label: 'safeguard',
      framework_handler_type: 'standard',
      accept_inapplicable: true,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      maturity_levels: [
        { id: '1', label: 'Not Implemented', int_value: 0 },
        { id: '2', label: 'Partially Implemented', int_value: 1 },
        { id: '3', label: 'Fully Implemented', int_value: 2 },
      ],
      categories: [
        {
          id: 'A.5',
          name: 'Policies for Information Security',
          category_num: 5,
          description: 'Management direction for information security',
          subcategories: [
            {
              id: 'A.5.1',
              name: 'Policies for Information Security',
              framework_reference: 'A.5.1',
              description:
                'Policies shall be defined, approved by management, published, communicated',
            },
          ],
        },
        {
          id: 'A.6',
          name: 'Organization of Information Security',
          category_num: 6,
          description: 'Organization of information security',
        },
      ],
    },
  ]),
];
