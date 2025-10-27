export const verifyLossImpactScenariosHasKeyComponents = () => {
  cy.contains('Total Annual Cyber Risk Exposure');
  cy.contains('Business Impact Scenarios');
  cy.contains('Business Interruption');
  cy.contains('Ransomware & Extortion');
  cy.contains('Regulation & Compliance');
  cy.contains('Third Party Service Provider Failure');
  cy.contains('Third Party Liability');
  cy.contains('Data Theft & Privacy');
};

export const verifyRiskProgressionHasKeyComponents = () => {
  cy.contains('Risk Position Analysis');
};

export const verifyWhatIfHasKeyComponents = () => {
  cy.contains('Control');
  cy.contains('Current Minimum');
  cy.contains('Target Minimum');
  cy.contains('Average Effect');
};
export const verifyControlsMitigationHasKeyComponents = (
  withHighEffect = false
) => {
  cy.contains('Asset Group');
  cy.contains('Asset Group Type');
  cy.contains('Control');
  cy.contains('Action');
  cy.contains('Average Effect');
  if (withHighEffect) {
    cy.contains('High Effect');
  }
};
export const verifyRiskTransferHasKeyComponents = () => {
  cy.contains('Insurance Terms Stress Testing');
  cy.contains('Annual Exposure');
  cy.contains('Business Impact Scenarios');
  cy.contains('Highlights');
};
export const verifyCisoReportHasKeyComponents = () => {
  cy.contains('Financial Exposure');
  cy.contains('Controls Summary');
  cy.contains('Risks');
  cy.contains('Assets Exposure');
};

export const verifyCrqReportHasKeyComponents = () => {
  cy.get('[data-testid="report-container"]');
};
export const verifyFinancialExposureHasKeyComponents = () => {
  cy.contains('Third Party Financial Exposure');
  cy.contains('Third Party Risk: Annual Financial Exposure');
  cy.contains('Third Party Exposure vs. Overall Exposure');
  cy.contains('Event Types Breakdown');
  cy.contains('Third Party Service Providers');
};
export const verifyVendorAnalysisHasKeyComponents = () => {
  cy.contains('Vendor Frequency Score');
  cy.contains('Product Name');
  cy.contains('Vendor Name');
  cy.contains('Type of Product');
  cy.contains('Frequency Score');
  cy.contains('Likelihood');
  cy.contains('Average Annual Loss');
  cy.contains('Akamai CDN').click();
  cy.url().should(
    'include',
    'third-party-risk/vendor-analysis#risk-drivers/cdn:Akamai:Akamai%20CDN'
  );
};
