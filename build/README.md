# build/

This directory contains resources for the electron-builder desktop installer.

## Required files

| File          | Purpose                                    | Size                                         |
| ------------- | ------------------------------------------ | -------------------------------------------- |
| `icon.ico`    | App icon (taskbar, installer, shortcuts)   | Multi-size ICO (16, 32, 48, 64, 128, 256 px) |
| `sidebar.bmp` | NSIS installer left-panel image (optional) | 164 × 314 px, 24-bit BMP                     |

## Generating icon.ico

Convert your logo PNG to a multi-resolution ICO:

```bash
# Using ImageMagick
convert public/logos/main-logo.png \
  -resize 256x256 -define icon:auto-resize="256,128,64,48,32,16" \
  build/icon.ico

# Or use an online converter: https://convertio.co/png-ico/
# Or use Electron Builder's electron-icon-builder:
npx electron-icon-builder --input=public/logos/main-logo.png --output=build/
```

## Generating sidebar.bmp (optional, NSIS only)

```bash
convert public/logos/main-logo.png \
  -resize 164x314^ -gravity center -extent 164x314 \
  -type TrueColor build/sidebar.bmp
```

> Note: electron-builder will skip installer graphics if the files are missing —
> the build will still succeed with default styling.
