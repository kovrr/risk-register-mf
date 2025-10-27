import { setupWorker } from 'msw';

import { handlers } from './data-handlers';
import { handlers as fronteggHandlers } from './frontegg-handlers';
import { integrationHandlers } from './integrationHandlers';

export const worker = setupWorker(
  ...handlers,
  ...fronteggHandlers,
  ...integrationHandlers
);
