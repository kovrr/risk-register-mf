export const validateDropDown = (
  textToContain: string,
  valueToType: string,
  dropdownRequired = true
) => {
  cy.contains(textToContain).parent().click();
  cy.get('body').click();
  if (dropdownRequired) {
    cy.get('[data-testid="form-error-label"]').contains('Required');
  }
  cy.contains(textToContain).parent().type(`${valueToType}{enter}`);
  // Wait a bit for the form to update and error to disappear
  cy.wait(500);
  cy.get('[data-testid="form-error-label"]').should('not.exist');
};

export const fillInputWithMaxValue = (
  fieldName: string,
  valueToType: number,
  errorMessage: string
) => {
  cy.get(`input[name="${fieldName}"]`).type(`${valueToType}`).blur();
  cy.get('[data-testid="form-error-label"]').contains(errorMessage);
};
