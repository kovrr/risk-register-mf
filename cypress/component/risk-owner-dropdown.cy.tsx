import { chance } from '@/mocks/builders/buildingUtils';
import {
  buildRiskOwner,
  buildRiskOwners,
  buildRiskRegisterResponse,
} from '@/mocks/builders/riskRegisterBuilders';
import { RiskOwnerDropdownMutate } from '@/_pages/RiskRegister/components/RiskOwner';
import { registerToRowData } from '@/_pages/RiskRegister/ScenarioDrillDown/RiskManagement/RiskManagementFormOld';

const riskOwners = buildRiskOwners();
const scenario = buildRiskRegisterResponse(
  {},
  {
    risk_owner: riskOwners[0].id,
  },
);
const scenarioRowData = registerToRowData(scenario);

describe('Risk Owner Dropdown', () => {
  beforeEach(() => {
    cy.mockFrontegg([]);
    cy.intercept('GET', '/api/tenant/users', {
      statusCode: 200,
      body: riskOwners,
    }).as('getRiskOwners');
    cy.intercept(
      'GET',
      `/api/risk-register/scenarios/${scenario.scenario_id}`,
      {
        statusCode: 200,
        body: scenario,
      },
    ).as('getScenario');
    cy.intercept(
      'PATCH',
      `/api/risk-register/scenarios/${scenario.scenario_id}`,
      (req) => {
        const updatedScenario = {
          ...scenario,
          scenario_data: {
            ...scenario.scenario_data,
            owner: req.body.risk_owner,
          },
        };
        req.reply({
          statusCode: 200,
          body: updatedScenario,
        });
      },
    ).as('updateScenario');
    cy.mount(
      <RiskOwnerDropdownMutate
        rowData={scenarioRowData}
        value={scenarioRowData.owner}
      />,
    );
  });

  it('should have value in dropdown and change it', () => {
    cy.get('[data-testid="risk-owner-dropdown-trigger"]')
      .contains(riskOwners[0].email)
      .click();
    cy.get('[data-testid="risk-owner-dropdown-input"]').type(
      `${riskOwners[1].email}{enter}`,
    );
    cy.get('[data-testid="risk-owner-dropdown-trigger"]')
      .contains(riskOwners[1].email)
      .click();
    cy.get('[data-testid="risk-owner-dropdown-input"]').type(
      `${riskOwners[1].email}{enter}`,
    );
    cy.get('[data-testid="risk-owner-dropdown-trigger"]').contains('Assign');
  });

  it('should invite non existent user', () => {
    const newRiskOwner = buildRiskOwner();
    const [firstname, lastname] = [chance.first(), chance.last()];
    cy.intercept('POST', '/api/tenant/invite', {
      statusCode: 200,
      body: newRiskOwner,
    }).as('inviteRiskOwner');
    cy.get('[data-testid="risk-owner-dropdown-trigger"]')
      .contains(riskOwners[0].email)
      .click();
    cy.get('[data-testid="risk-owner-dropdown-input"]').type(
      `${newRiskOwner.email}{enter}`,
    );
    // Fill in the invitation form
    cy.get('input[name="firstname"]').type(firstname);
    cy.get('input[name="lastname"]').type(lastname);
    cy.get('input[name="email"]').should('have.value', newRiskOwner.email);
    cy.get('input[name="phone"]').type(chance.phone());

    // Intercept the GET users request to include the newly invited user
    cy.intercept('GET', '/api/tenant/users', (req) => {
      req.reply({
        statusCode: 200,
        body: [newRiskOwner, ...riskOwners],
      });
    }).as('getUsers');
    // Submit the form
    cy.get('button[type="submit"]').click();

    // Wait for the invitation request to complete
    cy.wait('@inviteRiskOwner');
    cy.wait('@getUsers');
    cy.get('[data-testid="risk-owner-dropdown-trigger"]').contains(
      newRiskOwner.email,
    );
  });
});
