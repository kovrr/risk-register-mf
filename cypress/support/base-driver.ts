import { chance } from '@/mocks/builders/buildingUtils';
import { allVisibleMenuItemsMock } from '@/mocks/builders/buildMenuItemsPermissions';
import { buildTransparencyLambdaUpdate } from '@/mocks/builders/transperancyBuilder';
import { cisToOtherFrameworks } from '@/mocks/data/cisToOtherFrameworks';
import {
  transparency,
  transparencyAllAbove,
} from '@/mocks/data/transparencyData';
import {
  ApplicationSubType,
  ApplicationType,
  applicationTypes,
  foqusApplicationSubTypes,
} from '@/types/applicationTypes';
import { CompanyApiData } from '@/types/companyForm';
import {
  CombinedPermissionType,
  ExtendedPermissionType,
  HighOrderPermissions,
  PermissionType,
  PermissionTypes,
} from '@/types/permissions';
import { QuantificationData } from '@/types/quantificationData';
import { RiskRegisterResponse } from '@/types/riskRegister';
import { FeatureToggle } from '@/types/tenantData';

const getNumberOfPages = (companiesLength: number): number =>
  Math.ceil(companiesLength / 10);

export class BaseDriver {
  companies: CompanyApiData[] = [];
  tenantId: string = chance.guid();
  private fqs: QuantificationData[] = [];
  private featureToggles: FeatureToggle[] = [];
  private userPermissionKeys: string[] = [
    HighOrderPermissions.fqCreate,
    HighOrderPermissions.companyCreate,
    HighOrderPermissions.fqReadAll,
  ];
  private userId = chance.guid();
  private transparencyData = {};
  private applicationType: ApplicationType = applicationTypes.FOQUS;
  private applicationSubType?: ApplicationSubType =
    foqusApplicationSubTypes.FOQUS;
  private riskRegisterScenarios: RiskRegisterResponse[] = [];

  getTenantId() {
    return this.companies[0]?.tenant_id || this.tenantId;
  }

  withUserId(userId: string) {
    this.userId = userId;
    return this;
  }

  withCompanies(companies: CompanyApiData[]) {
    this.companies = companies;
    return this;
  }
  withFq(fqs: QuantificationData[]) {
    this.fqs = fqs;
    return this;
  }

  withFeatureToggle(featureToggle: string, value: any = true) {
    this.featureToggles.push({ name: featureToggle, value });
    return this;
  }

  withFeatureToggles(featureToggles: { name: string; value: any }[]) {
    this.featureToggles = featureToggles;
    return this;
  }
  withDemoUser() {
    this.userPermissionKeys = [
      HighOrderPermissions.fqReadAll,
      HighOrderPermissions.guestUser,
    ];
    return this;
  }
  limitRiskRegisterPermissions() {
    this.userPermissionKeys = [
      ...this.userPermissionKeys,
      HighOrderPermissions.riskRegisterLimitedUser,
      HighOrderPermissions.fqReadAll,
    ];
    return this;
  }
  withPermissions(permissions: CombinedPermissionType[] = []) {
    this.userPermissionKeys = permissions;
    return this;
  }
  withRiskRegisterTemplateEnabled() {
    this.featureToggles.push({
      name: 'enable.RiskRegisterTemplate',
      value: true,
    });
    return this;
  }
  withCompanyLevelPermissionsEnabled() {
    this.featureToggles.push({
      name: 'enable.companyLevelPermissions',
      value: true,
    });
    return this;
  }
  withCompanyLevelPermissions({
    companyIds,
    tenantId,
    permissions = Object.values(PermissionTypes),
  }: {
    companyIds: string[];
    tenantId: string;
    permissions?: PermissionType[];
  }) {
    const companyLevelPermissions = companyIds
      .map((companyId) =>
        permissions.map(
          (permission) => `${tenantId}.company.${companyId}.${permission}`,
        ),
      )
      .flat();
    this.userPermissionKeys = [
      ...this.userPermissionKeys,
      ...companyLevelPermissions,
    ];
    return this;
  }

  withTenantLevelPermissions({
    tenantId,
    permissions,
  }: {
    tenantId: string;
    permissions: ExtendedPermissionType[];
  }) {
    const tenantPermissions = permissions.map(
      (permission) => `${tenantId}.${permission}`,
    );
    this.userPermissionKeys = [
      ...this.userPermissionKeys,
      ...tenantPermissions,
    ];
    return this;
  }
  withAboveBenchMarkTransparency() {
    this.transparencyData = transparencyAllAbove;
    return this;
  }
  withRegularTransparency() {
    this.transparencyData = transparency;
    return this;
  }
  withNewLambdaTransparency() {
    this.transparencyData = buildTransparencyLambdaUpdate();
    return this;
  }
  with50DomainsAllowed() {
    this.featureToggles.push({
      name: 'feature.spec.maxDomains50',
      value: true,
    });
    return this;
  }

  withHighLevelControls() {
    this.featureToggles.push({
      name: 'feature.spec.highLevelControls',
      value: true,
    });
    return this;
  }
  withAsbControls() {
    this.featureToggles.push({
      name: 'feature.spec.asbControls',
      value: true,
    });
    return this;
  }
  withCISv8Controls() {
    this.featureToggles.push({
      name: 'feature.spec.cisV8Controls',
      value: true,
    });
    return this;
  }
  withServiceNow() {
    this.featureToggles.push({ name: 'enable.ServiceNow', value: true });
    return this;
  }
  withCrowdStrike() {
    this.featureToggles.push({ name: 'enable.crowdstrike', value: true });
    return this;
  }
  withTenable() {
    this.featureToggles.push({ name: 'enable.tenable', value: true });
    return this;
  }
  withMicrosoftRoci() {
    this.featureToggles.push({
      name: 'feature.spec.microsoftRoci',
      value: true,
    });
    return this;
  }

  withRiskDriverDrillDown() {
    this.featureToggles.push({
      name: 'enable.spec.riskDriverDrillDown',
      value: true,
    });
    return this;
  }
  withRiskRegisterEnabled() {
    this.featureToggles.push({
      name: 'enable.riskRegister',
      value: true,
    });
    return this;
  }
  withRiskRegisterCRQEnabled() {
    this.featureToggles.push({
      name: 'enable.riskRegister.crq',
      value: true,
    });
    return this;
  }
  withRiskRegister(scenarios: RiskRegisterResponse[]) {
    this.riskRegisterScenarios = scenarios;
    return this;
  }
  withRiskRegisterExport() {
    this.featureToggles.push({
      name: 'enable.riskRegister.export',
      value: true,
    });
    return this;
  }
  withManualIntegrations() {
    this.featureToggles.push(
      { name: 'enable.panaseer', value: true },
      { name: 'enable.crowdstrike', value: true },
      { name: 'enable.axonius', value: true },
      { name: 'enable.cybergrx', value: true },
      { name: 'enable.bitsight', value: true },
      { name: 'enable.forescout', value: true },
      { name: 'enable.rapid7', value: true },
      { name: 'enable.qualys', value: true },
    );
    return this;
  }

  withRiskProgression() {
    this.featureToggles.push({
      name: 'enable.spec.riskProgression',
      value: true,
    });
    return this;
  }

  withCRQReport() {
    this.featureToggles.push({
      name: 'enable.crqReport',
      value: true,
    });
    return this;
  }
  withMaterialityAnalysis() {
    this.featureToggles.push({
      name: 'enable.spec.materialityAnalysis',
      value: true,
    });
    return this;
  }

  withApplicationType(applicationType: ApplicationType) {
    this.applicationType = applicationType;
    return this;
  }

  withApplicationSubType(applicationSubType: ApplicationSubType) {
    this.applicationSubType = applicationSubType;
    return this;
  }

  withDisableSSCOnCompany() {
    this.featureToggles.push({
      name: 'disable.sscOnCompany',
      value: true,
    });
    return this;
  }

  withRunNewFQModal() {
    this.featureToggles.push({
      name: 'feature.spec.newRunFQModal',
      value: true,
    });
    return this;
  }

  withDynamicSidebar() {
    cy.intercept('GET', '**/api/components/fq_menu_items', {
      body: allVisibleMenuItemsMock,
    }).as('fqMenuItems');

    return this;
  }
  withDynamicSidebarV1() {
    cy.intercept('GET', '**/api/components/fq_menu_items_v1', {
      body: allVisibleMenuItemsMock,
    }).as('fqMenuItemsV1');

    return this;
  }

  withFqSideBarV1() {
    this.featureToggles.push({
      name: 'enable.foqus.reorganize',
      value: true,
    });
    return this;
  }
  withFqSideBarV1Off() {
    this.featureToggles.push({
      name: 'enable.foqus.reorganize',
      value: false,
    });
    return this;
  }

  _setPagination(numberOfPages: number, items: any[], endpointKey: string) {
    Array.from({ length: numberOfPages }, (_, i) => i + 1).forEach((page) => {
      const itemsPerPage = page * 10;
      const body = {
        items: items.slice(itemsPerPage - 10, itemsPerPage),
        total: items.length,
      };
      cy.intercept(
        'GET',
        `/api/${endpointKey.toLocaleLowerCase()}?page=${page}&size=10&fields=*`,
        {
          body,
        },
      ).as(`${endpointKey}${page}`);
      cy.intercept(
        'GET',
        `/api/${endpointKey.toLocaleLowerCase()}?page=${page}&size=10&name=`,
        {
          body,
        },
      ).as(`${endpointKey}${page}`);
    });
  }

  mock() {
    console.log('mocking with permissions' + this.userPermissionKeys);
    const numberOfPages = getNumberOfPages(this.companies.length) || 1;
    const riskRegisterScenariosNumberOfPages =
      getNumberOfPages(this.riskRegisterScenarios.length) || 1;

    cy.intercept('POST', '/next-api/log', { body: { message: 'ok' } }).as(
      'log',
    );

    cy.intercept('GET', 'https://cdn.document360.io/static/js/widget.js', {
      body: {},
    }).as('kovrrTrust');

    Array.from({ length: numberOfPages }, (_, i) => i + 1).forEach((page) => {
      const companiesPerPage = page * 10;
      const body = {
        items: this.companies.slice(companiesPerPage - 10, companiesPerPage),
        total: this.companies.length,
      };
      cy.intercept('GET', `/api/companies?page=${page}&size=10&fields=*`, {
        body,
      }).as(`Companies${page}`);
      cy.intercept('GET', `/api/companies?page=${page}&size=10&name=`, {
        body,
      }).as(`Companies${page}`);
    });
    Array.from(
      { length: riskRegisterScenariosNumberOfPages },
      (_, i) => i + 1,
    ).forEach((page) => {
      const scenariosPerPage = page * 10;
      const body = {
        items: this.riskRegisterScenarios.slice(
          scenariosPerPage - 10,
          scenariosPerPage,
        ),
        total: this.riskRegisterScenarios.length,
      };
      [
        'customer_scenario_id',
        'name',
        'likelihood',
        'impact',
        'annual_likelihood',
        'average_loss',
        'risk_priority',
        'response_plan',
        'updated_at',
        'risk_owner',
      ].forEach((column) => {
        cy.intercept(
          'GET',
          `/api/risk-scenarios?page=${page}&size=10&sort_by=${column}&sort_order=desc`,
          {
            body,
          },
        ).as(`Scenarios${column}Desc${page}`);
        cy.intercept(
          'GET',
          `/api/risk-scenarios?page=${page}&size=10&sort_by=${column}&sort_order=asc`,
          {
            body,
          },
        ).as(`Scenarios${column}Asc${page}`);
      });
    });
    cy.mockFrontegg(this.userPermissionKeys, this.userId, this.applicationType);
    cy.intercept('GET', 'api/tenant_application_details', {
      body: {
        application_type: this.applicationType,
        application_sub_type: this.applicationSubType,
      },
    });
    const tenantId = this.getTenantId();
    cy.intercept('GET', '/api/tenant', {
      body: {
        feature_toggles: this.featureToggles,
        id: tenantId,
      },
    }).as('Tenant Data');
    cy.intercept('GET', `/api/cis_mappings`, { body: cisToOtherFrameworks });
    this.companies.forEach((company) => {
      cy.intercept('GET', `/api/companies/${company.id}`, {
        body: company,
      }).as(`Company - ${company.name}`);
      cy.intercept('DELETE', `/api/companies/${company.id}`, {
        body: {},
        statusCode: 204,
      }).as('deleteCompany');
    });

    this.fqs.forEach((fq) => {
      cy.intercept('GET', `/api/fq/${fq.id}/transparency`, {
        body: this.transparencyData,
      }).as(`${fq.id} - transparency`);
      cy.intercept('GET', `/api/fq/${fq.id}`, {
        body: fq,
      }).as(`FQ - ${fq.id}`);
    });
    cy.mockMixpanel();
  }

  tearDown() {
    cy.window().then((win) => {
      win.location.href = 'about:blank';
    });
  }
}
