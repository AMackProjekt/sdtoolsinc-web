# T.O.O.L.S. Inc. Individual Service Navigation — methods & attribution

## Product boundary
An independently authored service-navigation and staff-report workflow, developed for T.O.O.L.S. Inc. clients. This is **not** George Mason University's ACE CJ-TRAK, the GAIN Short Screener, a validated risk assessment instrument, or a predictor of recidivism.

## Inspiration and references
- **Center for Advancing Correctional Excellence (ACE!), George Mason University** — CJ-TRAK / Risk-Need-Responsivity (RNR) Simulation Tool. The tool's report organizes needs, strengths, recommended programming, and target behaviors: https://tools.gmuace.org/assessindividual.php and https://www.gmuace.org/major-projects/rnr-simulation-tool/
- **GAIN Short Screener**, originally developed by Dennis, Feeney, Stevens & Bedoya (2006), viewed on the ACE Tools website *used with permission*. Exact GAIN items, proprietary algorithms, and GAIN scores are not reproduced. Use of the validated screener requires independent permission, training, and conditions set by its owner: https://tools.gmuace.org/gaintool.php
- **US Department of Labor**, *The Use of Risk/Needs Assessments in Reentry Services*: https://www.dol.gov/sites/dolgov/files/ETA/publications/ETAOP_2023-13_Using_Risk_Needs_Assessments_in_Reentry_Services.pdf
- **Bureau of Justice Assistance**, *Structured Decision-Making* (principles of matching appropriate programming and examining service gaps): https://bja.ojp.gov/sites/bja/files/media/document/pd-structured-decisionmaking.pdf

## Attribution and intellectual property
The **format concept** of displaying needs, strengths, recommended programming, and case goals was inspired by the above research and public references. Question prompts, the deterministic service-match logic, program descriptions, code and report layout in this repository are original T.O.O.L.S. work. We do not use the ACE instrument name as a certification, reproduce its numerical risk model, or assert endorsement by ACE/GMU. The original ACE page displays a **CC BY-NC 3.0** notice; attribution is not by itself permission to use a noncommercial instrument commercially. Ask the rights holder before incorporating verbatim ACE or GAIN items or proprietary scoring in a public/commercial product.

## Transparent matching
`lib/intake/service-matcher.ts` identifies services based on explicit requested support and self-reported practical barriers. Ordering means **service urgency**, not criminal risk. Housing instability may be immediate; limited transit, missing ID and current job search may be priority. Recorded strengths and DocuReady completion are labeled self-reported. The result always requires staff review. No demographics determine priority, admission, or eligibility. No criminal-offense classification is exposed to clients or used for automated denial.

## Staff reporting
The staff-only presentation `components/ui/EligibilityStaffReport.tsx` supports needs, strengths, actionable recommendations and review disposition. The report should only be mounted after server-side identity + role + record access checks. The component itself is not an access control boundary; a protected data API and audited, encrypted storage must be built and independently verified first.

## Not implemented or validated
No live submission, no confidentiality assurance from an encrypted storage deployment, no authenticated staff inbox, no PDF generation service, no GAIN scoring or recidivism prediction, and no end-to-end integration test. Do not accept real applicant information or mount the internal report on a public route until backend security and data retention are approved.
