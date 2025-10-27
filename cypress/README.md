# Foqus Cypress testing is under construction. no auto-run yet

## to run:

- in one console - run the server without pre made mock and with code coverage: `yarn start:cover`, without coverage: `yarn start:nomocks`
- in a second console - run `yarn cypress open`
- choose the spec you want to run (`company-table.ts`)
- to see coverage you want to run: `open coverage/lcov-report/index.html`
- profit

## how to run SYSTEM TESTS (full e2e on staging env with live server)

- note: no need to setup the server since we are working with everything in sme testing
- add a `cypress.env.json` file with the following format, if you can't find a user/password you can just create one in the frontegg dashboard...:

```json
{
  "testPassword": "<get it from somebody>",
  "testEmail": "testing-user@kovrr.com"
}
```

- run `yarn test:system`
- wait for about an hour for the test to conclude
