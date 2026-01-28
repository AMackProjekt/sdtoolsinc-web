# MCP Authentication Setup

This guide explains how to authenticate MCP servers securely using Azure Key Vault and runtime environment injection.

## What You'll Get
- Azure Key Vault-backed secrets
- One command to materialize credentials to env
- Optional JSON bundle for clients that read a file

## Prerequisites
- Azure CLI installed
- Logged in: `az login`
- Key Vault created and populated with MCP secrets (see names below)

## Key Vault Secret Names
Create these secrets in Azure Key Vault (names are prefixed `mcp-`):

- GitHub: `mcp-github-token`
- GitLab: `mcp-gitlab-token`
- Auth0: `mcp-auth0-client-id`, `mcp-auth0-client-secret`, `mcp-auth0-domain`
- Google: `mcp-google-oauth-client-id`, `mcp-google-oauth-client-secret`, `mcp-google-service-account-json`
- OpenAI: `mcp-openai-api-key`
- Notion: `mcp-notion-token`
- Snowflake: `mcp-snowflake-account`, `mcp-snowflake-user`, `mcp-snowflake-password`, `mcp-snowflake-role`, `mcp-snowflake-warehouse`, `mcp-snowflake-database`, `mcp-snowflake-schema`
- ntfy: `mcp-ntfy-server-url`, `mcp-ntfy-access-token`

You can add more mappings in `scripts/Setup-MCP-Auth.ps1`.

## Quick Start

```powershell
# Materialize env vars and a credentials JSON from Key Vault
./scripts/Setup-MCP-Auth.ps1 -KeyVaultName toolsinc-kv -ResourceGroup toolsinc-rg -OutputJson servers/mcp-server-credentials.json

# Then run your MCP client in the same shell so env vars are in scope
cd servers
npm install
npm run start   # or your specific MCP server/client command
```

## Using a .env File (Development Only)
`servers/.env.mcp.example` lists common variables. Prefer Key Vault injection above. If needed for local dev:

```powershell
Copy-Item servers/.env.mcp.example servers/.env.mcp
# Fill minimal non-sensitive placeholders; avoid putting real secrets in files.
# Use a tool like dotenv-cli to load, or VS Code run configurations.
```

## Best Practices
- Never commit real tokens; `.env.mcp` stays local
- Use Managed Identity for cloud-hosted services
- Rotate secrets regularly
- Log access and enable Key Vault diagnostics

## Troubleshooting
- "Secret not found": ensure the Key Vault secret exists with the exact name
- Auth failures: verify the MCP server’s expected env var names match `Setup-MCP-Auth.ps1`
- Permission denied: assign your user or app identity a role (Secrets User/Officer) on the vault

## References
- `servers/.env.mcp.example`
- `servers/mcp-server-credentials.example.json`
- `scripts/Setup-MCP-Auth.ps1`
- `docs/KEYVAULT_SETUP.md`
- `docs/SECURITY_CONFIGURATION.md`
