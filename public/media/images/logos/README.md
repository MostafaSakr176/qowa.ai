# Logos

This folder contains company logos and branding assets.

## File Naming Convention

- `logo-primary.png` - Main company logo
- `logo-white.png` - White version for dark backgrounds
- `logo-icon.svg` - Icon-only version
- `favicon.ico` - Website favicon

## Usage

```jsx
import Image from 'next/image'

// In components
<Image 
  src="/media/images/logos/logo-primary.png" 
  alt="Company Logo" 
  width={200} 
  height={100} 
/>
```

## Supported Formats

- PNG (recommended for logos with transparency)
- SVG (scalable, best for icons)
- JPG (for photos, not recommended for logos)
- ICO (for favicons) 