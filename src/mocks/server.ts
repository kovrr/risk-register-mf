// @ts-nocheck
import { setupServer } from 'msw/node';

import { handlers } from './data-handlers';
import { integrationHandlers } from './integrationHandlers';

export const server = setupServer(...handlers, ...integrationHandlers);
