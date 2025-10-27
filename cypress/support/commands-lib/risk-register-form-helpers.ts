import { CompanyApiData } from '@/types/companyForm';

export const initialAccessVectors = [
  'Valid Accounts',
  'Trusted Relationship',
  'Phishing',
  'External Remote Services',
  'Drive-By Compromise',
  'Replication Through Removable Media',
  'Supply Chain Compromise',
  'Hardware Additions',
  'Exploit Public Facing Application',
  'Lost or Stolen Devices',
  'Human Error',
  'Malicious Insider',
  'Content Injection',
];

export const eventTypes = ['ransomware', 'data_breach', 'interruption'];

export const clientImpacts = [
  'confidentiality_integrity',
  'availability',
  'extortion',
];

export const serverImpacts = [
  'confidentiality',
  'integrity',
  'availability',
  'extortion',
];

export const fillBasicScenarioDetails = (company: CompanyApiData) => {
  cy.get('[data-testid="crq-entity-select-trigger"]').click();
  cy.get('[data-testid="crq-entity-select-input"]').type(
    `${company.name}{enter}`,
  );

  cy.get('input[name="customer_scenario_id"]').type('RISK-001');
  cy.get('input[name="name"]').type('Test Risk Scenario');
  cy.get('textarea[name="description"]').type(
    'This is a test risk scenario description',
  );

  // Verify values were entered correctly
  cy.get('input[name="customer_scenario_id"]').should('have.value', 'RISK-001');
  cy.get('input[name="name"]').should('have.value', 'Test Risk Scenario');
  cy.get('textarea[name="description"]').should(
    'have.value',
    'This is a test risk scenario description',
  );
};

export const fillQualitativeMetrics = () => {
  // Open likelihood dropdown and select a value
  cy.get('[data-testid="likelihood-select"]').click();
  cy.get('[role="option"]').contains('Unlikely').click();

  // Open impact dropdown and select a value
  cy.get('[data-testid="impact-select"]').parent().click();
  cy.get('[role="option"]').contains('Minor').click();

  // Verify selections
  cy.get('[data-testid="likelihood-select"]').should('contain', 'Unlikely');
  cy.get('[data-testid="impact-select"]').should('contain', 'Minor');
};

export const fillFormCheckboxes = ({ type }: { type: 'fill' | 'verify' }) => {
  cy.get('[data-testid="initial-access-vectors-checkboxes"]').within(() => {
    cy.contains('Select All').click();
    type === 'verify' &&
      initialAccessVectors.forEach((vector) => {
        cy.get(`input[name="${vector.toLowerCase()}"]`)
          .should('exist')
          .and('be.checked');
        cy.get(`input[name="${vector.toLowerCase()}"]`)
          .parent()
          .find('button')
          .click();
        cy.get(`input[name="${vector.toLowerCase()}"]`).should(
          'not.be.checked',
        );
        cy.get(`input[name="${vector.toLowerCase()}"]`)
          .parent()
          .find('button')
          .click();
        cy.get(`input[name="${vector.toLowerCase()}"]`).should('be.checked');
      });
    if (type === 'verify') {
      cy.get('button').contains('Clear').click();
      initialAccessVectors.forEach((vector) => {
        cy.get(`input[name="${vector.toLowerCase()}"]`).should(
          'not.be.checked',
        );
      });
    }
  });
  cy.get('[data-testid="event-types-checkboxes"]').within(() => {
    eventTypes.forEach((eventType) => {
      cy.get(`input[name="${eventType.toLowerCase()}"]`).should(
        'not.be.checked',
      );
      cy.get(`input[name="${eventType.toLowerCase()}"]`)
        .parent()
        .find('button')
        .click();
      cy.get(`input[name="${eventType.toLowerCase()}"]`).should('be.checked');
      if (type === 'verify') {
        cy.get(`input[name="${eventType.toLowerCase()}"]`)
          .parent()
          .find('button')
          .click();
        cy.get(`input[name="${eventType.toLowerCase()}"]`).should(
          'not.be.checked',
        );
      }
    });
  });

  cy.get('[data-testid="impact-types-checkboxes"]').within(() => {
    clientImpacts.forEach((impact) => {
      cy.get(`input[name="${impact.toLowerCase()}"]`).should('not.be.checked');
      cy.get(`input[name="${impact.toLowerCase()}"]`)
        .parent()
        .find('button')
        .click();
      cy.get(`input[name="${impact.toLowerCase()}"]`).should('be.checked');
      if (type === 'verify') {
        cy.get(`input[name="${impact.toLowerCase()}"]`)
          .parent()
          .find('button')
          .click();
        cy.get(`input[name="${impact.toLowerCase()}"]`).should(
          'not.be.checked',
        );
      }
    });
  });
};

export const fillImpactMagnitude = (company: CompanyApiData) => {
  cy.get('[data-testid="impact-magnitude-sliders"]')
    .scrollIntoView()
    .within(() => {
      // Test data records compromised slider
      // check checkbox
      cy.get('[data-testid="data-records-compromised-checkbox"]').click();
      cy.get('[data-testid="data-records-compromised-slider-container"]')
        .find('[role="slider"]')
        .first()
        .focus()
        .type('{rightarrow}'.repeat(10)) // Move min value right
        .parent()
        .find('span')
        .should('contain', '100,000');

      cy.get('[data-testid="data-records-compromised-slider-container"]')
        .find('[role="slider"]')
        .last()
        .focus()
        .type('{leftarrow}'.repeat(10)) // Move max value left
        .parent()
        .find('span')
        .should('contain', '900,000');

      // Test event duration slider
      // check checkbox
      cy.get('[data-testid="event-duration-checkbox"]').click();
      cy.get('[data-testid="event-duration-slider-container"]')
        .find('[role="slider"]')
        .first()
        .focus()
        .type('{rightarrow}'.repeat(10))
        .parent()
        .find('span')
        .should('contain', '100,000');

      cy.get('[data-testid="event-duration-slider-container"]')
        .find('[role="slider"]')
        .last()
        .focus()
        .type('{leftarrow}'.repeat(10))
        .parent()
        .find('span')
        .should('contain', '900,000');

      // Test event cost slider
      // check checkbox
      cy.get('[data-testid="event-cost-checkbox"]').click();
      cy.get('[data-testid="event-cost-slider-container"]')
        .find('[role="slider"]')
        .first()
        .focus()
        .type('{rightarrow}'.repeat(10))
        .parent()
        .find('span')
        .should('contain', '100,000');

      cy.get('[data-testid="event-cost-slider-container"]')
        .find('[role="slider"]')
        .last()
        .focus()
        .type('{leftarrow}'.repeat(10))
        .parent()
        .find('span')
        .should('contain', '900,000');
    });
};
