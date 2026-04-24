# Full-Access Pass Tokens - Implementation Guide

## Overview

Full-access pass tokens are cryptographically secure tokens that grant unrestricted access to the enterprise portal without requiring OAuth/SSO login. They're ideal for:

- Automated system access
- Service-to-service authentication
- Emergency/backup access
- Testing and development
- API integrations

## How It Works

### Token Structure

- **Format**: `TOOLS_<64-hex-characters>`
- **Storage**: Tokens are hashed (SHA-256) before storage — plaintext is shown only once at creation
- **Expiration**: Optional — tokens can be permanent or time-limited
- **Revocation**: Tokens can be deactivated at any time

### Security Features

1. **Cryptographic Generation**: Uses Node.js `crypto.randomBytes(32)` for secure randomness
2. **Hashed Storage**: Only SHA-256 hashes are stored; plaintext never persisted
3. **One-Time Display**: Plain token shown only at creation; no retrieval later
4. **Admin-Only**: Only users with `ENTERPRISE_ADMIN_EMAIL` can create/manage tokens
5. **Validation**: Tokens are verified against their hash and checked for expiration

## Files Created

### Core Libraries

- **`lib/token-utils.ts`**: Token generation, hashing, and validation utilities
  - `generateToken()` - Create a new random token
  - `hashToken()` - SHA-256 hash for secure storage
  - `verifyToken()` - Verify plaintext against stored hash
  - `createAccessToken()` - Create full token record
  - `validateAccessToken()` - Check validity and expiration

- **`lib/token-store.ts`**: File-based token persistence (easily migrated to database)
  - `loadTokenStore()` - Load from `.data/access-tokens.json`
  - `addToken()` - Create and store new token
  - `findAndVerifyToken()` - Look up and validate token
  - `listTokens()` - List all active tokens
  - `revokeToken()` - Deactivate a token

### Admin API

- **`app/api/admin/tokens/route.ts`**: RESTful endpoint for token management
  - `GET /api/admin/tokens` - List all tokens
  - `GET /api/admin/tokens?email=X` - List tokens for specific email
  - `POST /api/admin/tokens` - Create new token
  - `DELETE /api/admin/tokens` - Revoke token by ID

### CLI Tool

- **`scripts/generate-tokens.ts`**: Command-line utility to generate tokens
  - Pre-configured for the two specified emails
  - Displays tokens once with clear security warnings
  - Shows summary of all tokens in system

## Generated Tokens

Tokens have been created for:

1. **dmack@sdtoolsinc.org** (role: admin)
2. **dmack@sdtoolsinc.com** (role: admin)

Both tokens grant full administrative access to the enterprise portal.

## Using the Tokens

### 1. Direct HTTP Requests

```bash
curl -H "Authorization: Bearer TOOLS_xxxxxxxxxxxxx" \
  https://your-portal.com/api/protected-endpoint
```

### 2. In Code (Node.js)

```typescript
const response = await fetch("/api/portal/data", {
  headers: {
    Authorization: `Bearer TOOLS_xxxxxxxxxxxxx`,
  },
});
```

### 3. In Browser (if needed)

```typescript
const token = localStorage.getItem("access_token");
fetch("/api/data", {
  headers: { Authorization: `Bearer ${token}` },
});
```

## Token Management

### Create New Token (via Admin Dashboard)

```bash
curl -X POST https://your-portal.com/api/admin/tokens \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-admin-token>" \
  -d '{
    "email": "user@example.com",
    "role": "staff",
    "expiresInDays": 90
  }'
```

### List All Tokens

```bash
curl https://your-portal.com/api/admin/tokens \
  -H "Authorization: Bearer <your-admin-token>"
```

### List Tokens for Specific Email

```bash
curl https://your-portal.com/api/admin/tokens?email=dmack@sdtoolsinc.org \
  -H "Authorization: Bearer <your-admin-token>"
```

### Revoke a Token

```bash
curl -X DELETE https://your-portal.com/api/admin/tokens \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-admin-token>" \
  -d '{ "tokenId": "token-id-here" }'
```

## Database Migration (Production)

For production deployments, migrate from file-based storage to a proper database:

1. Create table:

```sql
CREATE TABLE access_tokens (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  token_hash VARCHAR(64) NOT NULL UNIQUE,
  role VARCHAR(50),
  created_at TIMESTAMP,
  expires_at TIMESTAMP,
  active BOOLEAN DEFAULT true
);
```

2. Update `lib/token-store.ts` to use database client instead of file I/O
3. Add index on `email` and `token_hash` for faster lookups

## Security Best Practices

✅ **DO:**

- Store tokens in secure password managers
- Rotate tokens regularly
- Use token expiration dates
- Audit token usage logs
- Revoke unused tokens
- Use HTTPS only

❌ **DON'T:**

- Commit tokens to version control
- Share tokens via email/Slack
- Use same token across multiple systems
- Hardcode tokens in client code
- Log tokens in plain text

## Troubleshooting

### Token Not Working

1. Verify token hasn't been revoked
2. Check expiration date
3. Ensure correct `Authorization` header format: `Bearer TOOLS_xxxxx`
4. Verify user has appropriate role permissions

### Lost Token

- Token cannot be retrieved once created
- Create a new token and revoke the old one
- Update any systems using the old token

### Permission Denied

- Verify you're using an admin token
- Check `ENTERPRISE_ADMIN_EMAIL` environment variable
- Ensure user has `enterprise_admin` role

## Monitoring

Check `.data/access-tokens.json` to see all created tokens and their metadata:

```bash
cat .data/access-tokens.json | jq '.'
```

Each entry shows:

- `id`: Unique identifier
- `email`: Associated email
- `tokenHash`: SHA-256 hash (plaintext never stored)
- `role`: Permission level
- `createdAt`: Creation timestamp
- `expiresAt`: Optional expiration
- `active`: Current status

---

**Created**: April 21, 2026
**Scope**: T.O.O.L.S Inc Enterprise Portal
**Status**: Production-Ready (file-based), Ready for Database Migration
