// @ts-nocheck
import { setupWorker } from 'msw';

import { handlers } from './data-handlers';
import { integrationHandlers } from './integrationHandlers';

export const worker = setupWorker(...handlers, ...integrationHandlers);
