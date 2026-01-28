# Adobe After Effects Integration Guide

## Using After Effects for Motion Graphics

Adobe After Effects is perfect for creating high-quality motion graphics, logo animations, and text overlays for your launch video.

---

## Quick Start

### Option 1: Enhance DaVinci Edit with After Effects

**Best for**: Adding professional motion graphics to your video

1. Record screen → Edit in DaVinci Resolve
2. Export specific scenes that need motion graphics
3. Create animations in After Effects
4. Import back into DaVinci Resolve

### Option 2: Full After Effects Workflow

**Best for**: Complete control over every animation

1. Record screen
2. Import into After Effects
3. Create all motion graphics and animations
4. Export final video

---

## Automation Script

### Setup

1. Save your After Effects project first
2. Open After Effects
3. Go to: **File → Scripts → Run Script File**
4. Select: `scripts/after-effects-automation.jsx`

### What It Does

✅ Creates main composition (1920x1080, 30fps, 2 min)  
✅ Sets up 7 scene compositions for each video section  
✅ Applies brand colors (#38bdf8, #2dd4bf, #a78bfa)  
✅ Configures render queue with H.264 export  
✅ Creates output folder in Documents

---

## Motion Graphics Templates

### Scene 2: Logo Animation

**Create animated logo reveal:**

1. **Import Logo**:
   - File → Import → `public/logos/tools-logo.png`
   - Drag to "Scene2_BrandReveal" comp

2. **Add Glow Effect**:
   - Effect → Stylize → Glow
   - Glow Threshold: 0
   - Glow Radius: 50
   - Glow Intensity: 1.5
   - Color: Brand blue (#38bdf8)

3. **Animate Scale**:
   ```
   0s:  Scale = 0%, Opacity = 0%
   1s:  Scale = 110%, Opacity = 100%
   1.5s: Scale = 100%
   ```

4. **Add Text**:
   - Layer → New → Text
   - Type: "T.O.O.L.S Inc"
   - Font: Bold, 120px
   - Apply gradient overlay (blue to teal)

### Scene 3: Feature Cards

**Animated feature highlights:**

1. **Create Shape Layer**:
   - Layer → New → Shape Layer
   - Rectangle tool (glass morphism effect)
   - Add stroke: 2px, #38bdf8 @ 50% opacity

2. **Add Text**:
   - Feature title (bold, 36px)
   - Subtitle (regular, 18px)

3. **Animate In**:
   ```
   Position: Bottom (+100px) → Center
   Opacity: 0% → 100%
   Duration: 0.6s
   Ease: Cubic ease out
   Stagger: 0.2s between cards
   ```

### Statistics Overlays (Scene 1)

**Animated numbers:**

1. **Create Text Layer**: "600,000+"
2. **Add Expression** to Source Text:
   ```javascript
   n = effect("Slider Control")("Slider");
   Math.floor(n).toLocaleString() + "+"
   ```
3. **Add Slider Control**: Effect → Expression Controls → Slider
4. **Keyframes**:
   ```
   0s: Slider = 0
   2s: Slider = 600000 (ease out)
   ```

### Glass Morphism Effect

**For cards and panels:**

1. **Shape Layer** with rounded corners
2. **Effects**:
   - Fast Blur: 40px
   - Fill: White @ 6% opacity
   - Stroke: White @ 12% opacity, 2px
3. **Layer Mode**: Screen or Add

---

## Pre-built Templates

### Export Framer Motion to After Effects

Create a template from your web animations:

**Using Bodymovin/Lottie**:

```bash
npm install --save-dev @lottiefiles/lottie-player
```

Then export animations as JSON for After Effects import.

### Scene Templates

Save these as templates in After Effects:

1. **Text_Reveal_Template.aet**
   - Animated text with fade + slide
   - Brand color gradient
   - 3 second duration

2. **Stat_Counter_Template.aet**
   - Number counting animation
   - Glass card background
   - 2 second duration

3. **Logo_Reveal_Template.aet**
   - Scale animation with glow
   - Color shift (blue → teal)
   - 3 second duration

---

## Hybrid Workflow (Recommended)

### Best of Both Worlds: DaVinci + After Effects

**Timeline**:

1. **Record Screen** (5 min)
   - Win + G → Capture launch video

2. **DaVinci Resolve - Base Edit** (15 min)
   - Import recording
   - Trim, add music
   - Identify sections needing motion graphics

3. **After Effects - Motion Graphics** (60 min)
   - **Scene 1**: Animated statistics
   - **Scene 2**: Logo reveal with glow
   - **Scene 5**: Feature cards animation
   - Export as ProRes 4444 (with alpha)

4. **Back to DaVinci - Compositing** (15 min)
   - Import After Effects renders
   - Layer over base edit
   - Final color grade

5. **Export Final Video** (10 min)
   - Deliver page → H.264
   - 1920x1080, 30fps

**Total Time**: ~2 hours for professional result

---

## After Effects Automation

### ExtendScript Commands

**Create Text Layer with Expression**:

```javascript
var textLayer = comp.layers.addText("T.O.O.L.S Inc");
var textProp = textLayer.property("Source Text");
var textDoc = textProp.value;

textDoc.fontSize = 120;
textDoc.fillColor = [56/255, 189/255, 248/255]; // Brand blue
textDoc.font = "Arial-BoldMT";

textProp.setValue(textDoc);

// Add fade in animation
textLayer.opacity.setValueAtTime(0, 0);
textLayer.opacity.setValueAtTime(100, 1);
```

**Batch Export Scenes**:

```javascript
// Add to automation script
function exportAllScenes() {
    var proj = app.project;
    
    for (var i = 1; i <= proj.items.length; i++) {
        if (proj.items[i] instanceof CompItem) {
            var comp = proj.items[i];
            
            if (comp.name.indexOf("Scene") === 0) {
                addToRenderQueue(comp);
            }
        }
    }
    
    app.project.renderQueue.render();
}
```

### Run from Command Line

**Windows**:
```powershell
& "C:\Program Files\Adobe\Adobe After Effects 2024\Support Files\AfterFX.exe" -r "C:\path\to\after-effects-automation.jsx"
```

**Mac**:
```bash
/Applications/Adobe\ After\ Effects\ 2024/Adobe\ After\ Effects\ 2024.app/Contents/MacOS/After\ Effects -r ~/path/to/after-effects-automation.jsx
```

---

## Export Settings

### For DaVinci Resolve Import

**Format**: QuickTime ProRes 4444  
**Why**: Preserves alpha channel for overlays  
**Settings**:
- Codec: Apple ProRes 4444
- Resolution: 1920x1080
- Frame Rate: 30fps
- Include Alpha: Yes

### For Final Export

**Format**: H.264 MP4  
**Settings**:
- Codec: H.264
- Format: MP4
- Resolution: 1920x1080
- Frame Rate: 30fps
- Bitrate: 15-20 Mbps (VBR, 2-pass)
- Audio: AAC 320kbps

---

## Motion Graphics Assets to Create

### Priority Items

1. **Logo Animation** (Scene 2)
   - 3-5 second reveal
   - Glow effect
   - Scale + fade in

2. **Statistics Overlays** (Scene 1)
   - 3 animated numbers
   - Glass card backgrounds
   - Count-up effect

3. **Feature Cards** (Scene 5)
   - 5 cards
   - Staggered animation
   - Icons + text

4. **Website URL** (Scene 7)
   - Glow emphasis
   - Scale pulse effect
   - Clear call-to-action

### Optional Enhancements

- Transition wipes between scenes
- Particle effects for brand reveal
- Animated background gradients
- Lower thirds for key messages

---

## Templates & Plugins

### Recommended Plugins

**Free**:
- Saber (by Video Copilot) - Glow effects
- Motion Bro - Free templates
- Animation Composer - Presets

**Paid** (Optional):
- Element 3D - 3D logo animations
- Optical Flares - Light effects
- Trapcode Suite - Particles

### Element 3D Logo Animation

If you have Element 3D:

1. Import logo as AI/SVG
2. Extrude in 3D space
3. Add metallic material
4. Animate camera reveal
5. Add environment lighting

---

## Integration with VS Code

### Render Queue Automation

Create npm script in `package.json`:

```json
{
  "scripts": {
    "ae:render": "node scripts/ae-render-automation.js"
  }
}
```

### Watch Mode

Auto-render when JSX files change:

```javascript
// scripts/ae-render-automation.js
const fs = require('fs');
const { exec } = require('child_process');

fs.watch('./scripts/', (eventType, filename) => {
  if (filename.endsWith('.jsx')) {
    exec('afterfx -r scripts/after-effects-automation.jsx');
  }
});
```

---

## Troubleshooting

### "Script not allowed to run"

1. Edit → Preferences → Scripting & Expressions
2. Enable: "Allow Scripts to Write Files and Access Network"
3. Restart After Effects

### Memory Issues

- Purge cache: Edit → Purge → All Memory & Disk Cache
- Reduce preview resolution
- Close other applications
- Increase allocated RAM in preferences

### Slow Renders

- Use proxies for preview
- Render at half resolution for review
- Use GPU acceleration (CUDA/Metal)
- Render overnight for final quality

---

## Best Practices

### Project Organization

```
TOOLS_Launch_Video/
  ├── Footage/
  │   └── screen_recording.mp4
  ├── Assets/
  │   ├── tools-logo.png
  │   ├── brand-colors.txt
  │   └── fonts/
  ├── Compositions/
  │   ├── Scene1_Challenge
  │   ├── Scene2_BrandReveal
  │   └── ...
  └── Renders/
      ├── Scene2_Logo_Animation.mov (ProRes)
      └── Final_Export.mp4 (H.264)
```

### Naming Conventions

- **Comps**: `SceneX_Description`
- **Layers**: `Type_Description` (e.g., `Text_Title`, `Shape_Card`)
- **Renders**: `Scene_Description_v01.mov`

### Workflow Tips

1. Save project frequently (Ctrl+S)
2. Use pre-comps for reusable elements
3. Parent layers for grouped animations
4. Use adjustment layers for global effects
5. Enable motion blur for smoother animation

---

## Resources

**Adobe Docs**:
- ExtendScript Guide: https://ae-scripting.docsforadobe.dev/
- Expression Reference: https://helpx.adobe.com/after-effects/using/expression-reference.html

**Tutorials**:
- Video Copilot: https://www.videocopilot.net/
- School of Motion: https://www.schoolofmotion.com/
- Motion Array: https://motionarray.com/learn/after-effects/

**Templates**:
- Envato Elements: Corporate/Tech templates
- Motion Array: Free templates monthly
- Adobe Stock: Professional templates

---

## Next Steps

1. **Run automation script** to setup project
2. **Import screen recording** into main comp
3. **Create motion graphics** for key scenes
4. **Export** for DaVinci Resolve or as final video
5. **Review** and iterate

---

**Related Guides**:
- `docs/DAVINCI_RESOLVE_AUTOMATION.md` - DaVinci workflow
- `docs/VIDEO_RECORDING_GUIDE.md` - Recording instructions
- `docs/VIDEO_PRODUCTION_GUIDE.md` - Production specs
