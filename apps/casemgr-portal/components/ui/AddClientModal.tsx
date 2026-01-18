'use client'

import { useState } from 'react'
import { Button } from './Button'

interface ClientFormData {
  // Personal Info
  firstName: string
  lastName: string
  middleName: string
  dateOfBirth: string
  ssn: string
  
  // Contact Info
  email: string
  phone: string
  alternatePhone: string
  address: string
  city: string
  state: string
  zip: string
  
  // Demographics
  gender: string
  race: string
  ethnicity: string
  language: string
  veteran: string
  disabled: string
  
  // Case Info
  referralSource: string
  caseType: string
  priority: string
  notes: string
}

export function AddClientModal({ isOpen, onClose, onSave }: { 
  isOpen: boolean
  onClose: () => void
  onSave: (data: ClientFormData) => void
}) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<ClientFormData>({
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: '',
    ssn: '',
    email: '',
    phone: '',
    alternatePhone: '',
    address: '',
    city: '',
    state: 'CA',
    zip: '',
    gender: '',
    race: '',
    ethnicity: '',
    language: 'English',
    veteran: 'No',
    disabled: 'No',
    referralSource: '',
    caseType: '',
    priority: 'Medium',
    notes: ''
  })

  const updateField = (field: keyof ClientFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onSave(formData)
    onClose()
    setStep(1)
    setFormData({
      firstName: '', lastName: '', middleName: '', dateOfBirth: '', ssn: '',
      email: '', phone: '', alternatePhone: '', address: '', city: '', state: 'CA', zip: '',
      gender: '', race: '', ethnicity: '', language: 'English', veteran: 'No', disabled: 'No',
      referralSource: '', caseType: '', priority: 'Medium', notes: ''
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-panel border border-border rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-panel border-b border-border p-6 z-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-text">Add New Client</h2>
            <button onClick={onClose} className="text-muted hover:text-text text-2xl">&times;</button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex-1">
                <div className={`h-1 rounded-full ${s <= step ? 'bg-brand' : 'bg-border'}`} />
                <div className="text-xs text-muted mt-1">
                  {s === 1 && 'Personal'}
                  {s === 2 && 'Contact'}
                  {s === 3 && 'Demographics'}
                  {s === 4 && 'Case Info'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text mb-4">Personal Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-muted mb-2">First Name *</label>
                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-muted mb-2">Last Name *</label>
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="middleName" className="block text-sm font-medium text-muted mb-2">Middle Name</label>
                <input
                  id="middleName"
                  type="text"
                  value={formData.middleName}
                  onChange={(e) => updateField('middleName', e.target.value)}
                  className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-muted mb-2">Date of Birth *</label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateField('dateOfBirth', e.target.value)}
                    className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="ssn" className="block text-sm font-medium text-muted mb-2">SSN (Last 4)</label>
                  <input
                    id="ssn"
                    type="text"
                    maxLength={4}
                    value={formData.ssn}
                    onChange={(e) => updateField('ssn', e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                    placeholder="XXXX"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact Information */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text mb-4">Contact Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-muted mb-2">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-muted mb-2">Phone *</label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="alternatePhone" className="block text-sm font-medium text-muted mb-2">Alternate Phone</label>
                <input
                  id="alternatePhone"
                  type="tel"
                  value={formData.alternatePhone}
                  onChange={(e) => updateField('alternatePhone', e.target.value)}
                  className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-muted mb-2">Street Address</label>
                <input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-muted mb-2">City</label>
                  <input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-muted mb-2">State</label>
                  <select
                    id="state"
                    value={formData.state}
                    onChange={(e) => updateField('state', e.target.value)}
                    className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                  >
                    <option value="CA">CA</option>
                    <option value="AZ">AZ</option>
                    <option value="NV">NV</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="zip" className="block text-sm font-medium text-muted mb-2">ZIP Code</label>
                  <input
                    id="zip"
                    type="text"
                    maxLength={5}
                    value={formData.zip}
                    onChange={(e) => updateField('zip', e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Demographics */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text mb-4">Demographics</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-muted mb-2">Gender</label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => updateField('gender', e.target.value)}
                    className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                  >
                    <option value="">Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="race" className="block text-sm font-medium text-muted mb-2">Race</label>
                  <select
                    id="race"
                    value={formData.race}
                    onChange={(e) => updateField('race', e.target.value)}
                    className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                  >
                    <option value="">Select...</option>
                    <option value="American Indian/Alaska Native">American Indian/Alaska Native</option>
                    <option value="Asian">Asian</option>
                    <option value="Black/African American">Black/African American</option>
                    <option value="Native Hawaiian/Pacific Islander">Native Hawaiian/Pacific Islander</option>
                    <option value="White">White</option>
                    <option value="Two or more races">Two or more races</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ethnicity" className="block text-sm font-medium text-muted mb-2">Ethnicity</label>
                  <select
                    id="ethnicity"
                    value={formData.ethnicity}
                    onChange={(e) => updateField('ethnicity', e.target.value)}
                    className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                  >
                    <option value="">Select...</option>
                    <option value="Hispanic or Latino">Hispanic or Latino</option>
                    <option value="Not Hispanic or Latino">Not Hispanic or Latino</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-muted mb-2">Primary Language</label>
                  <select
                    id="language"
                    value={formData.language}
                    onChange={(e) => updateField('language', e.target.value)}
                    className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="veteran" className="block text-sm font-medium text-muted mb-2">Veteran Status</label>
                  <select
                    id="veteran"
                    value={formData.veteran}
                    onChange={(e) => updateField('veteran', e.target.value)}
                    className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="disabled" className="block text-sm font-medium text-muted mb-2">Disabled</label>
                  <select
                    id="disabled"
                    value={formData.disabled}
                    onChange={(e) => updateField('disabled', e.target.value)}
                    className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Case Information */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text mb-4">Case Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="referralSource" className="block text-sm font-medium text-muted mb-2">Referral Source</label>
                  <input
                    id="referralSource"
                    type="text"
                    value={formData.referralSource}
                    onChange={(e) => updateField('referralSource', e.target.value)}
                    className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                    placeholder="Organization or individual"
                  />
                </div>
                
                <div>
                  <label htmlFor="caseType" className="block text-sm font-medium text-muted mb-2">Case Type</label>
                  <select
                    id="caseType"
                    value={formData.caseType}
                    onChange={(e) => updateField('caseType', e.target.value)}
                    className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                  >
                    <option value="">Select...</option>
                    <option value="Reentry">Reentry</option>
                    <option value="Housing">Housing</option>
                    <option value="Employment">Employment</option>
                    <option value="Benefits">Benefits Enrollment</option>
                    <option value="General Support">General Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-muted mb-2">Priority Level</label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => updateField('priority', e.target.value)}
                  className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-muted mb-2">Initial Notes</label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none resize-none"
                  placeholder="Any additional information..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-panel border-t border-border p-6 flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          
          <Button 
            variant="primary"
            onClick={() => step < 4 ? setStep(step + 1) : handleSubmit()}
          >
            {step === 4 ? 'Save Client' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  )
}
