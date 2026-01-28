# Demo Video Recording Scripts & Timings

This file contains the scripts and timing guides for each of the four 20-30 second demo videos.

## 1. Personal Dashboard (Case Manager Preview)

**Total Duration: 25 seconds**

### Scene Breakdown

| Time | Action | Details |
|------|--------|---------|
| 0-2s | Title Card | "Personal Dashboard" fade in + icon |
| 2-3s | Dashboard Overview | Show full case list with 4-5 clients |
| 3-5s | Case Card Hover | Highlight one case card with cursor |
| 5-8s | Click Case | Click opens detailed view |
| 8-12s | Show Details | Scroll through case info (status, progress, upcoming appts) |
| 12-15s | Quick Actions | Highlight action buttons (Message, Schedule, View Notes) |
| 15-18s | Progress Metrics | Show progress bars and KPIs |
| 18-23s | Timeline | Show recent activity timeline |
| 23-25s | Closing | "Stay Organized. Track Progress." text overlay |

### Voice Script (Optional)
> "Stay organized with a clear overview of all your cases. See real-time progress, track appointments, and take quick action—all from one dashboard."

---

## 2. Educational Resources

**Total Duration: 26 seconds**

### Scene Breakdown

| Time | Action | Details |
|------|--------|---------|
| 0-2s | Title Card | "Educational Resources" fade in + book icon |
| 2-4s | Course Grid | Show colorful course cards in grid layout |
| 4-6s | Hover Effect | Hover over a course card to show description |
| 6-9s | Click Course | Click opens course detail page |
| 9-12s | Scroll Details | Show course description, lessons count, duration |
| 12-14s | Enroll Button | Click "Enroll" button |
| 14-17s | Lesson View | Navigate to lessons page |
| 17-21s | Progress View | Show progress bar, next lesson recommendation |
| 21-23s | Search Feature | Show course search/filter |
| 23-26s | Closing | "Learn at Your Pace" text overlay + certificates hint |

### Voice Script (Optional)
> "Access a comprehensive library of courses designed for your success. Enroll in interactive lessons, track your progress, and earn certificates as you learn."

---

## 3. MackAI Motivational Coach (LLM)

**Total Duration: 28 seconds**

### Scene Breakdown

| Time | Action | Details |
|------|--------|---------|
| 0-2s | Title Card | "MackAI Coach" + robot/AI icon animated entrance |
| 2-4s | Chat Interface | Show chat window with welcome message |
| 4-6s | Typing Action | Type question: "I need motivation today" |
| 6-10s | AI Response | Show AI response typing with animation |
| 10-12s | Read Response | Let response display (shows encouragement) |
| 12-14s | Second Question | Type: "Help me set goals" |
| 14-18s | Second Response | AI provides goal-setting framework |
| 18-21s | Recommendations | Show "Suggested Actions" section |
| 21-24s | Features Highlight | Quick text overlay of features (24/7 Available, Personalized, Goal Setting) |
| 24-28s | Closing | "Your Personal AI Coach" with CTA button animation |

### Voice Script (Optional)
> "Meet your personal AI coach. Get motivational support, personalized guidance, and actionable advice whenever you need it. Available 24/7 to help you succeed."

---

## 4. Client-Case Manager Connection

**Total Duration: 27 seconds**

### Scene Breakdown

| Time | Action | Details |
|------|--------|---------|
| 0-2s | Title Card | "Secure Connection" + link icon |
| 2-5s | Messaging View | Show messaging interface with conversation thread |
| 5-8s | Message History | Scroll up to show previous messages |
| 8-11s | New Message | Type new message: "Can we schedule a meeting?" |
| 11-13s | Send Message | Click send, message appears in thread |
| 13-16s | Schedule Action | Click "Schedule Appointment" button |
| 16-19s | Calendar Widget | Select date/time from calendar picker |
| 19-21s | Confirmation | Show appointment confirmation |
| 21-24s | Notification | Show notification/reminder in UI |
| 24-27s | Closing | "Seamless Communication" + features overlay |

### Voice Script (Optional)
> "Stay connected with your case manager. Send secure messages, schedule appointments, share resources, and maintain clear communication—all in one place."

---

## Recording Checklists

### Pre-Recording Setup
- [ ] Close all unnecessary applications
- [ ] Disable system notifications
- [ ] Ensure dark theme is enabled
- [ ] Test all features work correctly
- [ ] Prepare test data (cases, courses, messages)
- [ ] Run through demo once as practice
- [ ] Start recording software and test audio
- [ ] Position cursor visibility tool

### During Recording
- [ ] Speak clearly (if using voiceover)
- [ ] Move mouse smoothly between actions
- [ ] Click deliberately and pause for visibility
- [ ] Allow text to be readable (don't rush)
- [ ] Keep cursor in frame during actions
- [ ] Avoid typos when typing in demo

### Post-Recording
- [ ] Save raw video file
- [ ] Review timing (should be 20-30 seconds)
- [ ] Check for any mistakes or glitches
- [ ] Backup original file
- [ ] Proceed to editing

---

## Timing Guidelines

### Critical Timing Notes
1. **Intro (Title)**: 2-3 seconds
   - Allow time for text to be readable
   
2. **Main Demo**: 15-20 seconds
   - Click actions: 1-2 seconds per action
   - Let screens load naturally
   - Pause after major changes (1-2s)
   
3. **Outro (CTA)**: 3-5 seconds
   - Allow voiceover to complete
   - Show visual CTA clearly

### Speed Tips
- Use 1.25-1.5x playback for fast sequences
- Slow down for text-heavy screens
- Pause 1-2 seconds after major state changes
- Avoid rapid clicking (appears unprofessional)

---

## Editing Quick Guide

### Editing Software Recommendation: DaVinci Resolve

1. **Import Video**
   - File → Open Project
   - Media Pool → Import video

2. **Create Timeline**
   - Drag video to timeline
   - Trim to needed length

3. **Title Sequence**
   - Effects → Titles
   - Add text: "Demo Title"
   - Duration: 2-3 seconds
   - Add fade-in/fade-out transition

4. **Text Overlays**
   - Fusion tab → Text+
   - Add key feature text
   - Duration: 2-3 seconds
   - Position: bottom third

5. **Music**
   - Audio track
   - Drag music file
   - Reduce to -20dB
   - Fade in (1s) and fade out (2s)

6. **Export**
   - Deliver tab
   - Format: MP4
   - Codec: H.264
   - Resolution: 1920×1080
   - Frame Rate: 30 FPS
   - Output: `/public/videos/demos/`

---

## File Delivery Checklist

- [ ] Video is 20-30 seconds
- [ ] Resolution is 1920×1080
- [ ] Format is MP4 (H.264)
- [ ] File size is under 50MB
- [ ] Filename follows convention: `{demo-slug}-demo.mp4`
- [ ] Video plays smoothly on all browsers
- [ ] Audio is clear and balanced
- [ ] Text overlays are readable
- [ ] Color grading matches brand

---

## Integration Steps

1. **Upload Video**
   ```bash
   # Copy file to public directory
   cp ~/Downloads/personal-dashboard-demo.mp4 public/videos/demos/
   ```

2. **Update Demo Page**
   - Videos automatically load from `/public/videos/demos/{filename}.mp4`
   - Just ensure filename matches the `videoPlaceholder` in `app/demos/page.tsx`

3. **Test Locally**
   ```bash
   npm run dev
   # Visit http://localhost:3000/demos
   # Click on demo card to play video
   ```

4. **Commit & Push**
   ```bash
   git add public/videos/demos/{filename}.mp4
   git commit -m "feat: add {demo-name} video"
   git push origin main
   ```

5. **Verify Deployment**
   - Check GitHub Actions workflow
   - Visit Azure Static Web Apps URL
   - Play video to confirm it works

---

## Common Issues & Solutions

### Video Won't Play
- Check filename matches `videoPlaceholder` in code
- Verify video is valid MP4 format
- Test in different browser
- Check browser console for errors

### Audio Out of Sync
- Re-encode video with audio track
- Check codec compatibility

### Video Quality Poor
- Increase bitrate (8-10 Mbps)
- Ensure source resolution is 1920×1080
- Use H.264 codec with quality preset

### Playback Choppy
- Reduce frame rate to 24-25 FPS
- Lower bitrate to 4-6 Mbps
- Ensure browser hardware acceleration enabled

---

## Resources

- **OBS Settings**: https://obsproject.com/wiki/OBS-Studio-Quickstart
- **DaVinci Tutorials**: https://www.blackmagicdesign.com/products/davinciresolve/
- **FFmpeg Commands**: https://ffmpeg.org/ffmpeg.html
- **Video Best Practices**: https://web.dev/video/

---

**Total Project Time Estimate:**
- Recording (4 videos × 15-20 min each): ~80 minutes
- Editing (4 videos × 20-30 min each): ~120 minutes
- Testing & Upload: ~20 minutes
- **Total: ~4 hours**
