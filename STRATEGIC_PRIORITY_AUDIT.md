# T.O.O.L.S Inc - Strategic Priority Audit & Roadmap
## Justice-Involved User Needs Assessment (Feb 2026)

---

## Executive Summary
To win competitive reentry grants and become the default portal for case managers and parole officers in San Diego, T.O.O.L.S Inc must address **10 critical gaps** that currently block 70%+ of the primary audience.

**Primary Audience Profile:**
- 70%+ access via smartphone (prepaid or government-issued)
- Limited data plans (<2GB/month)
- High stress, low bandwidth for complexity
- First 72 hours post-release are **make or break**
- Privacy concerns (fear of law enforcement surveillance)

---

## CRITICAL FINDINGS

### ✅ Current Strengths
- **Mobile-first Tailwind setup** (responsive breakpoints in place)
- **First Steps Checklist** (72-hour timeline exists - needs UI polish)
- **Role-based routing** (Client, Case Manager, Admin portals)
- **Dark theme** (accessible for users with sensitivity to bright screens)
- **Emergency resources** (211, 988, crisis numbers included)

### ❌ Critical Gaps

#### 1. **Mobile Responsiveness** (BLOCKER - 70%+ of users)
**Status:** Partially complete  
**Issue:** Sidebar menus & data tables may not collapse correctly on mobile
- Admin portal sidebar may overflow on small screens
- Case manager resources table lacks mobile card layout
- Forms need mobile-optimized spacing
**Impact:** Users abandon site assuming it's "broken"
**Fix Timeline:** 2-3 days
**Priority:** 🔴 CRITICAL

#### 2. **Portal Redirect Speed** (BLOCKER - Auth handoff > 3 seconds)
**Status:** Unknown (no load testing)
**Issue:** High-security redirects (OAuth, Supabase, Azure AD) may timeout
- Currently configured but untested under real conditions
**Impact:** Users perceive portal as broken
**Fix Timeline:** 1 day (load testing + optimization)
**Priority:** 🔴 CRITICAL

#### 3. **"Day One" Dashboard** (MISSING)
**Status:** First Steps Checklist exists, but not as interactive dashboard
**Issue:** Users see static checklist instead of actionable dashboard
**Expected:** Interactive checklist with:
- ✓ Checkboxes for: Get ID, Secure Meal, Transit Pass
- 📍 Real-time location links to San Diego resources
- ⏱️ "72-hour timer" showing urgency
- 🎯 Progress tracking (2/7 complete, etc.)
**Impact:** Without this, users don't engage = no data for grant reports
**Fix Timeline:** 3-5 days
**Priority:** 🔴 CRITICAL (required for grant success)

#### 4. **Low-Bandwidth "Lite" Version** (MISSING)
**Status:** Not implemented
**Issue:** Many users have < 2GB data plans; portal loads heavy images & animations
**Expected Features:**
- Text-only mode toggle
- Asset lazy-loading/compression
- Lite CSS without Framer Motion animations
- WhatsApp integration for text-based resource queries
**Impact:** Portal unusable on weak signal = lost users in the field
**Fix Timeline:** 4-7 days
**Priority:** 🟠 HIGH

#### 5. **Progress Tracker + Certificates** (MISSING)
**Status:** Dashboard has basic progress; no certificate upload
**Issue:** Can't track "days of success," upload certificates, or share with case managers
**Expected Features:**
- Private profile with uploaded certificates/achievements
- "Days since release" counter
- "Miles traveled" metric (behavioral milestones)
- Share progress with case manager (private link)
- Export progress report for parole officer
**Impact:** No recidivism data = harder to win competitive grants
**Fix Timeline:** 5-7 days
**Priority:** 🟠 HIGH

#### 6. **"Verified Reentry Graduate" Badge** (MISSING)
**Status:** Not implemented
**Issue:** Employers/landlords have no way to verify program completion
**Expected Features:**
- Verified badge system (employer/landlord portal section)
- "Fair Chance" employer directory (San Diego-specific)
- One-click verification of user completion
- Partner integration (employers can view badge)
**Impact:** Competitive edge over other reentry portals; drives funding
**Fix Timeline:** 5-7 days
**Priority:** 🟠 HIGH

#### 7. **Spanish Language Support** (MISSING)
**Status:** Not implemented (no localization)
**Issue:** San Diego has massive demand for Spanish; only English available
**Expected:** Full portal translation to Spanish (es-MX, es-ES)
- Toggle in top-right (flag icon)
- All text, forms, resources translated
- Spanish-language resource directory
- SMS support in Spanish
**Impact:** Blocks 30%+ of San Diego population
**Fix Timeline:** 7-10 days (translation + QA)
**Priority:** 🟠 HIGH

#### 8. **WCAG 2.1 Accessibility** (BLOCKER - Grant requirement)
**Status:** Partial compliance
**Issues:**
- Color contrast may fail in some areas (dark theme on glass backgrounds)
- Screen reader support incomplete (missing ARIA labels)
- Keyboard navigation not fully tested
- No high-contrast mode toggle
**Required for:** Most federal/state reentry grants
**Fix Timeline:** 3-5 days
**Priority:** 🔴 CRITICAL

#### 9. **Privacy & Security Statement** (CRITICAL)
**Status:** Not implemented
**Issue:** Justice-involved users fear law enforcement access to data
**Expected:** Prominent banner stating:
- "Your data is encrypted (SSL/TLS)"
- "We do NOT share your data with law enforcement without your explicit consent"
- Privacy policy with data retention & deletion options
**Impact:** Trust issue = users won't enter real data
**Fix Timeline:** 1 day
**Priority:** 🔴 CRITICAL

#### 10. **Broken Link Audit** (OPERATIONAL)
**Status:** Not completed
**Issue:** External redirects to San Diego County departments, DA, Probation may 404
**Current Resources to Test:**
- San Diego County DA office
- Probation department links
- CalFresh/Benefits portals
- Job centers
- Housing agencies
**Impact:** Trust damage if links don't work
**Fix Timeline:** 1 day
**Priority:** 🟡 MEDIUM

---

## Implementation Roadmap

### **Phase 1: Critical Fixes (Weeks 1-2)**
- [ ] Mobile responsiveness audit & fixes
- [ ] Portal redirect speed testing + optimization
- [ ] Privacy statement implementation
- [ ] Broken link audit
- [ ] WCAG 2.1 contrast & screen reader fixes

**Deliverable:** Production-ready, accessible platform

### **Phase 2: User Experience (Weeks 3-4)**
- [ ] "Day One" Dashboard with 72-hour checklist
- [ ] Progress Tracker MVP (basic milestone tracking)
- [ ] Spanish language toggle (core pages only)

**Deliverable:** Interactive, engaging first-time user experience

### **Phase 3: Competitive Differentiation (Weeks 5-6)**
- [ ] Full Spanish localization (all pages)
- [ ] "Verified Reentry Graduate" badge system
- [ ] Low-bandwidth Lite version
- [ ] Advanced Progress Tracker (certificate uploads, sharing)

**Deliverable:** Market-leading features for grant applications

### **Phase 4: Integration & Analytics (Weeks 7-8)**
- [ ] WhatsApp integration for Lite mode
- [ ] Employer/landlord portal for badge verification
- [ ] Data export for grant reporting
- [ ] Recidivism tracking dashboard (admin only)

**Deliverable:** Complete grant-winning platform

---

## Grant Success Metrics

### By End of Phase 2:
- ✅ 100% mobile compatible
- ✅ < 3 second auth handoff
- ✅ WCAG 2.1 AA compliant
- ✅ Privacy statement visible

### By End of Phase 3:
- ✅ 500+ active users (estimated from pilot)
- ✅ Spanish language support (top 10 pages)
- ✅ Progress tracking (basic)
- ✅ Zero 404 errors on external links

### By End of Phase 4:
- ✅ Recidivism data collection (3-6 month pilot)
- ✅ Verified badge adoption by 5+ employers
- ✅ Case manager testimonials (quantified outcomes)
- ✅ Grant application ready for:
  - **Second Chance Act funding** (federal)
  - **California Department of Corrections grants**
  - **San Diego County Justice Reinvestment**

---

## Budget & Resource Needs

### Development
- **Phase 1-2:** 80 hours (1 senior dev + 1 junior)
- **Phase 3:** 120 hours (internationalization + Spanish QA)
- **Phase 4:** 100 hours (integrations + analytics)
- **Total:** ~300 hours (~$15K-20K @ $50-70/hr)

### Translation
- Spanish localization: 20 hours (~$2K professional translation)

### Testing
- Mobile device testing: 16 hours
- Accessibility audit: 16 hours
- Load testing: 8 hours
- **Total:** 40 hours (~$2K)

**Total Investment:** ~$20K-25K (phased over 8 weeks)

---

## Key Questions for Stakeholders

1. **Which grant opportunity are we targeting first?** (Second Chance Act, state, or county?)
2. **What's the timeline for the first grant application?** (Q1, Q2, Q3 2026?)
3. **Who is the primary case manager/partner for user testing?** (Father Joe's, PATH, etc?)
4. **Should we hire a Spanish translator or use AI + QA?**
5. **Do we have baseline data on current user retention?** (abandonment rate?)

---

## Success Stories to Build

Once complete, T.O.O.L.S Inc will offer:

✅ **First responder in digital space** - Case managers see T.O.O.L.S as default
✅ **72-hour retention** - Users stay engaged through critical first 3 days
✅ **Data-driven outcomes** - Quantified recidivism reduction for grant reports
✅ **Accessibility leader** - Spanish + WCAG compliance vs competitors
✅ **Employer bridge** - "Verified Reentry Graduate" badge drives hiring
✅ **Low-bandwidth proof** - Works in field without WiFi vs competitors
✅ **Privacy first** - Clear data protection builds trust

---

## Next Steps

1. ✅ **Approve this audit** (stakeholder sign-off)
2. **Assign Phase 1 sprint** (2 weeks, starting Monday)
3. **Set up grant timeline** (contact foundation program officers)
4. **Recruit case manager partners** (user testing cohort)
5. **Secure translation budget** (Spanish QA sign-off)

---

*Document Version: 1.0*  
*Last Updated: February 2, 2026*  
*Prepared for: T.O.O.L.S Inc Leadership & Grant Committee*
