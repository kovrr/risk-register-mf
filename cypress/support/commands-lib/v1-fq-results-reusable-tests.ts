import { convertToInternationalCurrencySystemToFixed } from '@/components/ui/charts/utils';
import { buildChangeLog } from '@/mocks/builders/changeLogBuilder';
import {
  buildCisCompanyAndFq,
  buildNistCompanyAndFq,
} from '@/mocks/builders/recipes';
import { fqDatasetType } from '@/types/cypressTypes';
import {
  ATTACK_VECTOR_TO_URL,
  InitialAttackVector,
} from '@/types/riskDrivers/attackVectors';
import {
  EVENT_TYPE_TO_TEXT,
  EVENT_TYPE_TO_URL,
  EventTypes,
} from '@/types/riskDrivers/eventTypes';
import { BaseDriver } from '../base-driver';
import { prepareAttackVectors } from './attack-vectors-helpers';

export const v1FqResultsReusableTests = (
  histFq: Record<string, fqDatasetType>,
) => {
  describe(`With ${Object.keys(histFq)[0]} case`, () => {
    beforeEach(() => {
      Cypress.config('defaultCommandTimeout', 15000); // Set the timeout to 10 seconds
    });
    let driver: BaseDriver;

    const fqDataset = Object.values(histFq)[0];
    const { transparency: _, ...quantificationData } = fqDataset;
    const overrides = {
      fqSpecific: {},
      companySpecifics: {
        id: quantificationData.company_id,
        last_quantification: quantificationData,
      },
    };
    const sec_controls_framework =
      quantificationData.input_data?.sec_controls_framework;
    const { company } =
      sec_controls_framework === 'NIST'
        ? buildNistCompanyAndFq(overrides)
        : buildCisCompanyAndFq(overrides);
    const controlsToMinimal =
      quantificationData.results_narrative!.control_scenarios
        .by_control_to_minimal;
    beforeEach(() => {
      driver = new BaseDriver();
      cy.intercept('GET', `api/companies/${quantificationData.company_id}`, {
        body: company,
      });
      cy.intercept(
        'GET',
        `api/companies/${quantificationData.company_id}/past-quantifications*`,
        {
          body: { items: [quantificationData] },
        },
      );
      cy.intercept('GET', `api/fq/${quantificationData.id}`, {
        body: quantificationData,
      });
      cy.intercept('GET', `api/companies/*/change-log?size=*`, {
        body: {
          ...buildChangeLog(16),
        },
      }).as('allNew');

      cy.intercept('GET', 'api/fq/nearest*', {
        body: quantificationData,
      });
    });

    afterEach(() => {
      driver.tearDown();
    });

    it('check risk-evaluation page correctness', () => {
      driver.withCompanies([company]).mock();

      const highAnnualLoss =
        quantificationData.results_narrative!.simulation_exposure
          .high_exposure_loss;
      const targetedAnnualRate =
        quantificationData.results_narrative!.simulation_exposure
          .targeted_annual_rate;

      cy.visit(
        `/company-management/${quantificationData.company_id}/fq/${quantificationData.id}`,
      );
      cy.contains(`Quantification for ${company.name}`);
      cy.contains('Risk Evaluation');
      cy.contains('Average Annual Loss');
      cy.contains('Annual Events Likelihood');
      cy.contains('Top Recommended Actions');
      cy.contains('Event Benchmark Insights');
      cy.contains('Event Statistics');
      cy.contains('Loss from an Event');
      cy.contains('Event Duration');
      cy.contains('Data Records Compromised');
      cy.contains('Loss from an Event');
      cy.contains('Breakdown of the risk by the types of events');
      cy.contains(
        'Breakdown of the risk by the techniques that are used to gain initial foothold within the network',
      );

      cy.contains('Event Types');
      cy.contains('Initial Vectors');
      if (
        quantificationData.results_narrative!.cost_components_breakdown !==
        undefined
      ) {
        cy.contains('Damage Types');
        cy.get('[data-testid="DamageTypesAnnual-main"]').should('exist');
      }
      cy.contains(
        convertToInternationalCurrencySystemToFixed(highAnnualLoss, 2).value,
      );
      if (controlsToMinimal && Object.keys(controlsToMinimal).length > 0) {
        cy.get('[data-testid="cis-mitigation-table"]').within(() => {
          // check if the table is rendered and if the right number of rows
          cy.get('tbody')
            .children()
            .should(
              'have.length',
              Math.min(Object.keys(controlsToMinimal).length + 1, 4),
            );
        });
      }
      cy.contains(`${Number((targetedAnnualRate * 100).toFixed(2))}%`);
      cy.get('[data-testid="event-types-chart"]').should('exist');
      cy.get('[data-testid="AttackVectorAnnual"]').should('exist');
      if (
        quantificationData.results_narrative!.calibration_highlights
          ?.frequency_highlights
      ) {
        cy.get('[data-testid="threat-insight-calibration-chart"]').should(
          'exist',
        );
      } else {
        cy.get('[data-testid="threat-insight-strict"]').should('exist');
      }
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
    if (quantificationData.results_narrative!.control_scenarios) {
      it('check Loss Impact Scenarios page correctness', () => {
        driver.withCompanies([company]).mock();

        cy.visit(
          `/company-management/${quantificationData.company_id}/fq/${quantificationData.id}/risk-analysis/loss-impact-scenarios`,
        );

        cy.contains('Total Annual Cyber Risk Exposure');

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
    if (quantificationData.results_narrative!.risk_scenarios) {
      it('check risk-progression correctness', () => {
        driver.withCompanies([company]).withRiskProgression().mock();

        cy.visit(
          `/company-management/${quantificationData.company_id}/fq/${quantificationData.id}/risk-analysis/risk-progression`,
        );

        cy.contains('Program Performance', { timeout: 20000 });
        cy.contains('Quarterly Trends');
        cy.contains('Quantifications History');
        // check battery component
        cy.get('[data-testid="risk-position-analysis"]').within(() => {
          cy.contains('Risk Position Analysis');
          cy.get('[data-testid="current-risk-position"]').should('exist');
          cy.contains('Minimal Risk');
          cy.contains('Current Risk Position');
          cy.contains('Baseline Risk');
          cy.contains('Risk Position Score');
        });
        //  check quarterly trends
        cy.get('[data-testid="annual-trends-average-annual-loss-card"]').within(
          () => {
            cy.contains('Average Annual Loss');
            cy.get('canvas').should('exist');
          },
        );
        cy.get('[data-testid="annual-trends-baseline-risk-card"]').within(
          () => {
            cy.contains('Baseline Risk');
            cy.get('canvas').should('exist');
          },
        );
        cy.get('[data-testid="annual-trends-risk-position-score-card"]').within(
          () => {
            cy.contains('Risk Position Score');
            cy.get('canvas').should('exist');
          },
        );
        // check quantifications history
        cy.contains('Quantifications History');
        cy.get('[data-testid="change-log-card"]').should('exist');
        cy.get('[data-testid="past-quantifications-graph-card"]').within(() => {
          cy.get('canvas').should('exist');
          cy.contains('Total Exposure').click();
          cy.contains('By Event Types').click();
          cy.contains('By Loss Impact Scenarios').click();
          cy.contains('1:100 Annual Loss').click();
          cy.contains('Average Annual Loss').click();
        });
        // check if the table is rendered and if the right number of rows
        cy.get('[data-testid="historical-fq-table"]').within(() => {
          cy.get('tbody').children().should('have.length', 1);
        });

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
    if (quantificationData.results_narrative!.control_scenarios) {
      it('check recommendations controls page correctness', () => {
        driver.withCompanies([company]).mock();

        cy.visit(
          `/company-management/${quantificationData.company_id}/fq/${quantificationData.id}/risk-management/what-if`,
        );
        if (sec_controls_framework === 'CIS') {
          cy.contains('CIS Control Actions');
        } else if (sec_controls_framework === 'NIST') {
          cy.contains('NIST CSF v1.1 Control Actions');
        } else if (sec_controls_framework === 'ISO27001') {
          cy.contains('ISO 27001 Control Actions');
        }

        if (controlsToMinimal && Object.keys(controlsToMinimal).length > 0) {
          cy.get('[data-testid="cis-mitigation-table"]').within(() => {
            // check if the table is rendered and if the right number of rows
            if (sec_controls_framework !== 'ISO27001') {
              cy.get('tbody')
                .children()
                .should('have.length', Object.keys(controlsToMinimal).length + 1);
            } else {
              cy.get('tbody')
                .children()
                .should(
                  'have.length',
                  Math.min(Object.keys(controlsToMinimal).length + 1, 11), // 11 is the number of rows in case there are more than 10 controls
                );
            }

            cy.get('tbody>tr').eq(2).click();
          });

          cy.contains('Test ROI');
          cy.get('[data-testid="mitigation-cis-card"]').should('exist');
        }
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
      if (sec_controls_framework !== 'ISO27001') {
        it('check recommendations controls assets groups page correctness', () => {
          driver.withCompanies([company]).mock();

          cy.visit(
            `/company-management/${quantificationData.company_id}/fq/${quantificationData.id}/risk-management/controls-mitigations`,
          );
          cy.contains('Risk Mitigation Recommendations: Asset Groups');

          cy.get('[data-testid="recommendations-table-filter-input"]').should(
            'exist',
          );

          cy.get('[data-testid="recommendations-table-container"]').within(
            () => {
              // check if the table is rendered and if the right number of rows (initial number is 10)
              cy.get('tbody').children().should('have.length', 10);
            },
          );
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
    }
    it('check Loss Impact Scenarios page correctness', () => {
      driver.withCompanies([company]).mock();

      cy.visit(
        `/company-management/${quantificationData.company_id}/fq/${quantificationData.id}/risk-analysis/loss-impact-scenarios`,
      );
      cy.contains('Annual Exposure');
      cy.contains('1:100 Annual Loss').click();
      cy.contains('98:100 Annual Loss').click();
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
        `/company-management/${quantificationData.company_id}/fq/${quantificationData.id}/risk-management/risk-transfer`,
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
        `/company-management/${quantificationData.company_id}/fq/${quantificationData.id}/third-party-risk/financial-exposure`,
      );
      if (
        quantificationData.results_narrative?.by_third_party_exposure &&
        quantificationData.results_narrative?.simulation_stats
          .hazard_distribution &&
        quantificationData.results_narrative?.by_event_type_exposure
      ) {
        cy.contains('Third Party Risk: Annual Financial Exposure');
        cy.contains('Third Party Exposure vs. Overall Exposure');
        cy.contains('Event Types Breakdown');
        cy.contains('How my input affects the results?');
        cy.contains('How are these results calculated?');
        cy.contains('Top Third Party Service Providers');
      } else {
        cy.contains('Sorry, we have nothing to show.');
      }
    });

    it('check ciso-report page correctness', () => {
      driver.withCompanies([company]).mock();

      const averageAnnualLoss =
        quantificationData.results_narrative!.simulation_exposure.aal;

      cy.visit(
        `/company-management/${quantificationData.company_id}/fq/${quantificationData.id}/reports/ciso-report`,
      );
      cy.contains(`${new Intl.NumberFormat().format(averageAnnualLoss)}`);
      cy.contains(`Financial Exposure`);
      cy.contains('TOP BUSINESS IMPACT SCENARIOS');
      cy.contains('LIKELIHOOD OF TARGETED EVENT');
      if (sec_controls_framework !== 'ISO27001') {
        cy.contains('IMMEDIATE MITIGATION ACTIONS');
        cy.contains('CONTROLS TIER');
      }
      cy.contains('TRENDS');

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
    if (
      quantificationData.results_narrative!.by_initial_vector_detailed_exposure
    ) {
      it('check risk drill down feature works', () => {
        driver.withCompanies([company]).withRiskDriverDrillDown().mock();

        cy.visit(
          `/company-management/${quantificationData.company_id}/fq/${quantificationData.id}`,
        );
        Object.entries(
          quantificationData.results_narrative!
            .by_event_type_detailed_exposure!,
        ).forEach((eventType) => {
          cy.get('[data-testid="event-types-chart"]').within(() => {
            cy.contains(EVENT_TYPE_TO_TEXT[eventType[0] as EventTypes]).click();
            cy.url().should(
              'contain',
              `/company-management/${quantificationData.company_id}/fq/${quantificationData.id
              }/risk-analysis/risk-evaluation/by-risk-driver/${EVENT_TYPE_TO_URL[eventType[0]]
              }`,
            );
          });
          // exit the drill down
          cy.get('nav').contains('Risk Evaluation').click();
        });
        // check only one of the attack vectors - full check is done in the AttackVectors.cy.tsx
        const { clickableAttackVectors } =
          prepareAttackVectors(quantificationData);
        const attackVector = Object.keys(clickableAttackVectors)[0];
        cy.get('[data-testid="AttackVectorAnnual"]').within(() => {
          cy.contains(attackVector).click();
        });
        cy.url().should(
          'contain',
          `/company-management/${quantificationData.company_id}/fq/${quantificationData.id
          }/risk-analysis/risk-evaluation/by-risk-driver/${ATTACK_VECTOR_TO_URL[attackVector as InitialAttackVector]
          }`,
        );
        // exit the drill down
        cy.get('nav').contains('Risk Evaluation').click();

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

      it('check attack vectors drawer content injection', () => {
        driver.withCompanies([company]).withRiskDriverDrillDown().mock();

        cy.visit(
          `/company-management/${quantificationData.company_id}/fq/${quantificationData.id}/risk-analysis/risk-evaluation`,
        );

        cy.contains('Risk Evaluation', { timeout: 20000 });

        // Get the current version
        const currentVersion = Object.keys(histFq)[0];
        const versionNumber = parseInt(currentVersion.substring(1));
        const newFeatureVersion = 20240400;

        const shouldHaveContentInjection = versionNumber >= newFeatureVersion;

        cy.get('body').then(($body) => {
          if ($body.find('[data-testid="RiskDriverAttackVectors"]').length > 0) {
            cy.get('[data-testid="RiskDriverAttackVectors"]', { timeout: 10000 }).then(($element) => {
              if ($element.text().includes('See All')) {
                cy.get('[data-testid="RiskDriverAttackVectors"]').contains('See All').click();

                cy.get('[data-testid="AttackVectorDrawer"]', { timeout: 10000 }).should('exist').then(() => {
                  cy.get('[data-testid="AttackVectorDrawer"]').then(($drawer) => {
                    if (shouldHaveContentInjection) {
                      expect($drawer.text()).to.include('content injection');
                    } else {
                      expect($drawer.text()).to.not.include('content injection');
                    }
                  });
                });
              }
            });
          }
        });

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
    }
  });
};
