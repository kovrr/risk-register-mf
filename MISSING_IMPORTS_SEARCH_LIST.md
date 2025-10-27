# Files with Missing Imports - Search List

## 🔴 Critical Missing Imports (High Priority)

### 1. DemoExperienceContext Related Files
**Missing Import:** `@/DemoExperienceContext`
**Files to search:**
- `src/_pages/RiskRegister/components/CustomFields/CustomFieldsContainer.tsx`
- `src/_pages/RiskRegister/components/CustomFields/fields/TagsField.tsx`
- `src/_pages/RiskRegister/components/CustomFields/FieldWrapper.tsx`
- `src/_pages/RiskRegister/components/PriorityDropdown.tsx`
- `src/_pages/RiskRegister/ScenarioDrillDown/DataBreachDuePhishing/MainAAL.tsx`
- `src/_pages/RiskRegister/ScenarioDrillDown/DataBreachDuePhishing/ScenarioHeader.tsx`

### 2. Service Files
**Missing Import:** `@/service/feature-toggles`
**Files to search:**
- `src/_pages/RiskRegister/ScenarioView/MASView/index.tsx`

**Missing Import:** `@/services/service`
**Files to search:**
- `src/components/wrappers/InstanceWrapper.tsx`

### 3. Type Definition Files
**Missing Import:** `types/companyAsset`
**Files to search:**
- `src/mocks/builders/assetBuilder.ts`

**Missing Import:** `types/transparency`
**Files to search:**
- `src/mocks/builders/transperancyBuilder.ts`

**Missing Import:** `@/components/layout/sidebar/sidebarPermissionsType`
**Files to search:**
- `src/mocks/builders/buildMenuItemsPermissions.ts`

## 🟡 Medium Priority Missing Imports

### 4. Next.js Related
**Missing Import:** `next/image`
**Files to search:**
- `src/_pages/RiskRegister/components/CustomFields/FieldWrapper.tsx`
- `src/_pages/RiskRegister/ScenarioDrillDown/ControlsModal/ControlsPreview.tsx`
- `src/_pages/RiskRegister/ScenarioDrillDown/DataBreachDuePhishing/components/RerunCRQScenario.tsx`
- `src/_pages/RiskRegister/ScenarioDrillDown/DataBreachDuePhishing/MainAAL.tsx`
- `src/components/containers/cards/TitleCard.tsx`

### 5. Component Wrappers
**Missing Import:** `components/wrappers/ErrorBoundary`
**Files to search:**
- `src/components/ui/tables/cells.tsx`

**Missing Import:** `_pages/FinancialQuantification/Mitigation/utils`
**Files to search:**
- `src/components/ui/tables/cells.tsx`

### 6. Financial Quantification Types
**Missing Import:** `_pages/FinancialQuantification/Mitigation/types`
**Files to search:**
- `src/mocks/builders/tableBuilders.ts`

**Missing Import:** `_pages/FinancialQuantification/Mitigation/utils`
**Files to search:**
- `src/mocks/builders/tableBuilders.ts`

## 🟢 Lower Priority Missing Imports

### 7. ROCI Related Files
**Missing Import:** `_pages/ROCI/CompanyCreation/Form/utils/types`
**Files to search:**
- `src/mocks/builders/companyBuilder.ts`
- `src/mocks/builders/e2eBuilders.ts`

**Missing Import:** `_pages/ROCI/CompanyCreation/Form/utils/initial-values`
**Files to search:**
- `src/mocks/builders/e2eBuilders.ts`

### 8. Sphere/Security Related
**Missing Import:** `_pages/Sphere/Security/ISO/formInitialValues`
**Files to search:**
- `src/mocks/builders/quantificationBuilders.ts`
- `src/mocks/data/fqResults.ts`

### 9. Results Narrative Related
**Missing Import:** `_pages/ResultsNarrative/RiskProgressionTab/PastQuantificationsCard/PastRunsChangeLogs/types`
**Files to search:**
- `src/mocks/builders/changeLogBuilder.ts`

### 10. Service Hooks
**Missing Import:** `service/securityscorecardHooks`
**Files to search:**
- `src/mocks/builders/securityscorecardBuilders.ts`

### 11. Helper Files
**Missing Import:** `../service/hooks`
**Files to search:**
- `src/helpers/string.ts`

## 📦 Missing Dependencies (Install These)

### Type Packages
```bash
yarn add -D @types/uuid
yarn add -D @types/styled-components
yarn add -D @types/next-themes
```

### Runtime Packages
```bash
yarn add @radix-ui/react-label
yarn add styled-components
yarn add next-themes
yarn add uuid
```

## 🔍 Search Instructions

For each file listed above:

1. **Open the file** in the original project
2. **Search for the missing import** (the part after `Cannot find module`)
3. **Copy the correct import path** and the file content
4. **Note the file location** in the original project structure

## 📋 Response Format

Please provide for each missing import:

```
File: [filename]
Missing Import: [exact import string]
Found At: [path in original project]
Correct Import: [correct import path]
File Content: [if it's a small file, include the content]
```

## 🎯 Priority Order for Search

1. **Start with DemoExperienceContext** - This affects the most files
2. **Then service files** - Critical for functionality
3. **Type definitions** - Needed for TypeScript compilation
4. **Component wrappers** - Needed for UI components
5. **Utility files** - Lower priority but still needed

This will help us fix all the import issues systematically!
