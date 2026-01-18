/**
 * Google Sheets Integration for Resource Management
 * 
 * Setup Instructions:
 * 1. Create a Google Sheet for your resources
 * 2. Go to Extensions > Apps Script
 * 3. Create a web app with doGet/doPost functions (see GOOGLE_SHEETS_SETUP.md)
 * 4. Deploy as web app with "Anyone" access
 * 5. Add the deployment URL below
 * 
 * Alternative: Use Google Sheets API with OAuth (more secure but requires setup)
 */

export interface SheetResource {
  id?: string
  name: string
  category: string
  phone: string
  address: string
  city: string
  hours: string
  website?: string
  email?: string
  services: string // Comma-separated or JSON array as string
  eligibility?: string
  notes?: string
  addedBy?: string
  dateAdded?: string
}

// Configuration
const GOOGLE_SHEETS_CONFIG = {
  // Replace with your Google Apps Script Web App URL
  WEB_APP_URL: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL || '',
  SHEET_NAME: 'Resources',
  ENABLED: false // Set to true after configuring
}

/**
 * Check if Google Sheets integration is configured
 */
export function isGoogleSheetsEnabled(): boolean {
  return GOOGLE_SHEETS_CONFIG.ENABLED && GOOGLE_SHEETS_CONFIG.WEB_APP_URL !== ''
}

/**
 * Fetch all resources from Google Sheets
 */
export async function fetchResourcesFromSheets(): Promise<SheetResource[]> {
  if (!isGoogleSheetsEnabled()) {
    console.warn('Google Sheets integration not configured')
    return []
  }

  try {
    const response = await fetch(GOOGLE_SHEETS_CONFIG.WEB_APP_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.resources || []
  } catch (error) {
    console.error('Error fetching resources from Google Sheets:', error)
    throw error
  }
}

/**
 * Add a new resource to Google Sheets
 */
export async function addResourceToSheets(resource: SheetResource): Promise<boolean> {
  if (!isGoogleSheetsEnabled()) {
    console.warn('Google Sheets integration not configured')
    return false
  }

  try {
    const response = await fetch(GOOGLE_SHEETS_CONFIG.WEB_APP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'add',
        resource: {
          ...resource,
          dateAdded: new Date().toISOString(),
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error('Error adding resource to Google Sheets:', error)
    throw error
  }
}

/**
 * Update an existing resource in Google Sheets
 */
export async function updateResourceInSheets(id: string, updates: Partial<SheetResource>): Promise<boolean> {
  if (!isGoogleSheetsEnabled()) {
    console.warn('Google Sheets integration not configured')
    return false
  }

  try {
    const response = await fetch(GOOGLE_SHEETS_CONFIG.WEB_APP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'update',
        id,
        updates,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error('Error updating resource in Google Sheets:', error)
    throw error
  }
}

/**
 * Delete a resource from Google Sheets
 */
export async function deleteResourceFromSheets(id: string): Promise<boolean> {
  if (!isGoogleSheetsEnabled()) {
    console.warn('Google Sheets integration not configured')
    return false
  }

  try {
    const response = await fetch(GOOGLE_SHEETS_CONFIG.WEB_APP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'delete',
        id,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error('Error deleting resource from Google Sheets:', error)
    throw error
  }
}

/**
 * Sync local resources with Google Sheets (bi-directional sync)
 */
export async function syncWithGoogleSheets(localResources: SheetResource[]): Promise<{
  success: boolean
  merged: SheetResource[]
  added: number
  updated: number
  conflicts: number
}> {
  if (!isGoogleSheetsEnabled()) {
    return {
      success: false,
      merged: localResources,
      added: 0,
      updated: 0,
      conflicts: 0,
    }
  }

  try {
    // Fetch remote resources
    const remoteResources = await fetchResourcesFromSheets()

    // Simple merge strategy: remote wins for conflicts, add new from both sides
    const mergedMap = new Map<string, SheetResource>()
    let added = 0
    let updated = 0
    let conflicts = 0

    // Add all local resources first
    localResources.forEach((resource) => {
      if (resource.id) {
        mergedMap.set(resource.id, resource)
      }
    })

    // Merge with remote (remote wins on conflicts)
    remoteResources.forEach((remoteResource) => {
      if (remoteResource.id) {
        if (mergedMap.has(remoteResource.id)) {
          // Conflict: check if different
          const local = mergedMap.get(remoteResource.id)!
          if (JSON.stringify(local) !== JSON.stringify(remoteResource)) {
            conflicts++
            mergedMap.set(remoteResource.id, remoteResource) // Remote wins
            updated++
          }
        } else {
          // New resource from remote
          mergedMap.set(remoteResource.id, remoteResource)
          added++
        }
      }
    })

    return {
      success: true,
      merged: Array.from(mergedMap.values()),
      added,
      updated,
      conflicts,
    }
  } catch (error) {
    console.error('Error syncing with Google Sheets:', error)
    throw error
  }
}
