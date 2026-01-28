# Fix: "The term 'npm' is not recognized"

## Problem
When running `npm run dev` or any npm command, you get:
```
npm: The term 'npm' is not recognized as a name of a cmdlet, function, script file, or executable program.
```

## Solution

### Option 1: Install Node.js (Recommended)

1. **Download Node.js**
   - Visit: https://nodejs.org/
   - Download the LTS version (Long Term Support)
   - Run the installer

2. **During Installation**
   - ✅ Check "Add to PATH" option
   - ✅ Use default settings
   - Click "Next" through all prompts

3. **Verify Installation**
   ```powershell
   node --version
   npm --version
   ```

4. **Restart Terminal**
   - Close all PowerShell windows
   - Open a new terminal
   - Navigate to project: `cd m:\sdtoolsinc-web`
   - Try: `npm run dev`

### Option 2: Use winget (Windows Package Manager)

```powershell
# Install Node.js via winget
winget install OpenJS.NodeJS.LTS

# Restart terminal, then verify
node --version
npm --version
```

### Option 3: Manual PATH Setup (If Node.js is already installed)

If Node.js is installed but not in PATH:

```powershell
# Find Node.js installation
Get-ChildItem -Path "C:\Program Files" -Filter node.exe -Recurse -ErrorAction SilentlyContinue

# Add to PATH (temporarily for current session)
$env:Path += ";C:\Program Files\nodejs"

# Or permanently (run as Administrator)
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files\nodejs", [EnvironmentVariableTarget]::Machine)
```

## After Fixing

Once npm is working, run:

```powershell
# Start the development server
npm run dev

# Visit http://localhost:3000
```

## Common Installation Locations

Node.js is typically installed at:
- `C:\Program Files\nodejs\`
- `C:\Program Files (x86)\nodejs\`
- `%LOCALAPPDATA%\Programs\nodejs\`
- `%APPDATA%\npm\`

## Still Having Issues?

1. **Restart your computer** after installing Node.js
2. **Check your PATH**:
   ```powershell
   $env:Path -split ";"
   ```
3. **Reinstall Node.js** with administrator privileges
4. **Use nvm-windows** for managing multiple Node.js versions:
   - https://github.com/coreybutler/nvm-windows

## What Node.js Includes

When you install Node.js, you get:
- ✅ `node` - JavaScript runtime
- ✅ `npm` - Package manager
- ✅ `npx` - Package runner

All three should work after installation!
