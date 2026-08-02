# Demo Recording Studio

## Overview
This directory contains **4 self-playing animated demos** ready to be screen-recorded for the T.O.O.L.S Inc website.

## Demos Included

### 1. Personal Dashboard (`/dashboard`)
- **Duration**: ~25 seconds
- **Features**: Case manager view, client cards, progress tracking, quick actions
- **Auto-plays**: Yes, loops continuously
- **File**: `dashboard/page.tsx`

### 2. Educational Resources (`/educational`)
- **Duration**: ~26 seconds  
- **Features**: Course catalog, enrollment flow, progress view
- **Auto-plays**: Yes, loops continuously
- **File**: `educational/page.tsx`

### 3. MackAI Coach (`/mackai`)
- **Duration**: ~28 seconds
- **Features**: AI chat interface, motivational responses, suggested actions
- **Auto-plays**: Yes, loops continuously
- **File**: `mackai/page.tsx`

### 4. Client-Case Manager Connection (`/connection`)
- **Duration**: ~27 seconds
- **Features**: Messaging, appointment scheduling, notifications
- **Auto-plays**: Yes, loops continuously
- **File**: `connection/page.tsx`

## How to Use

### Access the Demos
1. **Start dev server**: `npm run dev`
2. **Open hub**: `http://localhost:3000/demo-recording`
3. **Click any demo** to open in new tab

### Recording Process

#### Step 1: Setup OBS Studio (Free)
```bash
# Download from: https://obsproject.com/

# Settings:
- Resolution: 1920×1080 (16:9)
- Frame Rate: 30 FPS
- Format: MP4
- Codec: H.264
```

#### Step 2: Configure Browser
1. Open demo page in Chrome/Edge
2. Press `F11` for fullscreen (hides bookmarks/tabs)
3. Demo starts auto-playing immediately
4. Use on-screen controls if needed:
   - ⏸ Pause/Play button (top-right)
   - 🔄 Restart button (top-right)

#### Step 3: Record
1. Start OBS recording
2. Let demo play through 1-2 full cycles
3. Demo will loop automatically
4. Stop recording after closing card appears
5. Each demo runs ~25-28 seconds per cycle

#### Step 4: Edit (Optional)
Use DaVinci Resolve (free) or any editor:
1. Trim to exactly 20-30 seconds
2. Optional: Add background music
3. Optional: Color grading
4. Export as MP4 (H.264, 1920×1080, 30 FPS)

#### Step 5: Save Videos
Save each video with proper naming:
```bash
/public/videos/demos/personal-dashboard-demo.mp4
/public/videos/demos/educational-resources-demo.mp4
/public/videos/demos/mackai-coach-demo.mp4
/public/videos/demos/client-casemgr-connection-demo.mp4
```

#### Step 6: Deploy
```bash
git add public/videos/demos/
git commit -m "feat: add demo videos"
git push origin main
# Azure deploys automatically!
```

## Demo Features

### Interactive Controls
Every demo includes:
- ✅ Auto-play (starts immediately)
- ✅ Pause/Resume button
- ✅ Restart button  
- ✅ Progress indicator (bottom center)
- ✅ Smooth animations
- ✅ Professional transitions

### Timing Breakdown

Each demo follows this structure:
1. **Title Card** (2-3s) - Logo/icon animation
2. **Main Demo** (15-20s) - Feature showcase
3. **Closing Card** (3-5s) - CTA and branding
4. **Loop** - Automatically restarts

### Visual Design
- Matches T.O.O.L.S Inc brand colors
- Dark theme with sky blue accents
- Glass morphism effects
- Gradient overlays
- Smooth framer-motion animations

## Tips for Best Results

### Recording
- Record in fullscreen (F11) for clean edges
- Use 1920×1080 resolution
- Ensure smooth 30 FPS playback
- Record 1-2 full loops for options

### Editing
- Keep total duration 20-30 seconds
- Add fade in/out (optional)
- Background music at -20dB (optional)
- Export with high quality (5-8 Mbps bitrate)

### File Management
- Keep files under 50MB each
- Use H.264 codec for compatibility
- Test playback in browser before deploying

## Troubleshooting

### Demo won't auto-play
- Refresh the page
- Click the Play button manually
- Check browser console for errors

### Recording is choppy
- Close unnecessary applications
- Reduce browser zoom to 100%
- Try Chrome/Edge instead of Firefox
- Check CPU usage during recording

### Colors look washed out
- Record in Chrome/Edge (better color accuracy)
- Use browser's native fullscreen (F11)
- Avoid zooming in/out

## Alternative: Manual Control

If you prefer manual control over auto-play:
1. Open demo page
2. Click **⏸ Pause** immediately
3. Click **▶ Play** when ready to record
4. Demo plays through once, then loops

## File Structure

```
app/demo-recording/
├── page.tsx                    # Hub/index page
├── dashboard/
│   └── page.tsx               # Dashboard demo
├── educational/
│   └── page.tsx               # Educational demo
├── mackai/
│   └── page.tsx               # MackAI demo
├── connection/
│   └── page.tsx               # Connection demo
└── README.md                  # This file
```

## Related Documentation

- **VIDEO_DEMO_GUIDE.md** - Comprehensive production guide
- **DEMO_SCRIPTS.md** - Scene-by-scene timing breakdowns
- **DEMO_SETUP_COMPLETE.md** - Overview and setup summary

## Time Estimates

| Task | Duration |
|------|----------|
| Setup OBS | 10 min |
| Record all 4 demos | 30 min |
| Optional editing | 60-90 min |
| Export & upload | 15 min |
| **TOTAL** | **~2 hours** |

(Or ~30 minutes if recording without editing)

## Quick Start Commands

```bash
# Start dev server
npm run dev

# Open recording hub
open http://localhost:3000/demo-recording

# After recording, save videos to:
# /public/videos/demos/

# Deploy
git add public/videos/demos/
git commit -m "feat: add demo videos"
git push origin main
```

## Support

For questions or issues:
1. Check VIDEO_DEMO_GUIDE.md for detailed instructions
2. Review DEMO_SCRIPTS.md for timing guidance
3. See demos live at /demos page after deployment

## Credits

Built with:
- Next.js 14
- Framer Motion
- Tailwind CSS
- TypeScript

---

**Ready to record?** Open `http://localhost:3000/demo-recording` and get started! 🎬
