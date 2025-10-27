interface FillCompanyPageParams {
  name: string;
  revenue: number;
  domains: string[];
  currency: string;
  employees: string;
  countries: string[];
  industries: string[];
}

export function fillCompanyPage({
  name,
  revenue,
  domains,
  currency,
  employees,
  countries,
  industries,
}: FillCompanyPageParams) {
  cy.get('input[name="name"]').type(name);
  domains.forEach((domain) => {
    cy.contains('URLs*').parent().type(`${domain}{enter}`);
  });
  cy.contains('Currency*').parent().type(`${currency}{enter}`);
  cy.contains('Number of Employees*').parent().type(`${employees}{enter}`);
  cy.get('input[name="revenue"]').type(revenue.toString());
  cy.get('button:visible').contains('Next').click();
  countries.forEach((country) => {
    cy.contains('Countries of Operation*')
      .parent()
      .type(`${country}{enter}`)
      .click(); // click closes multi-select dialogs and not always needed
  });
  industries.forEach((sic) => {
    cy.contains('Industries of Operation*')
      .parent()
      .type(`${sic}{enter}`)
      .click();
  });
  cy.get('button:visible').contains('Next').click();
  cy.get('button:visible').contains('Next').click();
}
