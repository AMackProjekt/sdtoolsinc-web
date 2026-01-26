# Shared Configuration Package

Centralized configuration for all T.O.O.L.S Inc portal applications.

## Overview

The `@toolsinc/shared-config` package provides:

- **API Endpoints**: Centralized API endpoint definitions
- **Portal URLs**: Portal URL configuration based on environment
- **Environment Configuration**: Shared environment variable handling

## Installation

Since this is a local package, you can reference it in your `package.json`:

```json
{
  "dependencies": {
    "@toolsinc/shared-config": "file:../../packages/shared-config"
  }
}
```

Or use it directly in the monorepo if using workspaces.

## Usage

### API Endpoints

```typescript
import { API_ENDPOINTS, apiFetch } from '@toolsinc/shared-config'

// Use predefined endpoints
const user = await apiFetch(API_ENDPOINTS.USERS.ME)

// With dynamic parameters
const client = await apiFetch(API_ENDPOINTS.CLIENTS.GET('client-123'))

// Make authenticated requests
const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
  method: 'POST',
  headers: getApiHeaders(),
  body: JSON.stringify({ email, password })
})
```

### Portal URLs

```typescript
import { PORTAL_URLS, getPortalUrl, redirectToPortal } from '@toolsinc/shared-config'

// Get portal URL
const clientPortalUrl = PORTAL_URLS.client
// In production: https://client.sdtoolsinc.org
// In development: http://localhost:3001

// Get URL by type
const adminUrl = getPortalUrl('admin')

// Redirect to another portal
redirectToPortal('client', '/dashboard')
```

### Environment Configuration

```typescript
import { ENV, validateEnv } from '@toolsinc/shared-config'

// Check environment
if (ENV.IS_DEVELOPMENT) {
  console.log('Running in development mode')
}

// Access feature flags
if (ENV.ENABLE_RBAC) {
  // Role-based access control is enabled
}

// Validate required environment variables
validateEnv() // Throws error if required vars are missing
```

## API Endpoint Categories

### Authentication

- `AUTH.LOGIN` - User login
- `AUTH.LOGOUT` - User logout
- `AUTH.SIGNUP` - User registration
- `AUTH.VERIFY_EMAIL` - Email verification
- `AUTH.REFRESH_TOKEN` - Token refresh
- `AUTH.FORGOT_PASSWORD` - Password reset request
- `AUTH.RESET_PASSWORD` - Password reset confirmation

### Users

- `USERS.ME` - Get current user
- `USERS.LIST` - List all users
- `USERS.GET(id)` - Get user by ID
- `USERS.UPDATE(id)` - Update user
- `USERS.DELETE(id)` - Delete user

### Admin

- `ADMIN.USERS` - User management
- `ADMIN.ASSIGNMENTS` - Assignment management
- `ADMIN.AUDIT` - Audit logs
- `ADMIN.ROLES` - Role management
- `ADMIN.REPORTS` - Report generation

### Clients

- `CLIENTS.LIST` - List clients
- `CLIENTS.GET(id)` - Get client by ID
- `CLIENTS.CREATE` - Create new client
- `CLIENTS.UPDATE(id)` - Update client
- `CLIENTS.DELETE(id)` - Delete client
- `CLIENTS.NOTES(id)` - Client notes
- `CLIENTS.DOCUMENTS(id)` - Client documents

### Case Managers

- `CASE_MANAGERS.LIST` - List case managers
- `CASE_MANAGERS.GET(id)` - Get case manager by ID
- `CASE_MANAGERS.CLIENTS(id)` - Get assigned clients
- `CASE_MANAGERS.PERFORMANCE(id)` - Performance metrics

### Courses

- `COURSES.LIST` - List courses
- `COURSES.GET(id)` - Get course by ID
- `COURSES.ENROLL(id)` - Enroll in course
- `COURSES.PROGRESS(id)` - Get course progress

### Journal

- `JOURNAL.LIST` - List journal entries
- `JOURNAL.GET(id)` - Get journal entry
- `JOURNAL.CREATE` - Create journal entry
- `JOURNAL.UPDATE(id)` - Update journal entry
- `JOURNAL.DELETE(id)` - Delete journal entry

## Environment Variables

The package automatically determines the API base URL and portal URLs based on the environment:

### Development

```env
NEXT_PUBLIC_API_URL=http://localhost:7071
NEXT_PUBLIC_CLIENT_PORTAL_URL=http://localhost:3001
NEXT_PUBLIC_CASEMGR_PORTAL_URL=http://localhost:3002
NEXT_PUBLIC_ADMIN_PORTAL_URL=http://localhost:3003
NEXT_PUBLIC_HUB_URL=http://localhost:3004
```

### Staging

```env
NEXT_PUBLIC_API_URL=https://staging-api.sdtoolsinc.org
NEXT_PUBLIC_CLIENT_PORTAL_URL=https://client-staging.sdtoolsinc.org
# ... etc
```

### Production

```env
NEXT_PUBLIC_API_URL=https://api.sdtoolsinc.org
NEXT_PUBLIC_CLIENT_PORTAL_URL=https://client.sdtoolsinc.org
# ... etc
```

## Helper Functions

### `getApiHeaders(includeAuth?: boolean)`

Returns headers for API requests, optionally including authentication token.

```typescript
const headers = getApiHeaders(true) // Includes auth token
// {
//   'Content-Type': 'application/json',
//   'Authorization': 'Bearer <token>'
// }
```

### `apiFetch<T>(endpoint: string, options?: RequestInit)`

Wrapper around `fetch` with automatic error handling and authentication.

```typescript
try {
  const data = await apiFetch<User>(API_ENDPOINTS.USERS.ME)
  console.log(data.email)
} catch (error) {
  console.error('API error:', error.message)
}
```

### `validateEnv()`

Validates that required environment variables are set. Throws error if any are missing.

```typescript
// In your app initialization
validateEnv()
```

## Building

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Watch mode (for development)
npm run dev
```

The built package will be in the `dist/` directory.

## TypeScript

The package includes TypeScript definitions. Import types as needed:

```typescript
import type { /* types */ } from '@toolsinc/shared-config'
```

## License

MIT
