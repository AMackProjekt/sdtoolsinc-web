<#
.SYNOPSIS
  Creates a separate Azure Static Web App portal with authentication and SQL integration.

.DESCRIPTION
  Scaffolds:
    - portal-app/ Next.js application for authenticated portal
    - Azure Entra ID authentication configuration
    - API integration setup for Azure SQL backend
    - Separate deployment workflow for portal.sdtoolsinc.org
    - Environment configuration for Azure SQL connection

.NOTES
  This creates a separate SWA deployment that shares the backend API.
#>

[CmdletBinding()]
param(
  [Parameter(Mandatory=$false)]
  [string]$RootPath = (Get-Location).Path
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Section([string]$Title) {
  Write-Host ""
  Write-Host "============================================================" -ForegroundColor DarkCyan
  Write-Host $Title -ForegroundColor Cyan
  Write-Host "============================================================" -ForegroundColor DarkCyan
}

function Ensure-Dir([string]$Path) {
  if (-not (Test-Path $Path)) {
    New-Item -ItemType Directory -Path $Path | Out-Null
  }
}

function New-TextFile([string]$Path, [string]$Content, [switch]$NoClobber) {
  Ensure-Dir (Split-Path $Path -Parent)
  if ($NoClobber -and (Test-Path $Path)) { return }
  $Content | Out-File -FilePath $Path -Encoding utf8 -Force
}

$PortalRoot = Join-Path $RootPath "portal-app"

Write-Section "Creating Portal App Structure"
Ensure-Dir $PortalRoot
Ensure-Dir (Join-Path $PortalRoot "app")
Ensure-Dir (Join-Path $PortalRoot "components")
Ensure-Dir (Join-Path $PortalRoot "lib")
Ensure-Dir (Join-Path $PortalRoot "public")
Ensure-Dir (Join-Path $PortalRoot ".github\workflows")

# package.json
New-TextFile -Path (Join-Path $PortalRoot "package.json") -Content @"
{
  "name": "toolsinc-portal",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.0",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "framer-motion": "11.0.0"
  },
  "devDependencies": {
    "@types/node": "20.12.7",
    "@types/react": "18.3.1",
    "@types/react-dom": "18.3.0",
    "typescript": "5.4.5",
    "tailwindcss": "3.4.10",
    "postcss": "8.4.38",
    "autoprefixer": "10.4.19",
    "eslint": "8.57.0",
    "eslint-config-next": "14.2.0"
  }
}
"@

# next.config.js
New-TextFile -Path (Join-Path $PortalRoot "next.config.js") -Content @"
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;
"@

# tsconfig.json
New-TextFile -Path (Join-Path $PortalRoot "tsconfig.json") -Content @"
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./*"]
    },
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
"@

# tailwind.config.ts
New-TextFile -Path (Join-Path $PortalRoot "tailwind.config.ts") -Content @"
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#06070b',
        panel: '#0c0f17',
        glass: 'rgba(255,255,255,.06)',
        border: 'rgba(255,255,255,.12)',
        text: 'rgba(248,250,252,.96)',
        muted: 'rgba(148,163,184,.92)',
        brand: '#38bdf8',
        brand2: '#2dd4bf',
        accent: '#a78bfa',
      },
    },
  },
  plugins: [],
}
export default config
"@

# postcss.config.js
New-TextFile -Path (Join-Path $PortalRoot "postcss.config.js") -Content @"
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
"@

# .eslintrc.json
New-TextFile -Path (Join-Path $PortalRoot ".eslintrc.json") -Content @"
{
  "extends": "next/core-web-vitals"
}
"@

# app/globals.css
New-TextFile -Path (Join-Path $PortalRoot "app\globals.css") -Content @"
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
}

body {
  background: #06070b;
  color: rgba(248,250,252,.96);
}

.glass {
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.12);
  backdrop-filter: blur(14px);
}
"@

# app/layout.tsx
New-TextFile -Path (Join-Path $PortalRoot "app\layout.tsx") -Content @"
import './globals.css'

export const metadata = {
  title: 'T.O.O.L.S Inc Portal',
  description: 'Client Portal for T.O.O.L.S Inc'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
"@

# app/page.tsx
New-TextFile -Path (Join-Path $PortalRoot "app\page.tsx") -Content @"
'use client'

import { useEffect, useState } from 'react'

export default function PortalHome() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication via Azure SWA
    fetch('/.auth/me')
      .then(res => res.json())
      .then(data => {
        setUser(data.clientPrincipal)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass p-8 rounded-xl max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4">T.O.O.L.S Inc Portal</h1>
          <p className="text-muted mb-6">Please sign in to access the portal</p>
          <a
            href="/.auth/login/aad"
            className="inline-block px-6 py-3 bg-brand text-bg font-semibold rounded-lg hover:bg-brand2 transition"
          >
            Sign In with Microsoft
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Welcome, {user.userDetails}</h1>
          <a
            href="/.auth/logout"
            className="px-4 py-2 glass rounded-lg hover:border-brand transition"
          >
            Sign Out
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-2">My Progress</h2>
            <p className="text-muted">Track your journey and milestones</p>
          </div>
          <div className="glass p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-2">Resources</h2>
            <p className="text-muted">Access tools and materials</p>
          </div>
          <div className="glass p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-2">Support</h2>
            <p className="text-muted">Get help and connect with mentors</p>
          </div>
        </div>
      </div>
    </div>
  )
}
"@

# lib/api.ts - API client for backend
New-TextFile -Path (Join-Path $PortalRoot "lib\api.ts") -Content @"
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api'

export async function fetchAPI(endpoint: string, options?: RequestInit) {
  const url = API_BASE + endpoint
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error?.message || 'API request failed')
  }

  return res.json()
}

export const api = {
  // Users
  getCurrentUser: () => fetchAPI('/v1/users/me'),
  updateProfile: (data: any) => fetchAPI('/v1/users/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  // Progress tracking
  getProgress: () => fetchAPI('/v1/progress'),
  updateProgress: (data: any) => fetchAPI('/v1/progress', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
}
"@

# .env.local.example
New-TextFile -Path (Join-Path $PortalRoot ".env.local.example") -Content @"
# API Backend URL
NEXT_PUBLIC_API_BASE=https://blue-desert-08d808f10.azurestaticapps.net/api

# Azure SQL (Backend will use these)
AZURE_SQL_SERVER=your-server.database.windows.net
AZURE_SQL_DATABASE=toolsinc-db
AZURE_SQL_USER=your-username
AZURE_SQL_PASSWORD=your-password
"@

# staticwebapp.config.json - Azure SWA configuration
New-TextFile -Path (Join-Path $PortalRoot "staticwebapp.config.json") -Content @"
{
  "navigationFallback": {
    "rewrite": "/index.html"
  },
  "routes": [
    {
      "route": "/.auth/login/aad",
      "allowedRoles": ["anonymous"]
    },
    {
      "route": "/*",
      "allowedRoles": ["authenticated"]
    }
  ],
  "auth": {
    "identityProviders": {
      "azureActiveDirectory": {
        "registration": {
          "openIdIssuer": "https://login.microsoftonline.com/{tenant-id}/v2.0",
          "clientIdSettingName": "AAD_CLIENT_ID",
          "clientSecretSettingName": "AAD_CLIENT_SECRET"
        }
      }
    }
  },
  "responseOverrides": {
    "401": {
      "redirect": "/.auth/login/aad",
      "statusCode": 302
    }
  }
}
"@

# GitHub workflow for portal
New-TextFile -Path (Join-Path $PortalRoot ".github\workflows\azure-portal-deploy.yml") -Content @"
name: Azure Portal SWA Deploy

on:
  push:
    branches:
      - main
    paths:
      - 'portal-app/**'
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Portal
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        working-directory: ./portal-app
        run: npm install
      
      - name: Build portal
        working-directory: ./portal-app
        run: npm run build
      
      - name: Deploy to Azure SWA
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: `${{ secrets.AZURE_PORTAL_SWA_TOKEN }}
          repo_token: `${{ secrets.GITHUB_TOKEN }}
          action: 'upload'
          app_location: 'portal-app/out'
          skip_app_build: true
          output_location: ''

  close_pull_request:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request
    steps:
      - name: Close Pull Request
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: `${{ secrets.AZURE_PORTAL_SWA_TOKEN }}
          action: 'close'
"@

# README for portal
New-TextFile -Path (Join-Path $PortalRoot "README.md") -Content @"
# T.O.O.L.S Inc Portal Application

Separate Azure Static Web App for authenticated client portal.

## Architecture
- **Frontend**: Next.js 14 (Static Export)
- **Authentication**: Azure Entra ID (via SWA)
- **Backend API**: Shared with main site (Azure Functions)
- **Database**: Azure SQL Database
- **Deployment**: Azure Static Web Apps (portal subdomain)

## Local Development

1. Install dependencies:
``````bash
cd portal-app
npm install
``````

2. Run dev server:
``````bash
npm run dev
``````

3. Visit: http://localhost:3001

## Azure Setup Required

### 1. Create Azure Static Web App for Portal
``````bash
az staticwebapp create \
  --name toolsinc-portal \
  --resource-group toolsinc-rg \
  --location eastus \
  --sku Standard
``````

### 2. Configure Custom Domain (Optional)
Set up `portal.sdtoolsinc.org` to point to the SWA.

### 3. Configure Azure Entra ID App Registration
1. Go to Azure Portal > Entra ID > App Registrations
2. Create new registration for portal
3. Add redirect URI: `https://portal.sdtoolsinc.org/.auth/login/aad/callback`
4. Copy Client ID and create Client Secret
5. Add to SWA Configuration:
   - `AAD_CLIENT_ID`: Your application ID
   - `AAD_CLIENT_SECRET`: Your client secret

### 4. Configure Azure SQL Connection
Update backend API environment variables:
``````bash
az staticwebapp appsettings set \
  --name toolsinc-swa \
  --setting-names \
    AZURE_SQL_SERVER=your-server.database.windows.net \
    AZURE_SQL_DATABASE=toolsinc-db \
    AZURE_SQL_USER=your-username \
    AZURE_SQL_PASSWORD=your-password
``````

### 5. Add GitHub Secret for Deployment
Add `AZURE_PORTAL_SWA_TOKEN` to repository secrets with the deployment token from:
``````bash
az staticwebapp secrets list --name toolsinc-portal --resource-group toolsinc-rg
``````

## Features
- ✅ Azure Entra ID authentication
- ✅ User profile management
- ✅ Progress tracking
- ✅ Resource access
- ✅ Integration with Azure SQL backend
- ✅ Secure API communication

## API Integration
Portal connects to backend API at:
- Production: `https://blue-desert-08d808f10.azurestaticapps.net/api`
- Endpoints: `/v1/users`, `/v1/progress`, etc.
"@

Write-Section "Done"
Write-Host "Portal application scaffolded in: portal-app/" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. cd portal-app && npm install" -ForegroundColor Cyan
Write-Host "2. Create Azure Static Web App for portal in Azure Portal" -ForegroundColor Cyan
Write-Host "3. Configure Entra ID app registration" -ForegroundColor Cyan
Write-Host "4. Add AZURE_PORTAL_SWA_TOKEN to GitHub secrets" -ForegroundColor Cyan
Write-Host "5. Update backend API to connect to your Azure SQL database" -ForegroundColor Cyan
