# DaVinci Resolve Automation Guide

## Using DaVinci Resolve Toolkit Extension

Since you have the DaVinci Resolve toolkit extension in VS Code, you can automate your video editing workflow!

---

## Quick Setup

### Prerequisites

1. **DaVinci Resolve** installed (Studio or Free version)
2. **DaVinci Resolve Toolkit** VS Code extension
3. **Python 3.x** installed

### Enable DaVinci Resolve API

1. Open DaVinci Resolve
2. Go to: **Preferences → System → General**
3. Enable: **"External scripting using"**
4. Select: **"Local"** or **"Network"**
5. Click **Save**
6. Restart DaVinci Resolve

---

## Using the Automation Script

### Step 1: Record Your Screen

Use Windows Game Bar to record the launch video:
```bash
Win + G → Record → http://localhost:3000/launch-video
```

Recording saved to: `C:\Users\YourName\Videos\Captures\`

### Step 2: Run Automation Script

Open terminal in VS Code and run:

```bash
python scripts/davinci-resolve-automation.py
```

### Step 3: Follow Prompts

The script will:
1. ✅ Create/open project "TOOLS_Launch_Video"
2. ✅ Configure project settings (1920x1080, 30fps)
3. ✅ Prompt for your screen recording file path
4. ✅ Import media into Media Pool
5. ✅ Create timeline with your clip
6. ✅ Configure render settings

### Step 4: Manual Polish (Optional)

In DaVinci Resolve:
- **Edit Page**: Trim start/end, add fade in/out
- **Fairlight Page**: Add music, voiceover
- **Color Page**: Enhance brand colors
- **Deliver Page**: Export final video

---

## Manual Workflow with Toolkit Extension

### Using VS Code DaVinci Resolve Toolkit

If you prefer the extension features:

1. **Open Command Palette**: `Ctrl + Shift + P`
2. **Run**: "DaVinci Resolve: Connect"
3. Use extension commands for:
   - Project management
   - Media import
   - Timeline operations
   - Render queue management

### Extension Commands

Access via Command Palette (`Ctrl + Shift + P`):

- `DaVinci Resolve: Connect` - Connect to Resolve instance
- `DaVinci Resolve: Import Media` - Import files
- `DaVinci Resolve: Create Timeline` - New timeline
- `DaVinci Resolve: Render` - Start render job

---

## Advanced Automation Options

### Custom LUA Scripts

Create LUA scripts for more complex automation:

```lua
-- Example: Add fade transitions
local resolve = Resolve()
local projectManager = resolve:GetProjectManager()
local project = projectManager:GetCurrentProject()
local timeline = project:GetCurrentTimeline()

-- Add fade in at start
timeline:ApplyTransition("Cross Dissolve", 0, 30)

-- Add fade out at end
local duration = timeline:GetEndFrame()
timeline:ApplyTransition("Cross Dissolve", duration - 30, duration)
```

Save as: `scripts/resolve-transitions.lua`

Run in DaVinci Resolve:
- Workspace → Scripts → `resolve-transitions`

### Batch Processing

Process multiple recordings:

```python
import glob

recordings = glob.glob("C:/Users/*/Videos/Captures/*.mp4")
for recording in recordings:
    process_video(recording)
```

---

## Recommended Workflow

### 🎬 Complete Process (45-90 minutes)

**Recording** (5 min):
1. Win + G → Record screen
2. Play through launch video
3. Save recording

**Automation** (2 min):
1. Run Python script
2. Point to recording file
3. Let it setup project

**Manual Polish** (30-60 min):
1. **Edit Page**:
   - Trim beginning/end
   - Add transitions (Effects Library → Video Transitions → Cross Dissolve)
   - Adjust timing if needed

2. **Fairlight Page** (Optional):
   - Import background music
   - Drag to audio track
   - Adjust volume: -20dB to -15dB
   - Add fade in/out to music
   
   **OR** Record voiceover:
   - Setup microphone
   - Record following script in `docs/LAUNCH_VIDEO_SCRIPT.md`
   - Mix levels: Voiceover -6dB, Music -20dB

3. **Color Page** (Optional):
   - Select all clips
   - Primary Wheels: Boost blues (#38bdf8, #2dd4bf)
   - Add slight contrast (1.1-1.2)
   - Apply to all clips

4. **Deliver Page**:
   - Preset: YouTube 1080p or Custom
   - Format: MP4 H.264
   - Resolution: 1920x1080
   - Frame Rate: 30fps
   - Quality: Automatic or 15-20 Mbps
   - Output: `~/Videos/TOOLS_Launch_Video/`
   - Add to Render Queue → Render All

**Export** (10 min):
- Wait for render to complete
- Review final video
- Upload to platforms

---

## Troubleshooting

### "fusionscript module not found"

**Windows**:
```bash
set PYTHONPATH=C:\Program Files\Blackmagic Design\DaVinci Resolve\fusionscript
python scripts/davinci-resolve-automation.py
```

**Mac**:
```bash
export PYTHONPATH="/Applications/DaVinci Resolve/DaVinci Resolve.app/Contents/Libraries/Fusion/fusionscript"
python3 scripts/davinci-resolve-automation.py
```

### "Cannot connect to DaVinci Resolve"

1. Make sure DaVinci Resolve is running
2. Check Preferences → System → Enable External Scripting
3. Restart DaVinci Resolve
4. Try running script again

### Extension Not Working

1. Check extension settings in VS Code
2. Ensure DaVinci Resolve API is enabled
3. Restart VS Code
4. Reconnect using Command Palette

### Script Fails to Import Media

1. Check file path is correct (use absolute path)
2. Ensure file format is supported (MP4, MOV, AVI)
3. Try importing manually first to test
4. Check Media Pool permissions

---

## Tips for Best Results

### Performance

- Close other applications during render
- Use SSD for footage and project files
- Enable GPU acceleration in Preferences
- Render in H.264 for fastest export

### Quality

- Record at 1920x1080 or higher
- Use 30fps for smooth motion
- Color grade to enhance brand colors
- Export at high bitrate (15-20 Mbps)

### Workflow

- Save project frequently
- Use timeline markers for key moments
- Create multiple versions (with/without music)
- Export platform-specific versions

---

## Export Presets

### YouTube 1080p
- Format: MP4
- Codec: H.264
- Resolution: 1920x1080
- Frame Rate: 30fps
- Quality: Restrict to 15 Mbps
- Audio: AAC 320kbps

### Social Media (Facebook/LinkedIn)
- Same as YouTube preset
- Add subtitles/captions (SRT file)

### Instagram Feed (Square)
- Resolution: 1080x1080
- Crop/reframe content
- Export as MP4

### Instagram/TikTok (Vertical)
- Resolution: 1080x1920
- Reframe for vertical
- Export as MP4

---

## Resources

**DaVinci Resolve**:
- Official Manual: https://documents.blackmagicdesign.com/
- Tutorials: https://www.blackmagicdesign.com/products/davinciresolve/training
- Forums: https://forum.blackmagicdesign.com/

**VS Code Extension**:
- Extension Marketplace: Search "DaVinci Resolve"
- Documentation: Check extension README

**Python API**:
- Scripting Guide: In DaVinci Resolve install folder
- Example Scripts: `/Developer/Scripting/Examples/`

---

## Next Steps

1. **Test the automation script**:
   ```bash
   python scripts/davinci-resolve-automation.py
   ```

2. **Practice the workflow** with a test recording

3. **Add custom automation** as needed

4. **Create templates** for future videos

5. **Export platform-specific versions**

---

**Questions? Check the main video guides:**
- `docs/LAUNCH_VIDEO_SCRIPT.md` - Full script and voiceover
- `docs/VIDEO_PRODUCTION_GUIDE.md` - Production specs
- `docs/VIDEO_RECORDING_GUIDE.md` - Recording instructions
