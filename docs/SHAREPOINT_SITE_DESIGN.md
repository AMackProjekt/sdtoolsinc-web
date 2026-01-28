# T.O.O.L.S Inc SharePoint Site Design

## Site Structure

### Home Page
**Template**: Communication Site / Team Site
**URL**: https://[tenant].sharepoint.com/sites/toolsinc

---

## Page Layout & Content

### 1. Hero Section
**Web Part**: Hero Web Part (Full Width)

**Content**:
- **Title**: T.O.O.L.S Inc - Together Overcoming Obstacles and Limitations
- **Subtitle**: Empowering Justice-Involved Individuals Through Programs, Resources, and Support
- **Background Image**: /logos/main-logo.png (uploaded to Site Assets)
- **CTA Button 1**: "Submit Referral" → Link to referral form
- **CTA Button 2**: "Access Portal" → Link to portal hub

---

### 2. About Section
**Web Part**: Text Web Part

**Content**:
```
## Our Mission

T.O.O.L.S Inc (Together Overcoming Obstacles and Limitations) provides comprehensive support and resources for justice-involved individuals. Through programs, education, and community partnerships, we help people rebuild their lives and achieve lasting success.

### What We Do
- **Job Readiness Training** - Resume building, interview prep, and job placement
- **Educational Resources** - GED preparation, vocational training, life skills
- **Case Management** - Personalized support and progress tracking
- **Housing Assistance** - Finding stable housing and support services
- **Mental Health Support** - Counseling and wellness resources
```

---

### 3. Programs & Services
**Web Part**: Image & Text (4 columns)

**Cards**:

**Card 1: Job Readiness**
- Icon: 💼
- Title: Job Readiness Training
- Description: Resume building, interview preparation, and job placement assistance
- Link: Internal page or document

**Card 2: Education**
- Icon: 📚
- Title: Educational Resources
- Description: GED prep, vocational training, and skills development courses
- Link: Learning portal

**Card 3: Case Management**
- Icon: 👥
- Title: Case Management
- Description: Personalized support with dedicated case managers
- Link: Portal login

**Card 4: Support Services**
- Icon: 🤝
- Title: Community Support
- Description: Housing, mental health, and family reunification services
- Link: Resources page

---

### 4. Quick Links
**Web Part**: Quick Links (Compact Layout)

**Links**:
- 📝 Submit a Referral
- 🔐 Client Portal Login
- 👔 Case Manager Portal Login
- 🛡️ Admin Portal Login
- 📧 Contact Us
- 🤝 Partnership Opportunities
- 📊 Impact Dashboard
- 📰 Newsletter Signup

---

### 5. Statistics Dashboard
**Web Part**: Text Web Part with custom HTML

**Content**:
```html
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; text-align: center; color: white;">
    <div style="font-size: 48px; font-weight: bold; margin-bottom: 10px;">2,000+</div>
    <div style="font-size: 16px; opacity: 0.9;">Individuals Served</div>
  </div>
  <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; border-radius: 12px; text-align: center; color: white;">
    <div style="font-size: 48px; font-weight: bold; margin-bottom: 10px;">85%</div>
    <div style="font-size: 16px; opacity: 0.9;">Success Rate</div>
  </div>
  <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 30px; border-radius: 12px; text-align: center; color: white;">
    <div style="font-size: 48px; font-weight: bold; margin-bottom: 10px;">500+</div>
    <div style="font-size: 16px; opacity: 0.9;">Active Cases</div>
  </div>
  <div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 30px; border-radius: 12px; text-align: center; color: white;">
    <div style="font-size: 48px; font-weight: bold; margin-bottom: 10px;">50+</div>
    <div style="font-size: 16px; opacity: 0.9;">Partner Organizations</div>
  </div>
</div>
```

---

### 6. News & Updates
**Web Part**: News Web Part (Carousel or List)

**Setup**:
- Show 5 most recent posts
- Enable comments
- Link to full news page

---

### 7. Forms & Documents
**Web Part**: Document Library Web Part

**Libraries to Display**:
- Referral Forms
- Program Applications
- Resource Guides
- Policy Documents

---

### 8. Contact Information
**Web Part**: Text Web Part (2 columns)

**Column 1 - Contact**:
```
### Get In Touch

📧 **General Inquiries**
info@sdtoolsinc.org

📰 **Newsletter**
news@sdtoolsinc.org

🤝 **Partnerships**
partner@sdtoolsinc.org

📞 **Founder & CEO**
Donyale Mack
dmack@sdtoolsinc.org
+1 (619) 350-7638
```

**Column 2 - Office Hours**:
```
### Office Hours

**Monday - Friday**
9:00 AM - 5:00 PM PST

**Case Manager Availability**
By Appointment

**After Hours Support**
Emergency contact available
through case manager
```

---

### 9. Footer
**Web Part**: Text Web Part (Full Width)

**Content**:
```
---

© 2026 T.O.O.L.S Inc - Together Overcoming Obstacles and Limitations

[Privacy Policy](#) | [Terms of Service](#) | [Accessibility](#) | [Site Map](#)

501(c)(3) Non-Profit Organization
```

---

## Additional Pages

### Referral Page
**URL**: /sites/toolsinc/referral
**Template**: Modern Page

**Content**:
- Referral form (Microsoft Form or Power Apps)
- QR code for mobile access
- Instructions for referral agents
- Contact information

### Programs Page
**URL**: /sites/toolsinc/programs
**Template**: Modern Page

**Content**:
- Detailed program descriptions
- Eligibility requirements
- Enrollment process
- Success stories

### Resources Page
**URL**: /sites/toolsinc/resources
**Template**: Modern Page

**Content**:
- Document library
- External resource links
- Educational materials
- Community resources

### Impact Page
**URL**: /sites/toolsinc/impact
**Template**: Modern Page

**Content**:
- Success metrics
- Case studies
- Testimonials
- Annual reports

---

## Site Features to Enable

### 1. **Lists**
- **Referrals** - Track incoming referrals
- **Active Cases** - Case management tracking
- **Partners** - Partner organization directory
- **Events** - Upcoming events calendar

### 2. **Libraries**
- **Documents** - Forms, policies, resources
- **Images** - Logos, photos, graphics
- **Templates** - Standardized documents

### 3. **Apps**
- Microsoft Forms - Referral intake
- Power Apps - Case management interface
- Power BI - Analytics dashboard

### 4. **Permissions**
- **Visitors** - Public view only
- **Members** - Case managers, staff
- **Owners** - Administrators

---

## Branding & Theme

### Colors (from existing design)
- **Primary**: #38bdf8 (Sky Blue)
- **Secondary**: #2dd4bf (Teal)
- **Accent**: #a78bfa (Purple)
- **Background**: #06070b (Dark)
- **Text**: #f8fafc (Light)

### Logo
- Upload main-logo.png to Site Assets
- Set as site logo (Settings > Change the look > Header)

### Navigation
**Top Navigation**:
- Home
- Programs
- Resources
- About
- Contact
- Portals (with submenu)
  - Client Portal
  - Case Manager Portal
  - Admin Portal

---

## Setup Instructions

### Step 1: Create Site
1. Go to SharePoint Home
2. Click "+ Create site"
3. Select "Communication site"
4. Enter site details:
   - **Name**: T.O.O.L.S Inc
   - **Description**: Together Overcoming Obstacles and Limitations
   - **Language**: English
5. Click "Finish"

### Step 2: Apply Branding
1. Go to Settings (gear icon)
2. Select "Change the look"
3. Choose theme (or create custom)
4. Upload logo
5. Set header layout

### Step 3: Create Pages
1. Click "+ New" → "Page"
2. Choose template
3. Add web parts as outlined above
4. Publish when complete

### Step 4: Setup Navigation
1. Go to Settings → "Navigation"
2. Add top navigation links
3. Enable mega menu if desired
4. Save changes

### Step 5: Configure Permissions
1. Go to Settings → "Site permissions"
2. Set up security groups:
   - Public (Visitors)
   - Staff (Members)
   - Administrators (Owners)
3. Assign users to groups

### Step 6: Add Custom Formatting
1. Edit page
2. Add Text web parts with HTML
3. Use inline CSS for styling
4. Test responsiveness

---

## Integration with Existing Portals

### Embed Options

**Option 1: IFrame Embed**
```html
<iframe 
  src="https://your-portal-url.azurestaticapps.net" 
  width="100%" 
  height="800px" 
  frameborder="0"
  style="border: none; border-radius: 8px;"
></iframe>
```

**Option 2: Link Cards**
Use Quick Links web part to create branded portal access cards

**Option 3: Power Apps Embed**
Embed Power Apps for data integration with portals

---

## Microsoft Forms Integration

### Referral Form
1. Create form in Microsoft Forms
2. Questions:
   - Referent Information (Name, DOB, Contact)
   - Referral Agent Information
   - Program Interest
   - Background Information
   - Additional Notes
3. Get form link
4. Embed on Referral page

---

## Maintenance Schedule

- **Weekly**: Update news posts
- **Monthly**: Review analytics
- **Quarterly**: Update statistics
- **Annually**: Review content and branding

---

## Analytics & Insights

Enable:
- Page views tracking
- User engagement metrics
- Form submission analytics
- Document download tracking

Access: Site Settings → Site Analytics

---

## Mobile Optimization

- All web parts responsive by default
- Test on mobile devices
- Enable mobile app access
- QR codes for quick access

---

## Accessibility

- Alt text for all images
- Proper heading hierarchy
- High contrast support
- Screen reader compatible
- Keyboard navigation

---

## Backup & Version Control

- Enable versioning on all lists/libraries
- Regular site backups via SharePoint admin
- Document all customizations
- Maintain change log

