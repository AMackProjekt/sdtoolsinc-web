# Google Analytics Configuration

This project uses Google Analytics 4 (GA4) with privacy-first implementation.

## Environment Variable

Add your GA4 Measurement ID to your environment:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Getting Your Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property or select existing
3. Navigate to Admin → Data Streams
4. Select your web data stream
5. Copy the **Measurement ID** (starts with `G-`)

## Features

✅ **GDPR Compliant**
- Only loads when analytics cookies are accepted
- Anonymizes IP addresses automatically
- Respects cookie consent preferences

✅ **Privacy First**
- Integrates with existing CookieConsent component
- No tracking until user consent
- Updates consent dynamically

✅ **Next.js 14 Optimized**
- Uses Next.js Script component for optimal loading
- App Router compatible
- Automatic page view tracking

## Usage

### Basic Implementation

Already integrated in `app/layout.tsx` - no additional setup needed!

### Track Custom Events

```tsx
import { trackEvent } from "@/components/ui/GoogleAnalytics";

// Track button click
trackEvent("button_click", {
  button_name: "Sign Up",
  page: "/interest"
});

// Track form submission
trackEvent("form_submission", {
  form_name: "Referral Form",
  form_location: "/referral"
});

// Track video play
trackEvent("video_play", {
  video_title: "Launch Video",
  video_duration: 120
});
```

### Track Conversions

```tsx
import { trackConversion } from "@/components/ui/GoogleAnalytics";

// Track lead conversion
trackConversion("AW-CONVERSION-ID", 100);
```

### Track Page Views in Client Components

```tsx
"use client";
import { useGoogleAnalytics } from "@/components/ui/GoogleAnalytics";

export default function MyPage() {
  useGoogleAnalytics(); // Automatically tracks page views
  
  return <div>Content</div>;
}
```

## Event Examples

### Interest Form Submission
```tsx
trackEvent("generate_lead", {
  form_name: "Interest Form",
  form_location: "/interest"
});
```

### Referral Submission
```tsx
trackEvent("generate_lead", {
  form_name: "Referral Form",
  form_location: "/referral",
  referral_type: "case_management"
});
```

### Portal Registration
```tsx
trackEvent("sign_up", {
  method: "email",
  portal: "client"
});
```

### Course Enrollment
```tsx
trackEvent("course_enrollment", {
  course_name: "Job Readiness 101",
  course_category: "Employment"
});
```

### Resource Download
```tsx
trackEvent("file_download", {
  file_name: "Reentry Guide.pdf",
  file_type: "PDF"
});
```

## Recommended Events to Track

1. **Form Submissions**
   - Interest form
   - Referral form
   - Contact form
   - Partnership inquiry

2. **User Engagement**
   - Video plays
   - Course starts/completions
   - Resource downloads
   - Chat interactions

3. **Navigation**
   - Page views (automatic)
   - External link clicks
   - CTA button clicks

4. **Conversions**
   - Portal registrations
   - Program enrollments
   - Partnership applications

## Testing

### Development
```bash
# Add to .env.local
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Verify Installation
1. Open browser developer tools
2. Go to Console tab
3. Accept analytics cookies
4. Check for: `gtag('config', 'G-XXXXXXXXXX')`
5. Use Google Analytics Debugger Chrome extension

### Real-time Reports
1. Go to Google Analytics
2. Navigate to Reports → Realtime
3. Visit your site and check if events appear

## Privacy Compliance

✅ **GDPR Compliant**
- Requires explicit consent before tracking
- Anonymizes IP addresses
- Respects "Do Not Track" browser settings

✅ **CCPA Compliant**
- Allows users to opt-out via cookie preferences
- Clear disclosure in privacy policy

✅ **Cookie Notice**
- Integrated with existing CookieConsent component
- Granular consent controls
- Persistent preferences

## Troubleshooting

### Analytics Not Loading

**Issue:** Events not appearing in GA dashboard

**Solutions:**
1. Verify measurement ID is correct
2. Check browser console for errors
3. Ensure analytics cookies are accepted
4. Clear browser cache and cookies
5. Wait 24-48 hours for data to appear

### Consent Not Working

**Issue:** GA loads even when declined

**Solutions:**
1. Clear localStorage: `localStorage.clear()`
2. Check CookieConsent component is mounted
3. Verify consent preferences are saved
4. Test in incognito mode

### Duplicate Page Views

**Issue:** Page views tracked multiple times

**Solutions:**
1. Ensure `useGoogleAnalytics()` not called multiple times
2. Remove duplicate `GoogleAnalytics` components
3. Check for manual `gtag` calls

## Best Practices

1. ✅ **Always ask for consent** before tracking
2. ✅ **Use descriptive event names** (snake_case)
3. ✅ **Include relevant parameters** for context
4. ✅ **Test in development** before production
5. ✅ **Document custom events** in this file
6. ✅ **Review analytics regularly** to optimize
7. ✅ **Respect user privacy** at all times

## Resources

- [GA4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Next.js Analytics](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)
- [GDPR Compliance](https://support.google.com/analytics/answer/9019185)
- [Cookie Consent Guide](https://developers.google.com/tag-platform/security/guides/consent)
