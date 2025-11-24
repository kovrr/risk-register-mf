# Risk Register Migration - Executive Summary

## Overview

Migrate the Risk Register feature (~140 files, 51 shared components) from the main FOQUS frontend to a standalone microfrontend.

**Time Estimate:** 65-70 hours (2-2.5 weeks)

---

## Quick Start

1. **Read the full guide:** `RISK_REGISTER_MIGRATION_GUIDE.md`
2. **Follow the checklist:** `MIGRATION_CHECKLIST.md`
3. **Start with Phase 1:** Repository setup

---

## Key Directories to Copy

| Source | Destination | Files | Description |
|--------|-------------|-------|-------------|
| `/src/_pages/RiskRegister/` | `/src/features/RiskRegister/` | ~140 | Main feature |
| `/src/newComponents/` | `/src/components/shared/` | ~51 | UI components |
| `/src/types/riskRegister.ts` | `/src/types/riskRegister.ts` | 1 | Core types |
| `/src/service/hooks.ts` (extract) | `/src/services/hooks/index.ts` | 1 | API hooks |
| `/src/options/` | `/src/options/` | 4 | Configuration |
| `/src/permissions/` | `/src/permissions/` | 1 | Permissions |
| `/src/DemoExperienceContext.tsx` | `/src/contexts/` | 1 | Demo context |

**Total:** ~260 files

---

## Critical Dependencies

### NPM Packages (Top Priority)

```bash
# Authentication & Data Fetching
yarn add @frontegg/react@^7.0.13 react-query@^3.34.7 axios@^1.6.2

# Routing
yarn add react-router-dom@^6.25.0

# UI Framework
yarn add @tanstack/react-table@^8.5.13 @chakra-ui/react@2.6.0

# Forms
yarn add react-hook-form@^7.54.2 zod@^3.24.2 @hookform/resolvers@^4.0.0

# Utilities
yarn add clsx@^2.1.1 tailwind-merge@^3.0.1 date-fns@^4.1.0

# Radix UI (14 packages - see full guide)
yarn add @radix-ui/react-dialog @radix-ui/react-dropdown-menu ...
```

---

## Core Files Reference

### API Hooks to Extract (from `/src/service/hooks.ts`)

Lines **1531-2173** contain Risk Register hooks:

```typescript
// Query hooks
useRiskRegisterScenarios()        // List scenarios
useRiskRegisterScenario()         // Get single scenario
useCurrentRiskRegisterScenario()  // Get current from URL
useMetricHistory()                // Get metrics history
useRiskOwners()                   // List risk owners
useNotes()                        // Get notes

// Mutation hooks
useCreateRiskRegisterScenario()    // Create simple scenario
useCreateCRQRiskRegisterScenario() // Create CRQ scenario
useUpdateRiskRegisterScenario()    // Update scenario
useUpdateRiskRegisterScenarioField() // Update specific field
useDeleteRiskRegisterScenario()    // Delete scenario
useExportRiskRegisterScenario()    // Export to Excel
useCreateRiskOwner()               // Invite user
useCreateNote()                    // Add note
useUpdateCRQScenario()             // Rerun CRQ
```

### Types to Copy (from `/src/types/`)

```typescript
// Core types (riskRegister.ts)
RiskRegisterRow
RiskRegisterResponse
RiskRegisterScenarioPaginatedResponse
ScenarioCreateRequest
CRQScenarioCreateRequest
SimpleScenarioUpdateRequest
CRQScenarioUpdateRequest
RiskOwner
ScenarioMetricsHistory

// Supporting types
CompanyData              // from companyForm.ts
QuantificationData       // from quantificationData.ts
SphereForm              // from sphereForm.ts
PermissionTypes         // from permissions.ts
TenantData              // from tenantData.ts
FeatureToggle           // from tenantData.ts
```

### Feature Toggle Hooks (from `/src/service/feature-toggles.ts`)

```typescript
useFeatureRiskRegisterCRQ()        // Enable CRQ scenarios
useFeatureRiskRegisterTemplate()   // Enable templates
useFeatureRiskRegisterReorganize() // Enable reorganize
useFeatureRiskRegisterExport()     // Enable export
```

### Permission Hooks (from `/src/permissions/use-permissions.ts`)

```typescript
useIsGuestUser()                    // Guest user check
useIsRiskRegisterLimitedUser()      // Limited user check
useIsSelfAssessmentLimitedUser()    // Self-assessment check
useCanViewAllData()                 // Can view data
useCanEditCompany()                 // Can edit company
```

---

## Environment Setup

### Required Environment Variables

```bash
# Backend API
NEXT_PUBLIC_API_URL=https://api.your-domain.com

# Frontegg Auth
NEXT_PUBLIC_FRONTEGG_APP_URL=https://your-app.frontegg.com
NEXT_PUBLIC_FRONTEGG_CLIENT_ID=your-client-id
```

### Required Backend Endpoints

```
# Scenarios
GET    /api/risk-scenarios
POST   /api/risk-scenarios
POST   /api/risk-scenarios/crq
GET    /api/risk-scenarios/:id
PATCH  /api/risk-scenarios/:id
DELETE /api/risk-scenarios/:id
GET    /api/risk-scenarios/export

# Supporting
GET    /api/tenant
GET    /api/tenant/users
POST   /api/tenant/invite
GET    /api/companies
GET    /api/companies/:id
GET    /api/notes
POST   /api/notes
```

---

## Migration Phases (Simplified)

### Week 1: Foundation
1. ✅ Setup repository (4h)
2. ✅ Copy core files (5h)
3. ✅ Setup API layer (8h)
4. ✅ Copy utilities (3h)
5. ✅ Setup permissions (4h)

### Week 2: Integration
6. ✅ Handle dependencies (4h)
7. ✅ Setup i18n & routing (6h)
8. ✅ Fix import paths (3h)
9. ✅ **TESTING & DEBUGGING** (16h)

### Week 3: Polish
10. ✅ Bug fixes (8h)
11. ✅ Documentation (8h)
12. ✅ Final testing (8h)

---

## Testing Checklist (High Priority)

### Must Test
- [ ] Create simple scenario ⭐
- [ ] Create CRQ scenario ⭐
- [ ] Edit scenario ⭐
- [ ] Delete scenario ⭐
- [ ] View scenario details ⭐
- [ ] Export scenarios ⭐
- [ ] Add custom fields
- [ ] Add notes
- [ ] Permission gates work ⭐

### Nice to Test
- [ ] Metrics history
- [ ] Controls modal
- [ ] Damage types visualization
- [ ] Rerun CRQ scenario
- [ ] Risk owner creation

---

## Common Import Path Changes

```typescript
// BEFORE (parent app)
import { Component } from '@/_pages/RiskRegister/...'
import { Button } from '@/newComponents/atoms/button'
import { useRiskRegisterScenarios } from '@/service/hooks'
import { useAxiosInstance } from 'HttpClientContext'

// AFTER (microfrontend)
import { Component } from '@/features/RiskRegister/...'
import { Button } from '@/components/shared/atoms/button'
import { useRiskRegisterScenarios } from '@/services/hooks'
import { useAxiosInstance } from '@/services/api/client'
```

---

## Risk Management

### High Risk Items ⚠️

1. **API Integration**
   - Ensure backend endpoints match
   - Test all API calls early
   - Document any differences

2. **Testing Phase**
   - Budget extra time (16h planned)
   - Test all user flows
   - Fix bugs immediately

3. **Permissions**
   - Align permission keys with backend
   - Test all permission gates
   - Document permission requirements

### Medium Risk Items ⚡

1. **Cross-dependencies**
   - Grep for all imports
   - Create stub components if needed

2. **Feature Toggles**
   - Default to enabling features
   - Make toggles optional

3. **Translations**
   - Copy all translation files
   - Test all i18n keys

---

## File Structure Comparison

### Parent App
```
foqus-fe/
├── src/
│   ├── _pages/RiskRegister/        ← Copy this
│   ├── newComponents/               ← Copy this
│   ├── types/riskRegister.ts        ← Copy this
│   ├── service/hooks.ts             ← Extract RR hooks
│   ├── options/                     ← Copy this
│   └── permissions/                 ← Copy this
```

### Microfrontend
```
risk-register-mf/
├── src/
│   ├── features/RiskRegister/       ← Paste here
│   ├── components/shared/           ← Paste here
│   ├── types/                       ← Paste here
│   ├── services/hooks/              ← Paste RR hooks here
│   ├── options/                     ← Paste here
│   └── permissions/                 ← Paste here
```

---

## Key Components

### Main Entry Point
```
features/RiskRegister/index.tsx (15 lines)
  ├─ ScenarioTableTopBar
  └─ RiskRegisterTable
```

### Table Component
```
features/RiskRegister/RiskRegisterTable/
  ├─ index.tsx                      # Table wrapper
  ├─ useRiskRegisterTable.tsx       # Table logic
  ├─ useUpdateDropdownCell.tsx      # Inline editing
  └─ Cells/                         # Cell components
```

### Scenario Views
```
features/RiskRegister/ScenarioView/
  ├─ MASView/                       # MAS methodology
  ├─ NaiveView/                     # Simple scenario
  └─ MethodologyInsights/           # CRQ insights
```

### Scenario Forms
```
features/RiskRegister/ScenarioInputForm/
  ├─ RiskScenarioInputForm.tsx      # Simple form (222 lines)
  ├─ CRQRiskScenarioInputForm.tsx   # CRQ form
  └─ components/                    # Form fields
```

---

## Success Criteria

### Functional
- ✅ All features work independently
- ✅ Zero compilation errors
- ✅ All API calls succeed
- ✅ Permissions work correctly
- ✅ Feature toggles work

### Non-Functional
- ✅ Build time < 2 min
- ✅ Page load < 2 sec
- ✅ No console warnings
- ✅ TypeScript strict mode
- ✅ Documentation complete

---

## Next Actions

1. **Read full guide:** `RISK_REGISTER_MIGRATION_GUIDE.md` (20 min)
2. **Review checklist:** `MIGRATION_CHECKLIST.md` (10 min)
3. **Get API docs:** Contact backend team
4. **Get Frontegg creds:** Contact platform team
5. **Start Phase 1:** Create repository and setup

---

## Support Resources

### Documentation
- **Full Guide:** `RISK_REGISTER_MIGRATION_GUIDE.md` (detailed)
- **Checklist:** `MIGRATION_CHECKLIST.md` (task-by-task)
- **Summary:** `MIGRATION_SUMMARY.md` (this file)

### External Docs
- Next.js: https://nextjs.org/docs
- React Query: https://tanstack.com/query/v3/docs
- Frontegg: https://docs.frontegg.com/
- Radix UI: https://www.radix-ui.com/

### Internal
- Parent App: `/Users/admin/Projects/foqus-fe/`
- Backend Team: (for API documentation)
- Platform Team: (for Frontegg setup)

---

## Quick Stats

| Metric | Value |
|--------|-------|
| Total files to copy | ~260 |
| Core feature files | ~140 |
| UI component files | ~51 |
| Type definition files | ~12 |
| Estimated time | 65-70 hours |
| Timeline | 2-2.5 weeks |
| High risk phases | 3 (API, Testing, Permissions) |
| Medium risk phases | 5 |
| Low risk phases | 8 |

---

## Contact Information

- **Migration Lead:** [Your Name]
- **Backend Team:** [Contact]
- **Platform Team:** [Contact]
- **Project Manager:** [Contact]

---

**Ready to start?** Begin with Phase 1 in the full migration guide! 🚀
