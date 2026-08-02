'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { Button } from './Button'

interface FileUploadProps {
  onUpload: (file: File, metadata: { type: string; description?: string }) => Promise<void>
  acceptedTypes?: string
  maxSizeMB?: number
  label?: string
  showPreview?: boolean
}

export function FileUpload({ 
  onUpload, 
  acceptedTypes = '.pdf,.doc,.docx,.jpg,.jpeg,.png',
  maxSizeMB = 10,
  label = 'Upload Document',
  showPreview = false
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState('Administrative')
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const DOCUMENT_TYPES = [
    'Administrative',
    'Employment',
    'Housing',
    'Legal',
    'Medical',
    'Identification',
    'Financial',
    'Education',
    'Other'
  ]

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSizeMB) {
      setError(`File size must be less than ${maxSizeMB}MB`)
      return
    }

    setError('')
    setSelectedFile(file)

    // Generate preview for images
    if (showPreview && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    setError('')

    try {
      await onUpload(selectedFile, {
        type: documentType,
        description: description.trim() || undefined
      })

      // Reset form
      setSelectedFile(null)
      setDescription('')
      setPreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setDescription('')
    setPreview(null)
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      {/* File Input */}
      <div>
        <label className="block text-sm font-medium text-text mb-2">
          {label}
        </label>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes}
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-brand transition-colors bg-bg"
          >
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-muted"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="mt-2 text-sm text-muted">
                <span className="font-medium text-brand">Click to upload</span> or drag and drop
              </div>
              <p className="text-xs text-muted mt-1">
                {acceptedTypes.replace(/\./g, '').toUpperCase()} up to {maxSizeMB}MB
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Selected File Info */}
      {selectedFile && (
        <div className="glass rounded-lg p-4">
          <div className="flex items-start gap-3">
            {preview && (
              <img src={preview} alt="Preview" className="w-16 h-16 object-cover rounded" />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-text truncate">
                {selectedFile.name}
              </div>
              <div className="text-xs text-muted mt-1">
                {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Unknown type'}
              </div>
            </div>
          </div>

          {/* Document Type */}
          <div className="mt-4">
            <label className="block text-xs font-medium text-muted mb-2">
              Document Type
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-brand"
            >
              {DOCUMENT_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="mt-3">
            <label className="block text-xs font-medium text-muted mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add notes about this document..."
              className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text placeholder-muted focus:outline-none focus:border-brand resize-none"
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={uploading}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-muted">
        <p>Supported formats: {acceptedTypes.replace(/\./g, '').toUpperCase()}</p>
        <p className="mt-1">Maximum file size: {maxSizeMB}MB</p>
      </div>
    </div>
  )
}
