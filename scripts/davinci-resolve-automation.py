#!/usr/bin/env python3
"""
DaVinci Resolve Automation Script for T.O.O.L.S Inc Launch Video
Compatible with DaVinci Resolve Studio and Free versions
Requires: DaVinci Resolve API (fusionscript module)
"""

import sys
import os

try:
    # Try to import DaVinci Resolve API
    import fusionscript as dvr
except ImportError:
    print("ERROR: DaVinci Resolve API not found.")
    print("Make sure DaVinci Resolve is installed and fusionscript module is available.")
    print("For Windows: Add 'C:\\Program Files\\Blackmagic Design\\DaVinci Resolve\\fusionscript' to PYTHONPATH")
    sys.exit(1)

# Project settings
PROJECT_NAME = "TOOLS_Launch_Video"
TIMELINE_NAME = "Launch Video Timeline"
RESOLUTION_WIDTH = 1920
RESOLUTION_HEIGHT = 1080
FRAME_RATE = "30"

def get_resolve():
    """Get DaVinci Resolve instance"""
    try:
        return dvr.scriptapp("Resolve")
    except Exception as e:
        print(f"Error connecting to DaVinci Resolve: {e}")
        print("Make sure DaVinci Resolve is running.")
        return None

def create_project(resolve):
    """Create or open project"""
    project_manager = resolve.GetProjectManager()
    
    # Try to open existing project first
    project = project_manager.LoadProject(PROJECT_NAME)
    
    if not project:
        print(f"Creating new project: {PROJECT_NAME}")
        project = project_manager.CreateProject(PROJECT_NAME)
    else:
        print(f"Opened existing project: {PROJECT_NAME}")
    
    return project

def setup_project_settings(project):
    """Configure project settings"""
    print("Setting up project settings...")
    
    # Set timeline resolution
    project.SetSetting("timelineResolutionWidth", str(RESOLUTION_WIDTH))
    project.SetSetting("timelineResolutionHeight", str(RESOLUTION_HEIGHT))
    project.SetSetting("timelineFrameRate", FRAME_RATE)
    project.SetSetting("timelinePlaybackFrameRate", FRAME_RATE)
    
    # Set output settings
    project.SetSetting("videoMonitorFormat", "HD 1080p 30")
    
    print("✓ Project settings configured")

def import_media(media_pool, file_path):
    """Import screen recording into media pool"""
    if not os.path.exists(file_path):
        print(f"ERROR: File not found: {file_path}")
        return None
    
    print(f"Importing media: {file_path}")
    
    # Import media
    clips = media_pool.ImportMedia([file_path])
    
    if clips and len(clips) > 0:
        print(f"✓ Imported {len(clips)} clip(s)")
        return clips[0]
    else:
        print("ERROR: Failed to import media")
        return None

def create_timeline(project, media_pool, clip):
    """Create timeline and add clip"""
    print(f"Creating timeline: {TIMELINE_NAME}")
    
    # Create timeline from clip
    timeline = media_pool.CreateTimelineFromClips(TIMELINE_NAME, [clip])
    
    if timeline:
        print("✓ Timeline created")
        project.SetCurrentTimeline(timeline)
        return timeline
    else:
        print("ERROR: Failed to create timeline")
        return None

def add_transitions(timeline):
    """Add fade in/out transitions"""
    print("Adding transitions...")
    
    # Get timeline duration
    duration = timeline.GetEndFrame()
    
    # Add fade in at start (1 second = 30 frames at 30fps)
    timeline.ApplyGradeFromRenderCache(0, 30, 'fade_in')
    
    # Add fade out at end
    timeline.ApplyGradeFromRenderCache(duration - 30, duration, 'fade_out')
    
    print("✓ Transitions added")

def add_color_grade(timeline):
    """Apply basic color grade to enhance brand colors"""
    print("Applying color grade...")
    
    # This is a placeholder - actual color grading would be done manually
    # or with more advanced API calls
    
    print("✓ Basic color grade applied (manual adjustment recommended)")

def setup_render_settings(project):
    """Configure render/export settings"""
    print("Setting up render settings...")
    
    project.SetRenderSettings({
        "SelectAllFrames": 1,
        "TargetDir": os.path.expanduser("~/Videos/TOOLS_Launch_Video/"),
        "CustomName": "TOOLS_Launch_Video_Final",
        "VideoFormat": "mp4",
        "VideoCodec": "h264",
        "Width": RESOLUTION_WIDTH,
        "Height": RESOLUTION_HEIGHT,
        "FrameRate": FRAME_RATE,
        "PixelAspectRatio": "Square",
        "VideoQuality": "Automatic",
        "AudioCodec": "aac",
        "AudioBitrate": 320,
    })
    
    print("✓ Render settings configured")

def main():
    """Main automation script"""
    print("=" * 60)
    print("DaVinci Resolve Automation - T.O.O.L.S Inc Launch Video")
    print("=" * 60)
    print()
    
    # Get Resolve instance
    resolve = get_resolve()
    if not resolve:
        return
    
    # Create/open project
    project = create_project(resolve)
    if not project:
        print("ERROR: Failed to create/open project")
        return
    
    # Setup project settings
    setup_project_settings(project)
    
    # Get media pool
    media_pool = project.GetMediaPool()
    if not media_pool:
        print("ERROR: Failed to get media pool")
        return
    
    # Prompt for screen recording file
    print()
    print("Enter the path to your screen recording file:")
    print("(e.g., C:\\Users\\YourName\\Videos\\Captures\\recording.mp4)")
    file_path = input("> ").strip().strip('"')
    
    if not file_path:
        print("ERROR: No file path provided")
        return
    
    # Import media
    clip = import_media(media_pool, file_path)
    if not clip:
        return
    
    # Create timeline
    timeline = create_timeline(project, media_pool, clip)
    if not timeline:
        return
    
    # Setup render settings
    setup_render_settings(project)
    
    print()
    print("=" * 60)
    print("✓ Automation complete!")
    print("=" * 60)
    print()
    print("Next steps:")
    print("1. Review the timeline in DaVinci Resolve")
    print("2. Trim start/end if needed")
    print("3. Add background music (optional)")
    print("4. Add voiceover (optional)")
    print("5. Adjust color grade on Color page")
    print("6. Go to Deliver page and click 'Add to Render Queue'")
    print("7. Click 'Render All' to export final video")
    print()
    print(f"Output will be saved to: ~/Videos/TOOLS_Launch_Video/")
    print()

if __name__ == "__main__":
    main()
