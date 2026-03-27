# Fypod Icon Generation Instructions

## Quick Start

1. Open `generate_icons.html` in your browser
2. Click the download buttons to get all 3 icon sizes
3. Save them in the `icons/` folder as:
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`

## Design Specifications

The icon features:
- **Background**: Dark gray squircle (#1a1a1a) with rounded corners
- **Letter F**: Organic, ribbon-like shape in light gray (#e0e0e0)
- **Wireframe Cube**: 3D geometric overlay with thin white lines
- **Multi-layered Effect**: Diagonal cross lines showing depth
- **Grayscale Only**: No colors, strictly monochrome

## Visual Concept

```
┌─────────────────────┐
│  ╔═══════╗          │  <- Rounded square (squircle)
│  ║ ████  ║          │
│  ║ ████  ║  ┌─┐     │  <- Organic 'F' shape
│  ║ ██    ║  │ │     │
│  ║ ████  ║  └─┘     │  <- 3D wireframe cube overlay
│  ║ ██    ║          │
│  ║ ██    ║          │
│  ╚═══════╝          │
└─────────────────────┘
```

## Alternative: Use SVG

The `icons/icon.svg` file contains a vector version. You can:

1. Open it in Figma/Illustrator
2. Export at different sizes (16px, 48px, 128px)
3. Save as PNG files

## Alternative: Commission on Fiverr

If you want a professional designer:

**Search**: "minimalist tech logo design"

**Brief**:
> Create a minimalist, monochrome hybrid logo for a tech extension called "Fypod". 
> 
> Design requirements:
> - Rounded square background (squircle shape)
> - Organic, ribbon-like stylized letter 'F' that flows gracefully
> - Overlaid with a precise 3D geometric wireframe cube
> - Thin, sharp lines for the wireframe
> - Multi-layered effect showing contrast between fluid and rigid
> - Strictly grayscale with soft directional lighting
> - High-end, tech-focused, elegant aesthetic
> 
> Deliverables: 3 PNG files (16x16, 48x48, 128x128 pixels)
> 
> Budget: $20
> Turnaround: 24 hours

## Testing

After generating icons:

1. Replace placeholder icons in `icons/` folder
2. Load extension in Chrome (`chrome://extensions/`)
3. Check icon appears correctly in:
   - Browser toolbar
   - Extension popup
   - Chrome Web Store listing

## Current Status

✅ SVG version created (`icons/icon.svg`)
✅ HTML generator created (`generate_icons.html`)
✅ Inline SVG added to popup.html (no external file needed)
⏳ PNG files need to be generated (use HTML generator)

## Notes

- The popup.html now uses inline SVG, so the extension works without PNG files
- PNG files are only needed for Chrome Web Store listing and browser toolbar
- The inline SVG scales perfectly at any size
