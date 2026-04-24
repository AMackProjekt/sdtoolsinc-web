export interface StaffMember {
  id: string;
  name: string;
  title: string;
  dept: string;
  status: "active" | "on-leave" | "terminated" | "onboarding";
  hire: string;
  email: string;
  phone: string;
  supervisor: string;
  type: "Full-time" | "Part-time" | "Contract";
  location: string;
  emergency_name: string;
  emergency_phone: string;
  emergency_rel: string;
}

export const STAFF_DATA: StaffMember[] = [
  { id: "s1", name: "Marcus Johnson",  title: "Case Manager II",      dept: "Client Services",  status: "active",     hire: "Mar 1, 2022",  email: "mjohnson@sdtoolsinc.org",  phone: "(619) 555-0101", supervisor: "Priya Sharma",    type: "Full-time", location: "Main Office", emergency_name: "Dana Johnson",   emergency_phone: "(619) 555-0901", emergency_rel: "Spouse"  },
  { id: "s2", name: "Priya Sharma",    title: "Program Coordinator",  dept: "Operations",       status: "active",     hire: "Jul 15, 2021", email: "psharma@sdtoolsinc.org",   phone: "(619) 555-0102", supervisor: "James Thornton",  type: "Full-time", location: "Main Office", emergency_name: "Raj Sharma",     emergency_phone: "(619) 555-0902", emergency_rel: "Parent"  },
  { id: "s3", name: "Devon Clarke",    title: "Intake Specialist",    dept: "Client Services",  status: "on-leave",   hire: "Jan 20, 2023", email: "dclarke@sdtoolsinc.org",   phone: "(619) 555-0103", supervisor: "Marcus Johnson",  type: "Full-time", location: "Main Office", emergency_name: "Tanya Clarke",   emergency_phone: "(619) 555-0903", emergency_rel: "Sibling" },
  { id: "s4", name: "Sandra Nguyen",   title: "Data Analyst",         dept: "Technology",       status: "active",     hire: "Sep 5, 2023",  email: "snguyen@sdtoolsinc.org",   phone: "(619) 555-0104", supervisor: "James Thornton",  type: "Full-time", location: "Remote",      emergency_name: "Lyn Nguyen",     emergency_phone: "(619) 555-0904", emergency_rel: "Parent"  },
  { id: "s5", name: "James Thornton",  title: "Finance Manager",      dept: "Finance",          status: "active",     hire: "May 10, 2020", email: "jthornton@sdtoolsinc.org", phone: "(619) 555-0105", supervisor: "Executive Dir.",  type: "Full-time", location: "Main Office", emergency_name: "Carol Thornton", emergency_phone: "(619) 555-0905", emergency_rel: "Spouse"  },
  { id: "s6", name: "Aaliyah Brooks",  title: "HR Generalist",        dept: "Human Resources",  status: "active",     hire: "Feb 12, 2024", email: "abrooks@sdtoolsinc.org",   phone: "(619) 555-0106", supervisor: "Priya Sharma",    type: "Full-time", location: "Main Office", emergency_name: "Kim Brooks",     emergency_phone: "(619) 555-0906", emergency_rel: "Parent"  },
  { id: "s7", name: "Tyler Reed",      title: "Support Specialist",   dept: "Client Services",  status: "onboarding", hire: "Jul 1, 2025",  email: "treed@sdtoolsinc.org",     phone: "(619) 555-0107", supervisor: "Marcus Johnson",  type: "Full-time", location: "Main Office", emergency_name: "Meg Reed",       emergency_phone: "(619) 555-0907", emergency_rel: "Parent"  },
  { id: "s8", name: "Fatima Ali",      title: "Case Manager I",       dept: "Client Services",  status: "onboarding", hire: "Jul 1, 2025",  email: "fali@sdtoolsinc.org",      phone: "(619) 555-0108", supervisor: "Marcus Johnson",  type: "Part-time", location: "Main Office", emergency_name: "Yusuf Ali",      emergency_phone: "(619) 555-0908", emergency_rel: "Spouse"  },
  { id: "s9", name: "Carlos Vega",     title: "Program Assistant",    dept: "Operations",       status: "onboarding", hire: "Aug 1, 2025",  email: "cvega@sdtoolsinc.org",     phone: "(619) 555-0109", supervisor: "Priya Sharma",    type: "Part-time", location: "Remote",      emergency_name: "Maria Vega",     emergency_phone: "(619) 555-0909", emergency_rel: "Parent"  },
  { id: "s10", name: "Naomi Luckett",  title: "Outreach Lead",        dept: "Outreach",         status: "active",     hire: "Jan 10, 2022", email: "nluckett@sdtoolsinc.org",  phone: "(619) 555-0110", supervisor: "Priya Sharma",    type: "Full-time", location: "Main Office", emergency_name: "Roy Luckett",    emergency_phone: "(619) 555-0910", emergency_rel: "Spouse"  },
];

export const DEPARTMENTS = ["All", "Client Services", "Operations", "Finance", "Technology", "Human Resources", "Outreach"];
