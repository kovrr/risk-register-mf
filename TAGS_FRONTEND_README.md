# Tags Feature - Frontend Implementation Guide

This document provides comprehensive instructions for implementing the Tags feature in the frontend application, including API routes, data structures, and UI implementation details.

## Table of Contents

1. [Overview](#overview)
2. [Tag API Routes](#tag-api-routes)
3. [Scenario Changes](#scenario-changes)
4. [UI Implementation Requirements](#ui-implementation-requirements)
5. [Helper Functions](#helper-functions)

---

## Overview

Tags are a new feature that allows users to categorize and filter scenarios. Each tag has:
- **name**: Tag display name
- **description**: Optional tag description
- **color**: Background color for visual identification
- **tag_type**: Optional category/type (e.g., 'priority', 'status', 'category')
- **group_id**: The group the tag belongs to
- **usage_count**: Automatic counter of how many scenarios use this tag

Tags are automatically associated with scenarios via `tag_ids` array. When a scenario is created or updated with tag IDs, the tag usage counts are automatically incremented/decremented.

---

## Tag API Routes

### Base URL
All tag routes are under: `/api/v1/tags`

### Authentication
All routes require authentication headers (same as scenario routes):
- `Authorization`: Bearer token from Strapi
- `X-User-Id`: User ID header

---

### 1. GET Tags List

**Endpoint**: `GET /api/v1/tags`

**Query Parameters**:
- `group_ids` (required, array): Array of group IDs to filter tags
  - Example: `?group_ids=group1&group_ids=group2`
  - Or in array format: `?group_ids[]=group1&group_ids[]=group2`
- `name` (optional, string): Filter tags by name (case-insensitive partial match)
  - Example: `?name=high`
- `skip` (optional, int, default: 0): Number of tags to skip for pagination
- `limit` (optional, int, default: 100, max: 200): Maximum number of tags to return

**Response** (200 OK):
```json
{
  "tags": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "High Priority",
      "group_id": "550e8400-e29b-41d4-a716-446655440001",
      "description": "Tag for high priority items",
      "color": "#FF6B6B",
      "tag_type": "priority",
      "creator": {
        "documentId": "owsfztruqy2d0xc1rwoxkauo",
        "email": "user@example.com",
        "firstname": "John",
        "id": 1,
        "lastname": "Doe"
      },
      "usage_count": 5,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total_count": 1,
  "group_ids": ["550e8400-e29b-41d4-a716-446655440001"]
}
```

**Notes**:
- Tags are ordered by `usage_count` (descending), then by `updated_at` (descending)
- The `group_ids` in the response shows which groups were actually queried (filtered by user permissions)

---

### 2. Create Tag

**Endpoint**: `POST /api/v1/tags`

**Request Body**:
```json
{
  "name": "High Priority",
  "group_id": "550e8400-e29b-41d4-a716-446655440001",
  "description": "Tag for high priority items",
  "color": "#FF6B6B",
  "tag_type": "priority"
}
```

**Required Fields**:
- `name`: string (1-100 characters)
- `group_id`: string
- `color`: string (hex code or color name, max 50 characters)

**Optional Fields**:
- `description`: string (max 500 characters)
- `tag_type`: string (max 50 characters) - e.g., "priority", "status", "category"

**Response** (201 Created):
Same structure as single tag in GET response (see above).

**Error Responses**:
- `400`: Invalid input data or duplicate tag name in the same group
- `403`: User doesn't have permission to create tags in this group
- `404`: Group not available for the user

**Notes**:
- Tag names must be unique within a group (case-insensitive)
- User info is automatically extracted from request headers
- The `usage_count` starts at 0

---

### 3. Update Tag

**Endpoint**: `PATCH /api/v1/tags/{tag_id}`

**Request Body** (all fields optional):
```json
{
  "name": "Critical Priority",
  "description": "Updated description",
  "color": "#FF0000",
  "tag_type": "priority"
}
```

**Response** (200 OK):
Same structure as single tag in GET response.

**Error Responses**:
- `400`: Invalid input data or duplicate tag name
- `404`: Tag not found
- `403`: User doesn't have permission to update this tag

**Notes**:
- Only provided fields will be updated
- Cannot update `group_id` - create a new tag in the desired group instead
- Tag name must remain unique within its group

---

### 4. Delete Tag

**Endpoint**: `DELETE /api/v1/tags/{tag_id}`

**Response** (204 No Content):
No response body.

**Error Responses**:
- `404`: Tag not found
- `403`: User doesn't have permission to delete this tag

**Notes**:
- Currently, delete functionality is available but may not be needed immediately

---

## Scenario Changes

### Updated Scenario Create/Update

Scenarios now support an optional `tag_ids` field, and tag data is automatically populated in responses.

---

### 1. Create Scenario (Updated)

**Endpoint**: `POST /api/v1/risk-scenarios`

**Request Body** (add `tag_ids` field):
```json
{
  "group_id": "550e8400-e29b-41d4-a716-446655440001",
  "customer_scenario_id": "CUST-123",
  "name": "Test Scenario",
  "description": "Test Description",
  "scenario_type": "manual",
  "tag_ids": ["tag_id_1", "tag_id_2"],
  "scenario_data": {
    "likelihood": "Likely",
    "impact": "High"
  }
}
```

**New Field**:
- `tag_ids` (optional, array of strings): Array of tag IDs to associate with this scenario

**Response** (includes tags):
```json
{
  "id": "scenario_id",
  "scenario_id": "scenario_id",
  "name": "Test Scenario",
  "tag_ids": ["tag_id_1", "tag_id_2"],
  "tags": [
    {
      "id": "tag_id_1",
      "name": "High Priority",
      "color": "#FF6B6B",
      "description": "Tag description",
      "tag_type": "priority",
      "usage_count": 5,
      // ... other tag fields
    }
  ],
  // ... other scenario fields
}
```

**Automatic Behavior**:
- When a scenario is created with `tag_ids`, the usage count for each tag is automatically incremented
- Tags are automatically fetched and included in the response

---

### 2. Update Scenario (Updated)

**Endpoint**: `PATCH /api/v1/risk-scenarios/{scenario_id}`

**Request Body** (add `tag_ids` field):
```json
{
  "name": "Updated Scenario Name",
  "tag_ids": ["tag_id_1", "tag_id_3"]
}
```

**New Field**:
- `tag_ids` (optional, array of strings): Updated array of tag IDs

**Automatic Behavior**:
- When `tag_ids` is updated:
  - Tags that were **added** → their usage counts are incremented
  - Tags that were **removed** → their usage counts are decremented
- Tags are automatically fetched and included in the response

**Response** (includes tags):
Same structure as create response, with updated tag data.

---

### 3. Get Scenarios List (Updated)

**Endpoint**: `GET /api/v1/risk-scenarios`

**New Query Parameter**:
- `tag_ids` (optional, array of strings): Filter scenarios by tag IDs
  - Example: `?tag_ids=tag1&tag_ids=tag2`
  - Returns scenarios that have **any** of the specified tags

**Response**:
Each scenario in the list includes:
- `tag_ids`: Array of tag ID strings
- `tags`: Array of populated tag objects with full tag data

```json
{
  "scenarios": [
    {
      "id": "scenario_id",
      "tag_ids": ["tag_id_1", "tag_id_2"],
      "tags": [
        {
          "id": "tag_id_1",
          "name": "High Priority",
          "color": "#FF6B6B",
          // ... full tag data
        }
      ],
      // ... other scenario fields
    }
  ],
  "total_count": 10,
  "group_ids": ["group_id_1"]
}
```

---

### 4. Get Scenario by ID (Updated)

**Endpoint**: `GET /api/v1/risk-scenarios/{scenario_id}`

**Response**:
Same structure as create/update, includes:
- `tag_ids`: Array of tag ID strings
- `tags`: Array of populated tag objects

---

## UI Implementation Requirements

### 1. Scenarios List Page - Tag Filter Dropdown

**Location**: Scenarios table/list page

**Requirements**:
- Add a dropdown/select component **above the scenarios table**
- The dropdown should display all available tags for the current user's groups
- Users can select one or multiple tags to filter scenarios
- When tags are selected, add `tag_ids` query parameter to the scenarios list API call

**Implementation Steps**:

1. **Fetch Available Tags**:
   ```typescript
   // Get tags for the current user's groups
   GET /api/v1/tags?group_ids=<user_group_ids>
   ```

2. **Render Dropdown**:
   - Display tags with their colors as visual indicators
   - Show tag name and optionally description
   - Support multi-select functionality
   - Display selected tags as chips/badges

3. **Apply Filter**:
   - When tags are selected/deselected, update the scenarios list API call
   - Add `tag_ids` parameter: `GET /api/v1/risk-scenarios?tag_ids=tag1&tag_ids=tag2`
   - Refresh the scenarios list

**Example UI**:
```
┌─────────────────────────────────────┐
│ Filter by Tags: [Dropdown ▼]        │
│ Selected: [High Priority] [Urgent]  │
├─────────────────────────────────────┤
│ Scenarios Table                     │
│ ...                                 │
└─────────────────────────────────────┘
```

---

### 2. Scenario Edit Page - Tag Management

**Location**: Scenario detail/edit page (`/scenarios/:id`)

**Requirements**:
- Display tags similar to other array fields (like notes, custom fields, etc.)
- Show tags with color backgrounds, name, and description
- Allow adding new tags via a modal
- Allow removing tags from the scenario

**Tag Display Component**:

Each tag should be rendered as a card/pill component:
- **Background**: Use the tag's `color` field as background color
- **Text Color**: Black (since colors are bright/white as per requirements)
- **Content**:
  - Tag name (prominent, larger/bold text at the top)
  - Description below the name (if available, smaller text)
- **Layout**: Tags displayed in a grid or flex layout (responsive)
- **Styling**: Rounded corners, padding, visually distinct cards

**Add Tag Button**:
- Display a `+` icon/button at the top-left or top-right of the tags section
- Clear visual indication that it opens a modal to create a new tag
- Can be styled as a button or floating action button

**Tag Item Visual Example**:
```
┌──────────────────────────┐
│ High Priority            │  ← Bold, larger text (black on colored bg)
│ For urgent items         │  ← Smaller description text
└──────────────────────────┘
   ↑
   Background color from tag.color (e.g., #FF6B6B)
```

**Remove Tag**:
- Add an X/close icon (top-right corner of each tag card)
- On click, remove tag from scenario's tag_ids array and update scenario

---

### 3. Create Tag Modal

**Trigger**: Click the `+` icon in the scenario edit page

**Modal Content**:

**Form Fields**:
1. **Name** (required):
   - Input field
   - Validation: 1-100 characters
   - Must be unique within the group

2. **Description** (optional):
   - Textarea
   - Max 500 characters

3. **Tag Type** (optional but recommended):
   - Input/select field
   - Examples: "priority", "status", "category", etc.
   - Max 50 characters
   - Suggested values: priority, status, category, custom
   - **IMPORTANT**:
     - Include this field when creating tags - it helps categorize tags
     - Save the tag_type value when creating tags - it will be stored in the tag object
     - This allows grouping/organizing tags by type later

4. **Color** (automatic):
   - **Do NOT show color picker to user**
   - Color is automatically generated (see Color Generation Function below)
   - The function generates bright/light colors suitable for black text

5. **Group ID**:
   - Automatically set to the scenario's `group_id`
   - Do not show this field to the user

**Modal Flow**:
1. User clicks `+` icon
2. Modal opens with form fields
3. User fills in name, description, tag_type
4. On submit:
   - Generate random color automatically
   - Create tag via `POST /api/v1/tags`
   - Add the new tag ID to the scenario's `tag_ids` array
   - Update scenario via `PATCH /api/v1/risk-scenarios/{id}` with updated `tag_ids`
   - Close modal and refresh tag display

**Request Example**:
```json
POST /api/v1/tags
{
  "name": "Critical",
  "group_id": "scenario_group_id",
  "description": "Critical priority tag",
  "color": "#A8E6CF",  // Auto-generated by frontend function
  "tag_type": "priority"  // IMPORTANT: Include this field when creating tags
}
```

**Important Notes for Tag Creation**:
- **Always include `tag_type`** when creating tags - it's stored in the tag and helps with organization
- The `color` field is **required** but should be auto-generated by the frontend (do not ask user for color)
- After creating a tag, you **must add it to the scenario's tag_ids array** to associate it

After tag creation, add it to scenario:
```json
PATCH /api/v1/risk-scenarios/{scenario_id}
{
  "tag_ids": ["existing_tag_1", "new_tag_id"]
}
```

---

### 4. Remove Tag from Scenario

**Location**: Scenario edit page, on each tag item

**Implementation**:
- Add a remove/delete icon (X) on each tag
- When clicked:
  - Remove the tag ID from the scenario's `tag_ids` array
  - Update scenario: `PATCH /api/v1/risk-scenarios/{id}` with updated `tag_ids`
  - The tag's usage count will automatically decrement

**Note**: This removes the tag from the scenario but does NOT delete the tag itself. The tag can still be used in other scenarios.

---

## Helper Functions

### 1. Generate Random Bright/White Color

Create a function that generates random bright colors suitable for black text overlay.

**Requirements**:
- Colors should be bright/light (not dark/blacky)
- Text color on top will be black, so background must be light
- Return hex color string (e.g., "#A8E6CF")

**Suggested Implementation**:

```typescript
/**
 * Generate a random bright/light color suitable for black text overlay.
 * Colors are in the light/bright spectrum, avoiding dark colors.
 *
 * @returns Hex color string (e.g., "#A8E6CF")
 */
function generateRandomBrightColor(): string {
  // Light color ranges - using HSL for better control
  const hue = Math.floor(Math.random() * 360); // Full color spectrum
  const saturation = Math.floor(Math.random() * 30) + 40; // 40-70% saturation
  const lightness = Math.floor(Math.random() * 20) + 70; // 70-90% lightness (bright/light)

  // Convert HSL to RGB, then to hex
  const h = hue / 360;
  const s = saturation / 100;
  const l = lightness / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h * 6) % 2 - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (h < 1/6) {
    r = c; g = x; b = 0;
  } else if (h < 2/6) {
    r = x; g = c; b = 0;
  } else if (h < 3/6) {
    r = 0; g = c; b = x;
  } else if (h < 4/6) {
    r = 0; g = x; b = c;
  } else if (h < 5/6) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Alternative simpler approach - predefined bright colors
function generateRandomBrightColorSimple(): string {
  const brightColors = [
    '#FFE5E5', // Light Red
    '#FFE5F1', // Light Pink
    '#E5F1FF', // Light Blue
    '#E5FFE5', // Light Green
    '#FFF5E5', // Light Orange
    '#F5E5FF', // Light Purple
    '#FFE5F5', // Light Magenta
    '#E5FFF5', // Light Cyan
    '#FFFFE5', // Light Yellow
    '#F0E5FF', // Light Lavender
    '#FFE5CC', // Light Peach
    '#E5FFCC', // Light Lime
    '#CCFFE5', // Light Mint
    '#E5E5FF', // Light Indigo
    '#FFCCE5', // Light Rose
    '#CCE5FF', // Light Sky Blue
    '#FFCCCC', // Light Coral
    '#CCFFCC', // Light Emerald
    '#CCCCFF', // Light Periwinkle
    '#FFFFCC', // Light Cream
  ];

  return brightColors[Math.floor(Math.random() * brightColors.length)];
}
```

**Recommended**: Use the simple approach with predefined bright colors for consistency, or the HSL approach for more variety.

---

## Data Structures

### Tag Object Structure

```typescript
interface Tag {
  id: string;                    // MongoDB ObjectId as string
  name: string;                  // Tag name (1-100 chars)
  group_id: string;              // Group ID the tag belongs to
  description?: string;          // Optional description (max 500 chars)
  color: string;                 // Hex color code (e.g., "#FF6B6B")
  tag_type?: string;             // Optional type (max 50 chars)
  creator: {
    documentId?: string;
    email: string;
    firstname?: string;
    id: number;
    lastname?: string;
  };
  usage_count: number;           // Auto-incremented count
  created_at: string;            // ISO 8601 datetime
  updated_at: string;            // ISO 8601 datetime
}
```

### Scenario with Tags

```typescript
interface Scenario {
  id: string;
  scenario_id: string;
  name: string;
  // ... other scenario fields
  tag_ids: string[];             // Array of tag IDs
  tags: Tag[];                   // Populated tag objects
  // ... other scenario fields
}
```

---

## Implementation Checklist

### Scenarios List Page
- [ ] Add tag filter dropdown above the table
- [ ] Fetch available tags on page load
- [ ] Implement multi-select for tags
- [ ] Apply `tag_ids` filter to scenarios API call
- [ ] Display tags on each scenario row (optional - for quick visual reference)

### Scenario Edit Page
- [ ] Display tags section (similar to other array fields)
- [ ] Render tags with color backgrounds, name, and description
- [ ] Add `+` icon/button to open create tag modal
- [ ] Implement create tag modal with form
- [ ] Implement random color generation function
- [ ] Add remove tag functionality (X icon on each tag)
- [ ] Handle tag_ids in scenario update payload

### Tag Management
- [ ] Implement create tag API call
- [ ] Handle tag creation flow (create tag → add to scenario)
- [ ] Implement update scenario with new tag_ids
- [ ] Handle tag removal from scenario

### Data Handling
- [ ] Include `tag_ids` in scenario create payload
- [ ] Include `tag_ids` in scenario update payload
- [ ] Handle `tags` array in scenario responses
- [ ] Handle tag filtering in scenarios list query params

---

## Important Notes

1. **Tag Usage Counts**: Automatically managed by backend - no frontend action needed
2. **Tag Colors**: Always auto-generated on creation - don't allow user to pick colors
3. **Tag Uniqueness**: Tag names must be unique within a group (backend validates)
4. **Tag Type**: Optional field - can be used to categorize tags (e.g., "priority", "status")
5. **Group Context**: Tags are scoped to groups - users can only see/create tags in their accessible groups
6. **Tag Deletion**: Currently not needed in frontend - focus on create and associate with scenarios

---

## Example API Calls

### Fetch Tags for Dropdown
```javascript
// Get tags for user's groups
const response = await fetch('/api/v1/tags?group_ids=group1&group_ids=group2', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'X-User-Id': userId
  }
});
const { tags } = await response.json();
```

### Create Tag and Add to Scenario
```javascript
// Step 1: Generate color
const color = generateRandomBrightColor();

// Step 2: Create tag
const tagResponse = await fetch('/api/v1/tags', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Critical',
    group_id: scenario.group_id,
    description: 'Critical priority tag',
    color: color,
    tag_type: 'priority'
  })
});
const newTag = await tagResponse.json();

// Step 3: Add tag to scenario
await fetch(`/api/v1/risk-scenarios/${scenarioId}`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    tag_ids: [...currentTagIds, newTag.id]
  })
});
```

### Filter Scenarios by Tags
```javascript
// Get scenarios filtered by tags
const response = await fetch(
  `/api/v1/risk-scenarios?tag_ids=tag1&tag_ids=tag2&groupid=${groupId}`,
  {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-User-Id': userId
    }
  }
);
const { scenarios } = await response.json();
```

---

## UI/UX Recommendations

1. **Tag Display**: Use pill/chip components with rounded corners
2. **Color Contrast**: Ensure black text is readable on all generated colors
3. **Loading States**: Show loading indicators when fetching tags
4. **Error Handling**: Display user-friendly error messages for tag operations
5. **Validation**: Validate tag name length and uniqueness before submission
6. **Feedback**: Show success/error toasts when tags are added/removed

---

## Questions or Issues?

If you have questions about implementation or encounter issues, please reach out to the backend team with:
- The specific API endpoint you're calling
- Request/response examples
- Error messages (if any)
