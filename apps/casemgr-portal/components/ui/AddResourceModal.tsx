'use client'

import { useState } from 'react'
import { Button } from './Button'

interface ResourceFormData {
  name: string
  category: string
  phone: string
  address: string
  city: string
  hours: string
  website: string
  email: string
  services: string
  eligibility: string
  notes: string
}

const RESOURCE_CATEGORIES = [
  'SUD Rehabilitation',
  'Food Pantries',
  'Legal Aid',
  'Shelters/Programs',
  'Storage Facilities',
  'Mailing Services',
  'Medi-Cal Providers',
  'Mental Health',
  'Clothing Resources',
  'Employment Services',
  'Transportation',
  'Education',
  'Child Care',
  'Financial Assistance',
  'Other'
]

export function AddResourceModal({ isOpen, onClose, onSave }: { 
  isOpen: boolean
  onClose: () => void
  onSave: (data: ResourceFormData) => void
}) {
  const [formData, setFormData] = useState<ResourceFormData>({
    name: '',
    category: '',
    phone: '',
    address: '',
    city: '',
    hours: '',
    website: '',
    email: '',
    services: '',
    eligibility: '',
    notes: ''
  })

  const updateField = (field: keyof ResourceFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.category || !formData.phone) {
      alert('Please fill in required fields: Name, Category, and Phone')
      return
    }
    
    onSave(formData)
    onClose()
    
    // Reset form
    setFormData({
      name: '',
      category: '',
      phone: '',
      address: '',
      city: '',
      hours: '',
      website: '',
      email: '',
      services: '',
      eligibility: '',
      notes: ''
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-panel border border-border rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-panel border-b border-border p-6 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-text">Add New Resource</h2>
            <button onClick={onClose} className="text-muted hover:text-text text-2xl">&times;</button>
          </div>
          <p className="text-sm text-muted mt-2">* Required fields</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text">Basic Information</h3>
            
            <div>
              <label htmlFor="resource-name" className="block text-sm font-medium text-muted mb-2">
                Resource Name *
              </label>
              <input
                id="resource-name"
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="e.g., San Diego Job Center"
                required
              />
            </div>

            <div>
              <label htmlFor="resource-category" className="block text-sm font-medium text-muted mb-2">
                Category *
              </label>
              <select
                id="resource-category"
                value={formData.category}
                onChange={(e) => updateField('category', e.target.value)}
                className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand"
                required
              >
                <option value="">Select a category</option>
                {RESOURCE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="resource-phone" className="block text-sm font-medium text-muted mb-2">
                  Phone Number *
                </label>
                <input
                  id="resource-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand"
                  placeholder="(619) 555-0123"
                  required
                />
              </div>

              <div>
                <label htmlFor="resource-email" className="block text-sm font-medium text-muted mb-2">
                  Email
                </label>
                <input
                  id="resource-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand"
                  placeholder="info@example.org"
                />
              </div>
            </div>

            <div>
              <label htmlFor="resource-website" className="block text-sm font-medium text-muted mb-2">
                Website
              </label>
              <input
                id="resource-website"
                type="url"
                value={formData.website}
                onChange={(e) => updateField('website', e.target.value)}
                className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="https://example.org"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text">Location</h3>
            
            <div>
              <label htmlFor="resource-address" className="block text-sm font-medium text-muted mb-2">
                Street Address
              </label>
              <input
                id="resource-address"
                type="text"
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="123 Main St"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="resource-city" className="block text-sm font-medium text-muted mb-2">
                  City
                </label>
                <input
                  id="resource-city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand"
                  placeholder="San Diego, CA 92101"
                />
              </div>

              <div>
                <label htmlFor="resource-hours" className="block text-sm font-medium text-muted mb-2">
                  Hours of Operation
                </label>
                <input
                  id="resource-hours"
                  type="text"
                  value={formData.hours}
                  onChange={(e) => updateField('hours', e.target.value)}
                  className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand"
                  placeholder="Mon-Fri 9am-5pm"
                />
              </div>
            </div>
          </div>

          {/* Services & Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text">Services & Details</h3>
            
            <div>
              <label htmlFor="resource-services" className="block text-sm font-medium text-muted mb-2">
                Services Offered
              </label>
              <textarea
                id="resource-services"
                value={formData.services}
                onChange={(e) => updateField('services', e.target.value)}
                className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand min-h-[80px]"
                placeholder="Enter services separated by commas (e.g., Job Training, Resume Help, Interview Prep)"
              />
              <p className="text-xs text-muted mt-1">Separate multiple services with commas</p>
            </div>

            <div>
              <label htmlFor="resource-eligibility" className="block text-sm font-medium text-muted mb-2">
                Eligibility Requirements
              </label>
              <textarea
                id="resource-eligibility"
                value={formData.eligibility}
                onChange={(e) => updateField('eligibility', e.target.value)}
                className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand min-h-[60px]"
                placeholder="e.g., Open to all, Must be 18+, Income requirements, etc."
              />
            </div>

            <div>
              <label htmlFor="resource-notes" className="block text-sm font-medium text-muted mb-2">
                Additional Notes
              </label>
              <textarea
                id="resource-notes"
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand min-h-[60px]"
                placeholder="Any additional information (parking, accessibility, special programs, etc.)"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-bg hover:bg-glass"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
            >
              Add Resource
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
