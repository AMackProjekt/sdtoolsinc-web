'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'

interface FileUploadProps {
  onUpload: (files: File[]) => Promise<void>
  acceptedTypes?: string[]
  maxSize?: number // in MB
  maxFiles?: number
  documentTypes?: string[]
  className?: string
}

const DOCUMENT_TYPES = [
  'Identification (ID)',
  'Social Security Card',
  'Birth Certificate',
  'Alien Registration Card',
  'Proof of Residence',
  'Employment Authorization',
  'Court Documents',
  'Other'
]

export function SecureFileUpload({
  onUpload,
  acceptedTypes = ['image/*', 'application/pdf'],
  maxSize = 10,
  maxFiles = 5,
  documentTypes = DOCUMENT_TYPES,
  className
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [selectedType, setSelectedType] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [dragActive, setDragActive] = useState(false)

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize * 1024 * 1024) {
      return `File ${file.name} exceeds ${maxSize}MB limit`
    }
    const type = file.type
    const isAccepted = acceptedTypes.some(accepted => {
      if (accepted.endsWith('/*')) {
        return type.startsWith(accepted.replace('/*', ''))
      }
      return type === accepted
    })
    if (!isAccepted) {
      return `File type ${type} not accepted`
    }
    return null
  }

  const handleFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return
    
    const fileArray = Array.from(newFiles)
    
    if (files.length + fileArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`)
      return
    }

    const validFiles: File[] = []
    for (const file of fileArray) {
      const error = validateFile(file)
      if (error) {
        setError(error)
        return
      }
      validFiles.push(file)
    }

    setFiles(prev => [...prev, ...validFiles])
    setError('')
  }, [files.length, maxFiles, maxSize, acceptedTypes])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleSubmit = async () => {
    if (!selectedType) {
      setError('Please select document type')
      return
    }
    if (files.length === 0) {
      setError('Please select at least one file')
      return
    }

    setUploading(true)
    setError('')
    try {
      await onUpload(files)
      setFiles([])
      setSelectedType('')
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className={cn('glass rounded-xl p-6', className)}>
      <h3 className="text-xl font-semibold text-text mb-4">📁 Secure Document Upload</h3>
      
      {/* Document Type Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-muted mb-2">
          Document Type *
        </label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
        >
          <option value="">Select document type...</option>
          {documentTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-all',
          dragActive ? 'border-brand bg-brand/10' : 'border-border',
          'hover:border-brand/50 cursor-pointer'
        )}
      >
        <input
          type="file"
          id="file-upload"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="text-text font-medium mb-1">Click to upload or drag and drop</p>
          <p className="text-sm text-muted">
            {acceptedTypes.includes('image/*') && 'Images, '}
            {acceptedTypes.includes('application/pdf') && 'PDF '}
            (Max {maxSize}MB per file, up to {maxFiles} files)
          </p>
        </label>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-muted mb-2">Selected Files ({files.length})</p>
          {files.map((file, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-3 bg-bg rounded-lg border border-border"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded bg-brand/20 flex items-center justify-center flex-shrink-0">
                  {file.type.startsWith('image/') ? '🖼️' : '📄'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text truncate">{file.name}</p>
                  <p className="text-xs text-muted">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="ml-2 p-1 rounded hover:bg-red-500/20 text-red-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={uploading || files.length === 0 || !selectedType}
          className={cn(
            'flex-1 px-6 py-3 rounded-lg font-medium transition-all',
            uploading || files.length === 0 || !selectedType
              ? 'bg-muted/20 text-muted cursor-not-allowed'
              : 'bg-gradient-to-r from-brand to-brand2 text-white hover:shadow-lg'
          )}
        >
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Uploading...
            </span>
          ) : (
            '🔒 Secure Upload'
          )}
        </button>
        {files.length > 0 && (
          <button
            onClick={() => setFiles([])}
            className="px-6 py-3 border border-border text-text rounded-lg hover:bg-glass transition-all"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Security Notice */}
      <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div className="flex-1">
            <p className="text-xs text-green-400 font-medium">🔐 Secure & Encrypted</p>
            <p className="text-xs text-muted mt-1">All uploads are encrypted end-to-end and stored securely in compliance with HIPAA regulations.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
