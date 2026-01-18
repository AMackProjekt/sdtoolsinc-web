'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { PortalHeader } from '@/components/ui/PortalHeader'
import { Button } from '@/components/ui/Button'
import { KPICard } from '@/components/ui/KPICard'
import { AddResourceModal } from '@/components/ui/AddResourceModal'
import { 
  isGoogleSheetsEnabled, 
  fetchResourcesFromSheets, 
  addResourceToSheets, 
  syncWithGoogleSheets 
} from '@/lib/google-sheets'

interface CustomKPI {
  id: string
  title: string
  value: string | number
  icon: string
  color: 'brand' | 'brand2' | 'accent' | 'green' | 'yellow' | 'red'
  trend?: { value: number, label: string, isPositive?: boolean }
}

interface Resource {
  id: string
  name: string
  category: string
  phone: string
  address: string
  city: string
  hours: string
  website?: string
  email?: string
  services: string[]
  eligibility?: string
  notes?: string
}

const RESOURCE_CATEGORIES = [
  'All Resources',
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
  'Financial Assistance'
]

const MOCK_RESOURCES: Resource[] = [
  // SUD Rehabilitation
  {
    id: '1',
    name: 'McAlister Institute for Treatment and Education',
    category: 'SUD Rehabilitation',
    phone: '(619) 266-6500',
    address: '4050 Fairmount Ave',
    city: 'San Diego, CA 92105',
    hours: '24/7 Admissions',
    website: 'https://www.mcalisterinstitute.org',
    email: 'info@mcalisterinstitute.org',
    services: ['Residential Treatment', 'Outpatient Services', 'MAT', 'Counseling', 'Family Services'],
    eligibility: 'Low/No income accepted, Medi-Cal accepted',
    notes: 'Sliding scale fees available'
  },
  {
    id: '2',
    name: 'San Diego County Behavioral Health Access and Crisis Line',
    category: 'SUD Rehabilitation',
    phone: '(888) 724-7240',
    address: 'Countywide Services',
    city: 'San Diego, CA',
    hours: '24/7',
    website: 'https://www.sandiegocounty.gov/hhsa/programs/bhs',
    services: ['Crisis Support', 'Referrals', 'Treatment Locator', 'Emergency Services'],
    eligibility: 'All residents, free service'
  },
  {
    id: '20',
    name: 'Pacific Beach Health - In-Patient Program',
    category: 'SUD Rehabilitation',
    phone: '(858) 581-3681',
    address: '1964 Grand Ave',
    city: 'San Diego, CA 92109',
    hours: '24/7 Admissions',
    website: 'https://www.pbhealth.com',
    email: 'admissions@pbhealth.com',
    services: ['In-Patient Detox', 'Residential Treatment', 'Medical Monitoring', 'Group Therapy', 'Individual Counseling'],
    eligibility: 'Medi-Cal accepted, sliding scale available',
    notes: '30-90 day programs, gender-specific housing'
  },
  {
    id: '21',
    name: 'Scripps Mercy Hospital - Inpatient Treatment Center',
    category: 'SUD Rehabilitation',
    phone: '(619) 294-8111',
    address: '4077 5th Ave',
    city: 'San Diego, CA 92103',
    hours: '24/7',
    website: 'https://www.scripps.org/services/behavioral-health',
    services: ['Medical Detox', 'Dual Diagnosis Treatment', 'In-Patient Care', 'Psychiatry', 'Aftercare Planning'],
    eligibility: 'Most insurance accepted including Medi-Cal',
    notes: 'Hospital-based program with medical oversight'
  },
  {
    id: '22',
    name: 'Stepping Stone Recovery Center - Outpatient',
    category: 'SUD Rehabilitation',
    phone: '(619) 584-7000',
    address: '10364 Rockwood Dr',
    city: 'Santee, CA 92071',
    hours: 'Mon-Fri 8am-8pm, Sat 9am-1pm',
    website: 'https://www.steppingstonesd.org',
    email: 'info@steppingstonesd.org',
    services: ['Outpatient Counseling', 'Intensive Outpatient (IOP)', 'Group Therapy', 'Family Therapy', 'Relapse Prevention'],
    eligibility: 'Low/no income accepted, Medi-Cal accepted',
    notes: 'Evening and weekend programs available'
  },
  {
    id: '23',
    name: 'Comprehensive Treatment Centers - Outpatient MAT',
    category: 'SUD Rehabilitation',
    phone: '(619) 276-2550',
    address: '4455 Morena Blvd, Suite 202',
    city: 'San Diego, CA 92117',
    hours: 'Mon-Fri 6am-2:30pm, Sat 7am-12pm',
    website: 'https://www.ctcbehavioralhealth.com',
    services: ['Medication-Assisted Treatment', 'Methadone/Suboxone', 'Outpatient Counseling', 'Case Management', 'Peer Support'],
    eligibility: 'Most insurance and Medi-Cal accepted',
    notes: 'Walk-ins welcome for assessment'
  },
  {
    id: '24',
    name: 'Alvarado Parkway Institute - Dual Diagnosis',
    category: 'SUD Rehabilitation',
    phone: '(619) 667-6125',
    address: '7050 Parkway Dr',
    city: 'La Mesa, CA 91942',
    hours: '24/7',
    website: 'https://www.apibehavioral.com',
    services: ['In-Patient Dual Diagnosis', 'Mental Health + SUD Treatment', 'Psychiatric Care', 'Family Programs'],
    eligibility: 'Most insurance, Medi-Cal, Medicare accepted',
    notes: 'Specialized in co-occurring disorders'
  },
  
  // Food Pantries
  {
    id: '3',
    name: 'San Diego Food Bank',
    category: 'Food Pantries',
    phone: '(866) 350-3663',
    address: '9850 Distribution Ave',
    city: 'San Diego, CA 92121',
    hours: 'Mon-Fri 8am-4pm',
    website: 'https://www.sandiegofoodbank.org',
    email: 'info@sandiegofoodbank.org',
    services: ['Food Distribution', 'Mobile Pantries', 'Senior Programs', 'CalFresh Enrollment'],
    eligibility: 'Income-based, bring ID and proof of address'
  },
  {
    id: '4',
    name: 'Feeding San Diego',
    category: 'Food Pantries',
    phone: '(858) 527-1419',
    address: '9850 Distribution Ave',
    city: 'San Diego, CA 92121',
    hours: 'Mon-Fri 9am-3pm',
    website: 'https://www.feedingsandiego.org',
    services: ['Food Pantry', 'Meals', 'Nutrition Education'],
    eligibility: 'No income requirements'
  },

  // Legal Aid
  {
    id: '5',
    name: 'Legal Aid Society of San Diego',
    category: 'Legal Aid',
    phone: '(877) 534-2524',
    address: '110 S Euclid Ave',
    city: 'San Diego, CA 92114',
    hours: 'Mon-Fri 8:30am-5pm',
    website: 'https://www.lassd.org',
    email: 'info@lassd.org',
    services: ['Housing Law', 'Family Law', 'Consumer Rights', 'Immigration', 'Elder Law'],
    eligibility: 'Income at or below 200% federal poverty level'
  },
  {
    id: '6',
    name: 'Casa Cornelia Law Center',
    category: 'Legal Aid',
    phone: '(619) 687-0813',
    address: '2851 Camino del Rio S, Suite 400',
    city: 'San Diego, CA 92108',
    hours: 'Mon-Fri 9am-5pm',
    website: 'https://www.casacornelia.org',
    services: ['Immigration Law', 'Asylum Cases', 'Human Trafficking', 'Violence Against Women Act'],
    eligibility: 'Free for low-income residents'
  },

  // Shelters/Programs
  {
    id: '7',
    name: 'San Diego Rescue Mission',
    category: 'Shelters/Programs',
    phone: '(619) 819-1788',
    address: '120 Elm St',
    city: 'San Diego, CA 92101',
    hours: '24/7',
    website: 'https://www.sdrescue.org',
    services: ['Emergency Shelter', 'Meals', 'Recovery Programs', 'Job Training', 'Medical Care'],
    eligibility: 'Open to all experiencing homelessness'
  },
  {
    id: '8',
    name: 'Alpha Project for the Homeless',
    category: 'Shelters/Programs',
    phone: '(619) 542-1877',
    address: '3737 5th Ave',
    city: 'San Diego, CA 92103',
    hours: 'Mon-Fri 8am-5pm',
    website: 'https://www.alphaproject.org',
    email: 'info@alphaproject.org',
    services: ['Transitional Housing', 'Case Management', 'Mental Health', 'Job Services', 'Storage'],
    eligibility: 'Must be experiencing homelessness'
  },
  {
    id: '25',
    name: 'San Diego Housing Commission - Section 8 Program',
    category: 'Shelters/Programs',
    phone: '(619) 578-7550',
    address: '1122 Broadway, Suite 300',
    city: 'San Diego, CA 92101',
    hours: 'Mon-Fri 8am-5pm',
    website: 'https://www.sdhc.org',
    email: 'info@sdhc.org',
    services: ['Housing Choice Vouchers (Section 8)', 'Tenant-Based Rental Assistance', 'Project-Based Vouchers', 'Emergency Housing Vouchers'],
    eligibility: 'Extremely low to low-income (up to 80% AMI), waitlist may apply',
    notes: 'Must meet income limits and background check requirements'
  },
  {
    id: '26',
    name: 'SDHC - Moderate Income Housing Assistance',
    category: 'Shelters/Programs',
    phone: '(619) 578-7550',
    address: '1122 Broadway, Suite 300',
    city: 'San Diego, CA 92101',
    hours: 'Mon-Fri 8am-5pm',
    website: 'https://www.sdhc.org/housing-opportunities',
    services: ['First-Time Homebuyer Program', 'Down Payment Assistance', 'Mortgage Credit Certificate', 'Income-Restricted Rentals'],
    eligibility: 'Moderate-income households (up to 120% AMI)',
    notes: 'Various programs with different income limits'
  },
  {
    id: '27',
    name: 'SDHC - Transitional Housing Programs',
    category: 'Shelters/Programs',
    phone: '(619) 578-7550',
    address: '1122 Broadway, Suite 300',
    city: 'San Diego, CA 92101',
    hours: 'Mon-Fri 8am-5pm',
    website: 'https://www.sdhc.org/homelessness-solutions',
    services: ['Bridge to Housing', 'Moving On Initiative', 'Veteran Housing', 'Youth Housing', 'Rapid Re-Housing'],
    eligibility: 'Homeless or at-risk of homelessness, income-qualified',
    notes: 'Supportive services included'
  },
  {
    id: '28',
    name: 'Chelsea Investment Corporation - Affordable Housing',
    category: 'Shelters/Programs',
    phone: '(619) 234-4900',
    address: '2305 Historic Decatur Rd, Suite 100',
    city: 'San Diego, CA 92106',
    hours: 'Mon-Fri 9am-5pm',
    website: 'https://www.chelseainvestmentcorp.com',
    services: ['Low-Income Apartments', 'Senior Housing', 'Family Units', 'Income-Based Rent'],
    eligibility: '30-60% AMI depending on property',
    notes: 'Multiple properties throughout San Diego County'
  },
  {
    id: '29',
    name: 'PATH San Diego - Permanent Supportive Housing',
    category: 'Shelters/Programs',
    phone: '(858) 694-7384',
    address: '8954 Rio San Diego Dr, Suite 110',
    city: 'San Diego, CA 92108',
    hours: 'Mon-Fri 8am-5pm',
    website: 'https://www.epath.org',
    email: 'sandiego@epath.org',
    services: ['Housing Navigation', 'Permanent Supportive Housing', 'Case Management', 'Mental Health Services', 'Move-In Assistance'],
    eligibility: 'Chronically homeless with disabilities',
    notes: 'Coordinated through CES (Coordinated Entry System)'
  },
  {
    id: '30',
    name: 'Home Start - Housing Programs',
    category: 'Shelters/Programs',
    phone: '(619) 291-9444',
    address: '3878 54th St',
    city: 'San Diego, CA 92105',
    hours: 'Mon-Fri 8:30am-4:30pm',
    website: 'https://www.homestartonline.org',
    services: ['Rapid Re-Housing', 'Emergency Shelter', 'Domestic Violence Housing', 'Transitional Housing', 'Case Management'],
    eligibility: 'Homeless families and individuals, domestic violence survivors',
    notes: '24/7 crisis hotline available'
  },
  {
    id: '31',
    name: 'MAAC Project - Affordable Housing',
    category: 'Shelters/Programs',
    phone: '(619) 234-3171',
    address: '1355 20th St',
    city: 'San Diego, CA 92102',
    hours: 'Mon-Fri 8am-5pm',
    website: 'https://www.maacproject.org',
    services: ['Low-Income Rentals', 'Income-Based Housing', 'Family Units', 'Housing Application Assistance'],
    eligibility: 'Low to moderate-income (30-80% AMI)',
    notes: 'Multiple affordable housing communities'
  },

  // Employment Services
  {
    id: '32',
    name: 'San Diego Workforce Partnership - America\'s Job Center',
    category: 'Employment Services',
    phone: '(619) 228-2982',
    address: '3910 University Ave, Suite 400',
    city: 'San Diego, CA 92105',
    hours: 'Mon-Fri 8am-5pm',
    website: 'https://www.workforce.org',
    email: 'info@workforce.org',
    services: ['Job Search Assistance', 'Resume Writing', 'Interview Prep', 'Career Counseling', 'Training Programs', 'Computer Access'],
    eligibility: 'Open to all job seekers',
    notes: 'Multiple locations throughout San Diego County'
  },
  {
    id: '33',
    name: 'Father Joe\'s Villages - Employment Services',
    category: 'Employment Services',
    phone: '(619) 446-2100',
    address: '3350 E St',
    city: 'San Diego, CA 92102',
    hours: 'Mon-Fri 9am-4pm',
    website: 'https://www.neighbor.org',
    services: ['Job Placement', 'Skills Training', 'Work Readiness', 'Job Retention Support', 'Transportation Assistance'],
    eligibility: 'Priority for homeless and formerly homeless individuals',
    notes: 'Case management and support services included'
  },
  {
    id: '34',
    name: 'Second Chance - Employment Program',
    category: 'Employment Services',
    phone: '(619) 234-8888',
    address: '3821 32nd St',
    city: 'San Diego, CA 92104',
    hours: 'Mon-Fri 8:30am-4:30pm',
    website: 'https://www.secondchanceprogram.org',
    services: ['Job Training', 'Vocational Classes', 'Apprenticeships', 'Job Placement', 'Expungement Assistance'],
    eligibility: 'Justice-involved individuals, formerly incarcerated',
    notes: 'Specialized support for individuals with criminal records'
  },

  // Transportation
  {
    id: '35',
    name: 'MTS Reduced Fare Program (PRONTO)',
    category: 'Transportation',
    phone: '(619) 557-4555',
    address: '1255 Imperial Ave, Suite 1000',
    city: 'San Diego, CA 92101',
    hours: 'Mon-Fri 8am-5pm',
    website: 'https://www.sdmts.com/fares-passes/reduced-fare',
    services: ['Discounted Bus Passes', 'Discounted Trolley Passes', 'Senior/Disabled/Medicare Fare', 'Youth Fare'],
    eligibility: 'Seniors 65+, people with disabilities, Medicare cardholders, youth 6-18',
    notes: 'Up to 70% discount on transit fares'
  },
  {
    id: '36',
    name: 'Lyft Access - Ride Assistance',
    category: 'Transportation',
    phone: '(844) 250-2773',
    address: 'Phone/App Service',
    city: 'San Diego County',
    hours: '24/7',
    website: 'https://www.lyft.com/access',
    services: ['Discounted Rides', 'Paratransit Alternative', 'Medical Appointments', 'Wheelchair Accessible Vehicles'],
    eligibility: 'Varies by program - healthcare, community partners',
    notes: 'App-based service, partnerships with healthcare providers'
  },
  {
    id: '37',
    name: 'Gas Voucher Program - Catholic Charities',
    category: 'Transportation',
    phone: '(619) 231-2828',
    address: '349 Cedar St',
    city: 'San Diego, CA 92101',
    hours: 'Mon-Fri 8:30am-4:30pm',
    website: 'https://www.ccdsd.org',
    services: ['Gas Vouchers', 'Bus Passes', 'Emergency Transportation', 'Job Interview Transport'],
    eligibility: 'Low-income individuals, case-by-case basis',
    notes: 'Limited availability, must demonstrate need'
  },

  // Education
  {
    id: '38',
    name: 'San Diego Public Library - Adult Literacy',
    category: 'Education',
    phone: '(619) 236-5800',
    address: '330 Park Blvd',
    city: 'San Diego, CA 92101',
    hours: 'Varies by location',
    website: 'https://www.sandiegolibrary.org',
    services: ['GED Prep', 'ESL Classes', 'Computer Skills', 'Tutoring', 'Free Library Cards', 'Internet Access'],
    eligibility: 'Open to all San Diego residents',
    notes: 'Multiple locations, free library card provides access to online learning'
  },
  {
    id: '39',
    name: 'San Diego Community College District - Free Classes',
    category: 'Education',
    phone: '(619) 388-6500',
    address: 'Multiple Campus Locations',
    city: 'San Diego County',
    hours: 'Varies by campus',
    website: 'https://www.sdccd.edu',
    services: ['Community College Classes', 'Career Training', 'Financial Aid', 'GED Testing', 'Workforce Programs'],
    eligibility: 'CA residents - may qualify for free tuition (Promise Program)',
    notes: 'First-year free for eligible students, certificate programs available'
  },
  {
    id: '40',
    name: 'Job Corps San Diego',
    category: 'Education',
    phone: '(619) 628-3000',
    address: '1307 First Ave',
    city: 'San Diego, CA 92101',
    hours: 'Mon-Fri 8am-5pm',
    website: 'https://www.jobcorps.gov',
    services: ['Vocational Training', 'High School Diploma', 'Housing', 'Meals', 'Job Placement', 'Career Counseling'],
    eligibility: 'Ages 16-24, low-income',
    notes: 'Free residential and day programs, 100% federally funded'
  },

  // Child Care
  {
    id: '41',
    name: 'YMCA Childcare Financial Assistance',
    category: 'Child Care',
    phone: '(858) 292-4034',
    address: 'Multiple Locations',
    city: 'San Diego County',
    hours: 'Varies by location',
    website: 'https://www.ymcasd.org',
    services: ['Before/After School Care', 'Summer Camp', 'Financial Assistance', 'Preschool Programs'],
    eligibility: 'Income-based sliding scale',
    notes: 'Financial assistance available for qualifying families'
  },
  {
    id: '42',
    name: '211 San Diego - Child Care Resource',
    category: 'Child Care',
    phone: '2-1-1',
    address: 'Phone Service',
    city: 'San Diego County',
    hours: '24/7',
    website: 'https://www.211sandiego.org',
    services: ['Child Care Referrals', 'Subsidy Programs', 'Provider Search', 'Parent Resources'],
    eligibility: 'All families',
    notes: 'Free information and referral service for all child care needs'
  },
  {
    id: '43',
    name: 'California State Preschool Program',
    category: 'Child Care',
    phone: '(619) 725-7900',
    address: 'Multiple School District Locations',
    city: 'San Diego County',
    hours: 'School hours',
    website: 'https://www.cde.ca.gov/sp/cd/op',
    services: ['Free Preschool', 'Full-Day Programs', 'Part-Day Programs', 'Child Development'],
    eligibility: 'Low-income families, income limits apply',
    notes: 'Apply through local school districts'
  },

  // Financial Assistance
  {
    id: '44',
    name: 'Catholic Charities - Emergency Assistance',
    category: 'Financial Assistance',
    phone: '(619) 231-2828',
    address: '349 Cedar St',
    city: 'San Diego, CA 92101',
    hours: 'Mon-Fri 8:30am-4:30pm',
    website: 'https://www.ccdsd.org',
    services: ['Rent Assistance', 'Utility Assistance', 'Food Vouchers', 'Prescription Help', 'Transportation'],
    eligibility: 'Low-income, emergency situations',
    notes: 'Must show proof of need, limited funds available'
  },
  {
    id: '45',
    name: 'GRID Alternatives - Free Solar Installation',
    category: 'Financial Assistance',
    phone: '(619) 595-0139',
    address: '7915 Silverton Ave, Suite 103',
    city: 'San Diego, CA 92126',
    hours: 'Mon-Fri 9am-5pm',
    website: 'https://www.gridalternatives.org',
    services: ['Free Solar Installation', 'Electric Bill Savings', 'Job Training Opportunities'],
    eligibility: 'Low-income homeowners (80% AMI or below)',
    notes: 'Can reduce electric bills by 50-90%'
  },
  {
    id: '46',
    name: 'San Diego Financial Empowerment Centers',
    category: 'Financial Assistance',
    phone: '(619) 533-4473',
    address: 'Multiple Locations',
    city: 'San Diego County',
    hours: 'By appointment',
    website: 'https://www.sandiego.gov/treasurer/fec',
    services: ['Free Financial Counseling', 'Credit Building', 'Debt Management', 'Banking Access', 'Tax Prep'],
    eligibility: 'San Diego residents',
    notes: 'One-on-one professional financial counseling at no cost'
  },

  // Storage Facilities
  {
    id: '9',
    name: 'Alpha Project Storage Center',
    category: 'Storage Facilities',
    phone: '(619) 542-1877',
    address: '1250 6th Ave',
    city: 'San Diego, CA 92101',
    hours: 'Mon-Fri 8am-5pm',
    services: ['Personal Belongings Storage', 'Document Storage', 'Short-term Storage'],
    eligibility: 'Free for homeless individuals with referral',
    notes: 'Case manager referral required'
  },
  {
    id: '10',
    name: 'Think Dignity Storage',
    category: 'Storage Facilities',
    phone: '(619) 323-5034',
    address: '1047 25th St',
    city: 'San Diego, CA 92102',
    hours: 'Mon-Fri 7am-6pm, Sat 8am-12pm',
    website: 'https://www.thinkdignity.org',
    services: ['Locker Storage', 'Bin Storage', 'Mobile Storage'],
    eligibility: 'Free for homeless individuals',
    notes: 'ID required for check-in/out'
  },

  // Mailing Services
  {
    id: '11',
    name: 'Alpha Project Mail Services',
    category: 'Mailing Services',
    phone: '(619) 542-1877',
    address: '3737 5th Ave',
    city: 'San Diego, CA 92103',
    hours: 'Mon-Fri 9am-5pm',
    services: ['Mail Receiving', 'Mail Forwarding', 'Package Pickup'],
    eligibility: 'Free for Alpha Project clients',
    notes: 'Must enroll in program'
  },
  {
    id: '12',
    name: 'Dreams for Change - Mail Program',
    category: 'Mailing Services',
    phone: '(619) 338-9200',
    address: '4550 Kearny Villa Rd',
    city: 'San Diego, CA 92123',
    hours: 'Mon-Fri 8am-5pm',
    website: 'https://www.dreamsforchange.org',
    services: ['Mail Address', 'Package Receiving', 'Secure Storage'],
    eligibility: 'Program participants',
    notes: 'No cost, registration required'
  },

  // Medi-Cal Providers
  {
    id: '13',
    name: 'San Diego County Health and Human Services',
    category: 'Medi-Cal Providers',
    phone: '(866) 262-9881',
    address: 'Phone Service',
    city: 'San Diego County',
    hours: 'Mon-Fri 8am-5pm',
    website: 'https://www.sandiegocounty.gov/hhsa',
    services: ['Eligibility Questions', 'Application Assistance', 'Provider Locator', 'Renewals'],
    eligibility: 'All Medi-Cal recipients'
  },
  {
    id: '14',
    name: 'Community Health Group (Medi-Cal Managed Care)',
    category: 'Medi-Cal Providers',
    phone: '(800) 224-7766',
    address: '2420 Fenton St',
    city: 'Chula Vista, CA 91914',
    hours: '24/7 Nurse Hotline',
    website: 'https://www.chgsd.com',
    services: ['Primary Care', 'Specialist Referrals', 'Mental Health', 'Pharmacy', 'Transportation'],
    eligibility: 'Medi-Cal enrollees'
  },

  // Mental Health
  {
    id: '15',
    name: 'San Diego County Behavioral Health Services',
    category: 'Mental Health',
    phone: '(888) 724-7240',
    address: '3851 Rosecrans St',
    city: 'San Diego, CA 92110',
    hours: '24/7 Crisis Line',
    website: 'https://www.sandiegocounty.gov/hhsa/programs/bhs',
    services: ['Crisis Services', 'Outpatient Care', 'Case Management', 'Peer Support', 'Medication Services'],
    eligibility: 'Medi-Cal or no insurance accepted'
  },
  {
    id: '16',
    name: 'NAMI San Diego',
    category: 'Mental Health',
    phone: '(619) 543-1434',
    address: '5095 Murphy Canyon Rd, Suite 320',
    city: 'San Diego, CA 92123',
    hours: 'Mon-Fri 9am-5pm',
    website: 'https://www.namisandiego.org',
    email: 'info@namisandiego.org',
    services: ['Support Groups', 'Education', 'Advocacy', 'Resources', 'Family Support'],
    eligibility: 'Free programs for all'
  },

  // Clothing Resources
  {
    id: '17',
    name: 'Dress for Success San Diego',
    category: 'Clothing Resources',
    phone: '(619) 295-0658',
    address: '6010 Hidden Valley Rd',
    city: 'San Diego, CA 92120',
    hours: 'By appointment',
    website: 'https://www.sandiego.dressforsuccess.org',
    services: ['Professional Attire', 'Career Coaching', 'Interview Prep', 'Ongoing Support'],
    eligibility: 'Women seeking employment, referral required'
  },
  {
    id: '18',
    name: 'Father Joe\'s Villages - Clothing Closet',
    category: 'Clothing Resources',
    phone: '(619) 699-1355',
    address: '3350 E St',
    city: 'San Diego, CA 92102',
    hours: 'Mon-Fri 7am-3pm',
    website: 'https://www.neighbor.org',
    services: ['Clothing Distribution', 'Shoes', 'Hygiene Items', 'Work Attire'],
    eligibility: 'No restrictions, first-come basis'
  },
  {
    id: '19',
    name: 'St. Vincent de Paul Village - Thrift Store',
    category: 'Clothing Resources',
    phone: '(619) 233-8500',
    address: '1501 Imperial Ave',
    city: 'San Diego, CA 92101',
    hours: 'Mon-Sat 9am-5pm',
    website: 'https://www.svdpsd.org',
    services: ['Free Clothing Vouchers', 'Household Items', 'Furniture'],
    eligibility: 'Vouchers available for those in need',
    notes: 'Case manager referral recommended'
  }
]

export default function ResourcesPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('All Resources')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<'internal' | 'web'>('internal')
  const [webSearchQuery, setWebSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [showCustomKPIModal, setShowCustomKPIModal] = useState(false)
  const [customKPIs, setCustomKPIs] = useState<CustomKPI[]>([])
  const [newKPI, setNewKPI] = useState<Partial<CustomKPI>>({
    color: 'brand',
    icon: '📊'
  })
  
  // New state for Add Resource modal and Google Sheets
  const [showAddResourceModal, setShowAddResourceModal] = useState(false)
  const [localResources, setLocalResources] = useState<Resource[]>(MOCK_RESOURCES)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<string>('')
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)

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
  
  // Handler for adding new resource from modal
  const handleAddResource = async (formData: any) => {
    const newResource: Resource = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      hours: formData.hours,
      website: formData.website,
      email: formData.email,
      services: formData.services ? formData.services.split(',').map((s: string) => s.trim()) : [],
      eligibility: formData.eligibility,
      notes: formData.notes
    }
    
    // Add to local state
    setLocalResources(prev => [...prev, newResource])
    
    // Try to add to Google Sheets if enabled
    if (isGoogleSheetsEnabled()) {
      try {
        await addResourceToSheets({
          ...newResource,
          services: formData.services,
          addedBy: user?.email || 'Portal User',
          dateAdded: new Date().toISOString()
        })
        setSyncStatus('Resource added and synced to Google Sheets ✓')
        setTimeout(() => setSyncStatus(''), 3000)
      } catch (error) {
        console.error('Failed to sync to Google Sheets:', error)
        setSyncStatus('Resource added locally (sync failed)')
        setTimeout(() => setSyncStatus(''), 3000)
      }
    } else {
      setSyncStatus('Resource added locally ✓')
      setTimeout(() => setSyncStatus(''), 3000)
    }
  }
  
  // Handler for Google Sheets sync
  const handleGoogleSheetsSync = async () => {
    if (!isGoogleSheetsEnabled()) {
      alert('Google Sheets integration not configured. See GOOGLE_SHEETS_SETUP.md for setup instructions.')
      return
    }
    
    setIsSyncing(true)
    setSyncStatus('Syncing with Google Sheets...')
    
    try {
      const result = await syncWithGoogleSheets(localResources)
      
      if (result.success) {
        setLocalResources(result.merged)
        setLastSyncTime(new Date())
        setSyncStatus(`Sync complete! Added: ${result.added}, Updated: ${result.updated}, Conflicts: ${result.conflicts}`)
        setTimeout(() => setSyncStatus(''), 5000)
      }
    } catch (error) {
      console.error('Sync failed:', error)
      setSyncStatus('Sync failed. Please check your configuration.')
      setTimeout(() => setSyncStatus(''), 5000)
    } finally {
      setIsSyncing(false)
    }
  }

  const filteredResources = localResources.filter(resource => {
    const matchesCategory = selectedCategory === 'All Resources' || resource.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      resource.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.city.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesCategory && matchesSearch
  })

  const getCategoryCount = (category: string) => {
    if (category === 'All Resources') return localResources.length
    return localResources.filter(r => r.category === category).length
  }

  const handleWebSearch = () => {
    if (webSearchQuery) {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(webSearchQuery + ' San Diego low income resources')}`
      window.open(searchUrl, '_blank')
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'SUD Rehabilitation': return '💊'
      case 'Food Pantries': return '🍎'
      case 'Legal Aid': return '⚖️'
      case 'Shelters/Programs': return '🏠'
      case 'Storage Facilities': return '📦'
      case 'Mailing Services': return '✉️'
      case 'Medi-Cal Providers': return '🏥'
      case 'Mental Health': return '🧠'
      case 'Clothing Resources': return '👔'
      default: return '📚'
    }
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const expandAll = () => {
    const categories = RESOURCE_CATEGORIES.filter(c => c !== 'All Resources')
    setExpandedCategories(categories)
  }

  const collapseAll = () => {
    setExpandedCategories([])
  }

  const getResourcesByCategory = (category: string) => {
    return localResources.filter(r => r.category === category)
  }

  const handleAddCustomKPI = () => {
    if (newKPI.title && newKPI.value) {
      const kpi: CustomKPI = {
        id: Date.now().toString(),
        title: newKPI.title,
        value: newKPI.value,
        icon: newKPI.icon || '📊',
        color: newKPI.color || 'brand',
        trend: newKPI.trend
      }
      setCustomKPIs([...customKPIs, kpi])
      setNewKPI({ color: 'brand', icon: '📊' })
      setShowCustomKPIModal(false)
    }
  }

  const handleDeleteCustomKPI = (id: string) => {
    setCustomKPIs(customKPIs.filter(kpi => kpi.id !== id))
  }

  const colorOptions: Array<{ value: CustomKPI['color'], label: string, sample: string }> = [
    { value: 'brand', label: 'Brand Blue', sample: 'bg-brand' },
    { value: 'brand2', label: 'Teal', sample: 'bg-brand2' },
    { value: 'accent', label: 'Purple', sample: 'bg-accent' },
    { value: 'green', label: 'Green', sample: 'bg-green-500' },
    { value: 'yellow', label: 'Yellow', sample: 'bg-yellow-500' },
    { value: 'red', label: 'Red', sample: 'bg-red-500' }
  ]

  const iconOptions = ['📊', '📈', '📉', '💰', '👥', '⭐', '🎯', '✅', '⚡', '🔥', '💡', '🏆', '📚', '🎓', '💼', '🏠', '❤️', '🌟']


  return (
    <div className="min-h-screen bg-bg">
      <PortalHeader />
      
      <main className="mx-auto max-w-7xl px-6 pt-24 pb-16">
        {/* Header */}

        {/* Custom KPI Cards */}
        {customKPIs.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text">My Custom Metrics</h3>
              <Button variant="outline" onClick={() => setShowCustomKPIModal(true)} className="text-xs">
                + Add Metric
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {customKPIs.map((kpi) => (
                <div key={kpi.id} className="relative group">
                  <KPICard
                    title={kpi.title}
                    value={kpi.value}
                    icon={kpi.icon}
                    color={kpi.color}
                    trend={kpi.trend}
                  />
                  <button
                    onClick={() => handleDeleteCustomKPI(kpi.id)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 flex items-center justify-center text-xs"
                    title="Delete metric"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Custom KPI Button */}
        {customKPIs.length === 0 && (
          <div className="glass rounded-xl p-6 mb-8 text-center">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-text mb-2">Track Your Own Metrics</h3>
            <p className="text-muted mb-4">Create custom KPI cards to track what matters most to you</p>
            <Button variant="primary" onClick={() => setShowCustomKPIModal(true)}>
              + Create Custom Metric
            </Button>
          </div>
        )}

        {/* Custom KPI Modal */}
        {showCustomKPIModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-panel border border-border rounded-xl shadow-2xl w-full max-w-2xl">
              <div className="p-6 border-b border-border">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-text">Create Custom Metric</h2>
                  <button onClick={() => setShowCustomKPIModal(false)} className="text-muted hover:text-text text-2xl">&times;</button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted mb-2">Metric Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Clients Served Today"
                    value={newKPI.title || ''}
                    onChange={(e) => setNewKPI({ ...newKPI, title: e.target.value })}
                    className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted mb-2">Value</label>
                  <input
                    type="text"
                    placeholder="e.g., 42 or 95%"
                    value={newKPI.value || ''}
                    onChange={(e) => setNewKPI({ ...newKPI, value: e.target.value })}
                    className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted mb-2">Icon</label>
                  <div className="grid grid-cols-9 gap-2">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setNewKPI({ ...newKPI, icon })}
                        className={`p-3 text-2xl rounded-lg border transition-all ${
                          newKPI.icon === icon
                            ? 'border-brand bg-brand/10'
                            : 'border-border hover:border-brand/40'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted mb-2">Color</label>
                  <div className="grid grid-cols-3 gap-3">
                    {colorOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setNewKPI({ ...newKPI, color: option.value })}
                        className={`p-3 rounded-lg border flex items-center gap-3 transition-all ${
                          newKPI.color === option.value
                            ? 'border-brand bg-brand/10'
                            : 'border-border hover:border-brand/40'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded ${option.sample}`}></div>
                        <span className="text-text text-sm">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-muted/5 rounded-lg">
                  <label className="flex items-center gap-3 mb-3">
                    <input
                      type="checkbox"
                      checked={!!newKPI.trend}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewKPI({ ...newKPI, trend: { value: 0, label: '', isPositive: true } })
                        } else {
                          setNewKPI({ ...newKPI, trend: undefined })
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-text font-medium">Add Trend Indicator</span>
                  </label>

                  {newKPI.trend && (
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <label className="block text-xs text-muted mb-1">Trend Value</label>
                        <input
                          type="number"
                          placeholder="e.g., 12"
                          value={newKPI.trend.value || ''}
                          onChange={(e) => setNewKPI({
                            ...newKPI,
                            trend: { ...newKPI.trend!, value: Number(e.target.value) }
                          })}
                          className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-text text-sm focus:ring-2 focus:ring-brand focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted mb-1">Trend Label</label>
                        <input
                          type="text"
                          placeholder="e.g., vs last week"
                          value={newKPI.trend.label || ''}
                          onChange={(e) => setNewKPI({
                            ...newKPI,
                            trend: { ...newKPI.trend!, label: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-text text-sm focus:ring-2 focus:ring-brand focus:outline-none"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={newKPI.trend.isPositive}
                            onChange={(e) => setNewKPI({
                              ...newKPI,
                              trend: { ...newKPI.trend!, isPositive: e.target.checked }
                            })}
                            className="w-4 h-4"
                          />
                          <span className="text-text text-sm">Positive trend (green arrow up)</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-border flex justify-end gap-4">
                <Button variant="outline" onClick={() => setShowCustomKPIModal(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleAddCustomKPI}
                  disabled={!newKPI.title || !newKPI.value}
                >
                  Create Metric
                </Button>
              </div>
            </div>
          </div>
        )}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">Community Resources</h1>
          <p className="text-muted">Low/No Income Resources - Contact Information & Services</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <KPICard
            title="Total Resources"
            value={MOCK_RESOURCES.length}
            icon="📚"
            color="brand"
          />
          <KPICard
            title="Categories"
            value="9"
            icon="📂"
            color="brand2"
          />
          <KPICard
            title="24/7 Services"
            value="5"
            icon="🕐"
            color="accent"
          />
          <KPICard
            title="Free Services"
            value="12"
            icon="✓"
            color="green"
          />
        </div>

        {/* Custom KPI Cards Section */}
        {customKPIs.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text">My Custom Metrics</h3>
              <Button variant="outline" onClick={() => setShowCustomKPIModal(true)} className="text-xs">
                + Add Metric
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {customKPIs.map((kpi) => (
                <div key={kpi.id} className="relative group">
                  <KPICard
                    title={kpi.title}
                    value={kpi.value}
                    icon={kpi.icon}
                    color={kpi.color}
                    trend={kpi.trend}
                  />
                  <button
                    onClick={() => handleDeleteCustomKPI(kpi.id)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 flex items-center justify-center text-xs"
                    title="Delete metric"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Custom KPI Prompt */}
        {customKPIs.length === 0 && (
          <div className="glass rounded-xl p-6 mb-8 text-center">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-text mb-2">Track Your Own Metrics</h3>
            <p className="text-muted mb-4">Create custom KPI cards to track what matters most to you</p>
            <Button variant="primary" onClick={() => setShowCustomKPIModal(true)}>
              + Create Custom Metric
            </Button>
          </div>
        )}

        {/* Custom KPI Creation Modal */}
        {showCustomKPIModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-panel border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-border">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-text">Create Custom Metric</h2>
                  <button onClick={() => setShowCustomKPIModal(false)} className="text-muted hover:text-text text-2xl">&times;</button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted mb-2">Metric Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Clients Served Today"
                    value={newKPI.title || ''}
                    onChange={(e) => setNewKPI({ ...newKPI, title: e.target.value })}
                    className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted mb-2">Value</label>
                  <input
                    type="text"
                    placeholder="e.g., 42 or 95%"
                    value={newKPI.value || ''}
                    onChange={(e) => setNewKPI({ ...newKPI, value: e.target.value })}
                    className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted mb-2">Icon</label>
                  <div className="grid grid-cols-9 gap-2">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setNewKPI({ ...newKPI, icon })}
                        className={`p-3 text-2xl rounded-lg border transition-all ${
                          newKPI.icon === icon
                            ? 'border-brand bg-brand/10'
                            : 'border-border hover:border-brand/40'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted mb-2">Color</label>
                  <div className="grid grid-cols-3 gap-3">
                    {colorOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setNewKPI({ ...newKPI, color: option.value })}
                        className={`p-3 rounded-lg border flex items-center gap-3 transition-all ${
                          newKPI.color === option.value
                            ? 'border-brand bg-brand/10'
                            : 'border-border hover:border-brand/40'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded ${option.sample}`}></div>
                        <span className="text-text text-sm">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-muted/5 rounded-lg">
                  <label className="flex items-center gap-3 mb-3">
                    <input
                      type="checkbox"
                      checked={!!newKPI.trend}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewKPI({ ...newKPI, trend: { value: 0, label: '', isPositive: true } })
                        } else {
                          setNewKPI({ ...newKPI, trend: undefined })
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-text font-medium">Add Trend Indicator</span>
                  </label>

                  {newKPI.trend && (
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <label className="block text-xs text-muted mb-1">Trend Value</label>
                        <input
                          type="number"
                          placeholder="e.g., 12"
                          value={newKPI.trend.value || ''}
                          onChange={(e) => setNewKPI({
                            ...newKPI,
                            trend: { ...newKPI.trend!, value: Number(e.target.value) }
                          })}
                          className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-text text-sm focus:ring-2 focus:ring-brand focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted mb-1">Trend Label</label>
                        <input
                          type="text"
                          placeholder="e.g., vs last week"
                          value={newKPI.trend.label || ''}
                          onChange={(e) => setNewKPI({
                            ...newKPI,
                            trend: { ...newKPI.trend!, label: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-text text-sm focus:ring-2 focus:ring-brand focus:outline-none"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={newKPI.trend.isPositive}
                            onChange={(e) => setNewKPI({
                              ...newKPI,
                              trend: { ...newKPI.trend!, isPositive: e.target.checked }
                            })}
                            className="w-4 h-4"
                          />
                          <span className="text-text text-sm">Positive trend (green arrow up)</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-border flex justify-end gap-4">
                <Button variant="outline" onClick={() => setShowCustomKPIModal(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleAddCustomKPI}
                  disabled={!newKPI.title || !newKPI.value}
                >
                  Create Metric
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Search Tabs */}
        <div className="glass rounded-xl p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setSearchType('internal')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                searchType === 'internal'
                  ? 'bg-brand text-white'
                  : 'bg-bg text-muted hover:text-text'
              }`}
            >
              🔍 Internal Database
            </button>
            <button
              onClick={() => setSearchType('web')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                searchType === 'web'
                  ? 'bg-brand text-white'
                  : 'bg-bg text-muted hover:text-text'
              }`}
            >
              🌐 Web Search
            </button>
          </div>

          {searchType === 'internal' ? (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Search resources by name, service, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-text placeholder-muted focus:ring-2 focus:ring-brand focus:outline-none"
              />
              <div className="flex items-center gap-2 text-sm text-muted">
                <span>Showing {filteredResources.length} results</span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-brand hover:text-brand2 underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Search the web for additional resources..."
                  value={webSearchQuery}
                  onChange={(e) => setWebSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleWebSearch()}
                  className="flex-1 px-4 py-3 bg-bg border border-border rounded-lg text-text placeholder-muted focus:ring-2 focus:ring-brand focus:outline-none"
                />
                <Button variant="primary" onClick={handleWebSearch}>
                  Search Google
                </Button>
              </div>
              <p className="text-sm text-muted">
                💡 Searches will open in a new tab with "San Diego low income resources" added automatically
              </p>
            </div>
          )}
        </div>

        {/* Category Filter */}
        {searchType === 'internal' && (
          <div className="glass rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text">Resource Categories</h3>
              <div className="flex gap-2">
                <Button 
                  variant="primary" 
                  onClick={() => setShowAddResourceModal(true)}
                  className="text-sm"
                >
                  ➕ Add Resource
                </Button>
                {isGoogleSheetsEnabled() && (
                  <Button 
                    variant="outline" 
                    onClick={handleGoogleSheetsSync}
                    disabled={isSyncing}
                    className="text-sm"
                  >
                    {isSyncing ? '🔄 Syncing...' : '☁️ Sync'}
                  </Button>
                )}
                <Button variant="ghost" onClick={expandAll} className="text-xs">
                  Expand All
                </Button>
                <Button variant="ghost" onClick={collapseAll} className="text-xs">
                  Collapse All
                </Button>
              </div>
            </div>
            
            {/* Sync Status */}
            {syncStatus && (
              <div className="mb-4 p-3 bg-brand/10 border border-brand/30 rounded-lg">
                <p className="text-sm text-brand">{syncStatus}</p>
              </div>
            )}
            
            <div className="space-y-4">
              {RESOURCE_CATEGORIES.filter(c => c !== 'All Resources').map((category) => {
                const categoryResources = getResourcesByCategory(category)
                const isExpanded = expandedCategories.includes(category)
                const matchesSearch = searchQuery === '' || categoryResources.some(resource => 
                  resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  resource.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
                  resource.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  resource.city.toLowerCase().includes(searchQuery.toLowerCase())
                )

                if (!matchesSearch) return null

                const visibleResources = searchQuery === '' 
                  ? categoryResources 
                  : categoryResources.filter(resource =>
                      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      resource.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
                      resource.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      resource.city.toLowerCase().includes(searchQuery.toLowerCase())
                    )

                return (
                  <div key={category} className="glass rounded-xl overflow-hidden border border-border hover:border-brand/40 transition-all">
                    {/* Category Header - Acts as KPI Card */}
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full p-6 flex items-center justify-between hover:bg-brand/5 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{getCategoryIcon(category)}</div>
                        <div className="text-left">
                          <h3 className="text-xl font-semibold text-text">{category}</h3>
                          <p className="text-sm text-muted mt-1">
                            {visibleResources.length} {visibleResources.length === 1 ? 'resource' : 'resources'} available
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-3xl font-bold text-brand">{visibleResources.length}</div>
                          <div className="text-xs text-muted uppercase">Services</div>
                        </div>
                        <div className={`text-2xl transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                          ▼
                        </div>
                      </div>
                    </button>

                    {/* Expanded Resources List */}
                    {isExpanded && (
                      <div className="border-t border-border bg-bg/50">
                        <div className="p-6 space-y-4">
                          {visibleResources.map((resource) => (
                            <div key={resource.id} className="glass rounded-lg p-5 hover:border-brand/40 transition-all">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h4 className="text-lg font-semibold text-text mb-1">{resource.name}</h4>
                                  {resource.website && (
                                    <a
                                      href={resource.website}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-brand hover:text-brand2 underline"
                                    >
                                      🌐 Visit Website
                                    </a>
                                  )}
                                </div>
                              </div>

                              <div className="grid md:grid-cols-2 gap-6 mb-4">
                                {/* Contact Information */}
                                <div className="space-y-3">
                                  <h5 className="text-xs font-semibold text-muted uppercase mb-3">Contact Information</h5>
                                  <div className="flex items-center gap-3 text-text text-sm">
                                    <span className="text-brand">📞</span>
                                    <a href={`tel:${resource.phone}`} className="hover:text-brand transition-colors">
                                      {resource.phone}
                                    </a>
                                  </div>
                                  {resource.email && (
                                    <div className="flex items-center gap-3 text-text text-sm">
                                      <span className="text-brand">✉️</span>
                                      <a href={`mailto:${resource.email}`} className="hover:text-brand transition-colors">
                                        {resource.email}
                                      </a>
                                    </div>
                                  )}
                                  <div className="flex items-start gap-3 text-text text-sm">
                                    <span className="text-brand">📍</span>
                                    <div>
                                      <div>{resource.address}</div>
                                      <div className="text-muted text-xs">{resource.city}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 text-text text-sm">
                                    <span className="text-brand">🕐</span>
                                    <span>{resource.hours}</span>
                                  </div>
                                </div>

                                {/* Services & Eligibility */}
                                <div className="space-y-3">
                                  <h5 className="text-xs font-semibold text-muted uppercase mb-3">Services Offered</h5>
                                  <div className="flex flex-wrap gap-2">
                                    {resource.services.map((service, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2 py-1 bg-brand2/10 text-brand2 text-xs rounded-full"
                                      >
                                        {service}
                                      </span>
                                    ))}
                                  </div>
                                  {resource.eligibility && (
                                    <div className="mt-3">
                                      <h5 className="text-xs font-semibold text-muted uppercase mb-2">Eligibility</h5>
                                      <p className="text-text text-xs">{resource.eligibility}</p>
                                    </div>
                                  )}
                                  {resource.notes && (
                                    <div className="mt-3 p-2 bg-accent/5 border border-accent/20 rounded-lg">
                                      <p className="text-accent text-xs">💡 {resource.notes}</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Quick Actions */}
                              <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                                <Button
                                  variant="ghost"
                                  className="text-xs py-1 px-3"
                                  onClick={() => {
                                    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(resource.address + ', ' + resource.city)}`
                                    window.open(mapUrl, '_blank')
                                  }}
                                >
                                  🗺️ Directions
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  className="text-xs py-1 px-3"
                                  onClick={() => window.location.href = `tel:${resource.phone}`}
                                >
                                  📞 Call
                                </Button>
                                {resource.email && (
                                  <Button 
                                    variant="ghost" 
                                    className="text-xs py-1 px-3"
                                    onClick={() => window.location.href = `mailto:${resource.email}`}
                                  >
                                    ✉️ Email
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* No Results Message */}
            {filteredResources.length === 0 && searchQuery && (
              <div className="glass rounded-xl p-12 text-center mt-8">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-text mb-2">No resources found</h3>
                <p className="text-muted mb-4">Try adjusting your search</p>
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        )}
        
        {/* Add Resource Modal */}
        <AddResourceModal 
          isOpen={showAddResourceModal}
          onClose={() => setShowAddResourceModal(false)}
          onSave={handleAddResource}
        />
      </main>
    </div>
  )
}
