# Missing Files and Code Request for Risk Register Migration

## Overview
I'm migrating the Risk Register microfrontend and need several missing files and code snippets from the original project to fix TypeScript errors and complete the setup.

## Critical Missing Files

### 1. DemoExperienceContext
**Location needed:** `src/contexts/DemoExperienceContext.tsx` or similar
**Used in:** Multiple Risk Register components
**Error:** `Cannot find module '@/DemoExperienceContext'`

### 2. Missing Type Definitions
**Files needed:**
- `src/types/companyAsset.ts` - Used in `src/mocks/builders/assetBuilder.ts`
- `src/types/transparency.ts` - Used in `src/mocks/builders/transperancyBuilder.ts`
- `src/types/sidebarPermissionsType.ts` - Used in `src/mocks/builders/buildMenuItemsPermissions.ts`

### 3. Missing Service Files
**Files needed:**
- `src/services/service.ts` - Used in `src/components/wrappers/InstanceWrapper.tsx`
- `src/services/securityscorecardHooks.ts` - Used in `src/mocks/builders/securityscorecardBuilders.ts`

### 4. Missing Component Files
**Files needed:**
- `src/components/layout/sidebar/sidebarPermissionsType.ts`
- `src/components/wrappers/ErrorBoundary.tsx`

### 5. Missing Utility Files
**Files needed:**
- `src/_pages/FinancialQuantification/Mitigation/types.ts`
- `src/_pages/FinancialQuantification/Mitigation/utils.ts`
- `src/_pages/Sphere/Security/ISO/formInitialValues.ts`
- `src/_pages/ROCI/CompanyCreation/Form/utils/types.ts`
- `src/_pages/ROCI/CompanyCreation/Form/utils/initial-values.ts`
- `src/_pages/ResultsNarrative/RiskProgressionTab/PastQuantificationsCard/PastRunsChangeLogs/types.ts`

## Code Snippets Needed

### 1. DemoExperienceContext Implementation
```typescript
// Need the complete DemoExperienceContext implementation
// Should include:
// - showDemoModal function
// - Context provider
// - Hook for using the context
```

### 2. Missing Type Definitions
```typescript
// Need these type definitions:
export interface CompanyAsset {
  // ... asset properties
}

export interface TransparencyData {
  // ... transparency properties
}

export interface SidebarPermissionsType {
  // ... permission properties
}
```

### 3. Service Implementation
```typescript
// Need service.ts implementation
// Should include:
// - Service configuration
// - API client setup
// - Service methods
```

## Dependencies to Install

### Missing Type Packages
```bash
yarn add -D @types/uuid
yarn add -D @types/styled-components
yarn add -D @types/next-themes
```

### Missing UI Packages
```bash
yarn add @radix-ui/react-label
yarn add styled-components
yarn add next-themes
yarn add uuid
```

## Configuration Files Needed

### 1. Next.js Image Component Alternative
**Issue:** `Cannot find module 'next/image'`
**Solution:** Need alternative image component or configuration

### 2. Chart Component Types
**Issue:** Chart component has type errors
**Solution:** Need proper chart type definitions

## Mock Data Structure Questions

### 1. Risk Register Response Structure
**Question:** What should the complete structure of `buildRiskRegisterResponse()` return?
**Current error:** Missing properties in response objects

### 2. Company Data Structure
**Question:** What properties should `buildCompany()` include?
**Current error:** Missing `currency` property

### 3. Feature Toggle Structure
**Question:** What should the feature toggle response structure look like?
**Current error:** Missing feature toggle properties

## Import Path Fixes Needed

### 1. Relative to Absolute Paths
**Current:** `'../service/hooks'`
**Should be:** `'@/services/hooks'`

### 2. Missing Path Mappings
**Need to add to tsconfig.json:**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/DemoExperienceContext": ["./src/contexts/DemoExperienceContext"],
      "@/service/*": ["./src/services/*"]
    }
  }
}
```

## Priority Order

### High Priority (Blocking)
1. DemoExperienceContext implementation
2. Missing type definitions
3. Service.ts implementation
4. Critical dependency installations

### Medium Priority
1. Component wrapper files
2. Utility type definitions
3. Chart component fixes

### Low Priority
1. Unused variable warnings
2. Minor type improvements

## Expected Response Format

Please provide:

1. **Complete file contents** for each missing file
2. **Code snippets** for specific implementations
3. **Package.json additions** for missing dependencies
4. **Configuration updates** needed
5. **Any additional setup steps** required

## Current Status
- ✅ Mock files copied
- ✅ MSW service worker initialized
- ✅ Environment variables set
- ❌ TypeScript errors (100+ errors)
- ❌ Missing critical files
- ❌ Import path issues

## Next Steps After Receiving Files
1. Install missing dependencies
2. Copy provided files to correct locations
3. Fix import paths
4. Test mock functionality
5. Run development server

Thank you for providing these files! This will help complete the Risk Register microfrontend migration successfully.
