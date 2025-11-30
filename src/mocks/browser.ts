// MSW v1 uses 'msw', v2 uses 'msw/browser'
// For now, use v1 import until yarn install upgrades to v2
// After upgrading to MSW v2, change this to: import { setupWorker } from 'msw/browser';
import { setupWorker } from 'msw';

import { handlers } from './data-handlers';
import { integrationHandlers } from './integrationHandlers';

export const worker = setupWorker(...handlers, ...integrationHandlers);
