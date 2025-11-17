# Risk Register Microfrontend Migration Guide

## Executive Summary

This document provides a complete guide for migrating the Risk Register feature from the main FOQUS frontend to a standalone microfrontend. The migration involves copying 140+ files, handling cross-dependencies, and setting up the infrastructure for an independent application.

**Estimated Time: 50-60 hours (1.5-2 weeks)**

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Directory Structure Overview](#directory-structure-overview)
3. [Phase-by-Phase Migration Plan](#phase-by-phase-migration-plan)
4. [Files and Dependencies Checklist](#files-and-dependencies-checklist)
5. [Configuration](#configuration)
6. [Testing Strategy](#testing-strategy)
7. [Deployment](#deployment)

---

## Prerequisites

### Required Tools
- Node.js v20.18.x (as specified in package.json)
- Yarn 4.6.0 (package manager)
- Git

### Required Knowledge
- React 18.2.0
- TypeScript 4.9.5
- Next.js 13.2.4
- React Query 3.34.7
- Tailwind CSS
- Frontegg authentication

### Backend Requirements
- Access to Risk Register API endpoints (`/api/risk-register/*`)
- Access to Tenant API (`/api/tenant`)
- Access to Companies API (`/api/companies`)
- Access to Notes API (`/api/notes`)
- Authentication token handling via Frontegg

---

## Directory Structure Overview

### Source Application Structure
```
foqus-fe/
├── src/
│   ├── _pages/
│   │   └── RiskRegister/          # Main feature directory (140 files)
│   ├── newComponents/              # Shared UI components (51 files)
│   ├── types/                      # TypeScript definitions
│   ├── service/                    # API hooks and utilities
│   ├── hooks/                      # Custom React hooks
│   ├── lib/                        # Utility functions
│   ├── options/                    # Constants and configurations
│   ├── permissions/                # Permission system
│   └── DemoExperienceContext.tsx   # Demo user experience
```

### Target Microfrontend Structure
```
risk-register-mf/
├── src/
│   ├── features/
│   │   └── RiskRegister/          # Copied from _pages/RiskRegister
│   ├── components/
│   │   └── shared/                # Copied from newComponents
│   ├── types/                     # Type definitions
│   ├── services/
│   │   ├── api/                   # API client
│   │   ├── hooks/                 # React Query hooks
│   │   └── feature-toggles/       # Feature flags
│   ├── contexts/                  # React contexts
│   ├── permissions/               # Permission hooks
│   ├── lib/                       # Utilities
│   ├── options/                   # Configuration
│   └── App.tsx
```

---

## Phase-by-Phase Migration Plan

### Phase 1: Setup New Microfrontend Repository (4 hours)

**Goal:** Create a new Next.js project with the same configuration as the parent app.

#### Steps:

1. **Create new Next.js project:**
```bash
npx create-next-app@13.2.4 risk-register-mf --typescript --tailwind --app --use-yarn
cd risk-register-mf
```

2. **Install core dependencies:**
```bash
yarn add \
  @frontegg/react@^7.0.13 \
  react-query@^3.34.7 \
  @tanstack/react-table@^8.5.13 \
  react-hook-form@^7.54.2 \
  @hookform/resolvers@^4.0.0 \
  zod@^3.24.2 \
  axios@^1.6.2 \
  react-i18next@^14.1.2 \
  i18next@^21.6.16 \
  date-fns@^4.1.0 \
  sonner@^2.0.1 \
  lucide-react@^0.515.0 \
  class-variance-authority@^0.7.1 \
  clsx@^2.1.1 \
  tailwind-merge@^3.0.1 \
  react-router-dom@^6.25.0
```

3. **Install Radix UI components:**
```bash
yarn add \
  @radix-ui/react-avatar@^1.1.3 \
  @radix-ui/react-checkbox@^1.1.4 \
  @radix-ui/react-collapsible@^1.1.3 \
  @radix-ui/react-dialog@^1.1.6 \
  @radix-ui/react-dropdown-menu@^2.1.6 \
  @radix-ui/react-hover-card@^1.1.6 \
  @radix-ui/react-label@^1.1.2 \
  @radix-ui/react-popover@^1.1.6 \
  @radix-ui/react-radio-group@^1.2.3 \
  @radix-ui/react-select@^2.1.6 \
  @radix-ui/react-separator@^1.1.7 \
  @radix-ui/react-slider@^1.2.3 \
  @radix-ui/react-slot@^1.2.3 \
  @radix-ui/react-tabs@^1.1.12 \
  @radix-ui/react-toast@^1.2.6 \
  @radix-ui/react-tooltip@^1.1.8
```

4. **Install Chakra UI (for legacy components):**
```bash
yarn add \
  @chakra-ui/react@2.6.0 \
  @chakra-ui/next-js@^2.0.1 \
  @emotion/react@^11.10.5 \
  @emotion/styled@^11.10.5 \
  framer-motion@^6.5.1
```

5. **Install dev dependencies:**
```bash
yarn add -D \
  @types/react@^18.0.24 \
  @types/react-dom@^18.0.8 \
  @types/node@^20 \
  typescript@4.9.5 \
  prettier@^3.5.0 \
  eslint@^8.33.0
```

6. **Configure tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext", "es2021"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"]
    },
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

7. **Set up environment variables (.env.local):**
```bash
NEXT_PUBLIC_API_URL=https://your-api-url.com
NEXT_PUBLIC_FRONTEGG_APP_URL=https://your-frontegg-app.frontegg.com
NEXT_PUBLIC_FRONTEGG_CLIENT_ID=your-client-id
```

---

### Phase 2: Copy Core Risk Register Directory (2 hours)

**Goal:** Copy the main Risk Register feature directory.

#### Files to Copy:

**Source:** `/src/_pages/RiskRegister/*`
**Destination:** `/src/features/RiskRegister/*`

This includes:
- `index.tsx` - Main entry point (15 lines)
- `components/` - 35+ component files
  - `AddScenarioButton/` - Scenario creation components
  - `CustomFields/` - Custom field rendering and management
  - `icons/` - SVG icons
  - `DeleteScenarioModal.tsx`
  - `ErrorDialog.tsx`
  - `MitigationCostField.tsx`
  - `PriorityDropdown.tsx`
  - `ResponsePlanDropdown.tsx`
  - `RiskOwner.tsx`
  - `ScenarioTableTopBar.tsx`
- `RiskRegisterTable/` - Main table implementation
  - `index.tsx`
  - `useRiskRegisterTable.tsx`
  - `useUpdateDropdownCell.tsx`
  - `useUpdateRiskRegisterQueries.ts`
  - `Cells/` - Table cell components
- `ScenarioView/` - Scenario detail view
  - `MASView/` - MAS methodology view
  - `NaiveView/` - Simple scenario view
  - `MethodologyInsights/` - Methodology cards
  - `Notes.tsx` - Notes component
  - `ScenarioActionMenu.tsx`
  - `ScenarioContainer.tsx`
- `ScenarioDrillDown/` - Detailed scenario analysis
  - `ControlsModal/` - Security controls display
  - `DamageTypes/` - Financial impact breakdown
  - `DataBreachDuePhishing/` - CRQ scenario components
  - `RiskManagement/` - Risk management form
  - `SimulationExamples/` - Simulation examples
  - `TopActions/` - Mitigation actions table
- `ScenarioInputForm/` - Scenario creation/edit forms
  - `RiskScenarioInputForm.tsx` (222 lines)
  - `CRQRiskScenarioInputForm.tsx`
  - `ScenarioInputModal.tsx`
  - `components/` - Form field components
- `ScenarioEdit/` - Scenario editing
- `InvitationForm/` - User invitation form
- `utils/` - Utility functions
  - `controlsTransfomer.ts`
  - `textManipulation.ts`
  - `use-risk-register-demo-features.ts`

**Total:** ~140 files

#### Import Path Updates:

Use find/replace to update import paths:
```bash
# From: @/_pages/RiskRegister
# To:   @/features/RiskRegister
```

---

### Phase 3: Copy Shared UI Components (3 hours)

**Goal:** Copy the `newComponents` directory with all shared UI components.

#### Files to Copy:

**Source:** `/src/newComponents/*`
**Destination:** `/src/components/shared/*`

This includes:

**Atoms (28 files):**
- `button.tsx` - Button component
- `input.tsx` - Input fields
- `select.tsx` - Select dropdown
- `table.tsx` - Table component
- `dialog.tsx` - Modal dialogs
- `dropdown-menu.tsx` - Dropdown menus
- `form.tsx` - Form wrapper
- `toast.tsx` / `toaster.tsx` / `sonner.tsx` - Toast notifications
- `card.tsx` - Card container
- `badge.tsx` - Badge component
- `checkbox.tsx` - Checkbox input
- `label.tsx` - Form labels
- `separator.tsx` - Separator line
- `skeleton.tsx` - Loading skeleton
- `tabs.tsx` - Tab navigation
- `tooltip.tsx` - Tooltips
- `popover.tsx` - Popovers
- `hover-card.tsx` - Hover cards
- `collapsible.tsx` - Collapsible sections
- `radio-group.tsx` - Radio buttons
- `slider.tsx` - Range slider
- `dual-range-slider.tsx` - Dual range slider
- `textarea.tsx` - Text area
- `avatar.tsx` - Avatar component
- `chart.tsx` - Chart component
- And more...

**Molecules (15 files):**
- `DataTable.tsx` - Main data table (used by Risk Register)
- `AsyncSelect.tsx` - Async select dropdown
- `ConfirmationDialog.tsx` - Confirmation dialogs
- `Dropdown.tsx` / `DropdownMenu.tsx` - Dropdown components
- `Pagination.tsx` - Pagination controls
- `BackButton.tsx` / `BackWithLabel.tsx` - Navigation
- `BasicTooltip.tsx` - Tooltip wrapper
- `info-popover.tsx` - Info popover
- `LikelihoodBadge.tsx` - Risk likelihood badge
- `RadialChart.tsx` / `RadialChartWithLabel.tsx` - Radial charts
- `RestrictedOverlay.tsx` - Permission overlay
- `SeverityBullet.tsx` - Severity indicator
- `TableHeaderCell.tsx` - Table header

**Icons (4 files):**
- `Lightbulb.tsx`
- `ScrewdriverWrenchCross.tsx`
- `Sparkle.tsx`
- `Triangle.tsx`

**Hooks (1 file):**
- `use-debounce.ts`

**Charts Utils (1 file):**
- `utils.ts` - Chart utilities

#### Import Path Updates:

```bash
# From: @/newComponents
# To:   @/components/shared
```

---

### Phase 4: Copy Type Definitions (3 hours)

**Goal:** Copy all TypeScript type definitions used by Risk Register.

#### Files to Copy:

**Source:** `/src/types/*`
**Destination:** `/src/types/*`

**Core Types (7 files):**

1. **`riskRegister.ts`** (~323 lines) - Main Risk Register types
   - `RiskRegisterRow`
   - `RiskRegisterResponse`
   - `RiskRegisterScenarioPaginatedResponse`
   - `ScenarioCreateRequest`
   - `SimpleScenarioUpdateRequest`
   - `CRQScenarioCreateRequest`
   - `CRQScenarioUpdateRequest`
   - `RiskOwner`
   - `ScenarioMetricsHistory`
   - `scenarioTypes`
   - And more...

2. **`companyForm.ts`** - Company-related types
   - `CompanyApiData`
   - `CompanyData`
   - `CompanyStatus`
   - `CompanyApiResponseItem`
   - `CompanyFormData`
   - `BusinessProfileForm`
   - `InsuranceForm`
   - `ZonesOfOperation`

3. **`quantificationData.ts`** - Financial quantification types
   - `QuantificationData`
   - `PastQuantificationData`
   - `SimulationExposure`
   - `Exposure`
   - `HazardDistributionValues`
   - `EventTypeOld`
   - `ThresholdType`
   - `ThresholdTypes`

4. **`sphereForm.ts`** - Security controls types
   - `SphereForm`
   - Control framework types

5. **`permissions.ts`** - Permission types
   - `PermissionTypes`
   - `HighOrderPermissions`
   - `ExtendedPermissionType`
   - `CompanyLevelPermissionParams`

6. **`tenantData.ts`** - Tenant configuration
   - `TenantData`
   - `FeatureToggle`

7. **`applicationTypes.ts`** - Application types
   - `TenantApplicationData`

**Risk Drivers Types (5 files):**

8. **`riskDrivers/attackVectors.ts`**
   - `InitialAttackVector`
   - `initialAttackVectorsAsStringArray`
   - `URL_TO_ATTACK_VECTOR`

9. **`riskDrivers/impactTypes.ts`**
   - `ClickableScenariosTypes`
   - `ClickableScenarioType`

10. **`riskDrivers/eventTypes.ts`**
    - `ClickableEventTypes`
    - `eventTypesAsStringArray`
    - `URL_TO_EVENT_TYPE`

11. **`riskDrivers/riskDrivers.ts`**
    - `RiskDriverTypes`

12. **`riskDrivers/damageTypes.ts`**
    - Damage type definitions

---

### Phase 5: Copy Service Layer (8 hours)

**Goal:** Set up API client and React Query hooks for data fetching.

#### Files to Copy/Create:

**1. API Client Setup**

**File:** `/src/services/api/client.ts`

```typescript
import axios, { AxiosInstance } from 'axios';
import { useAuth } from '@frontegg/react';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const createApiClient = (accessToken?: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
  });

  return client;
};

// Hook to get authenticated axios instance
export const useAxiosInstance = () => {
  const { user } = useAuth();
  const accessToken = user?.accessToken;

  return createApiClient(accessToken);
};

// For Next.js API routes (server-side)
export const useNextAxiosInstance = () => {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
```

**2. API Hooks**

**File:** `/src/services/hooks/index.ts`

Copy from `/src/service/hooks.ts` and extract only Risk Register-related hooks:

```typescript
// Query Keys
export const QUERY_KEYS = {
  RISK_REGISTER_SCENARIOS: 'RISK_REGISTER_SCENARIOS',
  RISK_REGISTER_SCENARIOS_TABLE: 'RISK_REGISTER_SCENARIOS_TABLE',
  RISK_OWNER: 'RISK_REGISTER_RISK_OWNER',
  NOTES: 'NOTES',
  TENANT_DATA: 'TENANT_DATA',
  COMPANIES: 'COMPANIES',
};

// API URLs
export const API_URL = {
  RISK_REGISTER: `${baseURL}/api/risk-register`,
  NOTES: `${baseURL}/api/notes`,
  TENANT: `${baseURL}/api/tenant`,
  COMPANIES: `${baseURL}/api/companies`,
};

// Hooks to copy:
// - useRiskRegisterScenarios
// - useRiskRegisterScenario
// - useCurrentRiskRegisterScenario
// - useCurrentRiskRegisterScenarioId
// - useCreateRiskRegisterScenario
// - useCreateCRQRiskRegisterScenario
// - useUpdateRiskRegisterScenario
// - useUpdateRiskRegisterScenarioField
// - useUpdateRiskRegisterScenarioRow
// - useDeleteRiskRegisterScenario
// - useExportRiskRegisterScenario
// - useMetricHistory
// - useRiskOwners
// - useCreateRiskOwner
// - useNotes
// - useCreateNote
// - useTenantData
// - useCompanies
// - useCompany
// - useUpdateCRQScenario
```

Copy lines 1531-2173 from `/src/service/hooks.ts` (Risk Register hooks)

**3. Feature Toggles**

**File:** `/src/services/feature-toggles/index.ts`

Copy from `/src/service/feature-toggles.ts`:

```typescript
import { useTenantData } from '../hooks';
import { FeatureToggle } from '@/types/tenantData';

const useFeatureToggle = (
  name: string,
): { featureToggle: FeatureToggle | undefined; isLoading: boolean } => {
  const { data: tenantData, isLoading } = useTenantData();
  return {
    featureToggle: tenantData?.feature_toggles.find(
      (toggle) => toggle.name === name,
    ),
    isLoading,
  };
};

export const useFeatureRiskRegisterCRQ = () => {
  const { featureToggle } = useFeatureToggle('enable.riskRegister.crq');
  return !!featureToggle?.value;
};

export const useFeatureRiskRegisterTemplate = () => {
  const { featureToggle } = useFeatureToggle('enable.RiskRegisterTemplate');
  return !!featureToggle?.value;
};

export const useFeatureRiskRegisterReorganize = () => {
  const { featureToggle } = useFeatureToggle('enable.riskRegister.reorganize');
  return !!featureToggle?.value;
};

export const useFeatureRiskRegisterExport = () => {
  const { featureToggle } = useFeatureToggle('enable.riskRegister.export');
  return !!featureToggle?.value;
};
```

---

### Phase 6: Copy Utility Functions (1.5 hours)

**Goal:** Copy shared utility functions and hooks.

#### Files to Copy:

**1. lib/utils.ts**

**Source:** `/src/lib/utils.ts`
**Destination:** `/src/lib/utils.ts`

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**2. hooks/use-toast.ts**

**Source:** `/src/hooks/use-toast.ts`
**Destination:** `/src/hooks/use-toast.ts`

Copy the entire file (toast notification hook)

**3. hooks/useMixpanel.tsx**

**Source:** `/src/hooks/useMixpanel.tsx`
**Destination:** `/src/hooks/useMixpanel.tsx`

Copy for analytics tracking (if needed)

**4. hooks/useLocalStorage.ts**

**Source:** `/src/hooks/useLocalStorage.ts`
**Destination:** `/src/hooks/useLocalStorage.ts`

For local storage management

---

### Phase 7: Copy Configuration Files (2 hours)

**Goal:** Copy constants and configuration options.

#### Files to Copy:

**Source:** `/src/options/*`
**Destination:** `/src/options/*`

**Required Files (4 files):**

1. **`constants.ts`** - Currency codes and constants
   ```typescript
   export const CURRENCY_CODES = ['USD', 'EUR', 'GBP', ...];
   export type CurrencyCodeType = typeof CURRENCY_CODES[number];
   ```

2. **`cisControls.ts`** - CIS security controls data
   - Large data file with control definitions

3. **`cisV8Controls.ts`** - CIS v8 controls
   - Updated CIS controls version

4. **`nistV2Controls.ts`** - NIST controls
   - NIST cybersecurity framework controls

**Usage:** These files are used by `controlsTransfomer.ts` in Risk Register utils.

---

### Phase 8: Setup Permission System (4 hours)

**Goal:** Create permission hooks using Frontegg.

#### Files to Create:

**File:** `/src/permissions/use-permissions.ts`

**Source:** `/src/permissions/use-permissions.ts` (copy entire file)

Key hooks:
- `useIsGuestUser()` - Check if user is a guest (used in 14+ files)
- `useIsRiskRegisterLimitedUser()` - Check if user has limited RR access
- `useIsSelfAssessmentLimitedUser()` - Check for self-assessment users
- `useCanViewAllData()` - Permission to view data
- `useCanEditCompany()` - Permission to edit companies
- `useHasPermissions()` - Generic permission checker

**File:** `/src/types/permissions.ts`

Copy permission type definitions:
```typescript
export enum PermissionTypes {
  read = 'read',
  write = 'write',
  delete = 'delete',
}

export enum HighOrderPermissions {
  guestUser = 'guestUser',
  riskRegisterLimitedUser = 'riskRegisterLimitedUser',
  selfAssessmentLimitedUser = 'selfAssessmentLimitedUser',
  fqReadAll = 'fq.read-all',
  fqCreate = 'fq.create',
  companyCreate = 'company.create',
}

export type ExtendedPermissionType = PermissionTypes | '*';

export interface CompanyLevelPermissionParams {
  tenantId: string;
  companyId: string;
}
```

#### Integration Steps:

1. Ensure Frontegg is configured in the app
2. Wrap app with Frontegg provider
3. Configure permission keys to match parent application
4. Test permission gates in UI components

---

### Phase 9: Setup Demo Experience Context (3 hours)

**Goal:** Create context for managing demo user experience.

#### File to Copy:

**Source:** `/src/DemoExperienceContext.tsx`
**Destination:** `/src/contexts/DemoExperienceContext.tsx`

This context:
- Shows modal when demo users try to edit fields
- Used in 16+ files across Risk Register
- Integrates with permission system

**Dependencies:**
- `useIsRiskRegisterLimitedUser()` hook
- Confirmation modal component
- i18next translations

#### Implementation Options:

**Option 1: Full Implementation (Recommended)**
- Copy entire context with modal
- Copy ConfirmationModal component
- Set up translations

**Option 2: Simplified Version**
- Create no-op context for development
- Add full implementation later

**Option 3: Remove Demo Features**
- If not needed, remove all `showDemoModal` calls
- Simplify components

---

### Phase 10: Copy Additional Dependencies (4 hours)

**Goal:** Handle cross-directory component dependencies.

#### Components to Copy or Replace:

**From `/src/components/`:**

1. **Icons (SVG files):**
   - `icons/info.svg`
   - `icons/pencil.svg`
   - `icons/ellipse.svg`
   - `icons/x.tsx`
   - Copy entire `/src/components/icons/` directory

2. **Containers:**
   - `containers/modals/ConfirmationModal.tsx`
   - `containers/cards/*` (if used)

3. **UI Components:**
   - Check if any `components/ui/*` files are needed
   - Most should be covered by newComponents

**From Chakra UI:**

Risk Register uses Chakra UI components:
- `<Text>` - Text component
- `<Box>` - Container
- Theme configuration

**Action:** Keep Chakra UI dependency for now, gradually migrate to shadcn/ui later.

---

### Phase 11: Setup Internationalization (2 hours)

**Goal:** Configure i18next for translations.

#### Steps:

1. **Install i18next:**
   ```bash
   yarn add react-i18next i18next
   ```

2. **Create translation files:**

**File:** `/src/translations/en/riskRegister.json`

Copy from `/src/translations/en/riskRegister.json` in parent app

3. **Configure i18next:**

**File:** `/src/i18n.ts`

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import riskRegisterEn from './translations/en/riskRegister.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      riskRegister: riskRegisterEn,
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
```

4. **Import in App:**
```typescript
import './i18n';
```

---

### Phase 12: Setup Routing (3 hours)

**Goal:** Configure React Router for Risk Register pages.

#### Route Structure:

```
/                           → Risk Register Table
/scenario/create            → Create New Scenario
/scenario/:scenarioId       → View Scenario Details
/scenario/:scenarioId/edit  → Edit Scenario
```

#### Implementation:

**File:** `/src/App.tsx`

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RiskRegister from '@/features/RiskRegister';
import ScenarioView from '@/features/RiskRegister/ScenarioView';
import ScenarioEdit from '@/features/RiskRegister/ScenarioEdit';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RiskRegister />} />
        <Route path="/scenario/:scenarioId" element={<ScenarioView />} />
        <Route path="/scenario/:scenarioId/edit" element={<ScenarioEdit />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**URL Parameter Hooks:**

The following hooks are used throughout:
- `useCurrentRiskRegisterScenarioId()` - From URL params
- `useParams()` from react-router-dom

---

### Phase 13: Update Import Paths (3 hours)

**Goal:** Fix all import statements to use new directory structure.

#### Find & Replace Operations:

```bash
# Update Risk Register imports
Find:    @/_pages/RiskRegister
Replace: @/features/RiskRegister

# Update newComponents imports
Find:    @/newComponents
Replace: @/components/shared

# Update service imports
Find:    @/service/hooks
Replace: @/services/hooks

# Update type imports (should mostly work with @/types/*)
Find:    types/
Replace: @/types/

# Update hooks
Find:    @/hooks/
Replace: @/hooks/

# Update lib
Find:    @/lib/
Replace: @/lib/
```

#### Files Requiring Manual Updates:

Check these common import patterns:
- `from 'service/hooks'` → `from '@/services/hooks'`
- `from 'types/riskRegister'` → `from '@/types/riskRegister'`
- `from 'HttpClientContext'` → `from '@/services/api/client'`

#### Verification:

Run TypeScript compiler to find remaining errors:
```bash
yarn tsc --noEmit
```

---

### Phase 14: Setup React Query Provider (2 hours)

**Goal:** Configure React Query for data fetching.

#### Installation:

Already installed in Phase 1

#### Configuration:

**File:** `/src/providers/ReactQueryProvider.tsx`

```typescript
'use client';

import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useState } from 'react';

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

**File:** `/src/App.tsx` (wrap with provider)

```typescript
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import { FronteggProvider } from '@frontegg/react';

function App() {
  return (
    <FronteggProvider
      contextOptions={{
        baseUrl: process.env.NEXT_PUBLIC_FRONTEGG_APP_URL,
        clientId: process.env.NEXT_PUBLIC_FRONTEGG_CLIENT_ID,
      }}
    >
      <ReactQueryProvider>
        {/* Your app routes */}
      </ReactQueryProvider>
    </FronteggProvider>
  );
}
```

---

### Phase 15: Testing and Debugging (10 hours)

**Goal:** Test all features and fix bugs.

#### Test Checklist:

**Risk Register Table:**
- [ ] Table loads and displays scenarios
- [ ] Pagination works
- [ ] Sorting works
- [ ] Filtering works
- [ ] Row actions (view, edit, delete) work
- [ ] Export functionality works

**Scenario Creation:**
- [ ] Simple scenario creation works
- [ ] CRQ scenario creation works
- [ ] Form validation works
- [ ] Entity selection works
- [ ] Custom fields work

**Scenario View:**
- [ ] Scenario details load correctly
- [ ] Metrics display correctly
- [ ] Charts render properly
- [ ] Notes functionality works
- [ ] Controls modal opens and displays data
- [ ] Damage types visualization works

**Scenario Editing:**
- [ ] Edit form populates with existing data
- [ ] Updates save correctly
- [ ] Optimistic updates work
- [ ] Error handling works

**Permission Gates:**
- [ ] Guest users see correct restrictions
- [ ] Limited users can't edit scenarios
- [ ] Demo modal shows for restricted actions
- [ ] Permission checks work correctly

**CRQ Scenarios:**
- [ ] CRQ scenario creation works
- [ ] Rerun CRQ scenario works
- [ ] CRQ results display correctly
- [ ] Methodology insights show

**Custom Fields:**
- [ ] Add custom field wizard works
- [ ] Field types render correctly
- [ ] Field values save
- [ ] Field deletion works

**Risk Owners:**
- [ ] Risk owner dropdown populates
- [ ] Create new risk owner works
- [ ] Risk owner assignment saves

**Notes:**
- [ ] View notes
- [ ] Add note
- [ ] Upload file attachment
- [ ] Notes persist correctly

#### Debug Common Issues:

1. **"Cannot find module" errors:**
   - Check import paths
   - Verify files copied correctly
   - Check tsconfig.json paths

2. **API errors:**
   - Verify API_URL environment variable
   - Check Frontegg token in headers
   - Verify backend endpoints are accessible

3. **Type errors:**
   - Ensure all type files are copied
   - Check for missing type imports
   - Verify generic types are properly defined

4. **React Query errors:**
   - Check query keys match
   - Verify hooks have proper options
   - Check cache invalidation logic

5. **Style issues:**
   - Verify Tailwind config
   - Check CSS imports
   - Ensure Chakra theme is configured

---

### Phase 16: Documentation (3 hours)

**Goal:** Document the microfrontend for future maintainers.

#### Documents to Create:

**1. README.md**

```markdown
# Risk Register Microfrontend

Standalone Risk Register application.

## Setup

\`\`\`bash
yarn install
\`\`\`

## Environment Variables

Create `.env.local`:

\`\`\`
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_FRONTEGG_APP_URL=https://app.frontegg.com
NEXT_PUBLIC_FRONTEGG_CLIENT_ID=your-client-id
\`\`\`

## Development

\`\`\`bash
yarn dev
\`\`\`

## Build

\`\`\`bash
yarn build
\`\`\`

## Features

- Risk scenario management
- CRQ scenario analysis
- Custom fields
- Notes and attachments
- Security controls mapping
- Financial impact analysis

## Tech Stack

- Next.js 13.2.4
- React 18.2.0
- TypeScript 4.9.5
- React Query 3.34.7
- Tailwind CSS
- Frontegg Authentication
\`\`\`

**2. API.md** - Document API endpoints and data flow

**3. ARCHITECTURE.md** - Explain folder structure and patterns

**4. PERMISSIONS.md** - Document permission system

---

## Files and Dependencies Checklist

### Core Directories to Copy

- [ ] `/src/_pages/RiskRegister/` → `/src/features/RiskRegister/` (~140 files)
- [ ] `/src/newComponents/` → `/src/components/shared/` (~51 files)
- [ ] `/src/types/` → `/src/types/` (12 files)
- [ ] `/src/service/hooks.ts` → `/src/services/hooks/index.ts` (extract RR hooks)
- [ ] `/src/service/feature-toggles.ts` → `/src/services/feature-toggles/index.ts`
- [ ] `/src/lib/utils.ts` → `/src/lib/utils.ts`
- [ ] `/src/hooks/use-toast.ts` → `/src/hooks/use-toast.ts`
- [ ] `/src/options/` → `/src/options/` (4 files)
- [ ] `/src/permissions/use-permissions.ts` → `/src/permissions/use-permissions.ts`
- [ ] `/src/DemoExperienceContext.tsx` → `/src/contexts/DemoExperienceContext.tsx`
- [ ] `/src/components/icons/` → `/src/components/icons/` (SVG files)
- [ ] `/src/components/containers/modals/ConfirmationModal.tsx`

### NPM Dependencies

**Production:**
- [ ] `@frontegg/react@^7.0.13`
- [ ] `react-query@^3.34.7`
- [ ] `@tanstack/react-table@^8.5.13`
- [ ] `react-hook-form@^7.54.2`
- [ ] `@hookform/resolvers@^4.0.0`
- [ ] `zod@^3.24.2`
- [ ] `axios@^1.6.2`
- [ ] `react-i18next@^14.1.2`
- [ ] `i18next@^21.6.16`
- [ ] `date-fns@^4.1.0`
- [ ] `sonner@^2.0.1`
- [ ] `lucide-react@^0.515.0`
- [ ] `class-variance-authority@^0.7.1`
- [ ] `clsx@^2.1.1`
- [ ] `tailwind-merge@^3.0.1`
- [ ] `react-router-dom@^6.25.0`
- [ ] `@chakra-ui/react@2.6.0`
- [ ] `@chakra-ui/next-js@^2.0.1`
- [ ] `@emotion/react@^11.10.5`
- [ ] `@emotion/styled@^11.10.5`
- [ ] `framer-motion@^6.5.1`

**Radix UI:**
- [ ] All @radix-ui/* packages (14 packages)

**Dev Dependencies:**
- [ ] `typescript@4.9.5`
- [ ] `@types/react@^18`
- [ ] `@types/node@^20`
- [ ] `prettier@^3.5.0`

### Configuration Files

- [ ] `tsconfig.json` - TypeScript configuration
- [ ] `tailwind.config.js` - Tailwind CSS configuration
- [ ] `next.config.mjs` - Next.js configuration
- [ ] `.env.local` - Environment variables
- [ ] `.eslintrc.json` - ESLint configuration
- [ ] `.prettierrc` - Prettier configuration

---

## Configuration

### Environment Variables

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.your-domain.com

# Frontegg Authentication
NEXT_PUBLIC_FRONTEGG_APP_URL=https://your-app.frontegg.com
NEXT_PUBLIC_FRONTEGG_CLIENT_ID=your-client-id

# Feature Flags (Optional - can be managed via API)
NEXT_PUBLIC_FEATURE_CRQ=true
NEXT_PUBLIC_FEATURE_TEMPLATE=true
NEXT_PUBLIC_FEATURE_REORGANIZE=false

# Analytics (Optional)
NEXT_PUBLIC_MIXPANEL_TOKEN=your-token
```

### API Endpoints Required

Your backend must expose these endpoints:

```
GET    /api/v1/risk-scenarios              # List scenarios (paginated)
POST   /api/v1/risk-scenarios              # Create simple scenario
POST   /api/v1/risk-scenarios/crq          # Create CRQ scenario
GET    /api/v1/risk-scenarios/:id          # Get scenario details
PATCH  /api/v1/risk-scenarios/:id          # Update scenario
DELETE /api/v1/risk-scenarios/:id          # Delete scenario
GET    /api/v1/risk-scenarios/:id/controls # Get scenario controls
GET    /api/v1/risk-scenarios/:id/metrics-history # Get metrics history
POST   /api/v1/risk-scenarios/crq/:id/update-crq  # Rerun CRQ
GET    /api/v1/risk-scenarios/export       # Export scenarios

GET    /api/tenant                                # Get tenant data
GET    /api/tenant/users                          # Get risk owners
POST   /api/tenant/invite                         # Invite user

GET    /api/companies                             # List companies
GET    /api/companies/:id                         # Get company

GET    /api/notes?parent_type=scenario&parent_id=:id  # Get notes
POST   /api/notes                                 # Create note (with file upload)
```

### Frontegg Configuration

Ensure your Frontegg application has these permissions defined:
- `guestUser`
- `riskRegisterLimitedUser`
- `selfAssessmentLimitedUser`
- `fq.read-all`
- `fq.create`
- `company.create`
- `read` / `write` / `delete` (for company-level permissions)

---

## Testing Strategy

### Unit Tests (Optional)

Use Jest + React Testing Library:

```bash
yarn add -D jest @testing-library/react @testing-library/jest-dom
```

Test:
- Utility functions
- Custom hooks
- Form validation

### Integration Tests

Test with Cypress:

```bash
yarn add -D cypress
```

Test scenarios:
- Create scenario flow
- Edit scenario flow
- Delete scenario flow
- Notes functionality
- Custom fields

### E2E Tests

Existing Cypress tests in parent app can be adapted:
- `/cypress/e2e/risk-register.cy.ts`
- `/cypress/e2e/risk-register-rerun.cy.ts`
- `/cypress/e2e/export-scenario.cy.ts`

---

## Deployment

### Build for Production

```bash
yarn build
```

### Docker Deployment

**Dockerfile:**

```dockerfile
FROM node:20.18-alpine AS builder

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM node:20.18-alpine
WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["yarn", "start"]
```

Build and run:
```bash
docker build -t risk-register-mf .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.example.com \
  -e NEXT_PUBLIC_FRONTEGG_APP_URL=https://app.frontegg.com \
  -e NEXT_PUBLIC_FRONTEGG_CLIENT_ID=your-client-id \
  risk-register-mf
```

### Kubernetes Deployment

Use Helm chart template from parent app:
- `/helm/` directory contains templates

Update values for Risk Register microfrontend.

---

## Migration Estimation Summary

| Phase | Description | Time | Risk Level |
|-------|-------------|------|------------|
| 1 | Setup Repository | 4h | Low |
| 2 | Copy Risk Register | 2h | Low |
| 3 | Copy UI Components | 3h | Low |
| 4 | Copy Types | 3h | Low |
| 5 | Setup Service Layer | 8h | High |
| 6 | Copy Utilities | 1.5h | Low |
| 7 | Copy Configuration | 2h | Low |
| 8 | Setup Permissions | 4h | Medium |
| 9 | Demo Experience | 3h | Medium |
| 10 | Additional Dependencies | 4h | Medium |
| 11 | Internationalization | 2h | Low |
| 12 | Routing | 3h | Medium |
| 13 | Update Imports | 3h | Medium |
| 14 | React Query | 2h | Low |
| 15 | Testing & Debugging | 10h | High |
| 16 | Documentation | 3h | Low |
| **TOTAL** | | **57.5h** | |

**Buffer for unknowns:** +10-15h

**Total Realistic Estimate:** 65-70 hours (2-2.5 weeks)

---

## Risk Factors and Mitigation

### High Risk Areas:

1. **API Integration (Phase 5)**
   - **Risk:** Backend endpoints may not match expectations
   - **Mitigation:** Get API documentation early, test endpoints before migration

2. **Testing (Phase 15)**
   - **Risk:** Hidden dependencies may cause runtime errors
   - **Mitigation:** Thorough testing, use TypeScript compiler, test all user flows

3. **Permission System (Phase 8)**
   - **Risk:** Permission keys may not align with parent app
   - **Mitigation:** Coordinate with backend team, document all permission keys

### Medium Risk Areas:

1. **Cross-dependencies (Phase 10)**
   - **Risk:** Components may depend on unmigrated parts
   - **Mitigation:** Grep for all imports, create stub components if needed

2. **Feature Toggles (Phase 5)**
   - **Risk:** Feature flags may not work as expected
   - **Mitigation:** Default to enabling all features, make toggles optional

### Low Risk Areas:

- File copying (Phases 2-4, 6-7)
- Configuration setup (Phases 1, 11, 14)
- Documentation (Phase 16)

---

## Success Criteria

### Functional Requirements

- [ ] All Risk Register features work independently
- [ ] No compilation errors
- [ ] No runtime errors in browser console
- [ ] All API calls succeed
- [ ] Permissions properly restrict guest users
- [ ] Feature toggles control feature visibility

### Non-Functional Requirements

- [ ] Build time < 2 minutes
- [ ] Page load time < 2 seconds
- [ ] No console warnings
- [ ] TypeScript strict mode enabled
- [ ] Code follows existing patterns
- [ ] Documentation is complete

### Validation Checklist

- [ ] Can create simple scenario
- [ ] Can create CRQ scenario
- [ ] Can edit scenario
- [ ] Can delete scenario
- [ ] Can view scenario details
- [ ] Can export scenarios
- [ ] Can add custom fields
- [ ] Can add notes
- [ ] Can invite risk owners
- [ ] Permissions work correctly
- [ ] Demo modal works for limited users

---

## Next Steps

### After Migration:

1. **Performance Optimization**
   - Code splitting
   - Lazy loading
   - Image optimization

2. **Testing Coverage**
   - Add unit tests
   - Add integration tests
   - Set up CI/CD

3. **Monitoring**
   - Error tracking (Sentry)
   - Performance monitoring (Elastic APM)
   - Analytics (Mixpanel)

4. **Migration from Chakra to shadcn/ui** (Optional)
   - Gradually replace Chakra components
   - Reduce bundle size

5. **Feature Additions**
   - New scenario templates
   - Advanced filtering
   - Bulk operations
   - Reporting

---

## Support and Resources

### Documentation Links:
- Next.js: https://nextjs.org/docs
- React Query: https://tanstack.com/query/v3/docs/react/overview
- Frontegg: https://docs.frontegg.com/
- Radix UI: https://www.radix-ui.com/
- Tailwind CSS: https://tailwindcss.com/docs

### Internal Resources:
- Parent App: `/Users/admin/Projects/foqus-fe/`
- API Documentation: (TBD - coordinate with backend team)
- Permission Documentation: (TBD - coordinate with backend team)

---

## Appendix

### File Count Summary:

- Risk Register files: ~140
- UI Component files: ~51
- Type files: ~12
- Service files: ~3
- Hook files: ~3
- Option files: ~4
- Permission files: ~2
- Context files: ~1
- Utility files: ~2
- Icon files: ~40
- **Total files to copy/create: ~260**

### Import Pattern Reference:

```typescript
// Old patterns (parent app)
import { Component } from '@/_pages/RiskRegister/...'
import { Button } from '@/newComponents/atoms/button'
import { useRiskRegisterScenarios } from '@/service/hooks'
import { RiskRegisterRow } from '@/types/riskRegister'

// New patterns (microfrontend)
import { Component } from '@/features/RiskRegister/...'
import { Button } from '@/components/shared/atoms/button'
import { useRiskRegisterScenarios } from '@/services/hooks'
import { RiskRegisterRow } from '@/types/riskRegister'
```

---

## Conclusion

This migration will take approximately **2-2.5 weeks** of focused development time. The most critical phases are:
1. API Integration (Phase 5)
2. Testing & Debugging (Phase 15)
3. Permission System (Phase 8)

Start with Phases 1-4 (setup and file copying) while the backend API documentation is prepared. This will establish the foundation and allow early identification of issues.

Good luck with the migration! 🚀
