// @ts-nocheck
import { rest } from 'msw';

export const getMock = (url: string, response: object) =>
  rest.get(url, (req, res, ctx) => res(ctx.json(response)));

export const getMockWithStatus = (
  url: string,
  response: object,
  status?: number
) =>
  rest.get(url, (req, res, ctx) =>
    res(ctx.json(response), ctx.status(status ?? 200))
  );

export const postMock = (url: string, response: object) =>
  rest.post(url, (req, res, ctx) => res(ctx.json(response)));

export const getPaginatedMock = (url: string, allResponseObjects: unknown[]) =>
  rest.get(url, (req, res, ctx) => {
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
