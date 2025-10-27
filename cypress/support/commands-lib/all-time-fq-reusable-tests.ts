import {
  buildCisCompanyAndFq,
  buildNistCompanyAndFq,
} from '@/mocks/builders/recipes';
import { fqDatasetType } from '@/types/cypressTypes';
import { BaseDriver } from '../base-driver';

export const allTimeFqTests = (
  histFq: Record<string, fqDatasetType>,
  skippable_mitigation_check_domains: string[] = [],
) => {
  describe(`With ${Object.keys(histFq)[0]} case`, () => {
    beforeEach(() => {
      Cypress.config('defaultCommandTimeout', 10000); // Set the timeout to 10 seconds
    });
    let driver: BaseDriver;

    const fqDataset = Object.values(histFq)[0];
    const { transparency, ...quantificationData } = fqDataset;
    const overrides = {
      fqSpecific: {},
      companySpecifics: { id: quantificationData.company_id },
    };
    const sec_controls_framework =
      quantificationData.input_data?.sec_controls_framework;
    const { company } =
      sec_controls_framework === 'NIST'
        ? buildNistCompanyAndFq(overrides)
        : buildCisCompanyAndFq(overrides);

    beforeEach(() => {
      driver = new BaseDriver();
      cy.intercept('GET', `api/companies/${quantificationData.company_id}`, {
        body: company,
      });

      cy.intercept('GET', `api/fq/${quantificationData.id}`, {
        body: quantificationData,
      });
      cy.intercept('GET', `api/fq/${quantificationData.id}/transparency`, {
        body: transparency,
      });
    });

    afterEach(() => {
      driver.tearDown();
    });

    it('check risk-overview page correctness', () => {
      driver.withCompanies([company]).mock();

      const averageAnnualLoss =
        quantificationData.results.overall_exposure.highlights.medium;

      cy.visit(
        `/company-management/${quantificationData.company_id}/financial-quantification/${quantificationData.id}`,
      );
      cy.contains(`${new Intl.NumberFormat().format(averageAnnualLoss)}`);
      cy.contains(`${company.name} Profile`);
      cy.contains('TOP BUSINESS IMPACT SCENARIOS');
      cy.contains('LIKELIHOOD OF TARGETED EVENT');
      cy.contains('IMMEDIATE MITIGATION ACTIONS');
      cy.contains('TRENDS');
      cy.contains('CONTROLS TIER');
      cy.on('uncaught:exception', (err, runnable) => {
        // check if the exception message contains an error message
        if (err.message.includes('Error')) {
          // handle the error
          // ..
        }
        // let Cypress know that the exception has been handled
        return false;
      });
    });
    if (quantificationData.results.control_scenarios) {
      it('check mitigation page correctness', () => {
        driver.withCompanies([company]).mock();

        cy.visit(
          `/company-management/${quantificationData.company_id}/financial-quantification/${quantificationData.id}/mitigation`,
        );

        cy.contains('Security Controls');
        if (sec_controls_framework) {
          const domain = (quantificationData.input_data as any)?.domains[0];
          !skippable_mitigation_check_domains.includes(domain) &&
            cy.contains('NIST CSF v1.1 Control Actions');
        }
        cy.contains('Asset Groups').click();
        cy.get('[data-testid="recommendations-table-container"]');

        cy.on('uncaught:exception', (err, runnable) => {
          // check if the exception message contains an error message
          if (err.message.includes('Error')) {
            // handle the error
            // ...
          }
          // let Cypress know that the exception has been handled
          return false;
        });
      });
    }
    if (!quantificationData.results.control_scenarios) {
      it('check recommendations page correctness', () => {
        driver.withCompanies([company]).mock();

        cy.visit(
          `/company-management/${quantificationData.company_id}/financial-quantification/${quantificationData.id}/recommendations`,
        );

        cy.contains('CIS Controls Recommendations');
        cy.contains('Recommended Action');
        cy.contains('Current Implementation Group');
        cy.contains('Max Effect on High Exposure Year');

        cy.on('uncaught:exception', (err, runnable) => {
          // check if the exception message contains an error message
          if (err.message.includes('Error')) {
            // handle the error
            // ...
          }
          // let Cypress know that the exception has been handled
          return false;
        });
      });
    }
    it('check financial-exposure page correctness', () => {
      driver.withCompanies([company]).mock();

      cy.visit(
        `/company-management/${quantificationData.company_id}/financial-quantification/${quantificationData.id}/financial-exposure`,
      );
      cy.contains('Low Exposure Loss');
      cy.contains('High Exposure Loss');
      cy.contains('Business Impact Scenarios');
      cy.contains('Total Annual Cyber Risk Exposure');
      cy.contains('button', 'Business Impact Scenarios').click();
      cy.contains('Business Interruption');
      cy.contains('Ransomware & Extortion');
      cy.contains('Regulation & Compliance');
      cy.contains('Third Party Liability');
      cy.contains('Third Party Service Provider Failure');
      cy.contains('Data Theft & Privacy');
    });

    it('check risk-transfer page correctness', () => {
      driver.withCompanies([company]).mock();

      cy.visit(
        `/company-management/${quantificationData.company_id}/financial-quantification/${quantificationData.id}/risk-transfer`,
      );
      if (quantificationData.risk_transfer?.highlights) {
        cy.contains('Insurance Terms Stress Testing');
        cy.contains('Highlights');
        cy.get('[data-testid="loss-breakdown"]').within(() => {
          cy.contains('Business Impact Scenarios').click();
        });
      } else {
        cy.contains(
          'Stress testing of your insurance terms will be available once you provide the insurance terms inputs in the questionnaire before running the quantification',
        );
      }
    });
    it('check third-party-risk page correctness', () => {
      driver.withCompanies([company]).mock();

      cy.visit(
        `/company-management/${quantificationData.company_id}/financial-quantification/${quantificationData.id}/third-party-risk`,
      );
      if (
        quantificationData.results.third_party_exposure &&
        transparency.hazard_distribution &&
        quantificationData.results.by_event_type_exposure
      ) {
        const longTimeout = { timeout: 20000 }; // 20 seconds
        cy.contains('Third Party Risk: Annual Financial Exposure', longTimeout);
        cy.contains('Third Party Exposure vs. Overall Exposure', longTimeout);
        cy.contains('Event Types Breakdown', longTimeout);
        cy.contains('How my input affects the results?', longTimeout);
        cy.contains('How are these results calculated?', longTimeout);
        cy.contains('Top Third Party Service Providers', longTimeout);
      } else {
        cy.contains('Sorry, we have nothing to show.');
      }
    });
    it('check transparency page correctness', () => {
      driver.withCompanies([company]).mock();

      cy.visit(
        `/company-management/${quantificationData.company_id}/financial-quantification/${quantificationData.id}/transparency`,
      );
      cy.contains('Threat Intelligence Data');
      cy.contains('Industry Frequency Data');
      cy.contains('Past Cyber Event impacted the entity’s industry');
      cy.contains('Top Attack Vectors');
      cy.contains('Likelihood Calculation Insight');
      cy.contains('Top Risk Drivers by Likelihood');
      cy.contains('The Severity of Simulated Events');
    });
  });
};
