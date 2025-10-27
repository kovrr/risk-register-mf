import { Chance } from 'chance';
import {
  MAX_OUTAGE_DURATION_HOURS,
  MAX_TIME_TO_RESTORE_DATA_HOURS,
} from '_pages/Sphere/constant';
const chance = new Chance();

const dataReacordTypes = [
  'PCI data records',
  'PHI data records',
  'PII data records',
  'Other sensitive data records',
];

interface EmployeeParams {
  numberOfEndpoints: number;
  incomeReliance: number;
  prodReliance: number;
}

export function fillSphereEmployees(
  { numberOfEndpoints }: Partial<EmployeeParams>,
  groupIdx = 0
) {
  cy.get(
    `input[name="employee_endpoints[${groupIdx}].number_of_endpoints"]`
  ).type(numberOfEndpoints?.toString() || '0');
  cy.contains('linux');
  cy.contains('windows');

  dataReacordTypes.forEach((dataType) => {
    cy.get(`[aria-label="employee_endpoints[${groupIdx}].access"]`)
      .children()
      .contains(dataType)
      .parent()
      .children()
      .contains(chance.pickone(['Yes', 'No']))
      .click();
  });
}

interface InfraParams {
  pci: number;
  phi: number;
  pii: number;
  maxStored: number;
}

export function fillSphereInfra(
  { pci, phi, pii, maxStored }: InfraParams,
  groupNumber = 0
) {
  cy.contains('linux');
  cy.contains('windows');
  cy.get('[aria-label="osInfra"]').children().click({ multiple: true });
  // just to close the dropdown
  cy.get('[aria-label="osInfra"]').click();

  cy.get(`input[name="infrastructure[${groupNumber}].pci_stored"]`).type(
    pci.toString()
  );
  cy.get(`input[name="infrastructure[${groupNumber}].phi_stored"]`).type(
    phi.toString()
  );
  cy.get(`input[name="infrastructure[${groupNumber}].pii_stored"]`).type(
    pii.toString()
  );
  cy.get(
    `[name="infrastructure[${groupNumber}].max_number_of_records_stored_together"]`
  ).type(maxStored.toString());
}

interface CloudParams {
  pci: number;
  phi: number;
  pii: number;
  maxStored: number;
  incomeReliance: number;
  prodReliance: number;
  haveSensitive: boolean;
}

export function fillSphereCloud(
  {
    haveSensitive,
    pci,
    phi,
    pii,
    maxStored,
    prodReliance,
    incomeReliance,
  }: CloudParams,
  groupNumber = 0
) {
  cy.get(`input[name="cloud[${groupNumber}].pci_stored"]`).type(pci.toString());
  cy.get(`input[name="cloud[${groupNumber}].phi_stored"]`).type(phi.toString());
  cy.get(`input[name="cloud[${groupNumber}].pii_stored"]`).type(pii.toString());
  cy.get(
    `[name="cloud[${groupNumber}].max_number_of_records_stored_together"]`
  ).type(maxStored.toString());
  cy.get(`[name="cloud[${groupNumber}].productivity_reliance"]`)
    .clear()
    .type(prodReliance.toString());
  cy.get(`[name="cloud[${groupNumber}].income_reliance"]`)
    .clear()
    .type(incomeReliance.toString());
}

interface OTParams {
  haveCollateralDamageCost: boolean;
  haveQualityControl: boolean;
  lifeCycle: number;
  havePotentialLiability: boolean;
  severity_average: number;
  severity_max: number;
  severity_min: number;
  prodReliance: number;
  incomeReliance: number;
  distributionType: string;
}

export function fillSphereOT(
  {
    haveCollateralDamageCost,
    haveQualityControl,
    lifeCycle,
    havePotentialLiability,
    severity_average,
    severity_max,
    severity_min,
    prodReliance,
    incomeReliance,
    distributionType,
  }: OTParams,
  groupNumber = 0
) {
  cy.get(`[name="ot[${groupNumber}].productivity_reliance"]`)
    .clear()
    .type(prodReliance.toString());
  cy.get(`[name="ot[${groupNumber}].income_reliance"]`)
    .clear()
    .type(incomeReliance.toString());
  cy.get(`[name="ot[${groupNumber}].severity_min"]`)
    .clear()
    .type(severity_min.toString());
  cy.get(`[name="ot[${groupNumber}].severity_max"]`)
    .clear()
    .type(severity_max.toString());
  cy.get(`[name="ot[${groupNumber}].severity_min"]`)
    .clear()
    .type(severity_average.toString());
  cy.get(`[name="ot[${groupNumber}].average_life_cycle_of_critical_devices"]`)
    .clear()
    .type(lifeCycle.toString());
  console.log(distributionType);
  cy.contains(distributionType).click();
  cy.contains(
    'Is there a collateral damage cost associated with this asset group, for example, inventory stock and other property?*'
  )
    .parent()
    .children()
    .contains(haveCollateralDamageCost ? 'Yes' : 'No')
    .click();
  cy.contains(
    'Is there a potential liability cost associated with this asset group, for example, loss of safety or injury? *'
  )
    .parent()
    .children()
    .contains(havePotentialLiability ? 'Yes' : 'No')
    .click();
  cy.contains(
    'Is there any quality control process associated with this asset group?'
  )
    .parent()
    .children()
    .contains(haveQualityControl ? 'Yes' : 'No')
    .click();
}

export function fillSphereSecurityProfile({
  name,
  outageHoursToMaterialImpact = chance.natural({
    max: MAX_OUTAGE_DURATION_HOURS,
  }),
  hoursToRestore = chance.natural({ max: MAX_TIME_TO_RESTORE_DATA_HOURS }),
  groupNumber = 0,
}: any) {
  const getSelector = (postfix: string) => {
    return `[name="security_profiles[${groupNumber}].${postfix}"`;
  };
  name && cy.get(getSelector('profile_name')).clear().type(`${name}{enter}`);
  cy.get(getSelector('outage_hours_to_material_impact')).type(
    outageHoursToMaterialImpact
  );
  cy.get(
    getSelector('hours_to_restore_critical_business_ops_after_interruption')
  ).type(hoursToRestore);
}

const fillSelect = (value: any, selector: string) => {
  cy.get(selector)
    .siblings('div')
    .find('div input')
    .type(`${value}{enter}`, { force: true });
};

export function fillDamageType({
  name,
  minVal,
  maxVal,
  modeVal,
  eventType,
  impact,
  groupNumber = 0,
}: any) {
  const getSelector = (postfix: string) => {
    return `[name="custom_cost_components[${groupNumber}].${postfix}"`;
  };
  fillSelect(name, getSelector('cc_name'));
  cy.get(getSelector('cost_dist.min_val')).clear().type(minVal);
  cy.get(getSelector('cost_dist.mode_val')).type(modeVal);
  cy.get(getSelector('cost_dist.max_val')).type(maxVal);
  fillSelect(eventType, getSelector('event_type'));
  fillSelect(impact, getSelector('impact_scenario'));
}

const notAllowedChar = '<';
const notUnicodeChar = 'ࢠ';

export const validateAssetGroupNames = () => {
  cy.contains('Add Asset Group').click();
  cy.get('[data-testid="ag_name"]')
    .clear()
    .type(`${notUnicodeChar}`)
    .type('{enter}');
  cy.contains(`Value must contain only valid Latin Unicode characters`).should(
    'exist'
  );
  cy.get('[data-testid="ag_name"]')
    .clear()
    .type(`${notAllowedChar}`)
    .type('{enter}');
  cy.contains(`'<' is not an allowed character`).should('exist');
  cy.get('[data-testid="ag_name"]').clear().type('Hello').type('{enter}');
  cy.contains('Add Asset Group').click();
  cy.get('[data-testid="ag_name"]').type('hello').type('{enter}');
  cy.contains(`Name already exists`).should('exist');
};

export const badEmployeeEndpointsResponse = {
  loc: ['body', 'sphere', 'employee_endpoints', 0, 'number_of_endpoints'],
  msg: 'value is not a valid integer',
  type: 'type_error.integer',
};

export const badInfrastructureResponse = {
  loc: [
    'body',
    'sphere',
    'infrastructure',
    0,
    'max_number_of_records_stored_together',
  ],
  msg: 'value is not a valid integer',
  type: 'type_error.integer',
};
