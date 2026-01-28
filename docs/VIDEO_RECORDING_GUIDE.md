# Launch Video Recording Instructions

## Quick Start

### Step 1: Start the Development Server
```bash
npm run dev
```

### Step 2: Open the Video Page
Navigate to: **http://localhost:3000/launch-video**

### Step 3: Record the Video

**Option A: Using DaVinci Resolve (You Have This!)**

1. **Record Screen with DaVinci**:
   - File → Capture and Playback → Screen Capture
   - Or use Windows Game Bar (Win + G) to record first
   - Then import into DaVinci for editing
   
2. **Import and Edit**:
   - Create new project in DaVinci Resolve
   - Import your screen recording
   - Edit timeline, add music, voiceover
   - Color grade on Color page
   - Export: Deliver page → H.264, 1920x1080, 30fps

**Option B: Using OBS Studio (Also Free)**

1. **Download OBS Studio**: https://obsproject.com/
2. **Configure OBS**:
   - Open OBS Studio
   - Click "+" under Sources → "Window Capture"
   - Select your browser window
   - Adjust canvas to 1920x1080
   
3. **Recording Settings**:
   - Settings → Output → Recording Quality: "High Quality, Medium File Size"
   - Settings → Video → Base Resolution: 1920x1080
   - Settings → Video → FPS: 30
   
4. **Record**:
   - **For fullscreen**: Click browser's fullscreen button (⛶) or press F11 (works in Chrome/Edge)
   - **Alternative**: Maximize browser window and hide bookmarks bar (Ctrl+Shift+B)
   - Click "Start Recording" in OBS
   - Click "▶ Start Video" button on the page
   - Video will auto-play through all 7 scenes (~2 minutes)
   - Click "Stop Recording" in OBS when complete

**Option C: Using Windows Game Bar (Quick & Easy)**

1. Open browser and maximize window (don't need fullscreen)
2. Press **Win + G** to open Game Bar
3. Click the record button or press **Win + Alt + R**
4. **For fullscreen**: Press F11 (Chrome/Edge) or use browser fullscreen button (⛶)
   - **Note**: If F11 doesn't work, just maximize the window - it's fine!
5. Click "▶ Start Video" button
6. Press **Win + Alt + R** again to stop recording
7. Video saved to: `C:\Users\[YourName]\Videos\Captures\`
8. **Then edit in DaVinci Resolve** - just drag the recorded file into a new project!

---

## 🎨 Editing in DaVinci Resolve

Since you have DaVinci Resolve, here's your professional workflow:

### Import & Edit Page

1. **Create New Project**
   - File → New Project → Name it "TOOLS Launch Video"
   
2. **Import Screen Recording**
   - Media Pool → Right-click → Import Media
   - Select your recorded video file
   
3. **Timeline Setup**
   - Drag video to timeline
   - Right-click timeline → Timeline Settings → 1920x1080, 30fps
   
4. **Trim & Polish**
   - Trim beginning (before clicking Start)
   - Trim end (after video finishes)
   - Add fade in/out: Effects → Transitions → Cross Dissolve (1 second each)

### Add Audio (Optional)

5. **Add Background Music**
   - Import music file to Media Pool
   - Drag to audio track below video
   - Adjust volume: -20dB to -15dB (so it doesn't overpower)
   - Fade in/out at start and end
   
6. **Add Voiceover** (Optional)
   - Fairlight page (bottom tabs)
   - Record directly or import audio file
   - Sync with video timing
   - Mix levels: Voiceover at -6dB, music at -20dB

### Color Grade (Optional)

7. **Color Page**
   - Enhance brand colors (make blues pop)
   - Add cinematic look with subtle grading
   - Boost contrast slightly
   
### Export

8. **Deliver Page**
   - Format: MP4 (H.264)
   - Resolution: 1920x1080
   - Frame Rate: 30fps
   - Codec: H.264
   - Quality: Automatic or 15-20 Mbps
   - Audio: AAC, 320kbps
   - Click "Add to Render Queue" → "Render All"

---

## 🎬 Complete Workflow (Recommended)

**Using Game Bar + DaVinci Resolve**:

1. **Record** (5 minutes):
   - Win + G to open Game Bar
   - Record screen at http://localhost:3000/launch-video
   - Save to Videos\Captures

2. **Import to DaVinci** (2 minutes):
   - Open DaVinci Resolve
   - Create new project
   - Import recording

3. **Edit** (30-60 minutes):
   - Trim start/end
   - Add fade in/out
   - Add background music (optional)
   - Add voiceover (optional)
   - Color grade (optional)

4. **Export** (10 minutes):
   - Deliver page
   - H.264, 1920x1080, 30fps
   - Render

**Total Time**: 45-90 minutes for professional video!

### Quick Export (No Editing Needed)

If you just want the screen recording without editing:
- Your recording is ready to use as-is!
- Game Bar saves to: `Videos\Captures`
- OBS saves to: Settings → Output → Recording Path

---

## Video Specifications

The animated presentation includes:

✅ **7 Scenes** (15 seconds each = ~105 seconds total):
1. The Challenge - Statistics and barriers
2. Brand Reveal - T.O.O.L.S Inc introduction  
3. Platform Overview - Key features
4. Human Impact - Values and mission
5. Key Features - Technology highlights
6. Community & Partnership - Network building
7. Call to Action - Website and contact

✅ **Animations**:
- Smooth scene transitions
- Text animations with staggered timing
- Gradient effects and glass morphism
- Progress bar shows video timeline

✅ **Controls**:
- Play/Pause button (bottom right)
- Auto-advances through scenes
- Progress indicator at top

---

## Tips for Best Results

### Recording Quality
- **Resolution**: Ensure browser is exactly 1920x1080 before recording
- **Fullscreen Options**: 
  - Press F11 (works in Chrome/Edge, may not work in all browsers)
  - Click browser fullscreen button (⛶ icon)
  - OR just maximize window and hide bookmarks bar (Ctrl+Shift+B)
- **Performance**: Close other applications for smooth animations
- **Audio**: Mute system sounds or record in quiet environment

### Timing
- Each scene plays for 15 seconds automatically
- Total video length: ~1 minute 45 seconds
- Add 5-10 seconds buffer at start and end

### Browser Choice
- **Chrome/Edge**: Best performance for Framer Motion animations
- **Firefox**: Good alternative
- Disable extensions that might interfere (ad blockers, etc.)

### Post-Recording
- Trim first few seconds (before "Start Video" click)
- Trim last few seconds after video ends
- Add fade-in/fade-out (1 second each) in video editor

---

## Alternative: Screen Record with Audio

If you want to add live voiceover during recording:

1. Set up microphone in OBS or recording software
2. Open script: `docs/LAUNCH_VIDEO_SCRIPT.md`
3. Practice timing with the animations
4. Record video + voiceover simultaneously
5. Add background music in post-production

---

## Troubleshooting

**Animations choppy/laggy**:
- Close other applications
- Try different browser (Chrome recommended)
- Reduce browser zoom to 100%
- Disable browser extensions

**Video won't start**:
- Refresh the page
- Check browser console for errors (F12)
- Ensure JavaScript is enabled

**Recording file too large**:
- OBS: Use "High Quality, Medium File Size" preset
- Compress video with Handbrake (free)
- Target bitrate: 5-10 Mbps for 1080p

**Scenes advance too fast/slow**:
- Edit `SCENE_DURATION` in the page.tsx file
- Currently set to 15000ms (15 seconds)
- Increase for more time per scene

---

## Next Steps After Recording

1. **Review**: Watch the recording, check for issues
2. **Trim**: Remove start/end buffer in video editor
3. **Enhance** (Optional):
   - Add professional voiceover
   - Add background music
   - Color grade for cinematic look
   - Add sound effects for transitions
   
4. **Export Versions**:
   - Full version (2 minutes): YouTube, website
   - 60-second cut: LinkedIn, Facebook
   - 30-second teaser: Instagram, Twitter
   - Vertical (9:16): Instagram Stories, TikTok

5. **Upload & Share**:
   - YouTube (unlisted or public)
   - Website hero section
   - Social media platforms
   - Email campaigns
   - Presentations

---

## Support Files

- Full Script: `docs/LAUNCH_VIDEO_SCRIPT.md`
- Production Guide: `docs/VIDEO_PRODUCTION_GUIDE.md`
- Video Page: `app/launch-video/page.tsx`

---

**Ready to record? Start the dev server and navigate to `/launch-video`!**
