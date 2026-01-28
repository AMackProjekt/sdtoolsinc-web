# WiX Toolset Integration Guide

## Overview

WiX Toolset is now integrated into the T.O.O.L.S Inc desktop applications for building advanced Windows MSI installers. WiX (Windows Installer XML) provides enterprise-grade installation capabilities.

## What's Included

### Enhanced MSI Features

Both Case Manager Portal and Client Portal now include:

✅ **Custom UI/UX**
- Branded installation wizard with custom images
- Choose installation directory option
- Progress dialogs
- License agreement display (if provided)

✅ **Upgrade Handling**
- Automatic detection of previous versions
- Smooth upgrade path without uninstall
- Unique upgrade codes per application

✅ **Installation Options**
- Per-machine installation (all users)
- Desktop shortcut creation
- Start menu shortcuts
- Run application after installation

✅ **WiX Extensions**
- WixUIExtension - Enhanced UI components
- WixUtilExtension - Utility functions
- Localization support (en-us)

## Installation Prerequisites

### WiX Toolset

**Option 1: Install via Chocolatey (Recommended)**
```powershell
choco install wixtoolset
```

**Option 2: Download Installer**
- Visit: https://wixtoolset.org/releases/
- Download WiX Toolset v3.11 or v4.0
- Run the installer

**Verify Installation:**
```powershell
candle.exe -?
light.exe -?
```

You should see the WiX compiler and linker help text.

### .NET Framework

WiX requires .NET Framework 3.5 or later (usually pre-installed on Windows 10/11).

## Building MSI Installers

### Using NPM Scripts

**Case Manager Portal:**
```bash
cd apps/casemgr-portal
npm install
npm run package              # Builds both MSI and EXE
npm run electron:build:msi   # MSI only
```

**Client Portal:**
```bash
cd apps/client-portal
npm install
npm run package              # Builds both MSI and EXE
npm run electron:build:msi   # MSI only
```

### Using Automated Script

Build both portals at once:
```powershell
.\scripts\build-installers.ps1
```

Output location: `release/` folder

## Configuration Details

### Upgrade Codes

Each application has a unique upgrade code for version management:

- **Case Manager**: `4a1f3e2b-5c6d-4e7f-8a9b-0c1d2e3f4a5b`
- **Client Portal**: `5b2f4e3c-6d7e-5f8a-9b0c-1d2e3f4a5b6c`

These codes enable Windows Installer to:
- Detect installed versions
- Perform in-place upgrades
- Remove old files automatically
- Preserve user data and settings

### WiX Configuration

Both applications use:

```json
{
  "msi": {
    "perMachine": true,           // Install for all users
    "runAfterFinish": true,       // Launch after install
    "upgradeCode": "...",         // Version tracking
    "warningsAsErrors": false     // Build tolerance
  },
  "wix": {
    "lightOptions": [
      "-ext", "WixUIExtension",   // UI components
      "-ext", "WixUtilExtension", // Utilities
      "-cultures:en-us"           // Localization
    ],
    "candleOptions": [
      "-ext", "WixUIExtension",
      "-ext", "WixUtilExtension"
    ],
    "ui": {
      "enabled": true,
      "chooseDirectory": true,    // Allow custom path
      "images": {
        "background": "public/logos/tools-logo.png",
        "banner": "public/logos/tools-logo.png"
      }
    }
  }
}
```

## Customization

### Custom Installation UI

To customize the installation wizard images:

1. **Create custom images:**
   - Banner: 493 x 58 pixels
   - Dialog: 493 x 312 pixels
   - Format: BMP or PNG

2. **Update paths in electron-builder.json:**
```json
"ui": {
  "images": {
    "background": "path/to/dialog-background.png",
    "banner": "path/to/banner.png"
  }
}
```

### License Agreement

Add a license file (RTF format):

```json
"msi": {
  "licenseUrl": "https://toolsinc.org/license",
  "licenseFile": "LICENSE.rtf"
}
```

### Custom Installation Actions

Create a WiX extension file (`custom.wxs`):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Wix xmlns="http://schemas.microsoft.com/wix/2006/wi">
  <Fragment>
    <CustomAction Id="LaunchApplication"
                  FileKey="MainExecutable"
                  ExeCommand=""
                  Execute="immediate"
                  Impersonate="yes"
                  Return="asyncNoWait" />
    
    <InstallExecuteSequence>
      <Custom Action="LaunchApplication" After="InstallFinalize">
        NOT Installed AND LAUNCH_APP
      </Custom>
    </InstallExecuteSequence>
  </Fragment>
</Wix>
```

Reference in electron-builder.json:
```json
"wix": {
  "fragments": ["custom.wxs"]
}
```

## Advanced Features

### Registry Keys

Add registry entries for file associations or settings:

```json
"protocols": [
  {
    "name": "TOOLS Protocol",
    "schemes": ["tools"],
    "role": "Viewer"
  }
]
```

### File Associations

Associate file types with your application:

```json
"fileAssociations": [
  {
    "ext": "tcm",
    "name": "TOOLS Case Manager File",
    "description": "TOOLS Case Manager Document",
    "icon": "build/file-icon.ico",
    "role": "Editor"
  }
]
```

### Environment Variables

Set system environment variables:

```xml
<Environment Id="PATH"
             Name="PATH"
             Value="[INSTALLDIR]"
             Permanent="no"
             Part="last"
             Action="set"
             System="yes" />
```

## Troubleshooting

### WiX Not Found

**Error:** `candle.exe` or `light.exe` not found

**Solution:**
1. Install WiX Toolset (see Prerequisites)
2. Add WiX to PATH:
   ```powershell
   [Environment]::SetEnvironmentVariable("Path", "$env:Path;C:\Program Files (x86)\WiX Toolset v3.11\bin", "Machine")
   ```
3. Restart terminal/IDE

### Build Errors

**Error:** `LGHT0217: Error executing ICE validation`

**Solution:** Add to electron-builder.json:
```json
"msi": {
  "warningsAsErrors": false
}
```

**Error:** `The Windows Installer Service could not be accessed`

**Solution:**
```powershell
# Restart Windows Installer service
net stop msiserver
net start msiserver
```

### Missing Images

**Error:** Image files not found during build

**Solution:**
- Verify image paths are relative to project root
- Ensure images exist in specified locations
- Use proper image formats (BMP, PNG)
- Check image dimensions match WiX requirements

## Testing MSI Installers

### Silent Installation

Test silent install:
```powershell
msiexec /i TOOLS-CaseManager-2.0.0.msi /quiet /l*v install.log
```

### Uninstall Testing

Test uninstall:
```powershell
msiexec /x TOOLS-CaseManager-2.0.0.msi /quiet /l*v uninstall.log
```

### Upgrade Testing

1. Install version 1.0.0
2. Install version 2.0.0 without uninstalling
3. Verify upgrade completes successfully
4. Check that old files are removed
5. Verify shortcuts work correctly

## Deployment

### Group Policy Deployment

For enterprise deployment via Active Directory:

1. Copy MSI to network share
2. Create GPO: Computer Configuration → Software Settings → Software Installation
3. Add new package pointing to MSI
4. Configure deployment options
5. Link GPO to target OUs

### SCCM/Intune Deployment

Package the MSI for Microsoft Endpoint Manager:

1. Create application in SCCM/Intune
2. Use MSI as installation command
3. Set detection method to product code
4. Configure requirements (OS version, disk space)
5. Deploy to device collections

## Best Practices

1. **Version Management**
   - Increment version in package.json
   - Never change upgrade codes
   - Test upgrades before release

2. **File Organization**
   - Keep WiX fragments organized
   - Document custom actions
   - Version control all WiX files

3. **Testing**
   - Test on clean VMs
   - Verify upgrade paths
   - Check uninstall cleanup
   - Test both UI and silent modes

4. **Signing**
   - Code sign MSI files
   - Use trusted certificates
   - Include timestamp server

## Resources

- **WiX Documentation**: https://wixtoolset.org/documentation/
- **electron-builder WiX**: https://www.electron.build/configuration/win#msi-options
- **WiX Tutorial**: https://www.firegiant.com/wix/tutorial/
- **ICE Validation**: https://docs.microsoft.com/windows/win32/msi/ice-validation

## Support

For issues or questions:
1. Check build logs in `dist-electron/` folder
2. Review WiX error codes
3. Consult electron-builder documentation
4. Review project-specific docs in `docs/` folder
