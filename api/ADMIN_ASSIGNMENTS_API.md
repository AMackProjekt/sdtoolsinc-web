# Admin Assignments API

## Overview
The Admin Assignments API manages client-to-case-manager assignments with full audit logging and permission checks.

## Base URL
`/api/v1/admin/assignments`

## Authentication
- Requires Azure Static Web Apps authentication
- User must have `admin` or `case_manager` role

## Endpoints

### 1. List All Assignments
**GET** `/api/v1/admin/assignments`

**Query Parameters:**
- `limit` (optional, default: 50, max: 1000) - Number of results per page
- `offset` (optional, default: 0) - Pagination offset
- `caseManagerId` (optional) - Filter by case manager ID
- `clientId` (optional) - Filter by client ID
- `status` (optional) - Filter by status (active, inactive, transferred)

**Response:**
```json
{
  "data": [
    {
      "Id": "uuid",
      "ClientId": "uuid",
      "CaseManagerId": "uuid",
      "AssignedBy": "uuid",
      "AssignedAt": "2024-01-26T00:00:00Z",
      "Status": "active",
      "Notes": "Initial assignment",
      "ClientDisplayName": "John Doe",
      "ClientEmail": "john@example.com",
      "CaseManagerDisplayName": "Jane Smith",
      "CaseManagerEmail": "jane@example.com",
      "AssignedByDisplayName": "Admin User",
      "AssignedByEmail": "admin@example.com"
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 100
  }
}
```

### 2. Create Assignment
**POST** `/api/v1/admin/assignments`

**Request Body:**
```json
{
  "clientId": "uuid",
  "caseManagerId": "uuid",
  "notes": "Optional notes about the assignment"
}
```

**Validations:**
- Client must exist and be active
- Case manager must exist and be active
- Case manager must have `case_manager` or `admin` role
- Client cannot have another active assignment

**Response:** `201 Created`
```json
{
  "Id": "uuid",
  "ClientId": "uuid",
  "CaseManagerId": "uuid",
  "AssignedBy": "uuid",
  "AssignedAt": "2024-01-26T00:00:00Z",
  "Status": "active",
  "Notes": "Initial assignment",
  "ClientDisplayName": "John Doe",
  "ClientEmail": "john@example.com",
  "CaseManagerDisplayName": "Jane Smith",
  "CaseManagerEmail": "jane@example.com",
  "AssignedByDisplayName": "Admin User",
  "AssignedByEmail": "admin@example.com"
}
```

### 3. Update Assignment
**PATCH** `/api/v1/admin/assignments/:id`

**Request Body:**
```json
{
  "status": "inactive",
  "notes": "Updated notes"
}
```

**Valid Status Values:**
- `active`
- `inactive`
- `transferred`

**Response:** `200 OK`
```json
{
  "Id": "uuid",
  "Status": "inactive",
  "Notes": "Updated notes",
  ...
}
```

### 4. Delete Assignment
**DELETE** `/api/v1/admin/assignments/:id`

Sets assignment status to `inactive`.

**Response:** `200 OK`
```json
{
  "message": "Assignment deactivated successfully"
}
```

### 5. Get Assignments by Case Manager
**GET** `/api/v1/admin/assignments/case-manager/:id`

**Query Parameters:**
- `limit` (optional, default: 50, max: 1000)
- `offset` (optional, default: 0)
- `status` (optional, default: active)

**Response:** Same as List All Assignments

### 6. Get Assignment History by Client
**GET** `/api/v1/admin/assignments/client/:id`

Returns all assignments (active and inactive) for a specific client.

**Query Parameters:**
- `limit` (optional, default: 50, max: 1000)
- `offset` (optional, default: 0)

**Response:** Same as List All Assignments

## Error Responses

### 401 Unauthorized
```json
{
  "error": {
    "code": "unauthorized",
    "message": "Authentication required"
  }
}
```

### 403 Forbidden
```json
{
  "error": {
    "code": "forbidden",
    "message": "Admin or case manager permissions required"
  }
}
```

### 404 Not Found
```json
{
  "error": {
    "code": "not_found",
    "message": "Client not found or inactive"
  }
}
```

### 409 Conflict
```json
{
  "error": {
    "code": "conflict",
    "message": "Client already has an active assignment"
  }
}
```

### 422 Validation Error
```json
{
  "error": {
    "code": "validation_error",
    "message": "Case Manager ID is required"
  }
}
```

## Audit Logging

All operations are logged to the `AuditLog` table with:
- User ID and role
- Action type
- Resource (assignments)
- Resource ID (assignment ID)
- Details (request body)
- IP address and User-Agent
- Success/failure status

Additional logging via `logAssignment` function for assignment creation.

## Database Schema

```sql
CREATE TABLE ClientAssignments (
  Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  ClientId UNIQUEIDENTIFIER NOT NULL,
  CaseManagerId UNIQUEIDENTIFIER NOT NULL,
  AssignedBy UNIQUEIDENTIFIER NOT NULL,
  AssignedAt DATETIME2 DEFAULT GETDATE(),
  Status NVARCHAR(20) DEFAULT 'active',
  Notes NVARCHAR(MAX),
  FOREIGN KEY (ClientId) REFERENCES Users(Id),
  FOREIGN KEY (CaseManagerId) REFERENCES Users(Id),
  FOREIGN KEY (AssignedBy) REFERENCES Users(Id)
);
```

## Security Features

1. **Authentication Required** - All endpoints require Azure SWA authentication
2. **Role-Based Access** - Only `admin` and `case_manager` roles can access
3. **Audit Logging** - All operations logged with user, IP, and timestamp
4. **Input Validation** - Request bodies validated before processing
5. **User Verification** - Checks that users exist and are active
6. **Role Verification** - Ensures case managers have appropriate permissions
7. **Duplicate Prevention** - Prevents multiple active assignments per client

## Testing Examples

### List assignments with filters
```bash
curl -X GET "https://your-app.azurestaticapps.net/api/v1/admin/assignments?status=active&limit=10"
```

### Create an assignment
```bash
curl -X POST "https://your-app.azurestaticapps.net/api/v1/admin/assignments" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "123e4567-e89b-12d3-a456-426614174000",
    "caseManagerId": "123e4567-e89b-12d3-a456-426614174001",
    "notes": "Initial assignment for onboarding"
  }'
```

### Update an assignment
```bash
curl -X PATCH "https://your-app.azurestaticapps.net/api/v1/admin/assignments/123e4567-e89b-12d3-a456-426614174002" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "inactive",
    "notes": "Client completed program"
  }'
```

### Get case manager's assignments
```bash
curl -X GET "https://your-app.azurestaticapps.net/api/v1/admin/assignments/case-manager/123e4567-e89b-12d3-a456-426614174001?status=active"
```
