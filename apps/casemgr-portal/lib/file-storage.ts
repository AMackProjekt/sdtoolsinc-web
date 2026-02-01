/**
 * File Storage Management
 * 
 * This module handles file uploads and downloads for the portal.
 * For production, integrate with:
 * - Azure Blob Storage
 * - AWS S3
 * - Firebase Storage
 * - Your backend API
 */

export interface StoredFile {
  id: string
  name: string
  type: string
  size: number
  uploadedBy: string
  uploadedAt: string
  documentType: string
  description?: string
  url?: string
  mimeType: string
}

/**
 * Upload a file to storage
 * @param file - File object from input
 * @param metadata - Additional file metadata
 * @param clientId - Client ID for organizing files
 * @returns Stored file information
 */
export async function uploadFile(
  file: File,
  metadata: {
    type: string
    description?: string
    uploadedBy: string
  },
  clientId?: string
): Promise<StoredFile> {
  // For development: Store in browser localStorage/IndexedDB
  // For production: Replace with actual API call
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = () => {
      try {
        const fileData: StoredFile = {
          id: crypto.randomUUID(),
          name: file.name,
          type: metadata.type,
          size: file.size,
          uploadedBy: metadata.uploadedBy,
          uploadedAt: new Date().toISOString(),
          documentType: metadata.type,
          description: metadata.description,
          mimeType: file.type,
          // In production, this would be the actual storage URL
          url: reader.result as string // Base64 for demo
        }

        // Store in localStorage (demo only - use backend in production)
        const storageKey = clientId ? `files_${clientId}` : 'files_general'
        const existingFiles = JSON.parse(localStorage.getItem(storageKey) || '[]')
        existingFiles.push(fileData)
        localStorage.setItem(storageKey, JSON.stringify(existingFiles))

        resolve(fileData)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Get all files for a client
 * @param clientId - Client ID
 * @returns Array of stored files
 */
export function getClientFiles(clientId: string): StoredFile[] {
  try {
    const storageKey = `files_${clientId}`
    return JSON.parse(localStorage.getItem(storageKey) || '[]')
  } catch {
    return []
  }
}

/**
 * Download a file
 * @param file - Stored file information
 */
export function downloadFile(file: StoredFile) {
  // Create download link
  const link = document.createElement('a')
  link.href = file.url || ''
  link.download = file.name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Delete a file
 * @param fileId - File ID
 * @param clientId - Client ID
 */
export function deleteFile(fileId: string, clientId?: string): boolean {
  try {
    const storageKey = clientId ? `files_${clientId}` : 'files_general'
    const files = JSON.parse(localStorage.getItem(storageKey) || '[]')
    const updatedFiles = files.filter((f: StoredFile) => f.id !== fileId)
    localStorage.setItem(storageKey, JSON.stringify(updatedFiles))
    return true
  } catch {
    return false
  }
}

/**
 * Export data to CSV
 * @param data - Array of objects to export
 * @param filename - Output filename
 */
export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return

  // Get headers
  const headers = Object.keys(data[0])
  
  // Build CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        // Escape values containing commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    )
  ].join('\n')

  // Create download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Export data to JSON
 * @param data - Data to export
 * @param filename - Output filename
 */
export function exportToJSON(data: any, filename: string) {
  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Production Integration Notes:
 * 
 * For Azure Blob Storage:
 * 1. Install: npm install @azure/storage-blob
 * 2. Configure SAS tokens or managed identity
 * 3. Replace uploadFile with blob upload
 * 
 * For AWS S3:
 * 1. Install: npm install @aws-sdk/client-s3
 * 2. Configure IAM credentials
 * 3. Use presigned URLs for secure uploads
 * 
 * For Firebase Storage:
 * 1. Install: npm install firebase
 * 2. Initialize Firebase Storage
 * 3. Use ref() and uploadBytes()
 * 
 * Security Considerations:
 * - Validate file types on server
 * - Scan uploads for malware
 * - Implement file size limits
 * - Use signed URLs for downloads
 * - Encrypt sensitive documents
 * - Implement access control
 * - Log all file operations
 */
