# QR Code Generator Component Documentation

## Overview

The `QRCodeGenerator` component is a reusable React component that generates QR codes with built-in Google Analytics tracking and download functionality. It's designed to work seamlessly with the T.O.O.L.S Inc website's design system.

## Installation

The component is already integrated into the project. Required dependencies:
- `qrcode.react` - QR code generation
- `react-ga4` - Google Analytics tracking
- `framer-motion` - Animations

## Basic Usage

```tsx
import { QRCodeGenerator } from "@/components/ui/QRCodeGenerator";

function MyPage() {
  return (
    <QRCodeGenerator
      url="https://sdtoolsinc.org/interest"
      name="Interest Form"
      utmParams={{
        source: "qr_code",
        medium: "offline",
        campaign: "interest_form"
      }}
    />
  );
}
```

## Props API

### Required Props

#### `url: string`
The URL to encode in the QR code. This should be a valid absolute URL.

**Example:**
```tsx
url="https://sdtoolsinc.org/interest"
```

#### `name: string`
A descriptive name for the QR code, used for analytics tracking and download filenames.

**Example:**
```tsx
name="Interest Form"
```

### Optional Props

#### `utmParams: object`
UTM tracking parameters to append to the URL for Google Analytics.

**Properties:**
- `source?: string` - Campaign source (e.g., "qr_code")
- `medium?: string` - Campaign medium (e.g., "offline", "print")
- `campaign?: string` - Campaign name (e.g., "interest_form")
- `content?: string` - Campaign content
- `term?: string` - Campaign term

**Example:**
```tsx
utmParams={{
  source: "qr_code",
  medium: "offline",
  campaign: "interest_form",
  content: "poster_v1"
}}
```

**Resulting URL:**
```
https://sdtoolsinc.org/interest?utm_source=qr_code&utm_medium=offline&utm_campaign=interest_form&utm_content=poster_v1
```

#### `size: number`
QR code size in pixels. Default: `256`

**Example:**
```tsx
size={192}  // Smaller QR code
size={512}  // Larger QR code
```

#### `showDownload: boolean`
Whether to show the download button. Default: `true`

**Example:**
```tsx
showDownload={false}  // Hide download button
```

#### `className: string`
Additional CSS classes to apply to the container.

**Example:**
```tsx
className="my-4 mx-auto"
```

#### `fgColor: string`
QR code foreground color (hex format). Default: `"#000000"`

**Example:**
```tsx
fgColor="#1a1a1a"  // Dark gray
```

#### `bgColor: string`
QR code background color (hex format). Default: `"#FFFFFF"`

**Example:**
```tsx
bgColor="#f5f5f5"  // Light gray
```

#### `level: "L" | "M" | "Q" | "H"`
Error correction level. Default: `"M"`

- **L**: Low (7% error correction)
- **M**: Medium (15% error correction) - Recommended
- **Q**: Quartile (25% error correction)
- **H**: High (30% error correction) - Use if QR code may be damaged

**Example:**
```tsx
level="H"  // High error correction for printed materials
```

## Examples

### Basic QR Code
```tsx
<QRCodeGenerator
  url="https://sdtoolsinc.org"
  name="Homepage"
/>
```

### QR Code with Tracking
```tsx
<QRCodeGenerator
  url="https://sdtoolsinc.org/referral"
  name="Referral Form"
  utmParams={{
    source: "qr_code",
    medium: "print",
    campaign: "flyer_2024"
  }}
/>
```

### Custom Styled QR Code
```tsx
<QRCodeGenerator
  url="https://sdtoolsinc.org/interest"
  name="Interest Form"
  size={300}
  fgColor="#1e3a8a"
  bgColor="#ffffff"
  level="H"
  className="shadow-2xl"
/>
```

### QR Code Without Download
```tsx
<QRCodeGenerator
  url="https://sdtoolsinc.org/portal"
  name="User Portal"
  showDownload={false}
/>
```

## Features

### 1. Dynamic Generation
QR codes are generated on-the-fly based on the provided URL and parameters. No pre-generated images needed.

### 2. UTM Tracking
Automatically embeds UTM parameters in the QR code URL for comprehensive campaign tracking in Google Analytics.

### 3. Download Functionality
Users can download the QR code as a PNG image with a descriptive filename:
- Format: `qr-code-{name}.png`
- Example: `qr-code-interest-form.png`

### 4. Analytics Integration
Tracks two types of events:
- **QR Code Scan**: When users arrive via the QR code URL
- **QR Code Download**: When users download the QR code image

### 5. Responsive Design
- Adapts to different screen sizes
- White background with rounded corners
- Smooth animations on mount

### 6. Development Mode Debug
In development mode, displays the generated URL below the QR code for verification.

## Google Analytics Events

### QR Code Scan Event
Automatically tracked when a user visits a page via QR code:

```javascript
{
  category: "QR Code",
  action: "Scan",
  label: "Interest Form (qr_code/interest_form)"
}
```

### QR Code Download Event
Tracked when a user clicks the download button:

```javascript
{
  category: "QR Code",
  action: "Download",
  label: "Interest Form"
}
```

## Best Practices

### 1. URL Structure
- Always use absolute URLs (include `https://`)
- Keep URLs as short as possible for better QR code scanning
- Use URL shorteners for very long URLs

### 2. UTM Parameters
- Use consistent naming conventions
- Always include `source`, `medium`, and `campaign` at minimum
- Make campaign names descriptive and unique

### 3. Size Selection
- **192px**: Small, for web display or digital use
- **256px**: Standard, good balance for most uses
- **512px**: Large, for printing on posters or large materials

### 4. Error Correction
- Use **M** (medium) for most cases
- Use **H** (high) for materials that may get damaged or need logo overlay

### 5. Colors
- Maintain high contrast (dark foreground, light background)
- Test QR codes after customizing colors
- Avoid light colors on light backgrounds

### 6. Testing
Always test QR codes:
1. Scan with multiple devices (iOS, Android)
2. Test from different distances
3. Verify tracking parameters are working in Google Analytics
4. Test download functionality

## Troubleshooting

### QR Code Not Scanning
- Increase error correction level to `H`
- Increase size to at least 256px
- Ensure sufficient contrast between colors
- Check if URL is valid

### Download Not Working
- Check browser console for errors
- Ensure JavaScript is enabled
- Try a different browser

### Analytics Not Tracking
- Verify `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set in `.env`
- Check Google Analytics dashboard (events may take 24-48 hours to appear)
- Use Google Analytics Debug mode for real-time verification

## Implementation Details

The component uses:
- `QRCodeSVG` from `qrcode.react` for QR code generation
- Canvas API for SVG to PNG conversion
- Framer Motion for smooth animations
- React hooks for state management

## Future Enhancements

Potential improvements:
- Support for adding logos/icons in QR code center
- Multiple download formats (SVG, PDF)
- Batch QR code generation
- QR code customization UI
- Print-ready PDF generation

## Support

For issues or questions about the QR code component:
1. Check this documentation
2. Review component source code in `components/ui/QRCodeGenerator.tsx`
3. Contact the development team
