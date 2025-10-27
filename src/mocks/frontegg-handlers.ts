import { HighOrderPermissions } from '@/types/permissions';
import { rest } from 'msw';
import { applicationTypes } from 'types/applicationTypes';
import { fronteggAuthServerUrl } from '../../cypress/support/commands-lib/mock-frontegg';
import { companiesResults } from './data/companiesResults';

const APPLICATION_TYPE =
  process.env.NEXT_PUBLIC_DEV_APPLICATION_TYPE ?? applicationTypes.FOQUS;
const APPLICATION_SUBTYPE = process.env.NEXT_PUBLIC_DEV_APPLICATION_SUBTYPE;
const IS_RISK_REGISTER_GUEST_USER =
  process.env.NEXT_PUBLIC_DEV_RISK_REGISTER_GUEST_USER === 'true';

const RANDOM_VALID_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';
const defaultPermissions = ['fq.read_all', 'fq.create', 'company.edit'].map(
  (permissionKey, idx) => ({
    key: permissionKey,
    id: 'mock-id-irrelevant' + idx,
  }),
);
const companyLevelPermissions = companiesResults.flatMap((company, idx) =>
  ['read', 'write', 'delete'].map((permissionType) => ({
    key: `${company.tenant_id}.company.${company.id}.${permissionType}`,
    id: 'mock-id-irrelevant' + idx,
  })),
);

const riskRegisterPermissions = IS_RISK_REGISTER_GUEST_USER
  ? [
    {
      key: HighOrderPermissions.riskRegisterLimitedUser,
      id: 'mock-id-irrelevant',
    },
  ]
  : [];

const userDetails = {
  id: '110159ff-585d-4dc1-a4e4-efd1e016620b',
  email: 'khen@kovrr.com',
  verified: true,
  name: 'Khen Chen',
  phoneNumber: null,
  profilePictureUrl:
    'https://www.gravatar.com/avatar/9d223de87dd10097919285bbdc455121?d=https://ui-avatars.com/api/Amirs/128/random',
  provider: 'local',
  mfaEnrolled: false,
  metadata: '{}',
  tenantIds: ['b3890015-2bee-4e40-b686-8319c864112c'],
  tenantId: 'b3890015-2bee-4e40-b686-8319c864112c',
  roles: [],
  permissions: [
    ...defaultPermissions,
    ...companyLevelPermissions,
    ...riskRegisterPermissions,
  ],
  createdAt: '2020-12-22T13:37:45.000Z',
  lastLogin: '2021-02-04T10:28:30.000Z',
  activatedForTenant: true,
};
const apiUrl = (path: string) => `${fronteggAuthServerUrl}${path}`;
export const handlers = [
  rest.post(
    apiUrl('/frontegg/identity/resources/auth/v1/user/token/refresh'),
    (req, res, ctx) => {
      return res(
        ctx.status(202),
        ctx.json({
          accessToken: RANDOM_VALID_JWT,
          expires: 'Fri, 05 Feb 2022 10:23:04 GMT',
          expiresIn: 100000,
          mfaRequired: false,
          refreshToken: '1234',
        }),
      );
    },
  ),
  rest.post(
    apiUrl('/frontegg/identity/resources/auth/v1/user'),
    (req, res, ctx) => {
      return res(
        ctx.status(202),
        ctx.json({
          accessToken: RANDOM_VALID_JWT,
          expires: 'Fri, 05 Feb 2022 10:23:04 GMT',
          expiresIn: 100000,
          mfaRequired: false,
          refreshToken: '1234',
        }),
      );
    },
  ),
  rest.get(apiUrl('/frontegg/metadata'), (req, res, ctx) => {
    return res(
      ctx.status(202),
      ctx.json({
        rows: [],
      }),
    );
  }),
  rest.get(
    apiUrl('/frontegg/identity/resources/users/v2/me'),
    (req, res, ctx) => {
      return res(ctx.status(202), ctx.json(userDetails));
    },
  ),
  rest.get(
    apiUrl('/frontegg/identity/resources/users/v2/me?addRoles'),
    (req, res, ctx) => {
      return res(ctx.status(202), ctx.json(userDetails));
    },
  ),
  rest.get(
    apiUrl('/frontegg/identity/resources/users/v3/me/tenants'),
    (req, res, ctx) => {
      return res(
        ctx.status(202),
        ctx.json({
          tenants: [
            {
              _id: '5fe1f633a9193f002b5dd585',
              metadata: '{}',
              vendorId: 'e7cd5168-7a8c-4acc-a18b-c2f277dac86b',
              tenantId: 'b3890015-2bee-4e40-b686-8319c864112c',
              name: 'Chaucer',
              deletedAt: null,
              id: 'f07b2295-9003-4af3-ad25-59c27223d05b',
              createdAt: '2020-12-22T13:35:47.221Z',
              updatedAt: '2020-12-22T13:35:47.221Z',
              __v: 0,
            },
          ],
          activeTenant: {
            _id: '5fe1f633a9193f002b5dd585',
            metadata: JSON.stringify({
              application_type: APPLICATION_TYPE,
              application_subtype: APPLICATION_SUBTYPE,
            }),
            vendorId: 'e7cd5168-7a8c-4acc-a18b-c2f277dac86b',
            tenantId: 'b3890015-2bee-4e40-b686-8319c864112c',
            name: 'Chaucer',
            deletedAt: null,
            id: 'f07b2295-9003-4af3-ad25-59c27223d05b',
            createdAt: '2020-12-22T13:35:47.221Z',
            updatedAt: '2020-12-22T13:35:47.221Z',
            __v: 0,
          },
        }),
      );
    },
  ),
  rest.get(
    apiUrl('/frontegg/identity/resources/users/v2/me/tenants'),
    (req, res, ctx) => {
      return res(
        ctx.status(202),
        ctx.json([
          {
            _id: '5fe1f633a9193f002b5dd585',
            metadata: '{}',
            vendorId: 'e7cd5168-7a8c-4acc-a18b-c2f277dac86b',
            tenantId: 'b3890015-2bee-4e40-b686-8319c864112c',
            name: 'Chaucer',
            deletedAt: null,
            id: 'f07b2295-9003-4af3-ad25-59c27223d05b',
            createdAt: '2020-12-22T13:35:47.221Z',
            updatedAt: '2020-12-22T13:35:47.221Z',
            __v: 0,
          },
        ]),
      );
    },
  ),
  rest.get(
    apiUrl(
      '/frontegg/identity/resources/configurations/v1/captcha-policy/public',
    ),
    (req, res, ctx) => {
      return res(
        ctx.status(202),
        ctx.json({
          allowSignups: false,
          allowOverridePasswordComplexity: false,
          allowOverridePasswordExpiration: false,
          allowOverrideEnforcePasswordHistory: false,
        }),
      );
    },
  ),
  rest.get(apiUrl('/frontegg/identity/resources/sso/v1'), (req, res, ctx) => {
    return res(ctx.status(202), ctx.json([]));
  }),
];
