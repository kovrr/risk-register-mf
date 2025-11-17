<!-- b2839bf6-4c12-4884-8e95-4277da7f5545 1555cc29-318f-46bd-86ed-088fadf7caeb -->
# Risk Register Microfrontend Migration Plan

## Phase 1: Copy Core Directories (30 minutes)

**Description:** Copy the two main directories to the new microfrontend repository.

**Steps:**

1. Copy `/src/_pages/RiskRegister` to new repo's `src/features/RiskRegister`
2. Copy `/src/newComponents` to new repo's `src/newComponents`

**Time Estimate:** 30 minutes

- 15 min: Copy directories
- 15 min: Initial verification and setup

**Reasoning:** Straightforward copy operation with basic path updates.

---

## Phase 2: Copy Utility Functions (1 hour)

**Description:** Copy minimal utility files needed by both directories.

**Files to Copy:**

1. `src/lib/utils.ts` → Contains `cn()` function used in 30+ files
2. `src/hooks/use-toast.ts` → Toast hook used in 3 files

**Steps:**

1. Create `src/lib/utils.ts` in new repo
2. Create `src/hooks/use-toast.ts` in new repo
3. Verify imports resolve correctly

**Time Estimate:** 1 hour

- 20 min: Copy files
- 40 min: Test and verify toast functionality works

**Reasoning:** These are self-contained utilities with no complex dependencies. The `cn` function is 5 lines, and the toast hook is complete and ready to use.

---

## Phase 3: Copy Type Definitions (2 hours)

**Description:** Extract and copy all type definitions used by RiskRegister.

**Files to Copy:**

1. `src/types/riskRegister.ts` → Used in 35+ files (main types file, ~323 lines)
2. `src/types/companyForm.ts` → Used in 1 file (CompanyApiData, CompanyStatus types)
3. `src/types/riskDrivers/attackVectors.ts` → Used in 1 file
4. `src/types/riskDrivers/impactTypes.ts` → Used in 1 file
5. `src/types/quantificationData.ts` → Dependency of riskRegister.ts
6. `src/types/sphereForm.ts` → Dependency of riskRegister.ts
7. `src/types/permissions.ts` → Dependency of use-permissions

**Steps:**

1. Copy entire `src/types/` directory structure needed
2. Review and remove unused types to minimize dependencies
3. Update cross-type imports

**Time Estimate:** 2 hours

- 45 min: Identify and copy all type files
- 45 min: Review dependencies between type files
- 30 min: Clean up unused types and resolve import errors

**Reasoning:** Type files have interdependencies. Need to trace through imports carefully to ensure all required types are included.

---

## Phase 4: Copy Configuration Options (1.5 hours)

**Description:** Copy configuration and constant files.

**Files to Copy:**

1. `src/options/constants.ts` → CURRENCY_CODES and CurrencyCodeType (used in 6 files)
2. `src/options/cisControls.ts` → Used in controlsTransfomer.ts
3. `src/options/cisV8Controls.ts` → Used in controlsTransfomer.ts
4. `src/options/nistV2Controls.ts` → Used in controlsTransfomer.ts

**Steps:**

1. Create `src/options/` directory
2. Copy the 4 files listed above
3. Review for any nested dependencies

**Time Estimate:** 1.5 hours

- 30 min: Copy files
- 45 min: Review control implementation data structures
- 15 min: Test imports

**Reasoning:** These are data files, but CIS/NIST control files may be large with complex data structures that need verification.

---

## Phase 5: Create Mock Context Provider (3 hours)

**Description:** Create a simplified DemoExperienceContext provider for the new microfrontend.

**What It Does:**

- Current implementation shows a modal when demo users try to edit fields
- Used in 16 files across RiskRegister

**Implementation:**

```typescript
// src/contexts/DemoExperienceContext.tsx
import React from 'react';

interface ModalTitle {
  title: string;
}

interface ContextProps {
  showDemoModal: (modalContents: ModalTitle) => void;
}

export const DemoExperienceContext = React.createContext<ContextProps>({
  showDemoModal: () => null,
});

export const DemoExperienceContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const showDemoModal = ({ title }: ModalTitle) => {
    // Option 1: No-op for microfrontend (disable demo restrictions)
    // Option 2: Show simple alert
    // Option 3: Implement proper modal later
    console.log('Demo modal:', title);
  };

  return (
    <DemoExperienceContext.Provider value={{ showDemoModal }}>
      {children}
    </DemoExperienceContext.Provider>
  );
};
```

**Time Estimate:** 3 hours

- 1 hour: Implement basic context
- 1 hour: Decide on modal behavior (discuss with team)
- 1 hour: Test in all 16 files that use it

**Reasoning:** Need to decide whether to implement full modal or simplified version. Requires testing across multiple components to ensure no breaking changes.

---

## Phase 6: Create Mock Permissions System (4 hours)

**Description:** Create simplified permission hooks for the microfrontend.

**Current Usage:**

- `useIsGuestUser()` → Used in 14 files
- `useIsSelfAssessmentLimitedUser()` → Used in 1 file

**Implementation:**

```typescript
// src/permissions/use-permissions.ts
import { useProfileState } from '@frontegg/react';

const useHasPermissions = (requiredPermissions: string[]) => {
  const { profile } = useProfileState();
  const permissions = profile?.permissions || [];
  const permissionKeys = permissions.map((permission) => permission.key);
  return requiredPermissions.every((permission) =>
    permissionKeys.includes(permission),
  );
};

export const useIsGuestUser = () =>
  useHasPermissions(['guestUser']);

export const useIsSelfAssessmentLimitedUser = () =>
  useHasPermissions(['selfAssessmentLimitedUser']);

export const useIsRiskRegisterLimitedUser = () =>
  useHasPermissions(['riskRegisterLimitedUser']);
```

**Time Estimate:** 4 hours

- 1.5 hours: Implement permission hooks using Frontegg
- 1 hour: Define permission keys that match parent app
- 1 hour: Test permission behavior
- 30 min: Document permission setup requirements

**Reasoning:** Frontegg is in your boilerplate, so we can use it. Need to align permission keys with parent application. Testing required to ensure gates work correctly.

---

## Phase 7: Create Mock Feature Toggle System (2 hours)

**Description:** Create feature toggle hooks for conditional rendering.

**Current Usage:**

- `useFeatureRiskRegisterCRQ()` → Controls CRQ scenario button visibility
- `useFeatureRiskRegisterTemplate()` → Controls template scenario feature
- `useFeatureRiskRegisterReorganize()` → Controls reorganize feature

**Implementation:**

```typescript
// src/service/feature-toggles.ts
export const useFeatureRiskRegisterCRQ = () => {
  // Return true to enable feature, or read from env/config
  return process.env.REACT_APP_FEATURE_CRQ === 'true';
};

export const useFeatureRiskRegisterTemplate = () => {
  return process.env.REACT_APP_FEATURE_TEMPLATE === 'true';
};

export const useFeatureRiskRegisterReorganize = () => {
  return process.env.REACT_APP_FEATURE_REORGANIZE === 'true';
};
```

**Time Estimate:** 2 hours

- 45 min: Implement feature toggle hooks
- 45 min: Add environment variable configuration
- 30 min: Test feature toggling in UI

**Reasoning:** Simple implementation but need to set up proper configuration system and test all 4 usage points.

---

## Phase 8: Create Service/API Hooks (12 hours)

**Description:** Create React Query hooks for data fetching and mutations. This is the most complex phase.

**Hooks Needed:**

1. `useRiskRegisterScenarios()` → Fetches risk register data (table)
2. `useUpdateRiskRegisterScenarioField()` → Updates scenario fields
3. `useTenantData()` → Gets tenant information
4. `useCreateRiskOwner()` → Creates risk owner
5. `useRiskOwners()` → Fetches risk owners list
6. `useCurrentRiskRegisterScenario()` → Gets current scenario
7. `useUpdateCRQScenario()` → Updates CRQ scenario
8. `useCompany()` → Gets company data
9. `useCompanies()` → Gets companies list
10. Additional mutation hooks for CRUD operations

**Implementation Strategy:**

```typescript
// src/service/hooks.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiClient } from './api-client';

export const QUERY_KEYS = {
  riskRegister: 'risk-register',
  riskOwners: 'risk-owners',
  tenantData: 'tenant-data',
  // ... more keys
};

export const useRiskRegisterScenarios = (params) => {
  return useQuery(
    [QUERY_KEYS.riskRegister, params],
    () => apiClient.get('/api/v1/risk-scenarios', { params }),
  );
};

// ... similar pattern for other hooks
```

**Time Estimate:** 12 hours

- 3 hours: Set up API client with proper authentication
- 4 hours: Implement all query hooks with proper typing
- 3 hours: Implement mutation hooks with optimistic updates
- 2 hours: Test all API integrations and error handling

**Reasoning:** This is the core integration layer. Need to:

- Configure API endpoints (need backend URLs)
- Handle authentication tokens
- Implement proper error handling
- Set up React Query cache invalidation
- Test all CRUD operations

**Dependencies:** Need backend API documentation and endpoints.

---

## Phase 9: Handle Cross-Directory Dependencies (3 hours)

**Description:** Resolve or replace components from other parts of the codebase.

**Cross-Directory Dependencies:**

1. `@/_pages/FinancialQuantification/.../TableHeader` → Used in 1 file
2. `@/_pages/CompanyManagement/CompanyErrorRow` → Used in 3 files
3. `components/ui/Spinner` → Used in 1 file (DataTable.tsx)
4. `components/containers/cards/*` → Used in 5 files
5. `components/ui/charts/utils` → Used in 1 file
6. `components/icons/*` → Used in several files (info.svg, pencil.svg, ellipse.svg, etc.)

**Resolution Strategies:**

- **Option 1:** Copy needed components to microfrontend
- **Option 2:** Recreate using shadcn/ui alternatives
- **Option 3:** Remove features that depend on them (if non-critical)

**Steps:**

1. **Spinner:** Copy from `components/ui/Spinner` or use shadcn skeleton
2. **Icons:** Copy SVG files to new repo's assets
3. **Card components:** Use shadcn card or copy existing cards
4. **TableHeader:** Copy component or refactor to remove dependency
5. **CompanyErrorRow:** Extract `isCompanyWithError` utility function

**Time Estimate:** 3 hours

- 1 hour: Inventory all cross-dependencies
- 1.5 hours: Copy/recreate components
- 30 min: Test replacements

**Reasoning:** Some components are simple (SVGs, utilities), others may need recreation. Using shadcn for basic UI components will be faster than copying complex legacy components.

---

## Phase 10: Update Import Paths (2 hours)

**Description:** Update all import statements to use new microfrontend structure.

**Changes Needed:**

- `@/_pages/RiskRegister` → `@/features/RiskRegister`
- Verify all relative imports still work
- Update any absolute path aliases in tsconfig.json

**Steps:**

1. Set up path aliases in tsconfig.json
2. Global find/replace for common import patterns
3. Fix remaining import errors

**Time Estimate:** 2 hours

- 30 min: Configure tsconfig path aliases
- 1 hour: Update imports (mostly automated)
- 30 min: Resolve remaining import errors

**Reasoning:** Mostly automated with find/replace, but need to verify each change compiles correctly.

---

## Phase 11: Testing and Debugging (8 hours)

**Description:** Comprehensive testing of all features in the new microfrontend.

**Test Areas:**

1. Risk Register table loads and displays data
2. Scenario creation (simple and CRQ)
3. Scenario editing and updates
4. Risk owner management
5. Custom fields functionality
6. Scenario drill-down views
7. Controls modal
8. Damage types visualization
9. Notes functionality
10. Permission gates work correctly

**Steps:**

1. Set up test environment with backend connection
2. Test each major feature path
3. Fix bugs and missing dependencies
4. Handle edge cases

**Time Estimate:** 8 hours

- 2 hours: Initial smoke testing
- 3 hours: Feature-by-feature testing
- 2 hours: Bug fixes
- 1 hour: Edge case handling

**Reasoning:** First integration always reveals hidden dependencies and issues. Budget time for unexpected problems.

---

## Phase 12: Documentation and Handoff (2 hours)

**Description:** Document the migration and setup instructions.

**Deliverables:**

1. README with setup instructions
2. Environment variables documentation
3. API endpoint configuration guide
4. Known limitations/differences from parent app
5. Development workflow guide

**Time Estimate:** 2 hours

- 1 hour: Write documentation
- 1 hour: Create example configurations

**Reasoning:** Essential for team handoff and future maintenance.

---

## Total Time Estimate: 41 hours (~1 week)

**Breakdown by Complexity:**

- **Low Risk (13 hours):** Phases 1, 2, 3, 4, 10
- **Medium Risk (17 hours):** Phases 5, 6, 7, 9, 12
- **High Risk (11 hours):** Phases 8, 11

**Risk Factors:**

1. **Backend API availability** - If endpoints aren't ready, Phase 8 is blocked
2. **Unforeseen dependencies** - May discover more cross-dependencies during testing
3. **Permission alignment** - Parent app must share permission configuration
4. **Feature parity decisions** - Need to decide what features to include/exclude

**Recommendations:**

1. Start with Phases 1-4 (setup) while backend APIs are being prepared
2. Have backend API documentation ready before Phase 8
3. Plan for 1-2 days buffer for unexpected issues
4. Consider doing migration in 2-week sprint for safety

**Success Criteria:**

- All RiskRegister features work independently
- No compilation errors
- Permissions properly restrict guest users
- API integration functional with parent backend
- Documentation complete for team handoff
