import { CustomFieldsSection } from '@/_pages/RiskRegister/ScenarioDrillDown/RiskManagement/CustomFields';
import {
  buildCompanyWithSphere,
  buildLastQuantification,
} from '@/mocks/builders/companyBuilder';
import { buildQuantification } from '@/mocks/builders/quantificationBuilders';
import { buildCRQRiskRegisterResponse } from '@/mocks/builders/riskRegisterBuilders';
import {
  cisResultsFQNewSchema,
  mockCisInputData,
} from '@/mocks/data/fqResults';
import { CompanyApiData, CompanyStatus } from '@/types/companyForm';
import { QuantificationData } from '@/types/quantificationData';
import {
  CustomField,
  customFieldTypes,
  RiskRegisterResponse,
} from '@/types/riskRegister';
import { BaseDriver } from '../support/base-driver';

describe('Custom Fields', () => {
  let driver: BaseDriver,
    company: CompanyApiData,
    fq: QuantificationData,
    mockScenario: RiskRegisterResponse;

  beforeEach(() => {
    driver = new BaseDriver();
    company = buildCompanyWithSphere({
      status: CompanyStatus.COMPLETED,
      last_quantification: buildLastQuantification({
        id: 'new-schema-cis-fq-id',
        results_narrative: cisResultsFQNewSchema,
      }),
    });
    fq = buildQuantification({
      id: 'new-schema-cis-fq-id',
      results_narrative: cisResultsFQNewSchema,
      input_data: mockCisInputData,
      status: 'Success',
    });

    mockScenario = buildCRQRiskRegisterResponse(
      {
        customer_scenario_id: 'RISK-001',
        name: 'Test Risk Scenario',
        description: 'This is a test risk scenario description',
      },
      'complete',
      { company_id: company.id },
    );

    // Ensure custom_fields exists
    if (!mockScenario.scenario_data.custom_fields) {
      mockScenario.scenario_data.custom_fields = [];
    }

    // Mock API calls
    cy.intercept(
      'GET',
      `/api/risk-register/scenarios/${mockScenario.scenario_id}`,
      {
        statusCode: 200,
        body: mockScenario,
      },
    ).as('getScenario');

    cy.intercept(
      'PATCH',
      `/api/risk-register/scenarios/${mockScenario.scenario_id}`,
      {
        statusCode: 200,
        body: (req: { body: Partial<RiskRegisterResponse> }) => {
          // Update the mock scenario with the new data
          mockScenario = {
            ...mockScenario,
            scenario_data: {
              ...mockScenario.scenario_data,
              ...req.body,
            },
          };
          return mockScenario;
        },
      },
    ).as('updateScenario');
    driver.withCompanies([company]).withFq([fq]).mock();
    cy.mockFrontegg([]);
    cy.mount(<CustomFieldsSection scenario={mockScenario} />, {
      routerParams: {
        scenarioId: mockScenario.scenario_id,
      },
    });
    cy.wait(1000);
  });

  it('should render all custom fields in view mode', () => {
    const mockFields = mockScenario.scenario_data.custom_fields || [];
    mockFields.forEach((field) => {
      cy.contains(field.field_name).should('be.visible');
    });
  });

  it('should add a new custom field', () => {
    const newField = {
      field_name: 'New Currency Field',
      field_type: customFieldTypes.CURRENCY,
      attributes: { currency: 'EUR' },
    };

    // Click add button
    cy.contains('Add').click();

    // Select field type
    cy.get('[data-testid="field-type-select-currency"]').click();

    // Configure field
    cy.get('[data-testid="field-name-input"]').type(newField.field_name);
    cy.get('[data-testid="field-currency-select"]').select(
      newField.attributes.currency,
    );

    // Save field
    cy.get('[data-testid="field-config-save-button"]').click();

    // Verify the update request
    cy.wait('@updateScenario').then((interception) => {
      const updatedFields = interception.request.body.custom_fields;
      const addedField = updatedFields.find(
        (f: CustomField) => f.field_name === newField.field_name,
      );
      expect(addedField).to.exist;
      expect(addedField.field_type).to.equal(newField.field_type);
      expect(addedField.attributes).to.deep.equal(newField.attributes);
    });
  });

  it('should edit an existing custom field', () => {
    const mockFields = mockScenario.scenario_data.custom_fields || [];
    if (mockFields.length === 0) return;

    const fieldToEdit = mockFields[0];
    const updatedName = 'Updated Field Name';

    // Click edit button for first field
    cy.get('[data-testid="field-edit-button"]').first().click();

    // Edit field name
    cy.get('[data-testid="field-name-input"]').clear().type(updatedName);

    // Save changes
    cy.get('[data-testid="field-config-save-button"]').click();

    // Verify the update request
    cy.wait('@updateScenario').then((interception) => {
      const updatedFields = interception.request.body.custom_fields;
      const updatedField = updatedFields.find(
        (f: CustomField) => f.id === fieldToEdit.id,
      );
      expect(updatedField.field_name).to.equal(updatedName);
    });
  });

  it('should delete a custom field', () => {
    const mockFields = mockScenario.scenario_data.custom_fields || [];
    if (mockFields.length === 0) return;

    const fieldToDelete = mockFields[0];

    // Click delete button for first field
    cy.get('[data-testid="field-delete-button"]').first().click();

    // Verify the update request
    cy.wait('@updateScenario').then((interception) => {
      const updatedFields = interception.request.body.custom_fields;
      expect(updatedFields.find((f: CustomField) => f.id === fieldToDelete.id))
        .to.not.exist;
    });
  });

  describe('Field Validations', () => {
    it.only('should validate field values', () => {
      // Add and validate currency field
      cy.get('[data-testid^="field-"]').then(($fieldsBefore) => {
        const countBefore = $fieldsBefore.length;
        cy.contains('Add').click();
        cy.get('[data-testid="field-type-select-currency"]').click();
        cy.get('[data-testid="field-name-input"]').type('Currency Field');
        cy.get('[data-testid="field-currency-select"]').select('USD');
        cy.get('[data-testid="field-config-save-button"]').click();
        cy.wait('@updateScenario');
        cy.get('[data-testid^="field-"]')
          .should('have.length.greaterThan', countBefore)
          .then(($fieldsAfter) => {
            cy.wrap($fieldsAfter[countBefore]).within(() => {
              cy.get('[data-testid="currency-field-input"]').should('exist');
              cy.get('[data-testid="currency-field-input"]')
                .clear()
                .type('abc')
                .should('have.value', '');
              cy.get('[data-testid="currency-field-input"]')
                .clear()
                .type('123.45')
                .should('have.value', '1235');
            });
          });
      });

      // Add and validate number field
      cy.get('[data-testid^="field-"]').then(($fieldsBefore) => {
        const countBefore = $fieldsBefore.length;
        cy.contains('Add').click();
        cy.get('[data-testid="field-type-select-number"]').click();
        cy.get('[data-testid="field-name-input"]').type('Number Field');
        cy.get('[data-testid="field-config-save-button"]').click();
        cy.wait('@updateScenario');
        cy.get('[data-testid^="field-"]')
          .should('have.length.greaterThan', countBefore)
          .then(($fieldsAfter) => {
            cy.wrap($fieldsAfter[countBefore]).within(() => {
              cy.get('[data-testid="number-field-input"]').should('exist');
              cy.get('[data-testid="number-field-input"]')
                .clear()
                .type('-100')
                .should('have.value', '-100');
              cy.get('[data-testid="number-field-input"]')
                .clear()
                .type('abc')
                .should('have.value', '0');
              cy.get('[data-testid="number-field-input"]')
                .clear()
                .type('123.45')
                .should('have.value', '123.450');
            });
          });
      });

      // Add and validate date field
      cy.get('[data-testid^="field-"]').then(($fieldsBefore) => {
        const countBefore = $fieldsBefore.length;
        cy.contains('Add').click();
        cy.get('[data-testid="field-type-select-date"]').click();
        cy.get('[data-testid="field-name-input"]').type('Date Field');
        cy.get('[data-testid="field-config-save-button"]').click();
        cy.wait('@updateScenario');
        cy.get('[data-testid^="field-"]')
          .should('have.length.greaterThan', countBefore)
          .then(($fieldsAfter) => {
            cy.wrap($fieldsAfter[countBefore]).within(() => {
              cy.get('[data-testid="date-field-input"]').should('exist');
              cy.get('[data-testid="date-field-input"]')
                .click()
                .type('2024-12-31');
              cy.get('[data-testid="date-field-input"]').should(
                'have.value',
                '2024-12-31',
              );
            });
          });
      });

      // Add and validate text field
      cy.get('[data-testid^="field-"]').then(($fieldsBefore) => {
        const countBefore = $fieldsBefore.length;
        cy.contains('Add').click();
        cy.get('[data-testid="field-type-select-text"]').click();
        cy.get('[data-testid="field-name-input"]').type('Text Field');
        cy.get('[data-testid="field-config-save-button"]').click();
        cy.wait('@updateScenario');
        cy.get('[data-testid^="field-"]')
          .should('have.length.greaterThan', countBefore)
          .then(($fieldsAfter) => {
            cy.wrap($fieldsAfter[countBefore]).within(() => {
              cy.get('[data-testid="text-field-input"]').should('exist');
              cy.get('[data-testid="text-field-input"]')
                .clear()
                .type('a'.repeat(39))
                .should('have.value', 'a'.repeat(39));
            });
          });
      });

      // Add and validate tags field
      cy.get('[data-testid^="field-"]').then(($fieldsBefore) => {
        const countBefore = $fieldsBefore.length;
        cy.contains('Add').click();
        cy.get('[data-testid="field-type-select-tags"]').click();
        cy.get('[data-testid="field-name-input"]').type('Tags Field');
        cy.get('[data-testid="field-config-save-button"]').click();
        cy.wait('@updateScenario');
        cy.get('[data-testid^="field-"]')
          .should('have.length.greaterThan', countBefore)
          .then(($fieldsAfter) => {
            cy.wrap($fieldsAfter[countBefore]).within(() => {
              cy.get('[data-testid="new-tag-input"]').type('   ');
              cy.get('[data-testid="new-tag-input"]')
                .type('tag1')
                .trigger('keydown', { key: 'Tab' });
              cy.get('[data-testid="remove-tag-tag1"]').should('exist');
              cy.get('[data-testid="new-tag-input"]')
                .type('tag2')
                .trigger('keydown', { key: 'Tab' });
              cy.get('[data-testid="remove-tag-tag2"]').should('exist');
              cy.get('[data-testid="new-tag-input"]')
                .type(`${`a`.repeat(100)}`)
                .trigger('keydown', { key: 'Tab' });
              cy.get(`[data-testid="remove-tag-${`a`.repeat(100)}"]`).should(
                'exist',
              );
            });
          });
      });
    });
  });
});
