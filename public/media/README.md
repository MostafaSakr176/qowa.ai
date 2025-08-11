# Media Assets

This folder contains all media assets for the project including images, videos, icons, and other static files.

## Folder Structure

```
public/media/
├── images/          # Images (logos, photos, illustrations)
│   ├── logos/       # Company logos and branding
│   ├── hero/        # Hero section images
│   ├── features/    # Feature section images
│   └── team/        # Team member photos
├── icons/           # Custom icons and SVGs
├── videos/          # Video files
└── documents/       # PDFs and other documents
```

## Usage

### In Next.js Components

```jsx
// Import images
import Image from 'next/image'
import logo from '@/public/media/images/logos/logo.png'

// Use in components
<Image src="/media/images/logos/logo.png" alt="Logo" width={200} height={100} />
```

### In CSS/SCSS

```css
.hero-section {
  background-image: url('/media/images/hero/hero-bg.jpg');
}
```

## Best Practices

1. **Optimize images** before adding to this folder
2. **Use descriptive names** for files
3. **Organize by type** (images, videos, etc.)
4. **Keep file sizes reasonable** for web performance
5. **Use appropriate formats** (WebP for images, MP4 for videos)

## Supported Formats

- **Images**: PNG, JPG, JPEG, WebP, SVG
- **Videos**: MP4, WebM, OGV
- **Documents**: PDF, DOC, DOCX
- **Icons**: SVG, PNG, ICO 