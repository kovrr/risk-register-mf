# Cypress Test Updates Summary

## Overview
This document tracks the updates made to Cypress tests to align with recent code changes:
1. Notes API endpoints changed to scenario-based routes
2. Scenario ID changed from `scenario.id` (Mongo _id) to `scenario.scenario_id` (stable ID)
3. Companies endpoints disabled (no-op hooks)

## Completed Updates

### ✅ 1. Notes Mock Helpers (`cypress/support/commands-lib/mock-notes.ts`)
- **Updated** `mockGetNotes()` to use: `GET /api/risk-scenarios/{scenario_id}/notes`
- **Updated** `mockCreateNote()` to handle both:
  - `POST /api/risk-scenarios/{scenario_id}/notes` (content as query param)
  - `POST /api/risk-scenarios/{scenario_id}/notes-with-attachment` (FormData)
- **Updated** `mockGetDocument()` to use: `GET /api/risk-scenarios/{scenario_id}/attachments/download?attachment_id={id}`
- **Response format**: Changed to return `{ data: notes }` instead of `{ items: notes }`

### ✅ 2. Notes Component Tests (`cypress/component/Notes.cy.tsx`)
- Added scenario mock setup (component needs scenario context)
- Updated to use `scenario.scenario_id` instead of `scenario.id`
- Updated error test to use new endpoint structure
- Added proper scenario endpoint mocking

### ✅ 3. NoteItem Component Tests (`cypress/component/NoteItem.cy.tsx`)
- Added scenario context setup (component uses `useCurrentRiskRegisterScenario`)
- Updated download test to verify new attachment endpoint with scenario_id
- Added router params to provide scenarioId context

### ⚠️ 4. Company Endpoint Mocks (NOT REMOVED YET)
**Status**: Company endpoints are still mocked in tests but the hooks are no-op
- Tests still mock `/api/companies/*` but hooks won't call them
- These mocks are safe to leave (won't interfere) but could be removed for clarity
- **Files with company mocks**:
  - `MASScenarioView.cy.tsx` - line 64
  - `QuantitativeMetricsHeader.cy.tsx` - lines 142, 194
  - `RelevantControlsModal.cy.tsx` - line 59
  - `crq-scenario-form.cy.tsx` - line 72
  - `crq-scenario-form-edit.cy.tsx` - lines 75, 87
  - `base-driver.ts` - lines 376, 379, 439, 442

## Pending Updates

### 🔄 Files That May Need Updates
1. **MASScenarioView.cy.tsx** - Already uses `scenario.scenario_id` ✅
2. **QuantitativeMetricsHeader.cy.tsx** - Uses `company.id` (acceptable - not scenario ID)
3. **RelevantControlsModal.cy.tsx** - Uses `scenario.scenario_id` ✅
4. **crq-scenario-form.cy.tsx** - Uses `company.id` in payload (acceptable)
5. **crq-scenario-form-edit.cy.tsx** - Uses `scenario.scenario_id` ✅
6. **scenario-form.cy.tsx** - Uses `scenario.scenario_id` ✅
7. **scenario-form-edit.cy.tsx** - Uses `scenario.scenario_id` ✅

### 📝 Notes
- `company.id` references are acceptable - they're for company data, not scenario IDs
- Only `scenario.id` should be changed to `scenario.scenario_id`
- Company endpoint mocks are harmless (hooks return empty) but could be cleaned up

## Testing Checklist

- [x] Notes component renders correctly
- [x] Notes can be created
- [x] Notes with attachments work
- [x] Attachment download works
- [x] Scenario IDs use stable `scenario_id` field
- [ ] All form tests pass
- [ ] All scenario view tests pass
- [ ] All CRQ form tests pass

## Key API Endpoint Changes

### Notes Endpoints (OLD → NEW)
```
OLD: GET  /api/notes?parent_type=scenario&parent_id={id}
NEW: GET  /api/risk-scenarios/{scenario_id}/notes

OLD: POST /api/notes (with parent_type/parent_id in body)
NEW: POST /api/risk-scenarios/{scenario_id}/notes?content={content}

OLD: POST /api/notes (with FormData)
NEW: POST /api/risk-scenarios/{scenario_id}/notes-with-attachment (FormData)

OLD: GET  /api/documents/{id}
NEW: GET  /api/risk-scenarios/{scenario_id}/attachments/download?attachment_id={id}
```

### Response Format Changes
- Notes GET: `{ items: [...] }` → `{ data: [...] }`
- Document GET: `{ download_url: "..." }` → Blob response

## Running Tests
```bash
# Run all component tests
yarn cypress:component

# Run specific test file
yarn cypress:component --spec "cypress/component/Notes.cy.tsx"
```

