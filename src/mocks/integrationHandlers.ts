import { rest } from 'msw';
import { getMicrosoftAuthApiUrl } from 'urls-defs';

export const integrationHandlers = [
  rest.post(
    `${getMicrosoftAuthApiUrl()}/tanium/integration`,
    (req, res, ctx) => {
      return res(ctx.json({ id: 'new-company-id' }));
    }
  ),
  rest.post(
    `${getMicrosoftAuthApiUrl()}/servicenow/integration`,
    (req, res, ctx) => {
      return res(ctx.json({ id: 'new-company-id' }));
    }
  ),
  rest.post(
    `${getMicrosoftAuthApiUrl()}/tenable/integration`,
    (req, res, ctx) => {
      return res(ctx.json({ id: 'new-company-id' }));
    }
  ),
];
