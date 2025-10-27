// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --

import { mockFrontegg } from './commands-lib/mock-frontegg';
import { fillCompanyPage } from './commands-lib/fill-company-page';
import { mockMixpanel } from './commands-lib/mock-mixpanel';

//import { fill } from './commands-lib/fill-company-page

// Cypress.Commands.add('login', (email, password) => { ... })
Cypress.Commands.add('mockFrontegg', mockFrontegg);
Cypress.Commands.add('fillCompanyPage', fillCompanyPage);
Cypress.Commands.add('mockMixpanel', mockMixpanel);
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
