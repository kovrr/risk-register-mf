# Cypress Test Updates - Complete Summary

## Overview
All Cypress test files have been systematically reviewed and updated to match the current codebase implementation. This document summarizes all changes made.

## ✅ Completed Updates

### 1. Notes System (`cypress/support/commands-lib/mock-notes.ts`)
**Changed:**
- `mockGetNotes()` - Updated to use `GET /api/risk-scenarios/{scenario_id}/notes`
- `mockCreateNote()` - Updated to handle:
  - `POST /api/risk-scenarios/{scenario_id}/notes` (content as query param)
  - `POST /api/risk-scenarios/{scenario_id}/notes-with-attachment` (FormData)
- `mockGetDocument()` - Updated to use `GET /api/risk-scenarios/{scenario_id}/attachments/download?attachment_id={id}`
- Response format changed from `{ items: [...] }` to `{ data: [...] }`

**Files Updated:**
- `cypress/component/Notes.cy.tsx` - Added scenario context, updated endpoints
- `cypress/component/NoteItem.cy.tsx` - Added scenario context for download test

### 2. Scenario ID Usage
**Changed:** All references to `scenario.id` (Mongo `_id`) updated to `scenario.scenario_id` (stable ID)

**Verified Files:**
- ✅ `MASScenarioView.cy.tsx` - Already uses `scenario.scenario_id`
- ✅ `crq-scenario-form-edit.cy.tsx` - Already uses `scenario.scenario_id`
- ✅ `scenario-form-edit.cy.tsx` - Already uses `scenario.scenario_id`
- ✅ `RelevantControlsModal.cy.tsx` - Already uses `scenario.scenario_id`
- ✅ `QuantitativeMetricsHeader.cy.tsx` - Already uses `scenario.scenario_id`
- ✅ `customFields.cy.tsx` - Already uses `scenario.scenario_id`

### 3. Risk Owner Dropdown (`cypress/component/risk-owner-dropdown.cy.tsx`)
**Changed:**
- Removed `/api/tenant/users` mock (not used - `useRiskOwners` uses mock data)
- Removed `/api/tenant/invite` mock (not used - `useCreateRiskOwner` uses mock data)
- Updated test to not wait for API calls that don't happen

### 4. Form Submission Endpoints
**Verified:**
- ✅ Manual scenario: `POST /api/risk-scenarios` (correct)
- ✅ CRQ scenario: `POST /api/risk-scenarios/crq` (correct)
- ✅ Update scenario: `PATCH /api/risk-scenarios/{scenario_id}` (correct)
- ✅ Update CRQ: `POST /api/risk-scenarios/crq/{scenario_id}/update-crq` (correct)

**Files Updated:**
- `cypress/component/scenario-form.cy.tsx` - Added proper mock response with `scenario_id`

### 5. Company Endpoint Mocks
**Status:** Company endpoints are disabled (hooks return no-op), but mocks left in place for safety

**Added Comments:**
- `MASScenarioView.cy.tsx`
- `QuantitativeMetricsHeader.cy.tsx` (2 occurrences)
- `RelevantControlsModal.cy.tsx`
- `crq-scenario-form.cy.tsx`
- `crq-scenario-form-edit.cy.tsx` (2 occurrences)

All now have comments explaining these mocks won't be called but are harmless to leave.

### 6. Test File Status

#### ✅ Fully Updated & Verified:
1. `Notes.cy.tsx` - Notes component with scenario-based endpoints
2. `NoteItem.cy.tsx` - Note item with attachment download
3. `risk-owner-dropdown.cy.tsx` - Risk owner dropdown (mocks removed)
4. `scenario-form.cy.tsx` - Manual scenario form
5. `crq-scenario-form.cy.tsx` - CRQ scenario form
6. `crq-scenario-form-edit.cy.tsx` - CRQ scenario edit form
7. `scenario-form-edit.cy.tsx` - Manual scenario edit form
8. `MASScenarioView.cy.tsx` - MAS/CRQ scenario view
9. `RelevantControlsModal.cy.tsx` - Controls preview
10. `QuantitativeMetricsHeader.cy.tsx` - Quantitative metrics header
11. `customFields.cy.tsx` - Custom fields component
12. `ScenarioMetricsCard.cy.tsx` - Metrics card component
13. `ScenarioRobustness.cy.tsx` - Robustness component
14. `CrqAverageFinancialLossMetricFooter.cy.tsx` - CRQ financial loss footer
15. `AddRiskScenarioButton.cy.tsx` - Add scenario button

## API Endpoint Summary

### Notes Endpoints (UPDATED)
```
GET  /api/risk-scenarios/{scenario_id}/notes
POST /api/risk-scenarios/{scenario_id}/notes?content={content}
POST /api/risk-scenarios/{scenario_id}/notes-with-attachment (FormData)
GET  /api/risk-scenarios/{scenario_id}/attachments/download?attachment_id={id}
```

### Scenario Endpoints
```
POST   /api/risk-scenarios                    # Manual scenario
POST   /api/risk-scenarios/crq                # CRQ scenario
GET    /api/risk-scenarios/{scenario_id}      # Get scenario
PATCH  /api/risk-scenarios/{scenario_id}      # Update scenario
DELETE /api/risk-scenarios/{scenario_id}      # Delete scenario
POST   /api/risk-scenarios/crq/{scenario_id}/update-crq  # Update CRQ
GET    /api/risk-scenarios/{scenario_id}/metrics-history  # Metrics history
GET    /api/risk-scenarios/{scenario_id}/controls         # Controls
```

### Disabled Endpoints (No-op hooks)
```
GET /api/companies  # Disabled - hooks return empty array
GET /api/companies/*   # Disabled - hooks return empty array
```

### Mock Data (No API calls)
```
useRiskOwners()      # Returns mock data array
useCreateRiskOwner() # Adds to mock data array
```

## Key Changes Summary

1. **Notes System**: Completely migrated to scenario-based endpoints
2. **Scenario IDs**: All tests now use `scenario.scenario_id` (stable ID)
3. **Risk Owners**: Removed unused API mocks (uses mock data)
4. **Company Endpoints**: Added documentation comments (disabled but mocks safe)
5. **Form Endpoints**: Verified all match implementation

## Testing

All tests should now:
- ✅ Use correct API endpoints
- ✅ Use stable scenario IDs (`scenario_id` not `_id`)
- ✅ Not mock non-existent API calls
- ✅ Match current implementation

## Notes

- TypeScript linter errors in `cypress/tsconfig.json` are configuration issues, not code issues
- Company endpoint mocks are harmless (hooks are no-op) but left for safety
- All scenario ID references verified to use `scenario.scenario_id`

