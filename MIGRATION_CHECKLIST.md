# Risk Register Migration - Quick Start Checklist

## Pre-Migration Setup

- [ ] Create new repository for microfrontend
- [ ] Get API documentation from backend team
- [ ] Get Frontegg credentials for new app
- [ ] Set up development environment
- [ ] Review full migration guide: `RISK_REGISTER_MIGRATION_GUIDE.md`

---

## Week 1: Setup and Core Files

### Day 1: Repository Setup (4 hours)
- [ ] Initialize Next.js project with TypeScript
- [ ] Install all dependencies (see Phase 1 in guide)
- [ ] Configure tsconfig.json
- [ ] Set up Tailwind CSS
- [ ] Create .env.local with API credentials
- [ ] Set up Git repository

### Day 2-3: Copy Core Directories (8 hours)
- [ ] Copy `/src/_pages/RiskRegister/` → `/src/features/RiskRegister/`
- [ ] Copy `/src/newComponents/` → `/src/components/shared/`
- [ ] Copy `/src/types/riskRegister.ts`
- [ ] Copy `/src/types/companyForm.ts`
- [ ] Copy `/src/types/quantificationData.ts`
- [ ] Copy `/src/types/sphereForm.ts`
- [ ] Copy `/src/types/permissions.ts`
- [ ] Copy `/src/types/tenantData.ts`
- [ ] Copy `/src/types/riskDrivers/*`

### Day 4: Service Layer (8 hours)
- [ ] Create `/src/services/api/client.ts` (API client)
- [ ] Copy Risk Register hooks from `/src/service/hooks.ts`
- [ ] Copy feature toggle hooks from `/src/service/feature-toggles.ts`
- [ ] Set up React Query provider
- [ ] Test basic API connection

### Day 5: Utilities and Configuration (8 hours)
- [ ] Copy `/src/lib/utils.ts`
- [ ] Copy `/src/hooks/use-toast.ts`
- [ ] Copy `/src/options/constants.ts`
- [ ] Copy `/src/options/cisControls.ts`
- [ ] Copy `/src/options/cisV8Controls.ts`
- [ ] Copy `/src/options/nistV2Controls.ts`
- [ ] Copy `/src/permissions/use-permissions.ts`
- [ ] Copy `/src/DemoExperienceContext.tsx`

---

## Week 2: Integration and Testing

### Day 6: Additional Dependencies (4 hours)
- [ ] Copy necessary icon SVG files
- [ ] Copy ConfirmationModal component
- [ ] Copy any missing Chakra UI components
- [ ] Verify all cross-dependencies resolved

### Day 7: i18n and Routing (6 hours)
- [ ] Set up i18next
- [ ] Copy translation files
- [ ] Configure React Router
- [ ] Set up main routes
- [ ] Test navigation

### Day 8: Import Path Updates (6 hours)
- [ ] Find/replace all import paths
- [ ] Fix remaining TypeScript errors
- [ ] Run `yarn tsc --noEmit` to verify
- [ ] Fix any compilation errors

### Day 9-10: Testing and Debugging (16 hours)

**Risk Register Table:**
- [ ] Table loads scenarios
- [ ] Pagination works
- [ ] Sorting works
- [ ] Search/filtering works
- [ ] Export works
- [ ] Delete scenario works

**Scenario Creation:**
- [ ] Create simple scenario
- [ ] Create CRQ scenario
- [ ] Form validation
- [ ] Entity selection
- [ ] Custom fields

**Scenario View:**
- [ ] View scenario details
- [ ] Metrics display
- [ ] Charts render
- [ ] Notes functionality
- [ ] Controls modal
- [ ] Damage types

**Scenario Editing:**
- [ ] Edit form loads
- [ ] Updates save
- [ ] Optimistic updates
- [ ] Error handling

**Permissions:**
- [ ] Guest user restrictions
- [ ] Limited user restrictions
- [ ] Demo modal shows
- [ ] Permission gates work

**CRQ Scenarios:**
- [ ] Create CRQ scenario
- [ ] Rerun CRQ scenario
- [ ] Results display
- [ ] Methodology insights

**Custom Fields:**
- [ ] Add field wizard
- [ ] Field types render
- [ ] Field values save
- [ ] Field deletion

**Risk Owners:**
- [ ] Owner dropdown
- [ ] Create owner
- [ ] Owner assignment

**Notes:**
- [ ] View notes
- [ ] Add note
- [ ] File upload
- [ ] Notes persist

---

## Week 3: Polish and Documentation

### Day 11: Bug Fixes (8 hours)
- [ ] Fix all identified bugs
- [ ] Handle edge cases
- [ ] Improve error messages
- [ ] Test error scenarios

### Day 12: Documentation (8 hours)
- [ ] Write README.md
- [ ] Document API endpoints
- [ ] Document environment variables
- [ ] Document permissions
- [ ] Create architecture docs

### Day 13: Final Testing (8 hours)
- [ ] Full regression testing
- [ ] Performance testing
- [ ] Cross-browser testing
- [ ] Mobile responsiveness (if applicable)

### Day 14: Deployment Prep (8 hours)
- [ ] Production build test
- [ ] Create Dockerfile
- [ ] Set up CI/CD
- [ ] Deployment documentation
- [ ] Handoff to team

---

## Files to Copy - Master Checklist

### Phase 2: Risk Register (140 files)
```
✓ src/_pages/RiskRegister/
  ✓ index.tsx
  ✓ components/
    ✓ AddScenarioButton/ (5 files)
    ✓ CustomFields/ (14 files)
    ✓ icons/ (4 SVGs)
    ✓ DeleteScenarioModal.tsx
    ✓ ErrorDialog.tsx
    ✓ MitigationCostField.tsx
    ✓ PriorityDropdown.tsx
    ✓ ResponsePlanDropdown.tsx
    ✓ RiskOwner.tsx
    ✓ ScenarioTableTopBar.tsx
    ... (9 more files)
  ✓ RiskRegisterTable/ (7 files)
  ✓ ScenarioView/ (12 files)
  ✓ ScenarioDrillDown/ (50+ files)
  ✓ ScenarioInputForm/ (11 files)
  ✓ ScenarioEdit/
  ✓ InvitationForm/
  ✓ utils/ (3 files)
```

### Phase 3: UI Components (51 files)
```
✓ src/newComponents/
  ✓ atoms/ (28 files)
  ✓ molecules/ (15 files)
  ✓ icons/ (4 files)
  ✓ hooks/ (1 file)
  ✓ charts/ (1 file)
```

### Phase 4: Types (12 files)
```
✓ src/types/
  ✓ riskRegister.ts (REQUIRED)
  ✓ companyForm.ts
  ✓ quantificationData.ts
  ✓ sphereForm.ts
  ✓ permissions.ts (REQUIRED)
  ✓ tenantData.ts
  ✓ applicationTypes.ts
  ✓ riskDrivers/
    ✓ attackVectors.ts
    ✓ impactTypes.ts
    ✓ eventTypes.ts
    ✓ riskDrivers.ts
    ✓ damageTypes.ts
```

### Phase 5: Services (3 files)
```
✓ Create: src/services/api/client.ts
✓ Extract: src/services/hooks/index.ts (from src/service/hooks.ts lines 1531-2173)
✓ Copy: src/services/feature-toggles/index.ts (from src/service/feature-toggles.ts)
```

### Phase 6: Utilities (3 files)
```
✓ src/lib/utils.ts
✓ src/hooks/use-toast.ts
✓ src/hooks/useMixpanel.tsx (optional)
```

### Phase 7: Configuration (4 files)
```
✓ src/options/
  ✓ constants.ts
  ✓ cisControls.ts
  ✓ cisV8Controls.ts
  ✓ nistV2Controls.ts
```

### Phase 8: Permissions (2 files)
```
✓ src/permissions/use-permissions.ts
✓ src/types/permissions.ts
```

### Phase 9: Contexts (1 file)
```
✓ src/DemoExperienceContext.tsx → src/contexts/DemoExperienceContext.tsx
```

### Phase 10: Additional (40+ files)
```
✓ src/components/icons/ (SVG files)
✓ src/components/containers/modals/ConfirmationModal.tsx
```

---

## NPM Packages Checklist

### Core Dependencies
- [ ] `@frontegg/react@^7.0.13`
- [ ] `react-query@^3.34.7`
- [ ] `axios@^1.6.2`
- [ ] `react-router-dom@^6.25.0`

### UI Libraries
- [ ] `@tanstack/react-table@^8.5.13`
- [ ] `@chakra-ui/react@2.6.0`
- [ ] `lucide-react@^0.515.0`
- [ ] `sonner@^2.0.1`

### Form Handling
- [ ] `react-hook-form@^7.54.2`
- [ ] `@hookform/resolvers@^4.0.0`
- [ ] `zod@^3.24.2`

### Utilities
- [ ] `clsx@^2.1.1`
- [ ] `tailwind-merge@^3.0.1`
- [ ] `class-variance-authority@^0.7.1`
- [ ] `date-fns@^4.1.0`

### i18n
- [ ] `react-i18next@^14.1.2`
- [ ] `i18next@^21.6.16`

### Radix UI (14 packages)
- [ ] `@radix-ui/react-avatar@^1.1.3`
- [ ] `@radix-ui/react-checkbox@^1.1.4`
- [ ] `@radix-ui/react-dialog@^1.1.6`
- [ ] `@radix-ui/react-dropdown-menu@^2.1.6`
- [ ] `@radix-ui/react-label@^1.1.2`
- [ ] `@radix-ui/react-popover@^1.1.6`
- [ ] `@radix-ui/react-select@^2.1.6`
- [ ] `@radix-ui/react-tabs@^1.1.12`
- [ ] `@radix-ui/react-toast@^1.2.6`
- [ ] `@radix-ui/react-tooltip@^1.1.8`
- [ ] (and 4 more)

---

## Environment Variables Checklist

```bash
# Required
NEXT_PUBLIC_API_URL=                    # Backend API URL
NEXT_PUBLIC_FRONTEGG_APP_URL=          # Frontegg app URL
NEXT_PUBLIC_FRONTEGG_CLIENT_ID=        # Frontegg client ID

# Optional Feature Flags
NEXT_PUBLIC_FEATURE_CRQ=true
NEXT_PUBLIC_FEATURE_TEMPLATE=true
NEXT_PUBLIC_FEATURE_REORGANIZE=false

# Optional Analytics
NEXT_PUBLIC_MIXPANEL_TOKEN=            # Mixpanel token
```

---

## API Endpoints to Verify

### Risk Register
- [ ] `GET /api/risk-register/scenarios`
- [ ] `POST /api/risk-register/scenarios`
- [ ] `POST /api/risk-register/scenarios/crq`
- [ ] `GET /api/risk-register/scenarios/:id`
- [ ] `PATCH /api/risk-register/scenarios/:id`
- [ ] `DELETE /api/risk-register/scenarios/:id`
- [ ] `GET /api/risk-register/scenarios/:id/controls`
- [ ] `GET /api/risk-register/scenarios/:id/metrics-history`
- [ ] `POST /api/risk-register/scenarios/crq/:id/update-crq`
- [ ] `GET /api/risk-register/scenarios/export`

### Tenant & Users
- [ ] `GET /api/tenant`
- [ ] `GET /api/tenant/users`
- [ ] `POST /api/tenant/invite`

### Companies
- [ ] `GET /api/companies`
- [ ] `GET /api/companies/:id`

### Notes
- [ ] `GET /api/notes?parent_type=scenario&parent_id=:id`
- [ ] `POST /api/notes`

---

## Common Issues and Solutions

### Issue: "Cannot find module '@/_pages/RiskRegister'"
**Solution:** Update import paths to `@/features/RiskRegister`

### Issue: "Cannot find module '@/newComponents'"
**Solution:** Update import paths to `@/components/shared`

### Issue: API calls fail with 401
**Solution:** Check Frontegg token in axios headers, verify `useAxiosInstance()` hook

### Issue: TypeScript errors on types
**Solution:** Ensure all type files are copied, check import paths

### Issue: React Query hooks not working
**Solution:** Verify QueryClientProvider wraps app, check query keys

### Issue: Chakra UI components not styled
**Solution:** Import and configure Chakra theme in App.tsx

### Issue: Translations not loading
**Solution:** Check i18n configuration, verify translation files copied

### Issue: Permission hooks always return false
**Solution:** Verify Frontegg configuration, check permission key names

---

## Success Metrics

- [ ] Zero TypeScript compilation errors
- [ ] Zero runtime errors in console
- [ ] All API calls succeed
- [ ] All user flows complete successfully
- [ ] Build completes without errors
- [ ] Production build works
- [ ] Documentation is complete

---

## Final Deliverables

- [ ] Working microfrontend application
- [ ] README.md with setup instructions
- [ ] API documentation
- [ ] Environment variables documented
- [ ] Deployment guide
- [ ] Permission system documented
- [ ] Known issues/limitations documented
- [ ] Handoff meeting scheduled

---

## Timeline Summary

- **Week 1:** Setup, core files, services (40 hours)
- **Week 2:** Integration, testing, bug fixes (40 hours)
- **Week 3:** Polish, documentation, deployment (24 hours)

**Total:** ~104 hours budgeted (includes buffer time)
**Estimated actual:** 65-70 hours

---

## Getting Help

1. Review full guide: `RISK_REGISTER_MIGRATION_GUIDE.md`
2. Check parent app for reference implementations
3. Review API documentation
4. Contact backend team for API issues
5. Contact platform team for Frontegg issues

---

**Good luck with the migration!** 🚀
