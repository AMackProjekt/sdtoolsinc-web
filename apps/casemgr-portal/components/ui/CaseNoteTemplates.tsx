'use client'

import { useState } from 'react'
import { Button } from './Button'

const TEMPLATES = [
  {
    id: 'initial-intake',
    name: 'Initial Intake',
    content: `CLIENT INFORMATION:
- Full Name: [Name]
- Date: [Date]
- Case Worker: [Your Name]

INTAKE SUMMARY:
- Presenting Issues: [List primary concerns]
- Immediate Needs: [Housing, Employment, Healthcare, etc.]
- Barriers Identified: [Transportation, Documentation, etc.]

GOALS ESTABLISHED:
1. Short-term (0-3 months): [Goal]
2. Mid-term (3-6 months): [Goal]
3. Long-term (6+ months): [Goal]

ACTION ITEMS:
- [ ] Referrals made: [List]
- [ ] Documents requested: [List]
- [ ] Next appointment scheduled: [Date]

NOTES:
[Additional observations]`
  },
  {
    id: 'progress-note',
    name: 'Progress Note',
    content: `PROGRESS NOTE
Date: [Date]
Client: [Name]
Duration: [Minutes]

TOPICS DISCUSSED:
[Summary of session]

PROGRESS TOWARD GOALS:
- Goal 1: [Progress update]
- Goal 2: [Progress update]

BARRIERS/CHALLENGES:
[Any obstacles encountered]

INTERVENTIONS/SERVICES PROVIDED:
[What was done to help]

PLAN FOR NEXT SESSION:
[What will be addressed next]

NEXT APPOINTMENT:
Date: [Date]
Time: [Time]`
  },
  {
    id: 'employment-tracking',
    name: 'Employment Tracking',
    content: `EMPLOYMENT UPDATE
Date: [Date]
Client: [Name]

EMPLOYMENT STATUS:
☐ Employed    ☐ Unemployed    ☐ Job Search    ☐ Training

CURRENT EMPLOYMENT (if applicable):
- Employer: [Name]
- Position: [Title]
- Start Date: [Date]
- Hours/Week: [Number]
- Hourly Rate: [Amount]

JOB SEARCH ACTIVITIES:
- Applications Submitted: [Number]
- Interviews Scheduled: [Number]
- Follow-ups Needed: [List]

SUPPORT PROVIDED:
- Resume assistance: ☐
- Interview prep: ☐
- Work attire: ☐
- Transportation: ☐

NEXT STEPS:
[Action items]`
  },
  {
    id: 'crisis-intervention',
    name: 'Crisis Intervention',
    content: `CRISIS INTERVENTION NOTE
Date: [Date]
Time: [Time]
Client: [Name]

PRESENTING CRISIS:
[Description of the crisis situation]

RISK ASSESSMENT:
☐ Low Risk    ☐ Moderate Risk    ☐ High Risk

IMMEDIATE ACTIONS TAKEN:
[What was done to address the crisis]

RESOURCES PROVIDED:
[Referrals, contacts, emergency services]

FOLLOW-UP PLAN:
[Next steps and timeline]

SAFETY PLANNING:
[Safety measures discussed/implemented]

CONSULTATION/COLLABORATION:
[Other professionals involved]`
  },
  {
    id: 'housing-assistance',
    name: 'Housing Assistance',
    content: `HOUSING ASSISTANCE NOTE
Date: [Date]
Client: [Name]

CURRENT HOUSING STATUS:
☐ Homeless    ☐ Transitional    ☐ Temporary    ☐ Permanent

HOUSING NEEDS:
- Type needed: [Apartment/Room/etc.]
- Move-in timeline: [Date]
- Budget: [Amount]

BARRIERS TO HOUSING:
[Credit, income, background check, etc.]

ASSISTANCE PROVIDED:
- Housing applications: [Number]
- Landlord contacts: [List]
- Rental assistance: [Type/Amount]
- Move-in fund support: [Amount]

APPLICATIONS SUBMITTED:
[List properties/programs]

NEXT STEPS:
[Action items]`
  },
  {
    id: 'benefits-enrollment',
    name: 'Benefits Enrollment',
    content: `BENEFITS ENROLLMENT NOTE
Date: [Date]
Client: [Name]

BENEFITS APPLIED FOR:
☐ CalFresh (SNAP)
☐ Medi-Cal
☐ CalWORKs
☐ General Assistance
☐ SSI/SSDI
☐ Other: [Specify]

APPLICATION STATUS:
- Submitted: [Date]
- Documents needed: [List]
- Interview date: [Date]
- Status: [Pending/Approved/Denied]

ASSISTANCE PROVIDED:
- Application completion: ☐
- Document gathering: ☐
- Interview prep: ☐
- Appeal assistance: ☐

FOLLOW-UP REQUIRED:
[Action items and deadlines]`
  }
]

export function CaseNoteTemplates({ onSelectTemplate }: { onSelectTemplate: (content: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (content: string) => {
    onSelectTemplate(content)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full"
      >
        📋 Use Template
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-full mt-2 w-72 bg-panel border border-border rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
            <div className="p-3 border-b border-border">
              <h3 className="font-semibold text-text">Select Template</h3>
            </div>
            <div className="p-2">
              {TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleSelect(template.content)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-glass transition-colors text-text text-sm"
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
