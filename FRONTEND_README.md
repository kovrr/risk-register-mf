# Frontend Integration Guide - Risk Register Service API

## 📋 Table of Contents

1. [Overview](#overview)
2. [Project Configuration](#project-configuration)
3. [Running Locally](#running-locally)
4. [Authentication (Mock)](#authentication-mock)
5. [API Base URL](#api-base-url)
6. [TypeScript Types](#typescript-types)
7. [API Endpoints Reference](#api-endpoints-reference)
8. [Error Handling](#error-handling)
9. [Best Practices](#best-practices)

---

## Overview

This document provides comprehensive documentation for frontend developers integrating with the Risk Register Service API. The API manages risk register scenarios with support for notes, document attachments, versioning, and soft deletion (archiving).

### Key Features

- **Scenario Management**: Create, read, update, and delete risk register scenarios
- **Versioning**: All edits create new versions while maintaining logical IDs
- **Notes System**: Add notes to scenarios with optional document attachments
- **Soft Delete**: Scenarios are archived (not permanently deleted)
- **Group-based Access**: Scenarios are scoped to user groups
- **Mock Authentication**: No real auth required for development

---

## Project Configuration

### Backend Configuration

The backend runs on **port 8000** by default. The API is served at:

```
http://localhost:8000/api/risk-register
```

### Frontend Configuration

Configure your frontend to point to the backend API:

**Environment Variables (`.env` or `.env.local`):**

```bash
# Development
VITE_API_BASE_URL=http://localhost:8000/api
# or
REACT_APP_API_BASE_URL=http://localhost:8000/api
# or
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

**Example API Client Configuration:**

```typescript
// api/client.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const apiClient = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};
```

### CORS Configuration

The backend is configured to allow CORS from all origins in development. No additional CORS configuration is needed for local development.

---

## Running Locally

### Prerequisites

- **Backend**: Python 3.11+, MongoDB running locally or via Docker
- **Frontend**: Node.js 18+, npm/yarn/pnpm

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd risk-register-service
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   # or
   poetry install
   ```

3. **Set up MongoDB:**
   ```bash
   # Option 1: Use Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest

   # Option 2: Use local MongoDB installation
   # Ensure MongoDB is running on port 27017
   ```

4. **Run migrations:**
   ```bash
   python scripts/mongo_cli.py migrate up
   ```

5. **Start the backend server:**
   ```bash
   # Development mode (auto-reload)
   python main.py

   # Or using uvicorn directly
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

6. **Verify backend is running:**
   - Open http://localhost:8000/docs for Swagger UI
   - Open http://localhost:8000/ for health check

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd your-frontend-project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure environment:**
   ```bash
   # Create .env.local
   echo "VITE_API_BASE_URL=http://localhost:8000/api" > .env.local
   ```

4. **Start the frontend:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

### Running Both Together

**Terminal 1 (Backend):**
```bash
cd risk-register-service
python main.py
```

**Terminal 2 (Frontend):**
```bash
cd your-frontend-project
npm run dev
```

Both services should now be running:
- Backend: http://localhost:8000
- Frontend: http://localhost:3000 (or your configured port)

---

## Authentication (Mock)

### ⚠️ Important: Mock Authentication

**The backend currently uses mock authentication. You do NOT need to implement FrontEgg or any real authentication system.**

The backend automatically provides a mock user for all requests:

```typescript
// Mock user details (automatically injected by backend)
{
  user_id: "mock-user-123",
  tenant_id: "00000000-0000-0456-0000-000000000456",
  group_id: "00000000-0000-0456-0001-000000000001",
  email: "mock.user@example.com",
  name: "Mock User"
}
```

### What This Means for Frontend

1. **No Auth Headers Required**: You don't need to send authentication tokens or headers
2. **No Login Flow**: There's no login endpoint to call
3. **No Token Management**: No need to store or refresh tokens
4. **Remove FrontEgg**: You can remove all FrontEgg authentication code from your frontend

### Example API Call (No Auth Headers)

```typescript
// ✅ Correct - No auth headers needed
const response = await fetch('http://localhost:8000/api/risk-scenarios', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ❌ Incorrect - Don't add auth headers
const response = await fetch('http://localhost:8000/api/risk-scenarios', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ...', // ❌ Not needed
  },
});
```

---

## API Base URL

All risk register endpoints are prefixed with:

```
/api/risk-register
```

**Full base URL examples:**
- Local: `http://localhost:8000/api/risk-register`
- Production: `https://api.yourdomain.com/api/risk-register`

---

## TypeScript Types

### Core Types

```typescript
// Enums
enum ScenarioType {
  MANUAL = "manual",
  CRQ = "crq"
}

enum ScenarioStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed"
}

enum Likelihood {
  EXPECTED = "Expected",
  LIKELY = "Likely",
  POSSIBLE = "Possible",
  UNLIKELY = "Unlikely",
  RARE = "Rare"
}

enum Impact {
  SEVERE = "Severe",
  SIGNIFICANT = "Significant",
  MODERATE = "Moderate",
  MINOR = "Minor",
  NEGLIGIBLE = "Negligible"
}

enum RiskPriority {
  CRITICAL = "Critical",
  HIGH = "High",
  MEDIUM = "Medium",
  LOW = "Low"
}

enum ResponsePlan {
  ACCEPT = "Accept",
  AVOID = "Avoid",
  MITIGATE = "Mitigate",
  TRANSFER = "Transfer"
}

enum ScenarioCategory {
  STRATEGIC_RISK = "Strategic Risk",
  OPERATIONAL_RISK = "Operational Risk",
  TECHNICAL_RISK = "Technical Risk",
  PRIVACY_RISK = "Privacy Risk",
  SECURITY_RISK = "Security Risk",
  ETHICAL_RISK = "Ethical Risk",
  FAIRNESS_BIAS_RISK = "Fairness/Bias Risk",
  LEGAL_COMPLIANCE_RISK = "Legal/Compliance Risk",
  SAFETY_RISK = "Safety Risk",
  REPUTATIONAL_RISK = "Reputational Risk",
  ENVIRONMENTAL_RISK = "Environmental Risk"
}

// Data Structures
interface DataExposure {
  pii?: number;  // >= 0
  pci?: number;  // >= 0
  phi?: number;  // >= 0
}

interface ScenarioData {
  likelihood?: Likelihood;
  impact?: Impact;
  annual_likelihood?: number;  // 0-100
  peer_base_rate?: number;      // 0-100
  average_loss?: number;        // >= 0
  average_loss_currency?: string;
  sec_controls_framework?: string;
  risk_priority?: RiskPriority;
  response_plan?: ResponsePlan;
  risk_owner?: string;
  ticket?: string;
  methodology_insights?: string;
  sub_category?: string;
  review_date?: string;
  mitigation_cost?: number;
  scenario_category?: ScenarioCategory[];
  risk_subcategory?: string[];
  ai_assets?: string[];
  tactics?: string[];
  event_types?: string[];
  impact_types?: string[];
  data_exposure?: DataExposure;
}

interface DocumentData {
  id: string;
  filename: string;
  file_path: string;
  content_type: string;
  created_at: string;  // ISO 8601
  updated_at?: string; // ISO 8601
}

interface Note {
  id: string;
  content: string;
  user: string;
  created_at: string;  // ISO 8601
  updated_at?: string; // ISO 8601
  documents: DocumentData[];
}

// Request Types
interface CreateScenarioRequest {
  group_id: string;
  customer_scenario_id: string;
  name: string;
  description: string;
  scenario_type: ScenarioType;
  scenario_data: ScenarioData;
  // Note: scenario_id, version, and is_archived are auto-generated - DO NOT include
}

interface UpdateScenarioRequest {
  name?: string;
  description?: string;
  scenario_data?: Partial<ScenarioData>;
}

// Response Types
interface ScenarioResponse {
  id: string;                    // MongoDB _id
  scenario_id: string;           // Logical ID (same across versions)
  version: number;               // Version number
  group_id: string;
  customer_scenario_id: string;
  name: string;
  description: string;
  scenario_type: ScenarioType;
  scenario_data: ScenarioData;
  created_at: string;            // ISO 8601
  updated_at: string;            // ISO 8601
  deleted_at?: string;           // ISO 8601 (null if not deleted)
  status: ScenarioStatus;
  note_count: number;
  notes: Note[];
  is_archived: boolean;
}

interface ScenarioListResponse {
  scenarios: ScenarioResponse[];
  total_count: number;
  group_id: string;
}

interface APIResponse {
  success: boolean;
  message: string;
  data?: Record<string, any>;
}
```

---

## API Endpoints Reference

### 1. Create Scenario

**Endpoint:** `POST /api/risk-scenarios`

**Request Body:**
```typescript
{
  group_id: "00000000-0000-0456-0001-000000000001",
  customer_scenario_id: "CUST-123",
  name: "Large Language Model Exfiltration",
  description: "Adversary uses LLM prompt injection to exfiltrate confidential data.",
  scenario_type: "manual",
  scenario_data: {
    likelihood: "Likely",
    impact: "Severe",
    annual_likelihood: 35.0,
    peer_base_rate: 20.0,
    average_loss: 500000,
    average_loss_currency: "USD",
    sec_controls_framework: "NIST",
    risk_priority: "High",
    response_plan: "Mitigate",
    risk_owner: "Head of Security",
    ticket: "RISK-1234",
    methodology_insights: "Scenario assessed using FAIR methodology.",
    sub_category: "Data Exposure",
    review_date: "2025-12-31",
    mitigation_cost: 75000.0,
    scenario_category: ["Security Risk"],
    risk_subcategory: ["Data Breach", "Authentication Failure"],
    ai_assets: ["OpenAI - GPT-4 Turbo"],
    tactics: ["Drive-by Compromise (AML.T0078)"],
    event_types: ["Data Exfiltration"],
    impact_types: ["Financial Loss"],
    data_exposure: { pii: 1000, pci: 0, phi: 0 }
  }
}
```

**Response:** `201 Created`
```typescript
ScenarioResponse
```

**Example:**
```typescript
const createScenario = async (data: CreateScenarioRequest): Promise<ScenarioResponse> => {
  const response = await fetch('http://localhost:8000/api/risk-scenarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create scenario: ${response.statusText}`);
  }

  return response.json();
};
```

**Status Codes:**
- `201`: Created successfully
- `400`: Invalid input data
- `404`: Group not available for user's tenant
- `500`: Internal server error
- `503`: Groups service unavailable

---

### 2. Get Scenario by ID

**Endpoint:** `GET /api/risk-scenarios/{scenario_id}`

**Path Parameters:**
- `scenario_id` (string): The logical scenario ID (not MongoDB _id)

**Response:** `200 OK`
```typescript
ScenarioResponse  // Includes full notes array
```

**Example:**
```typescript
const getScenario = async (scenarioId: string): Promise<ScenarioResponse> => {
  const response = await fetch(
    `http://localhost:8000/api/risk-scenarios/${scenarioId}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Scenario not found');
    }
    throw new Error(`Failed to get scenario: ${response.statusText}`);
  }

  return response.json();
};
```

**Status Codes:**
- `200`: Retrieved successfully
- `404`: Scenario not found
- `403`: Access denied (scenario belongs to different group)
- `500`: Internal server error

**Note:** This endpoint returns the **latest version** of the scenario and includes the full `notes` array with all documents.

---

### 3. List Scenarios

**Endpoint:** `GET /api/risk-scenarios`

**Query Parameters:**
- `skip` (number, optional): Number of scenarios to skip (default: 0, min: 0)
- `limit` (number, optional): Maximum scenarios to return (default: 50, min: 1, max: 100)
- `scenario_type` (string, optional): Filter by "manual" or "crq"

**Response:** `200 OK`
```typescript
ScenarioListResponse
```

**Example:**
```typescript
const listScenarios = async (
  skip: number = 0,
  limit: number = 50,
  scenarioType?: string
): Promise<ScenarioListResponse> => {
  const params = new URLSearchParams({
    skip: skip.toString(),
    limit: limit.toString(),
  });

  if (scenarioType) {
    params.append('scenario_type', scenarioType);
  }

  const response = await fetch(
    `http://localhost:8000/api/risk-scenarios?${params}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to list scenarios: ${response.statusText}`);
  }

  return response.json();
};
```

**Status Codes:**
- `200`: Retrieved successfully
- `500`: Internal server error

**Note:** This endpoint returns only the **latest version** of each scenario. The `notes` array is empty (`[]`) for list responses. Use the single scenario endpoint to get full note details.

---

### 4. Update Scenario

**Endpoint:** `PATCH /api/risk-scenarios/{scenario_id}`

**Path Parameters:**
- `scenario_id` (string): The logical scenario ID

**Request Body:**
```typescript
{
  name?: string;
  description?: string;
  scenario_data?: Partial<ScenarioData>;
}
```

**Response:** `200 OK`
```typescript
ScenarioResponse  // New version with incremented version number
```

**Example:**
```typescript
const updateScenario = async (
  scenarioId: string,
  updates: UpdateScenarioRequest
): Promise<ScenarioResponse> => {
  const response = await fetch(
    `http://localhost:8000/api/risk-scenarios/${scenarioId}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Scenario not found');
    }
    throw new Error(`Failed to update scenario: ${response.statusText}`);
  }

  return response.json();
};
```

**Status Codes:**
- `200`: Updated successfully (new version created)
- `404`: Scenario not found or group not available
- `403`: Access denied
- `500`: Internal server error
- `503`: Groups service unavailable

**Important:** This creates a **new version** of the scenario. The `scenario_id` remains the same, but `version` is incremented and a new document is created in the database.

---

### 5. Delete Scenario (Soft Delete / Archive)

**Endpoint:** `DELETE /api/risk-scenarios/{scenario_id}`

**Path Parameters:**
- `scenario_id` (string): The logical scenario ID

**Response:** `200 OK`
```typescript
{
  success: true,
  message: "Risk register scenario deleted successfully",
  data: {
    scenario_id: string
  }
}
```

**Example:**
```typescript
const deleteScenario = async (scenarioId: string): Promise<APIResponse> => {
  const response = await fetch(
    `http://localhost:8000/api/risk-scenarios/${scenarioId}`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Scenario not found');
    }
    throw new Error(`Failed to delete scenario: ${response.statusText}`);
  }

  return response.json();
};
```

**Status Codes:**
- `200`: Deleted successfully (all versions archived)
- `404`: Scenario not found
- `403`: Access denied
- `500`: Internal server error

**Important:** This is a **soft delete**. All versions of the scenario are marked as `is_archived: true`. The scenario will not appear in list or get requests (they filter out archived scenarios).

---

### 6. Add Note to Scenario

**Endpoint:** `POST /api/risk-scenarios/{scenario_id}/notes`

**Path Parameters:**
- `scenario_id` (string): The logical scenario ID

**Request Body (Form Data or JSON):**
```typescript
// Option 1: Simple note (JSON)
{
  content: string;
  filename?: string;      // Optional: if adding document
  file_path?: string;     // Optional: if adding document
  content_type?: string;  // Optional: if adding document
}

// Option 2: Note with document metadata (JSON)
{
  content: "Initial risk assessment completed",
  filename: "assessment.pdf",
  file_path: "gs://bucket/risk_register_scenarios/{scenario_id}/assessment.pdf",
  content_type: "application/pdf"
}
```

**Response:** `201 Created`
```typescript
{
  success: true,
  message: "Note added to scenario successfully",
  data: {
    scenario_id: string
  }
}
```

**Example:**
```typescript
const addNote = async (
  scenarioId: string,
  content: string,
  documentMetadata?: {
    filename: string;
    file_path: string;
    content_type: string;
  }
): Promise<APIResponse> => {
  const body: any = { content };

  if (documentMetadata) {
    body.filename = documentMetadata.filename;
    body.file_path = documentMetadata.file_path;
    body.content_type = documentMetadata.content_type;
  }

  const response = await fetch(
    `http://localhost:8000/api/risk-scenarios/${scenarioId}/notes`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Scenario not found');
    }
    throw new Error(`Failed to add note: ${response.statusText}`);
  }

  return response.json();
};
```

**Status Codes:**
- `201`: Note added successfully
- `404`: Scenario not found
- `403`: Access denied
- `500`: Internal server error

---

### 7. Add Note with File Attachment

**Endpoint:** `POST /api/risk-scenarios/{scenario_id}/notes-with-attachment`

**Path Parameters:**
- `scenario_id` (string): The logical scenario ID

**Request Body (Multipart Form Data):**
```typescript
FormData {
  content: string;        // Note content
  uploaded_file: File;   // File to attach
}
```

**Response:** `201 Created`
```typescript
{
  success: true,
  message: "Note with attachment added to scenario successfully",
  data: {
    scenario_id: string,
    document: {
      filename: string,
      file_path: string,
      content_type: string
    }
  }
}
```

**Example:**
```typescript
const addNoteWithAttachment = async (
  scenarioId: string,
  content: string,
  file: File
): Promise<APIResponse> => {
  const formData = new FormData();
  formData.append('content', content);
  formData.append('uploaded_file', file);

  const response = await fetch(
    `http://localhost:8000/api/risk-scenarios/${scenarioId}/notes-with-attachment`,
    {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Scenario not found');
    }
    if (response.status === 422) {
      throw new Error('File validation failed');
    }
    throw new Error(`Failed to add note with attachment: ${response.statusText}`);
  }

  return response.json();
};
```

**Status Codes:**
- `201`: Note with attachment added successfully
- `404`: Scenario not found
- `422`: File validation failed (size, type, etc.)
- `403`: Access denied
- `500`: Internal server error

**File Restrictions:**
- Max size: 5 MB (5242880 bytes)
- Allowed types: PDF, images (PNG, JPEG, GIF, BMP, TIFF, WebP), text files, Office documents (Word, Excel, PowerPoint), JSON, CSV

---

### 8. Download Scenario Attachment

**Endpoint:** `GET /api/risk-scenarios/{scenario_id}/attachments/download`

**Path Parameters:**
- `scenario_id` (string): The logical scenario ID

**Query Parameters:**
- `file_path` (string, required): Full GCS file path (e.g., `bucket_name/risk_register_scenarios/{scenario_id}/filename.pdf`)

**Response:** `200 OK`
- Content-Type: Based on file type
- Content-Disposition: `attachment; filename="filename.pdf"`
- Body: File binary stream

**Example:**
```typescript
const downloadAttachment = async (
  scenarioId: string,
  filePath: string
): Promise<Blob> => {
  const params = new URLSearchParams({ file_path: filePath });

  const response = await fetch(
    `http://localhost:8000/api/risk-scenarios/${scenarioId}/attachments/download?${params}`,
    {
      method: 'GET',
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('File not found');
    }
    throw new Error(`Failed to download attachment: ${response.statusText}`);
  }

  const blob = await response.blob();

  // Create download link
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filePath.split('/').pop() || 'download';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);

  return blob;
};
```

**Status Codes:**
- `200`: File downloaded successfully
- `400`: Invalid file path format
- `404`: Scenario not found or file not found
- `403`: Access denied
- `500`: Internal server error
- `503`: Google Cloud Storage unavailable

---

### 9. Request Pre-defined Scenario

**Endpoint:** `POST /api/risk-scenarios/request-pre-defined-scenario`

**Request Body:** None (uses current user from mock auth)

**Response:** `200 OK`
```typescript
{
  success: true,
  message: "Request sent successfully",
  data: {
    user_email: string,
    user_id: string,
    tenant_id: string,
    group_id: string
  }
}
```

**Example:**
```typescript
const requestPreDefinedScenario = async (): Promise<APIResponse> => {
  const response = await fetch(
    'http://localhost:8000/api/risk-scenarios/request-pre-defined-scenario',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to request pre-defined scenario: ${response.statusText}`);
  }

  return response.json();
};
```

**Status Codes:**
- `200`: Request sent successfully
- `500`: Internal server error

**Note:** This sends an email to `contact@kovrr.com` with the user's information requesting pre-defined scenarios.

---

## Error Handling

### Standard Error Response Format

All errors follow this structure:

```typescript
{
  detail: string;  // Human-readable error message
}
```

### HTTP Status Codes

- `200 OK`: Successful GET, PATCH, DELETE
- `201 Created`: Successful POST (create)
- `400 Bad Request`: Invalid input data
- `403 Forbidden`: Access denied (scenario belongs to different group)
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: File validation failed
- `500 Internal Server Error`: Server error
- `503 Service Unavailable`: External service unavailable (groups service, GCS)

### Error Handling Example

```typescript
const handleApiError = async (response: Response): Promise<never> => {
  let errorMessage = 'An unexpected error occurred';

  try {
    const errorData = await response.json();
    errorMessage = errorData.detail || errorMessage;
  } catch {
    errorMessage = response.statusText;
  }

  switch (response.status) {
    case 400:
      throw new ValidationError(errorMessage);
    case 403:
      throw new AccessDeniedError(errorMessage);
    case 404:
      throw new NotFoundError(errorMessage);
    case 422:
      throw new ValidationError(errorMessage);
    case 500:
      throw new ServerError(errorMessage);
    case 503:
      throw new ServiceUnavailableError(errorMessage);
    default:
      throw new Error(errorMessage);
  }
};

// Usage
const fetchScenario = async (id: string) => {
  const response = await fetch(`.../scenarios/${id}`);

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
};
```

---

## Best Practices

### 1. Versioning Awareness

- **Always use `scenario_id`** (logical ID) for operations, not MongoDB `_id`
- **Understand versioning**: Updates create new versions. The `version` field increments automatically
- **Latest version only**: List and get endpoints return only the latest version (by `created_at`)

### 2. Group ID Management

- The mock user has a default `group_id`: `"00000000-0000-0456-0001-000000000001"`
- Use this `group_id` when creating scenarios
- Scenarios are automatically filtered by the user's group

### 3. Notes Handling

- **List endpoint**: `notes` array is empty (`[]`) for performance
- **Single scenario endpoint**: `notes` array is fully populated
- **Fetch notes separately**: If you need notes in a list view, fetch each scenario individually (or implement a batch endpoint)

### 4. Archiving (Soft Delete)

- Deleted scenarios are **archived**, not permanently deleted
- Archived scenarios (`is_archived: true`) are automatically excluded from queries
- To restore, you would need a restore endpoint (not currently implemented)

### 5. File Uploads

- Use `FormData` for file uploads
- Don't set `Content-Type` header manually for multipart requests
- Validate file size and type on the frontend before uploading
- Handle upload progress for better UX

### 6. Pagination

- Use `skip` and `limit` for pagination
- Default limit is 50, maximum is 100
- Use `total_count` from list response for pagination UI

### 7. Type Safety

- Use the provided TypeScript types
- Validate API responses match expected types
- Consider using a type-safe API client (e.g., `tRPC`, `openapi-typescript`)

### 8. Caching

- Consider caching scenario lists
- Invalidate cache on create/update/delete
- Use `updated_at` timestamps for cache invalidation

### 9. Error Recovery

- Implement retry logic for transient errors (500, 503)
- Show user-friendly error messages
- Log errors for debugging

### 10. Development Tools

- Use the Swagger UI at http://localhost:8000/docs for testing
- Check browser DevTools Network tab for request/response details
- Use TypeScript strict mode for better type safety

---

## Complete Example: React Hook

```typescript
import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8000/api/risk-register';

export const useScenarios = () => {
  const [scenarios, setScenarios] = useState<ScenarioResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/scenarios?limit=50`);

        if (!response.ok) {
          throw new Error(`Failed to fetch scenarios: ${response.statusText}`);
        }

        const data: ScenarioListResponse = await response.json();
        setScenarios(data.scenarios);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchScenarios();
  }, []);

  const createScenario = async (data: CreateScenarioRequest) => {
    try {
      const response = await fetch(`${API_BASE}/scenarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to create scenario: ${response.statusText}`);
      }

      const newScenario: ScenarioResponse = await response.json();
      setScenarios(prev => [newScenario, ...prev]);
      return newScenario;
    } catch (err) {
      throw err;
    }
  };

  const updateScenario = async (id: string, updates: UpdateScenarioRequest) => {
    try {
      const response = await fetch(`${API_BASE}/scenarios/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update scenario: ${response.statusText}`);
      }

      const updatedScenario: ScenarioResponse = await response.json();
      setScenarios(prev =>
        prev.map(s => s.scenario_id === id ? updatedScenario : s)
      );
      return updatedScenario;
    } catch (err) {
      throw err;
    }
  };

  const deleteScenario = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/scenarios/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete scenario: ${response.statusText}`);
      }

      setScenarios(prev => prev.filter(s => s.scenario_id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    scenarios,
    loading,
    error,
    createScenario,
    updateScenario,
    deleteScenario,
  };
};
```

---

## Summary

- **Base URL**: `http://localhost:8000/api/risk-register`
- **No Authentication**: Mock auth is automatic, no headers needed
- **Versioning**: Updates create new versions automatically
- **Soft Delete**: Scenarios are archived, not permanently deleted
- **Notes**: Full notes only in single scenario endpoint, empty in list
- **File Uploads**: Use `FormData` for attachments
- **TypeScript**: Use provided types for type safety

For questions or issues, refer to the Swagger documentation at http://localhost:8000/docs or contact the backend team.
