// @ts-nocheck
// Using MSW v1 API since v1.3.3 is currently installed
// After upgrading to MSW v2, convert to: import { HttpResponse, http } from 'msw';
import { rest } from 'msw';

export const getMock = (url: string, response: object) =>
  rest.get(url, (req, res, ctx) => {
    console.log(`[MSW] ✅ Intercepted GET ${req.url}`);
    return res(ctx.json(response));
  });

export const getMockWithStatus = (
  url: string,
  response: object,
  status?: number
) =>
  rest.get(url, (req, res, ctx) => {
    console.log(`[MSW] ✅ Intercepted GET ${req.url}`);
    return res(ctx.json(response), ctx.status(status ?? 200));
  });

export const postMock = (url: string, response: object) =>
  rest.post(url, (req, res, ctx) => {
    console.log(`[MSW] ✅ Intercepted POST ${req.url}`);
    return res(ctx.json(response));
  });

export const patchMock = (url: string, response: object) =>
  rest.patch(url, (req, res, ctx) => {
    console.log(`[MSW] ✅ Intercepted PATCH ${req.url}`);
    return res(ctx.json(response));
  });

export const putMock = (url: string, response: object) =>
  rest.put(url, (req, res, ctx) => {
    console.log(`[MSW] ✅ Intercepted PUT ${req.url}`);
    return res(ctx.json(response));
  });

export const deleteMock = (url: string, response: object) =>
  rest.delete(url, (req, res, ctx) => {
    console.log(`[MSW] ✅ Intercepted DELETE ${req.url}`);
    return res(ctx.json(response));
  });

export const getPaginatedMock = (url: string, allResponseObjects: unknown[]) =>
  rest.get(url, (req, res, ctx) => {
    console.log(`[MSW] ✅ Intercepted GET ${req.url}`);
    const page = parseInt(req.url.searchParams.get('page') || '1');
    const size = parseInt(req.url.searchParams.get('size') || '10');

    const respItems = allResponseObjects.slice((page - 1) * size, page * size);
    return res(
      ctx.json({
        items: respItems,
        total: allResponseObjects.length,
      })
    );
  });
