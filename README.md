# Risk Register Microfrontend

Standalone risk register experience built with Rsbuild, React 18, TypeScript, and Module Federation. This README consolidates every previous guide (setup, migration, and API docs) into one reference.

## Feature Highlights

- **Risk Register UI**: Scenario table, drill-down views, CRQ workflows, notes, controls, and damage types.
- **Group-aware filtering**: The Risk Register table always reflects the selected group and persists the active selection in `localStorage` under `active_group_id`, so users return to the same context.
- **API-first design**: Axios client + TanStack Query hooks cover scenarios, notes, groups, companies, tenants, and risk owners.
- **Mock-friendly**: MSW handlers mimic the Risk Register Service API, including mock `/me` data—no Frontegg dependency remains.
- **Module Federation remote**: Exposes `RemoteApp` (providers + routes) for host shells and can be published as an npm package.
- **Modern tooling**: Tailwind, shadcn/ui, Chakra UI (legacy pieces), Radix primitives, Biome, Cypress, and GitHub Actions CI/CD.

## Architecture & Tech Stack

- **Framework**: React 18 + Rsbuild with Module Federation 2.0.
- **State/Data**: TanStack Query, React Hook Form, Zod validation.
- **UI**: shadcn/ui components, Chakra UI for legacy layouts, Radix primitives, Tailwind CSS.
- **Mocking & Testing**: MSW, Cypress component/E2E suites, Jest-ready utilities.
- **Languages & Types**: Strict TypeScript, consolidated risk register types (`src/types/riskRegister.ts`) plus enums for AI lifecycle, risk origin, and stakeholder types.

```
src/
├── _pages/RiskRegister/         # Core feature (table, forms, drill-down, etc.)
├── components/                  # Shared atoms/molecules (shadcn-style)
├── contexts/                    # DemoExperience, Instance providers
├── services/                    # Axios client, React Query hooks, feature toggles
├── types/                       # Domain models (risk register, permissions, tenant)
├── options/                     # CIS/NIST control catalogs and constants
├── hooks/                       # Helpers like use-toast, use-debounce, useLocalStorage
└── exposes/RemoteApp.tsx        # Module Federation entry point
```

## Prerequisites

- Node.js 20.18.x (matches `.nvmrc`)
- Yarn 4.6.0+ (Berry)
- Optional: Docker (backend) and Biome CLI or VS Code extension

## Getting Started

```bash
git clone git@github.com:kovrr/risk-register-mf.git
cd risk-register-mf
yarn install
cp env.example .env     # edit values
yarn dev                # http://localhost:3004
```

> Tip: install the Biome VS Code extension or `npm i -g @biomejs/biome` for on-save formatting aligned with `biome.json`.

## Environment Configuration

`env.example` documents every toggle. Key variables:

- `VITE_USE_MOCKS`, `NEXT_PUBLIC_USE_MOCKS`: enable MSW in dev.
- `VITE_DEV_*`: demo tenant/application defaults.
- `VITE_FEATURE_*`: feature flags (CRQ, template, reorganize, product tour).
- `VITE_API_BASE_URL` / `NEXT_PUBLIC_API_BASE_URL`: point to backend (`http://localhost:8000/api` for dev).
- `RUNNING_IN_CYPRESS`: disables React Query retries during E2E tests.

## Running Against the Backend

### Backend Expectations

- Risk Register Service on port `8000` (Python/FastAPI reference implementation).
- MongoDB running locally or via Docker (see backend repo).
- CORS open for development.

### Mock Authentication

No Frontegg. Backend injects a mock user (ID, tenant_id, default group). Frontend requests omit auth headers. MSW mimics the same payloads so UI works offline.

### API Base URL

```
http://localhost:8000/api/risk-register
```

Use `VITE_API_BASE_URL` to change environments. Axios client lives in `src/services/configureAxiosInstance.ts`, and React Query hooks in `src/services/hooks.ts`.

## Primary API Endpoints

| Endpoint | Description |
| --- | --- |
| `GET /api/risk-scenarios` | Paginated scenario list (latest versions only). |
| `POST /api/risk-scenarios` | Create manual scenario (group_id required). |
| `PATCH /api/risk-scenarios/{scenario_id}` | Update scenario (new version created). |
| `DELETE /api/risk-scenarios/{scenario_id}` | Soft delete / archive. |
| `GET /api/risk-scenarios/{scenario_id}` | Full scenario (notes, metrics). |
| `POST /api/risk-scenarios/{scenario_id}/notes` | Add note (optional doc metadata). |
| `POST /api/risk-scenarios/{scenario_id}/notes-with-attachment` | File upload via multipart FormData. |
| `GET /api/risk-scenarios/{scenario_id}/attachments/download` | Download attachments. |
| `POST /api/risk-scenarios/request-pre-defined-scenario` | Email request (uses mock user context). |
| `GET /api/groups/with-risk-scenarios-permission-create` | Fetch groups with scenario permissions (used by `useGroups`). |

> Creation & edit payloads place new fields (`entity`, `risk_origin`, `ai_lifecycle`, `stakeholders_affected`, `scenario_category`, `response_plan`, etc.) inside `scenario_data`. Hooks like `useCreateRiskScenario` and `useUpdateRiskScenario` already handle this.

## Group Selection & Persistence

- Group dropdown on the Risk Register page is powered by the Strapi groups endpoint and our `useGroups` hook (search + pagination).
- Selecting a group sets the active filter for table/query hooks and writes `localStorage.setItem('active_group_id', groupId)` so refreshes or new sessions stay scoped.
- Scenario forms default to the persisted group; edit mode renders the group field read-only beside the scenario ID for clarity.
- Scenario header shows `ID`, `Group`, and `Entity` inline.

## Development Workflow

### Scripts

```bash
yarn dev             # Run app with MSW
yarn build           # Production build
yarn preview         # Preview build locally
yarn lint            # Biome lint
yarn lint:fix        # Auto-fix
yarn format          # Format via Biome
yarn test            # Cypress run mode
yarn test:open       # Cypress UI
yarn test:component  # Component tests
yarn test:e2e        # E2E tests
yarn clean           # Remove dist artifacts
```

### Testing Notes

- Cypress folders: `cypress/component`, `cypress/e2e`, `cypress/support`.
- MSW auto-starts in dev; disable with `VITE_USE_MOCKS=false`.
- React Query retries are disabled when `RUNNING_IN_CYPRESS=true`.

## Module Federation & Integration

- Remote exposes:
  - `RemoteApp` (providers + routing + layout).
  - `RemoteRoutes` for host-level routing.
- Shared deps: `react`, `react-dom`, `react-router-dom`.
- Example webpack snippet:

```ts
new ModuleFederationPlugin({
  name: 'riskRegister',
  filename: 'remoteEntry.js',
  exposes: {
    './RemoteApp': './src/exposes/RemoteApp',
    './remoteRoutes': './src/exposes/remoteRoutes',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^18.0.0' },
    'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
    'react-router-dom': { singleton: true },
  },
});
```

## Migration & Extraction Guide (Condensed)

| Phase | Focus | Highlights |
| --- | --- | --- |
| 1. Repo Setup | Next.js/Rsbuild baseline | Align Node/Yarn versions, configure tsconfig paths and Module Federation. |
| 2. Copy Core Feature | `_pages/RiskRegister` → `src/_pages/RiskRegister` | Includes table, forms, drill-down, notes, utilities. |
| 3. Shared Components | `newComponents` → `src/components` | shadcn-style atoms/molecules, DataTable, AsyncSelect, etc. |
| 4. Types & Options | `src/types`, `src/options` | Risk register types, enums, CIS/NIST catalogs. |
| 5. Services & Hooks | Axios client, React Query | Implement `useRiskRegisterScenarios`, `useGroups`, risk owner hooks, feature toggles. |
| 6. Permissions & Demo Context | Simplified hooks | `useIsGuestUser`, demo modal helpers (currently no-op). |
| 7. Routing & Providers | `RemoteApp`, QueryClient, MSW | BrowserRouter, TanStack Query provider, DemoExperience context. |
| 8. Testing & QA | Cypress + manual | Table flows, scenario CRUD, notes, CRQ, permissions, mock vs real API. |
| 9. Documentation & Handoff | This README | Setup, environment, migration strategy, API notes. |

> Original multi-document plan (COPY, FRONTEND, SETUP, MIGRATION) is now represented by the sections above.

## CI/CD & Deployment

- GitHub Actions pipelines (`.github/workflows/*.yml`) cover linting, Cypress (parallel split), build, semantic release, and GCS upload for Module Federation assets.
- Required secrets: `SA_TOKEN`, `GCP_SHARED_KEY`, `NPM_TOKEN`, Slack webhook, and test credentials.
- Semantic Release rules follow commit prefixes (`feat`, `fix`, `feat!`, etc.).
- Production build: `yarn build` → deploy `dist` or publish to npm / remote storage.

## Troubleshooting & Tips

- **MSW not intercepting**: Verify `VITE_USE_MOCKS=true` and check console for `MSW worker started`.
- **Group dropdown blank**: Ensure `/api/groups/with-risk-scenarios-permission-create` is reachable or mocks enabled.
- **Permission checks**: Hooks default to permissive behavior until real auth is wired.
- **Type errors**: Run `yarn tsc --noEmit` to find missing imports or enums.
- **Backend auth**: Do not send auth headers; backend supplies mock identity.

## Contributing

1. Follow Biome formatting and linting rules.
2. Update tests or add new ones for behavioral changes.
3. Document new environment variables, API fields, or UX behaviors here.
4. Ensure group persistence continues to set/read `active_group_id`.

## Support

- Open an issue or reach out to the Risk Register team.
- Backend Swagger docs available at `http://localhost:8000/docs`.
- For module federation host integration questions, contact platform engineering.
