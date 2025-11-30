// @ts-nocheck
// Using MSW v1 API since v1.3.3 is currently installed
import { rest } from 'msw';
import { getMicrosoftAuthApiUrl } from 'urls-defs';

export const integrationHandlers = [
  rest.post(
    `${getMicrosoftAuthApiUrl()}/tanium/integration`,
    (req, res, ctx) => {
      console.log(`[MSW] ✅ Intercepted POST ${req.url}`);
      return res(ctx.json({ id: 'new-company-id' }));
    }
  ),
  rest.post(
    `${getMicrosoftAuthApiUrl()}/servicenow/integration`,
    (req, res, ctx) => {
      console.log(`[MSW] ✅ Intercepted POST ${req.url}`);
      return res(ctx.json({ id: 'new-company-id' }));
    }
  ),
  rest.post(
    `${getMicrosoftAuthApiUrl()}/tenable/integration`,
    (req, res, ctx) => {
      console.log(`[MSW] ✅ Intercepted POST ${req.url}`);
      return res(ctx.json({ id: 'new-company-id' }));
    }
  ),
];
