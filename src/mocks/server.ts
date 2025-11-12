// @ts-nocheck
import { setupServer } from 'msw/node';

import { handlers } from './data-handlers';
import { handlers as fronteggHandlers } from './frontegg-handlers';
import { integrationHandlers } from './integrationHandlers';

export const server = setupServer(
  ...handlers,
  ...fronteggHandlers,
  ...integrationHandlers
);
