import { applicationTypes } from 'types/applicationTypes';

export const fronteggAuthServerUrl = 'https://auth.kov-test.notprod.me';

export const mockFrontegg = (
  userPermissionsKeys: string[],
  userId = '110159ff-585d-4dc1-a4e4-efd1e016620b',
  applicationType = applicationTypes.FOQUS
) => {
  const permissions = userPermissionsKeys.map((permissionKey, idx) => ({
    key: permissionKey,
    id: 'mock-id-irrelevant' + idx,
  }));

  cy.window().then((win: any) => {
    win.elasticApm = {
      // Configuration properties
      serviceName: 'foqus-frontend-test',
      serverUrl: 'https://apm-test.example.com',
      environment: 'test',

      // Core methods
      isActive: () => false,
      setUserContext: () => undefined,
      setCustomContext: () => undefined,
      captureError: () => undefined,

      // Additional methods that might be called
      startTransaction: () => ({
        addLabels: () => undefined,
        addContext: () => undefined,
        setOutcome: () => undefined,
        end: () => undefined,
      }),
      startSpan: () => ({
        addLabels: () => undefined,
        addContext: () => undefined,
        setOutcome: () => undefined,
        end: () => undefined,
      }),
      addLabels: () => undefined,
      addContext: () => undefined,
      captureException: () => undefined,
      captureMessage: () => undefined,
      addFilter: () => undefined,
      addErrorFilter: () => undefined,
      addTransactionFilter: () => undefined,
      addSpanFilter: () => undefined,
      addMetricsFilter: () => undefined,
      addMetadataFilter: () => undefined,
      addMetadata: () => undefined,
    };
  });

  cy.intercept(
    `${fronteggAuthServerUrl}/frontegg/identity/resources/auth/v1/user/token/refresh`,
    {
      accessToken:
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjhiOTM1ZDc3In0.eyJzdWIiOiI0ZWNlNjI5Ny1jNTMyLTQyYmYtYTRkYi04ZTkxYWU2ZGE5ODUiLCJuYW1lIjoibnVuaStudW5leiIsImVtYWlsIjoibnVuaStudW5lekBrb3Zyci5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibWV0YWRhdGEiOnt9LCJyb2xlcyI6W10sInBlcm1pc3Npb25zIjpbXSwidGVuYW50SWQiOiJjYmE0MmZlNy1hNjM5LTRjOTQtYjZmNy1jZWJhOTQ1YjNmMTYiLCJ0ZW5hbnRJZHMiOlsiY2JhNDJmZTctYTYzOS00Yzk0LWI2ZjctY2ViYTk0NWIzZjE2Il0sInByb2ZpbGVQaWN0dXJlVXJsIjoiaHR0cHM6Ly93d3cuZ3JhdmF0YXIuY29tL2F2YXRhci9hZDYzNTY1MGJlNTAxZjBjYjU5YjFiZmU2MzEwN2ZjNT9kPWh0dHBzOi8vdWktYXZhdGFycy5jb20vYXBpL251bmkrbnVuZXovMTI4L3JhbmRvbSIsInR5cGUiOiJ1c2VyVG9rZW4iLCJpYXQiOjE2NDk1OTE1OTEsImV4cCI6MTY0OTY3Nzk5MSwiYXVkIjoiOGI5MzVkNzctOGI5Zi00MmVhLWExY2UtNWEzM2RiZGE0NTRmIiwiaXNzIjoiaHR0cHM6Ly9mb3F1cy10ZXN0aW5nLm5vdHByb2QubWUifQ.kW-APVRkNkvvR27-xFznPWBSJNhhnAxUwTBUzdF558Lzs1T16RWD5DKZaNMbkkC9REBsNXCUFzfbfxZ8TdCF_oY5FUqMnFSGGTUQSCZxAzhmc-7xr6j7vBe0gl69F_H6YCK9tuo2cS4s07JkWfjrf_PS7HNhPEiwCKi4EExrCC53HZ0tZYtg3UJsI1P2JYfvb0Tf2I27zMAXZewFnywQSjNG1mmnugFFas3fx7YVci2w0ng1ArlaPOTFarTiISVgwDYJKCs8CCbfEWsLp5HijqN98vTFcvCUEvR6HkeAyThrveREYayxaI3_bA6MFR9Dfs-oGrgTm_8Txzw-40VzTg',
      expires: 'Fri, 05 Feb 2022 10:23:04 GMT',
      expiresIn: 100000,
      mfaRequired: false,
      refreshToken: '1234',
    }
  );
  cy.intercept(
    `${fronteggAuthServerUrl}/frontegg/identity/resources/users/v2/me*`,
    {
      id: userId,
      email: 'khen@kovrr.com',
      verified: true,
      name: 'Khen Chen',
      phoneNumber: null,
      profilePictureUrl:
        'https://www.gravatar.com/avatar/9d223de87dd10097919285bbdc455121?d=https://ui-avatars.com/api/Amirs/128/random',
      provider: 'local',
      mfaEnrolled: false,
      metadata: '{}',
      permissions,
      tenantIds: ['b3890015-2bee-4e40-b686-8319c864112c'],
      tenantId: 'b3890015-2bee-4e40-b686-8319c864112c',
      roles: [],
    }
  );
  cy.intercept(
    `${fronteggAuthServerUrl}/frontegg/identity/resources/users/v1/me/authorization`,
    {
      permissions,
      roles: [],
    }
  );
  cy.intercept('GET', `${fronteggAuthServerUrl}/frontegg/identity/resources/v2/saml/metadata*`, {
  statusCode: 200,
  body: {
    metadata: "mock-saml-metadata"
  }
  });
  cy.intercept('GET', `${fronteggAuthServerUrl}/frontegg/vendors/public`, {
    body: [],
  });
  cy.intercept(
    'GET',
    `${fronteggAuthServerUrl}/frontegg/identity/resources/configurations/v1/captcha-policy/public`,
    {
      body: [],
    }
  );
  cy.intercept('GET', `${fronteggAuthServerUrl}/frontegg/flags`, {
    body: [],
  });
  cy.intercept(
    'GET',
    `${fronteggAuthServerUrl}/frontegg/identity/resources/sso/custom/v1`,
    {
      body: [],
    }
  );
  cy.intercept(
    'GET',
    `${fronteggAuthServerUrl}/frontegg/identity/resources/sso/v2`,
    {
      body: [],
    }
  );
  cy.intercept(
    'GET',
    `${fronteggAuthServerUrl}/frontegg/team/resources/sso/v2/configurations/public`,
    {
      body: [],
    }
  );
  cy.intercept(
    'GET',
    `${fronteggAuthServerUrl}/frontegg/identity/resources/configurations/v1/public`,
    {
      body: [],
    }
  );
  cy.intercept(
    'GET',
    `${fronteggAuthServerUrl}/frontegg/identity/resources/users/v2/me/tenants`,
    {
      body: [
        {
          _id: '5fe1f633a9193f002b5dd585',
          metadata: '{}',
          vendorId: 'e7cd5168-7a8c-4acc-a18b-c2f277dac86b',
          tenantId: 'b3890015-2bee-4e40-b686-8319c864112c',
          name: 'FAKE',
          deletedAt: null,
          id: 'f07b2295-9003-4af3-ad25-59c27223d05b',
          createdAt: '2020-12-22T13:35:47.221Z',
          updatedAt: '2020-12-22T13:35:47.221Z',
          __v: 0,
        },
      ],
    }
  );
  cy.intercept(
    'GET',
    `${fronteggAuthServerUrl}/frontegg/identity/resources/users/v3/me/tenants`,
    {
      body: {
        activeTenant: {
          metadata: JSON.stringify({ application_type: applicationType }),
        },
        tenants: [],
      },
    }
  );
  cy.intercept(
    'GET',
    `${fronteggAuthServerUrl}/frontegg/identity/resources/configurations/v1/auth/strategies/public`,
    {
      body: [],
    }
  );
  cy.intercept(
    'GET',
    `${fronteggAuthServerUrl}/frontegg/identity/resources/configurations/sessions/v1`,
    {
      body: [],
    }
  );
};
