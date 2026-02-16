'use client'

import { useState } from 'react'
import { Button } from '../../../../components/ui/Button'
import Image from 'next/image'

export default function ProgramInterestPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    organizationName: '',
    contactName: '',
    title: '',
    email: '',
    phone: '',
    organizationType: '',
    servesPopulation: '',
    programDescription: '',
    estimatedParticipants: '',
    interestedServices: [] as string[],
    preferredDemoDate: '',
    preferredDemoTime: '',
    additionalInfo: '',
    referralFormInterest: false
  })

  const services = [
    'Client Portal - Dashboard & Progress Tracking',
    'Case Manager Portal - Client Management',
    'Resource Directory - Referral Management',
    'Document Management - File Uploads & Storage',
    'Appointment Scheduling - Calendar Integration',
    'Progress Reports - Analytics & Insights',
    'Referral Form Integration',
    'AI Coach - Motivational Support',
    'CalBenefits Assistance Tools',
    'Custom Integrations'
  ]

  const organizationTypes = [
    'Reentry Program',
    'Correctional Facility',
    'Nonprofit Organization',
    'Government Agency',
    'Community Organization',
    'Faith-Based Organization',
    'Education Institution',
    'Employment Program',
    'Healthcare Provider',
    'Other'
  ]

  const handleServiceToggle = (service: string) => {
    if (formData.interestedServices.includes(service)) {
      setFormData({
        ...formData,
        interestedServices: formData.interestedServices.filter(s => s !== service)
      })
    } else {
      setFormData({
        ...formData,
        interestedServices: [...formData.interestedServices, service]
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // TODO: Send form data to backend/email service
    console.log('Program Interest Form:', formData)
    
    setSubmitted(true)
    
    // Reset form after 3 seconds and show confirmation
    setTimeout(() => {
      setFormData({
        organizationName: '',
        contactName: '',
        title: '',
        email: '',
        phone: '',
        organizationType: '',
        servesPopulation: '',
        programDescription: '',
        estimatedParticipants: '',
        interestedServices: [],
        preferredDemoDate: '',
        preferredDemoTime: '',
        additionalInfo: '',
        referralFormInterest: false
      })
    }, 3000)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="glass rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-text mb-2">Thank You!</h2>
          <p className="text-muted mb-6">
            Your program interest form has been submitted successfully. Our team will contact you within 48 hours to schedule your demo.
          </p>
          <Button variant="primary" onClick={() => window.location.href = '/dashboard'}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-semibold uppercase tracking-wider mb-4">
            Program Partnership
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-text mb-4">
            Add T.O.O.L.S Inc Portal to Your Program
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Schedule a live demo with our team to see how our platform can enhance your reentry services and client management
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Organization Information */}
          <div className="glass rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-text mb-6 flex items-center gap-2">
              <span className="text-2xl">🏢</span>
              Organization Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="organizationName" className="block text-sm font-medium text-muted mb-2">
                  Organization Name *
                </label>
                <input
                  id="organizationName"
                  type="text"
                  required
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                  placeholder="Your Organization Name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-muted mb-2">
                    Contact Person *
                  </label>
                  <input
                    id="contactName"
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                    placeholder="Your Full Name"
                  />
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-muted mb-2">
                    Your Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                    placeholder="Program Director, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-muted mb-2">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                    placeholder="contact@organization.org"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-muted mb-2">
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="organizationType" className="block text-sm font-medium text-muted mb-2">
                  Organization Type *
                </label>
                <select
                  id="organizationType"
                  required
                  value={formData.organizationType}
                  onChange={(e) => setFormData({ ...formData, organizationType: e.target.value })}
                  className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                >
                  <option value="">Select Type</option>
                  {organizationTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Program Details */}
          <div className="glass rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-text mb-6 flex items-center gap-2">
              <span className="text-2xl">📋</span>
              Program Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="servesPopulation" className="block text-sm font-medium text-muted mb-2">
                  Population You Serve
                </label>
                <input
                  id="servesPopulation"
                  type="text"
                  value={formData.servesPopulation}
                  onChange={(e) => setFormData({ ...formData, servesPopulation: e.target.value })}
                  className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                  placeholder="e.g., Justice-involved individuals, reentry clients, etc."
                />
              </div>

              <div>
                <label htmlFor="programDescription" className="block text-sm font-medium text-muted mb-2">
                  Brief Program Description
                </label>
                <textarea
                  id="programDescription"
                  rows={4}
                  value={formData.programDescription}
                  onChange={(e) => setFormData({ ...formData, programDescription: e.target.value })}
                  className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none resize-none"
                  placeholder="Describe your program and services..."
                />
              </div>

              <div>
                <label htmlFor="estimatedParticipants" className="block text-sm font-medium text-muted mb-2">
                  Estimated Number of Participants/Clients
                </label>
                <input
                  id="estimatedParticipants"
                  type="text"
                  value={formData.estimatedParticipants}
                  onChange={(e) => setFormData({ ...formData, estimatedParticipants: e.target.value })}
                  className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                  placeholder="e.g., 50-100 clients"
                />
              </div>
            </div>
          </div>

          {/* Services of Interest */}
          <div className="glass rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-text mb-6 flex items-center gap-2">
              <span className="text-2xl">⚙️</span>
              Services & Features of Interest
            </h2>
            
            <div className="space-y-2">
              {services.map(service => (
                <label 
                  key={service}
                  className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-brand/50 transition cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.interestedServices.includes(service)}
                    onChange={() => handleServiceToggle(service)}
                    className="mt-1 w-5 h-5 rounded border-border text-brand focus:ring-brand focus:ring-offset-0"
                  />
                  <span className="text-text">{service}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Demo Scheduling */}
          <div className="glass rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-text mb-6 flex items-center gap-2">
              <span className="text-2xl">📅</span>
              Schedule Live Demo
            </h2>
            
            <p className="text-sm text-muted mb-6">
              Our team will contact you to confirm the demo time. Please provide your preferred date and time below.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="preferredDemoDate" className="block text-sm font-medium text-muted mb-2">
                  Preferred Demo Date
                </label>
                <input
                  id="preferredDemoDate"
                  type="date"
                  value={formData.preferredDemoDate}
                  onChange={(e) => setFormData({ ...formData, preferredDemoDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="preferredDemoTime" className="block text-sm font-medium text-muted mb-2">
                  Preferred Time
                </label>
                <select
                  id="preferredDemoTime"
                  value={formData.preferredDemoTime}
                  onChange={(e) => setFormData({ ...formData, preferredDemoTime: e.target.value })}
                  className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                >
                  <option value="">Select Time</option>
                  <option value="morning">Morning (9am - 12pm)</option>
                  <option value="afternoon">Afternoon (12pm - 3pm)</option>
                  <option value="late-afternoon">Late Afternoon (3pm - 5pm)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Referral Form Interest */}
          <div className="glass rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-text mb-6 flex items-center gap-2">
              <span className="text-2xl">🤝</span>
              Referral System
            </h2>
            
            <label className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-brand/50 transition cursor-pointer">
              <input
                type="checkbox"
                checked={formData.referralFormInterest}
                onChange={(e) => setFormData({ ...formData, referralFormInterest: e.target.checked })}
                className="mt-1 w-5 h-5 rounded border-border text-brand focus:ring-brand focus:ring-offset-0"
              />
              <div>
                <div className="font-medium text-text">Yes, I'm interested in the referral form integration</div>
                <div className="text-sm text-muted mt-1">
                  Allow external partners to submit referrals directly to your program through our secure form system
                </div>
              </div>
            </label>

            <div className="mt-4 p-4 bg-brand/5 border border-brand/20 rounded-lg">
              <p className="text-sm text-muted">
                📝 Learn more about our <a href="/referral" className="text-brand hover:text-brand2 underline" target="_blank" rel="noopener noreferrer">referral system</a> and how it streamlines client intake.
              </p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="glass rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-text mb-6 flex items-center gap-2">
              <span className="text-2xl">💬</span>
              Additional Information
            </h2>
            
            <div>
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-muted mb-2">
                Questions or Special Requirements?
              </label>
              <textarea
                id="additionalInfo"
                rows={4}
                value={formData.additionalInfo}
                onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none resize-none"
                placeholder="Let us know if you have any specific questions or requirements..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button type="submit" variant="primary" className="px-12 py-4 text-lg">
              Submit Program Interest Form
            </Button>
          </div>

          <p className="text-xs text-center text-muted">
            By submitting this form, you agree to be contacted by T.O.O.L.S Inc regarding our platform and services.
            We typically respond within 48 hours.
          </p>
        </form>
      </div>
    </div>
  )
}
