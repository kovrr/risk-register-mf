/* eslint-disable @typescript-eslint/no-namespace */
// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import the styles setup first
import { mount, MountOptions, MountReturn } from 'cypress/react';
import { ReactNode } from 'react';
import './commands';
import { CustomOptions, withProvider } from './my-mount';
import './styles';
// Import global CSS after styles setup
import '../../src/globals.css';

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  namespace Cypress {
    interface Chainable {
      mount(
        component: ReactNode,
        options?: MountOptions & Partial<CustomOptions>,
      ): Chainable<MountReturn>;
    }
  }
}

Cypress.Commands.add('mount', (component, options) => {
  const { routerParams, ...builtinOptions } = options || {};
  return mount(
    withProvider(component, { routerParams }),
    builtinOptions,
  ) as unknown as any;
});

// Example use:
// cy.mount(<MyComponent />)
