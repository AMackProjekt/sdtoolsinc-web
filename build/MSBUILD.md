# T.O.O.L.S Inc Multi-Platform MSBuild System

Unified build orchestration for Web (Next.js), Desktop (Electron), and Mobile platforms.

## Directory Structure

```
build/
├── Multi-Platform.targets    # Main orchestration file
├── Web.targets              # Next.js web build targets
├── Desktop.targets          # Electron desktop build targets
├── Mobile.targets           # Mobile app build targets
├── Common.props             # Shared properties and configuration
└── MSBUILD.md              # This file

build.sln                    # Visual Studio solution file
```

## Quick Start

### Build All Platforms

```bash
# Visual Studio / MSBuild
msbuild build.sln

# Command line
msbuild build\Multi-Platform.targets /t:All

# PowerShell
& "C:\Program Files\Microsoft Visual Studio\2022\Community\MSBuild\Current\Bin\msbuild.exe" build\Multi-Platform.targets /t:All
```

### Build Specific Platforms

```bash
# Build only Web
msbuild build\Multi-Platform.targets /t:BuildWeb

# Build only Desktop
msbuild build\Multi-Platform.targets /t:BuildDesktop

# Build only Mobile
msbuild build\Multi-Platform.targets /t:BuildMobile

# Build Web + Desktop
msbuild build\Multi-Platform.targets /t:BuildWeb-Desktop
```

### Development Workflows

```bash
# Start web development server
msbuild build\Multi-Platform.targets /t:StartWebServer

# Start desktop development environment
msbuild build\Multi-Platform.targets /t:StartDesktopDev

# Start mobile development environment
msbuild build\Multi-Platform.targets /t:StartMobileDev
```

### Clean & Restore

```bash
# Restore all dependencies
msbuild build\Multi-Platform.targets /t:RestoreDependencies

# Clean all build artifacts
msbuild build\Multi-Platform.targets /t:Clean

# Full rebuild
msbuild build\Multi-Platform.targets /t:Clean;All
```

### Testing

```bash
# Run all tests
msbuild build\Multi-Platform.targets /t:Test

# Run web tests only
msbuild build\Multi-Platform.targets /t:TestWeb

# Run desktop tests only
msbuild build\Multi-Platform.targets /t:TestDesktop

# Run mobile tests only
msbuild build\Multi-Platform.targets /t:TestMobile
```

## Build Targets Reference

### Multi-Platform.targets

| Target                  | Description                                        |
| ----------------------- | -------------------------------------------------- |
| **All**                 | Build all platforms (Web, Desktop, Mobile)         |
| **Clean**               | Clean all build artifacts                          |
| **RestoreDependencies** | Install/restore npm dependencies for all platforms |
| **Test**                | Run tests for all platforms                        |
| **BuildProduction**     | Clean build all for production                     |
| **BuildWeb-Desktop**    | Build Web and Desktop only (common scenario)       |
| **ValidateEnvironment** | Check Node.js and npm versions                     |

### Web.targets

| Target                     | Description                                |
| -------------------------- | ------------------------------------------ |
| **BuildWeb**               | Build Next.js static export for production |
| **BuildWebDev**            | Start Next.js dev server                   |
| **CleanWeb**               | Clean Next.js build artifacts              |
| **RestoreWebDependencies** | Install web npm dependencies               |
| **TestWeb**                | Run web tests (vitest)                     |
| **LintWeb**                | Lint web code (ESLint)                     |
| **StartWebServer**         | Start dev server on http://localhost:3000  |
| **ValidateWebConfig**      | Validate Next.js configuration             |

### Desktop.targets

| Target                         | Description                           |
| ------------------------------ | ------------------------------------- |
| **BuildDesktop**               | Build Electron app with MSI installer |
| **BuildDesktopDev**            | Start Electron dev environment        |
| **BuildDesktopMSI**            | Build MSI installer only              |
| **CleanDesktop**               | Clean Electron build artifacts        |
| **RestoreDesktopDependencies** | Install desktop npm dependencies      |
| **TestDesktop**                | Run desktop tests                     |
| **StartDesktopDev**            | Start Electron dev environment        |
| **PackageDesktopPortable**     | Build portable executable             |
| **ValidateDesktopConfig**      | Validate Electron configuration       |

### Mobile.targets

| Target                        | Description                                    |
| ----------------------------- | ---------------------------------------------- |
| **BuildMobile**               | Build all mobile platforms (Android, iOS, Web) |
| **BuildMobileAndroid**        | Build Android APK/AAB                          |
| **BuildMobileIOS**            | Build iOS app (macOS only)                     |
| **BuildMobileWeb**            | Build mobile PWA                               |
| **CleanMobile**               | Clean mobile build artifacts                   |
| **RestoreMobileDependencies** | Install mobile npm dependencies                |
| **TestMobile**                | Run mobile tests                               |
| **StartMobileDev**            | Start mobile dev environment                   |
| **InitMobileProject**         | Setup mobile project structure                 |

## Configuration Properties

### Configuration Types

- **Debug**: Unoptimized build with full debug info
- **Release**: Optimized build with minimal debug info

### Build Paths

```
ProjectRoot         = Project root directory
OutputPath          = dist/
BuildTempPath       = obj/
LogsPath            = obj/logs/
```

### Platform-Specific Paths

```
Web:     dist/web/           (Next.js static export)
Desktop: dist/desktop/       (Electron MSI, executables)
Mobile:  dist/mobile/        (APK, IPA, PWA)
         dist/mobile/android (APK/AAB files)
         dist/mobile/ios     (IPA files)
         dist/mobile/web     (PWA files)
```

## Usage Examples

### Development Workflow

```bash
# 1. Restore dependencies
msbuild build\Multi-Platform.targets /t:RestoreDependencies

# 2. Start web development server
msbuild build\Multi-Platform.targets /t:StartWebServer
```

### Production Release

```bash
# Full production build with tests
msbuild build\Multi-Platform.targets /t:BuildProduction

# Output available in dist/ directory
```

### CI/CD Integration

```bash
# PowerShell
$msbuild = "C:\Program Files\Microsoft Visual Studio\2022\Community\MSBuild\Current\Bin\msbuild.exe"

# Build all platforms
& $msbuild build\Multi-Platform.targets /t:All /p:Configuration=Release

# Run tests
& $msbuild build\Multi-Platform.targets /t:Test

# Package output
```

### Platform-Specific Release

```bash
# Web only (static hosting)
msbuild build\Multi-Platform.targets /t:BuildWeb

# Desktop only (MSI installer)
msbuild build\Multi-Platform.targets /t:BuildDesktopMSI

# Mobile only (all platforms)
msbuild build\Multi-Platform.targets /t:BuildMobile
```

## Environment Requirements

### Windows (Web + Desktop)

- Node.js 18+ with npm
- Visual Studio 2022 or MSBuild CLI tools
- .NET Framework 4.7.2+

### macOS (Web + Desktop + iOS)

- Node.js 18+ with npm
- Xcode command line tools
- Electron build dependencies

### Linux (Web + Mobile Web)

- Node.js 18+ with npm
- Build essentials for native modules

## Troubleshooting

### Command Not Found: msbuild

**Windows**: Install Visual Studio Build Tools or Visual Studio Community

```powershell
# Or use npm scripts directly
npm run build
npm run build:electron
```

### Dependencies Installation Fails

```bash
# Clear npm cache
npm cache clean --force

# Reinstall
msbuild build\Multi-Platform.targets /t:Clean;RestoreDependencies
```

### Build Artifacts Not Found

```bash
# Check output paths
Get-Item -Path "dist/" -Recurse

# Verify build completed successfully
msbuild build\Multi-Platform.targets /t:All /v:diag
```

### Port Already in Use (Dev Server)

```bash
# Web server uses port 3000
# Kill existing process on Windows
Get-Process node | Stop-Process -Force

# Or specify different port
npm run dev -- -p 3001
```

## Customization

### Adding Build Targets

Edit the appropriate `.targets` file and add your target:

```xml
<Target Name="CustomBuild" DependsOnTargets="BuildWeb">
  <Message Text="Custom build step" Importance="high" />
  <Exec Command="custom-command" WorkingDirectory="$(ProjectRoot)" />
</Target>
```

### Modifying Output Paths

Edit `Common.props` or pass as parameter:

```bash
msbuild build\Multi-Platform.targets /t:BuildWeb /p:OutputPath="D:\CustomOutput\"
```

### Conditional Builds

Use properties in targets:

```xml
<Target Name="BuildWeb" Condition="'$(SkipWeb)' != 'true'">
  <!-- Build steps -->
</Target>
```

Run with:

```bash
msbuild build\Multi-Platform.targets /t:All /p:SkipWeb=true
```

## Integration with npm Scripts

The MSBuild targets wrap npm scripts defined in `package.json`. Key npm scripts:

### Web

- `npm run dev` - Start Next.js dev server
- `npm run build` - Build static export
- `npm run lint` - Lint code
- `npm run test` - Run tests

### Desktop

- `npm run electron-dev` - Start Electron dev environment
- `npm run build:electron` - Build Electron app
- `npm run electron:package` - Package MSI

### Mobile

- `npm run build:android` - Build Android
- `npm run build:ios` - Build iOS
- `npm run build:web` - Build PWA

## Best Practices

1. **Always restore dependencies first**: `RestoreDependencies` target
2. **Clean before production builds**: Include `Clean` in dependency chain
3. **Validate environment**: Run `ValidateEnvironment` for CI/CD
4. **Use appropriate configurations**: Debug for dev, Release for production
5. **Check logs**: Build logs saved in `obj/logs/` for troubleshooting
6. **Test before release**: Run `Test` target to validate all platforms

## Support

For issues or questions about the build system:

1. Check build logs in `obj/logs/`
2. Run with verbose logging: `/v:diag`
3. Validate environment: `ValidateEnvironment` target
4. Check platform-specific documentation in respective `.targets` files

## Version

Build System Version: 1.0.0

Last Updated: 2026-04-24

---

**T.O.O.L.S Inc Multi-Platform Build System** | Enterprise Demo
