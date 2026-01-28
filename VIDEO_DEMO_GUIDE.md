# T.O.O.L.S Inc - Video Demo Production Guide

## Overview
This guide provides step-by-step instructions for creating the four 20-30 second demo videos for the T.O.O.L.S Inc platform.

## Demo Requirements Summary

| Demo | Duration | Focus | Key Actions |
|------|----------|-------|-------------|
| Personal Dashboard | 20-30s | Case Manager view | Overview → Case selection → Progress tracking |
| Educational Resources | 20-30s | Course browsing | Catalog → Enrollment → Progress view |
| MackAI Motivational Coach | 20-30s | LLM interaction | Chat interface → Motivation delivery → Goal setting |
| Client-Case Manager Connection | 20-30s | Communication | Send message → Schedule → View history |

---

## 1. Personal Dashboard (Case Manager Preview)

### What to Show
- **Opening (0-3s)**: Dashboard overview with multiple client cases
- **Main Content (3-20s)**:
  - Click on a case to view details
  - Show case status indicators (progress bars, metrics)
  - Highlight quick action buttons
  - Show recent activity/timeline
- **Closing (20-30s)**: Value proposition text overlay

### Talking Points (If using voiceover)
"Stay organized with a clear overview of all your cases. Track client progress, manage appointments, and take quick action—all from one dashboard."

### Files to Prepare
- Access to Case Manager Portal (`localhost:3002`)
- Sample case data populated
- Status: `personal-dashboard-demo.mp4`

---

## 2. Educational Resources

### What to Show
- **Opening (0-3s)**: Course catalog view
- **Main Content (3-20s)**:
  - Search/filter courses
  - Click on a course card
  - View course details (lessons, duration)
  - Click "Enroll" button
  - Navigate to lesson modules
  - Show progress tracking
- **Closing (20-30s)**: CTA "Start Learning Today"

### Talking Points (If using voiceover)
"Access a comprehensive library of courses designed to support your journey. Learn at your own pace with interactive lessons, videos, and resources."

### Files to Prepare
- Client Portal courses page (`localhost:3001/portal/courses`)
- Sample enrolled courses
- Status: `educational-resources-demo.mp4`

---

## 3. MackAI Motivational Coach (LLM)

### What to Show
- **Opening (0-3s)**: MackAI interface reveal with animated entrance
- **Main Content (3-20s)**:
  - Show chat interface
  - Type a question/request (e.g., "I need motivation today")
  - Show AI response appearing with typing animation
  - Ask second question (e.g., "Help me set goals")
  - Show contextual recommendations
  - Show suggested next actions
- **Closing (20-30s)**: "Your Personal AI Coach" overlay

### Talking Points (If using voiceover)
"Meet your personal AI coach. Get motivational support, personalized guidance, and actionable advice whenever you need it. Available 24/7."

### Files to Prepare
- MackAI dashboard (`localhost:3001/portal/mackai`)
- Pre-write sample questions
- Status: `mackai-coach-demo.mp4`

---

## 4. Client-Case Manager Connection

### What to Show
- **Opening (0-3s)**: Split view or messaging interface
- **Main Content (3-20s)**:
  - Open messaging conversation
  - Type and send a message
  - Show message appears in real-time
  - Click "Schedule Appointment" button
  - Select date/time
  - View scheduled confirmation
  - Show previous messages/conversation history
- **Closing (20-30s)**: "Seamless Communication" overlay

### Talking Points (If using voiceover)
"Stay connected with your case manager. Send messages, schedule appointments, share documents, and maintain clear communication—all in one secure space."

### Files to Prepare
- Client Portal or Case Manager Portal messaging feature
- Pre-populated conversation thread
- Status: `client-casemgr-connection-demo.mp4`

---

## Recording Instructions

### Setup
1. **Environment**: Use a clean desktop with T.O.O.L.S Inc app running locally
2. **Resolution**: 1920×1080 (16:9 aspect ratio)
3. **Frame Rate**: 30 FPS
4. **Browser**: Use Chrome/Edge in full-screen, hide bookmarks/tabs
5. **Cursor**: Enable cursor highlighting in recording software

### Recording Tools

#### Option 1: OBS Studio (Free, Recommended)
```
Windows: https://obsproject.com/
Mac: https://obsproject.com/
Linux: https://obsproject.com/

Setup:
- Create new scene
- Add Display Capture source (your monitor)
- Output: 1920x1080, 30 FPS, H.264 codec
- Format: MP4
```

#### Option 2: ScreenFlow (macOS)
- Built-in cursor highlighting
- Direct MP4 export
- Audio recording included

#### Option 3: Camtasia
- Cursor effect options
- Built-in editing
- Zoom/pan capabilities

#### Option 4: ShareX (Windows)
- Lightweight screen recorder
- FFmpeg support
- Good performance

### Recording Checklist
- [ ] Close unnecessary apps/windows
- [ ] Disable notifications
- [ ] Set theme to dark mode (matches app design)
- [ ] Test audio if using voiceover
- [ ] Do a practice run
- [ ] Record the actual demo (aim for 25-28 seconds)
- [ ] Stop recording
- [ ] Save as MP4 format

---

## Editing Instructions

### Recommended Editors
- **DaVinci Resolve** (Free, professional)
- **Adobe Premiere Pro** (Professional)
- **Shotcut** (Free, open-source)
- **CapCut** (Free, simple)

### Basic Editing Template

1. **Import Video**
   - 20-30 second base video
   - Trim/cut as needed

2. **Add Title Sequence (0-3 seconds)**
   - Black background
   - Animated text: Demo title + icon
   - Fade in effect (0.5s)
   - Hold (2s)

3. **Main Footage (3-20 seconds)**
   - Play recorded demo
   - Add text overlays for key actions
   - Use cursor highlights (zoom 1.2x on mouse location)
   - Optional: Add subtle background music (royalty-free)

4. **Closing Sequence (20-30 seconds)**
   - Fade to black (0.3s)
   - Text overlay: Value prop message
   - Add button/CTA graphic
   - Logo animation (T.O.O.L.S Inc)
   - Fade out (0.5s)

### Text Overlay Guidelines
- Font: Montserrat, Poppins, or Inter (sans-serif)
- Color: Sky blue (#38bdf8) or white
- Size: Large (48-72pt for titles)
- Duration: 2-3 seconds per overlay
- Position: Bottom third (avoid UI elements)

### Music Recommendations (Royalty-Free)
- Epidemic Sound
- Artlist
- YouTube Audio Library
- Pixabay
- Pexels

**Suggested mood**: Uplifting, motivational, modern tech

---

## Workflow

### Step 1: Pre-Production
- [ ] Plan demo flow (write it down)
- [ ] Prepare test data/cases
- [ ] Create script for voiceover (if using)
- [ ] Test all features work as expected

### Step 2: Recording
- [ ] Set up recording environment
- [ ] Do practice run
- [ ] Record main demo (25-28 seconds)
- [ ] Record backup take if possible
- [ ] Save file with naming convention

### Step 3: Post-Production
- [ ] Import video to editor
- [ ] Trim/cut unnecessary parts
- [ ] Add title & closing sequences
- [ ] Add text overlays
- [ ] Add music/sound
- [ ] Color grading (optional)
- [ ] Export as MP4 (H.264, 1920x1080)

### Step 4: Quality Check
- [ ] Video plays smoothly
- [ ] Audio is clear (if included)
- [ ] Text is readable
- [ ] Timing is 20-30 seconds
- [ ] File size is reasonable (< 50MB)

### Step 5: Upload & Integration
- [ ] Save video to `/public/videos/demos/`
- [ ] Update `app/demos/page.tsx` with video source
- [ ] Test video player loads correctly
- [ ] Commit changes: `git add .` → `git commit -m "feat: add demo videos"`
- [ ] Push: `git push origin main`
- [ ] Verify on Azure Static Web Apps

---

## File Naming Convention

Store all videos in: `public/videos/demos/`

Filename format: `{demo-slug}.mp4`

Examples:
```
personal-dashboard-demo.mp4
educational-resources-demo.mp4
mackai-coach-demo.mp4
client-casemgr-connection-demo.mp4
```

---

## Video Specifications

| Property | Value |
|----------|-------|
| Resolution | 1920×1080 (16:9) |
| Frame Rate | 30 FPS |
| Codec | H.264 |
| Format | MP4 (.mp4) |
| Duration | 20-30 seconds |
| Max File Size | 50MB |
| Audio | AAC stereo (if included) |
| Bitrate | 5-8 Mbps |

---

## Code Integration

### Update `/app/demos/page.tsx` 

Once videos are ready, update the video player component:

```tsx
// Example: Replace placeholder with actual video
const videoUrl = `/videos/demos/${demo.videoPlaceholder}.mp4`;

<video 
  controls 
  className="w-full h-full"
  poster={`/images/demos/${demo.videoPlaceholder}-poster.jpg`}
>
  <source src={videoUrl} type="video/mp4" />
  Your browser doesn't support HTML5 video.
</video>
```

### Optional: Create Thumbnail/Poster Images
- Size: 1920×1080
- Format: JPG
- Save to: `/public/images/demos/`
- Name: `{demo-slug}-poster.jpg`

---

## Deployment Checklist

- [ ] Videos recorded and edited
- [ ] Videos saved to `/public/videos/demos/`
- [ ] Video player code updated
- [ ] Thumbnails created (optional)
- [ ] All videos tested locally
- [ ] Git changes committed
- [ ] Pushed to main branch
- [ ] GitHub Actions deployment complete
- [ ] Videos play on Azure Static Web Apps
- [ ] Shared with team/stakeholders

---

## Troubleshooting

### Video Not Playing
- Check file path is correct
- Verify MP4 format and codec
- Check browser console for errors
- Test on different browser

### Performance Issues
- Reduce video bitrate
- Lower resolution to 1280×720
- Use lazy loading on video elements

### Audio Issues
- Ensure AAC codec for audio
- Check volume levels
- Add fade-in/fade-out to avoid pops

---

## Support & Resources

- **OBS Documentation**: https://obsproject.com/wiki/
- **DaVinci Resolve Tutorials**: https://www.blackmagicdesign.com/products/davinciresolve/
- **Video Codec Guide**: https://en.wikipedia.org/wiki/H.264/MPEG-4_AVC
- **Web Video Best Practices**: https://web.dev/video/

---

## Questions?

Refer to the demo page at `/demos` for visual reference of how videos will be displayed.
