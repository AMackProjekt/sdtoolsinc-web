'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { PortalHeader } from '@/components/ui/PortalHeader'
import { Button } from '@/components/ui/Button'
import { KPICard } from '@/components/ui/KPICard'

export default function CalBenefitsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-muted">Loading...</div>
      </div>
    )
  }

  const programs = [
    {
      id: 'calfresh',
      name: 'CalFresh',
      icon: '🍎',
      description: 'Food assistance program (SNAP)',
      avgBenefit: '$195/person/month',
      processingTime: '30 days (3 days expedited)',
      color: 'green' as const,
      details: {
        eligibility: 'Based on household income and size',
        benefits: 'Monthly EBT card for purchasing food',
        documents: ['ID', 'Proof of income', 'Residency proof']
      }
    },
    {
      id: 'medical',
      name: 'Medi-Cal',
      icon: '🏥',
      description: 'Healthcare coverage (Medicaid)',
      avgBenefit: 'Free or low-cost',
      processingTime: '45 days',
      color: 'brand' as const,
      details: {
        eligibility: 'Based on income; expanded under ACA',
        benefits: 'Doctor visits, hospital care, prescriptions, mental health services',
        documents: ['ID', 'Social Security card', 'Income verification']
      }
    },
    {
      id: 'general-relief',
      name: 'General Relief',
      icon: '💵',
      description: 'County-level cash assistance',
      avgBenefit: 'Varies by county',
      processingTime: '10-30 days',
      color: 'brand2' as const,
      details: {
        eligibility: 'Adults without dependents, unable to work',
        benefits: 'Monthly cash assistance (temporary 3-12 months)',
        documents: ['ID', 'Bank statements', 'Proof of inability to work']
      }
    },
    {
      id: 'calworks',
      name: 'CalWORKs',
      icon: '👨‍👩‍👧',
      description: 'Cash aid and services for families',
      avgBenefit: 'Based on family size',
      processingTime: '45 days',
      color: 'accent' as const,
      details: {
        eligibility: 'Families with children under 18',
        benefits: 'Cash assistance, job training, childcare support',
        documents: ['ID', 'Birth certificates', 'Income proof', 'Rent/utility bills']
      }
    }
  ]

  const handleLaunchPortal = () => {
    window.open('https://www.mybenefitscalwin.org', '_blank')
  }

  return (
    <div className="min-h-screen bg-bg">
      <PortalHeader />
      
      <main className="mx-auto max-w-7xl px-6 pt-24 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">
            CalBenefits Portal
          </h1>
          <p className="text-muted">
            Assist clients with California public assistance applications
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <KPICard
            title="Applications This Month"
            value="12"
            icon="📋"
            trend={{ value: 20, label: "+20% vs last month", isPositive: true }}
            color="brand"
          />
          <KPICard
            title="Approved"
            value="9"
            icon="✅"
            trend={{ value: 75, label: "75% success rate", isPositive: true }}
            color="green"
          />
          <KPICard
            title="Pending Review"
            value="3"
            icon="⏳"
            color="yellow"
          />
          <KPICard
            title="Avg Processing Time"
            value="28 days"
            icon="⏱️"
            color="accent"
          />
        </div>

        {/* Quick Actions */}
        <div className="glass rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-text mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="primary" className="w-full" onClick={handleLaunchPortal}>
              🌐 Launch CalBenefits Portal
            </Button>
            <Button variant="secondary" className="w-full">
              📝 New Application
            </Button>
            <Button variant="outline" className="w-full">
              📊 Check Status
            </Button>
            <Button variant="outline" className="w-full">
              📄 View Guide
            </Button>
          </div>
        </div>

        {/* Programs */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-text mb-6">Available Programs</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map((program) => (
              <div
                key={program.id}
                className={`glass rounded-xl p-6 cursor-pointer transition-all ${
                  selectedProgram === program.id ? 'border-brand' : 'hover:border-brand/40'
                }`}
                onClick={() => setSelectedProgram(selectedProgram === program.id ? null : program.id)}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">{program.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-text mb-1">{program.name}</h3>
                    <p className="text-sm text-muted">{program.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-muted mb-1">Avg Benefit</div>
                    <div className="text-sm font-medium text-text">{program.avgBenefit}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted mb-1">Processing Time</div>
                    <div className="text-sm font-medium text-text">{program.processingTime}</div>
                  </div>
                </div>

                {selectedProgram === program.id && (
                  <div className="mt-4 pt-4 border-t border-border space-y-3">
                    <div>
                      <div className="text-xs font-medium text-muted mb-1">Eligibility</div>
                      <div className="text-sm text-text">{program.details.eligibility}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-muted mb-1">Benefits</div>
                      <div className="text-sm text-text">{program.details.benefits}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-muted mb-1">Required Documents</div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {program.details.documents.map((doc) => (
                          <span key={doc} className="text-xs px-2 py-1 bg-brand/10 text-brand rounded">
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button variant="primary" className="w-full mt-4" onClick={handleLaunchPortal}>
                      Start Application
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text mb-4">Resources & Best Practices</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-text mb-2">📋 Pre-Application</h3>
              <ul className="text-sm text-muted space-y-1">
                <li>✓ Assess client eligibility</li>
                <li>✓ Gather required documents</li>
                <li>✓ Explain program benefits</li>
                <li>✓ Create CalBenefits account</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-text mb-2">✍️ During Application</h3>
              <ul className="text-sm text-muted space-y-1">
                <li>✓ Complete online application</li>
                <li>✓ Upload all documents</li>
                <li>✓ Review before submission</li>
                <li>✓ Save confirmation number</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-text mb-2">📞 Follow-Up</h3>
              <ul className="text-sm text-muted space-y-1">
                <li>✓ Track application status</li>
                <li>✓ Respond to county requests</li>
                <li>✓ Prepare for interviews</li>
                <li>✓ Assist with appeals</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-brand/5 border border-brand/20 rounded-lg">
            <div className="flex gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <h4 className="font-semibold text-text mb-1">Pro Tip: Expedited Processing</h4>
                <p className="text-sm text-muted">
                  CalFresh applications can be expedited to 3 days if the household has less than $150 monthly income
                  and $100 or less in liquid resources, or housing costs exceed income and liquid resources.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Portal Access */}
        <div className="mt-8 glass rounded-xl p-6 text-center">
          <h3 className="text-xl font-semibold text-text mb-2">Ready to Start?</h3>
          <p className="text-muted mb-6">Access the official CalBenefits portal to begin applications</p>
          <div className="flex gap-4 justify-center">
            <Button variant="primary" size="lg" onClick={handleLaunchPortal}>
              🌐 Open CalBenefits Portal
            </Button>
            <Button variant="outline" size="lg">
              📖 View Full Guide
            </Button>
          </div>
          <p className="text-xs text-muted mt-4">
            Portal: <a href="https://www.mybenefitscalwin.org" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
              https://www.mybenefitscalwin.org
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}
