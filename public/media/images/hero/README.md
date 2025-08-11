# Hero Images

This folder contains hero section images and background graphics.

## File Naming Convention

- `hero-bg.jpg` - Main hero background image
- `hero-illustration.svg` - Hero illustration
- `hero-mobile.jpg` - Mobile-optimized hero image
- `hero-desktop.jpg` - Desktop-optimized hero image

## Usage

```jsx
import Image from 'next/image'

// In hero components
<Image 
  src="/media/images/hero/hero-bg.jpg" 
  alt="Hero Background" 
  fill
  className="object-cover"
/>
```

## CSS Background Usage

```css
.hero-section {
  background-image: url('/media/images/hero/hero-bg.jpg');
  background-size: cover;
  background-position: center;
}
```

## Best Practices

1. **Optimize images** - Compress for web use
2. **Multiple sizes** - Provide different sizes for responsive design
3. **Alt text** - Always include descriptive alt text
4. **Lazy loading** - Use Next.js Image component for automatic optimization 