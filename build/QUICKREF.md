# MSBuild Quick Reference

## Essential Commands

### One-liner: Build Everything

```powershell
msbuild build\Multi-Platform.targets /t:All
```

### One-liner: Build Web + Desktop

```powershell
msbuild build\Multi-Platform.targets /t:BuildWeb-Desktop
```

### One-liner: Clean & Rebuild

```powershell
msbuild build\Multi-Platform.targets /t:Clean;All
```

## Common Workflows

### Development Setup (First Time)

```powershell
# 1. Restore dependencies
msbuild build\Multi-Platform.targets /t:RestoreDependencies

# 2. Start web dev server
msbuild build\Multi-Platform.targets /t:StartWebServer
```

### Production Release

```powershell
# Full build for all platforms
msbuild build\Multi-Platform.targets /t:BuildProduction /p:Configuration=Release
```

### Desktop MSI Packaging

```powershell
# Just build the MSI installer
msbuild build\Multi-Platform.targets /t:BuildDesktopMSI
```

### Run Tests Before Release

```powershell
# Test everything
msbuild build\Multi-Platform.targets /t:Test

# Or test specific platform
msbuild build\Multi-Platform.targets /t:TestWeb
msbuild build\Multi-Platform.targets /t:TestDesktop
msbuild build\Multi-Platform.targets /t:TestMobile
```

## Platform-Specific Builds

### Web Only

```powershell
msbuild build\Multi-Platform.targets /t:BuildWeb
# Output: dist/web/
```

### Desktop Only (Requires Web First)

```powershell
msbuild build\Multi-Platform.targets /t:BuildDesktop
# Output: dist/desktop/
```

### Mobile Only

```powershell
msbuild build\Multi-Platform.targets /t:BuildMobile
# Output: dist/mobile/
```

## Development Servers

### Start Web Dev Server

```powershell
msbuild build\Multi-Platform.targets /t:StartWebServer
# http://localhost:3000
```

### Start Desktop Dev Environment

```powershell
msbuild build\Multi-Platform.targets /t:StartDesktopDev
```

### Start Mobile Dev Environment

```powershell
msbuild build\Multi-Platform.targets /t:StartMobileDev
```

## Configuration Options

### Release Build

```powershell
msbuild build\Multi-Platform.targets /t:All /p:Configuration=Release
```

### Debug Build

```powershell
msbuild build\Multi-Platform.targets /t:All /p:Configuration=Debug
```

### Custom Output Directory

```powershell
msbuild build\Multi-Platform.targets /t:BuildWeb /p:OutputPath="D:\MyOutput\"
```

### Verbose Logging

```powershell
msbuild build\Multi-Platform.targets /t:All /v:diag
```

## Cleaning

### Clean All

```powershell
msbuild build\Multi-Platform.targets /t:Clean
```

### Clean Specific Platform

```powershell
msbuild build\Multi-Platform.targets /t:CleanWeb
msbuild build\Multi-Platform.targets /t:CleanDesktop
msbuild build\Multi-Platform.targets /t:CleanMobile
```

## Validation

### Check Environment

```powershell
msbuild build\Multi-Platform.targets /t:ValidateEnvironment
```

### Validate Web Configuration

```powershell
msbuild build\Multi-Platform.targets /t:ValidateWebConfig
```

### Validate Desktop Configuration

```powershell
msbuild build\Multi-Platform.targets /t:ValidateDesktopConfig
```

## Output Locations

```
dist/
├── web/         ← Next.js static export
├── desktop/     ← Electron MSI & executables
│   └── *.msi    ← Windows installer
└── mobile/      ← Mobile builds
    ├── android/ ← APK/AAB files
    ├── ios/     ← IPA files
    └── web/     ← PWA files
```

## Troubleshooting

### MSBuild Not Found

```powershell
# Use full path
"C:\Program Files\Microsoft Visual Studio\2022\Community\MSBuild\Current\Bin\msbuild.exe" build\Multi-Platform.targets /t:All

# Or use npm directly
npm run build
npm run build:electron
```

### Clean & Retry

```powershell
msbuild build\Multi-Platform.targets /t:Clean
msbuild build\Multi-Platform.targets /t:RestoreDependencies
msbuild build\Multi-Platform.targets /t:All
```

### Check Logs

```powershell
Get-Content obj/logs/* | Select-Object -Last 100
```

## Quick Links

- [Full Documentation](MSBUILD.md)
- [Solution File](../build.sln)
- [Multi-Platform Targets](Multi-Platform.targets)
- [Web Targets](Web.targets)
- [Desktop Targets](Desktop.targets)
- [Mobile Targets](Mobile.targets)

---

**Pro Tip**: Add this to your PowerShell profile for quick access:

```powershell
function MSBuild-All {
  msbuild build\Multi-Platform.targets /t:All
}

function MSBuild-Web {
  msbuild build\Multi-Platform.targets /t:BuildWeb
}

function MSBuild-Desktop {
  msbuild build\Multi-Platform.targets /t:BuildDesktop
}

function MSBuild-Dev {
  msbuild build\Multi-Platform.targets /t:RestoreDependencies
  msbuild build\Multi-Platform.targets /t:StartWebServer
}
```

Then just use: `MSBuild-All`, `MSBuild-Web`, etc.
