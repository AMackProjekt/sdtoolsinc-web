# Video Demo Files

This directory is for storing the 20-30 second demo videos for T.O.O.L.S Inc.

## Expected Files

Add the following video files to this directory once they are recorded and edited:

1. **personal-dashboard-demo.mp4** (20-30s)
   - Case Manager dashboard overview
   - Case selection and progress tracking

2. **educational-resources-demo.mp4** (20-30s)
   - Course catalog browsing
   - Enrollment and progress tracking

3. **mackai-coach-demo.mp4** (20-30s)
   - MackAI LLM interaction
   - Motivational coaching demonstration

4. **client-casemgr-connection-demo.mp4** (20-30s)
   - Client-Case Manager messaging
   - Appointment scheduling

## Format Specifications

- **Resolution**: 1920×1080 (16:9)
- **Frame Rate**: 30 FPS
- **Codec**: H.264
- **Format**: MP4 (.mp4)
- **Max Size**: 50MB per video

## Recording Guide

See [VIDEO_DEMO_GUIDE.md](../../VIDEO_DEMO_GUIDE.md) in the root directory for detailed instructions on:
- Recording setup and tools
- Editing guidelines
- Text overlays and styling
- Integration with the demos page

## Usage

Videos are embedded in the demos page at `/demos` route.
Reference the video by filename in `app/demos/page.tsx`:

```tsx
<video 
  controls 
  className="w-full h-full"
  src="/videos/demos/personal-dashboard-demo.mp4"
/>
```

Once videos are added, commit changes and push to main branch for automatic Azure deployment.
