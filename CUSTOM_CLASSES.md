# Custom Tailwind CSS Classes

This document explains all the custom classes available in this project.

## 🎨 Custom Colors

### Primary Colors
```html
<!-- Primary color variants -->
<div class="bg-primary-50">Light Primary</div>
<div class="bg-primary-500">Primary</div>
<div class="bg-primary-900">Dark Primary</div>
```

### Secondary Colors
```html
<!-- Secondary color variants -->
<div class="bg-secondary-50">Light Secondary</div>
<div class="bg-secondary-500">Secondary</div>
<div class="bg-secondary-900">Dark Secondary</div>
```

### Accent Colors
```html
<!-- Accent color variants -->
<div class="bg-accent-50">Light Accent</div>
<div class="bg-accent-500">Accent</div>
<div class="bg-accent-900">Dark Accent</div>
```

## 🎯 Custom Components

### Buttons
```html
<!-- Custom button classes -->
<button class="btn-primary">Primary Button</button>
<button class="btn-secondary">Secondary Button</button>
<button class="btn-outline">Outline Button</button>
```

### Cards
```html
<!-- Custom card classes -->
<div class="card">Basic Card</div>
<div class="card-hover">Hoverable Card</div>
<div class="card-glass">Glass Card</div>
```

### Inputs
```html
<!-- Custom input classes -->
<input class="input-primary" placeholder="Primary Input" />
<input class="input-error" placeholder="Error Input" />
```

## 🌈 Custom Gradients

### Background Gradients
```html
<!-- Custom gradient backgrounds -->
<div class="bg-gradient-hero">Hero Gradient</div>
<div class="bg-gradient-card">Card Gradient</div>
<div class="bg-gradient-primary">Primary Gradient</div>
<div class="bg-gradient-secondary">Secondary Gradient</div>
<div class="bg-gradient-accent">Accent Gradient</div>
```

### Text Gradients
```html
<!-- Text gradients -->
<h1 class="text-gradient">Gradient Text</h1>
<h2 class="text-gradient-secondary">Secondary Gradient Text</h2>
```

## 🎭 Custom Animations

### Built-in Animations
```html
<!-- Custom animations -->
<div class="animate-fade-in">Fade In Animation</div>
<div class="animate-slide-up">Slide Up Animation</div>
<div class="animate-bounce-slow">Slow Bounce</div>
<div class="animate-pulse-slow">Slow Pulse</div>
```

### Animation Classes
```html
<!-- Animation utility classes -->
<div class="animate-fade-in">Fade In</div>
<div class="animate-slide-up">Slide Up</div>
```

## 🎪 Custom Effects

### Glass Morphism
```html
<!-- Glass effects -->
<div class="glass">Glass Effect</div>
<div class="glass-dark">Dark Glass Effect</div>
```

### Hover Effects
```html
<!-- Hover effects -->
<div class="hover-lift">Lift on Hover</div>
<div class="hover-glow">Glow on Hover</div>
```

### Shadows
```html
<!-- Custom shadows -->
<div class="shadow-soft">Soft Shadow</div>
<div class="shadow-glow">Glow Shadow</div>
<div class="shadow-glow-lg">Large Glow Shadow</div>
```

## 📐 Custom Layout

### Containers
```html
<!-- Custom containers -->
<div class="container-custom">Custom Container</div>
```

### Spacing
```html
<!-- Custom spacing -->
<div class="section-padding">Section with Custom Padding</div>
<div class="responsive-padding">Responsive Padding</div>
```

### Responsive Text
```html
<!-- Responsive text -->
<h1 class="responsive-text">Responsive Text</h1>
```

## 🎨 Custom Utilities

### Text Utilities
```html
<!-- Text utilities -->
<p class="text-balance">Balanced Text</p>
<p class="text-pretty">Pretty Text</p>
<p class="text-shadow">Text with Shadow</p>
<p class="text-shadow-lg">Large Text Shadow</p>
```

### Scrollbar
```html
<!-- Custom scrollbar -->
<div class="custom-scrollbar">Hidden Scrollbar</div>
<div class="scrollbar-default">Default Scrollbar</div>
```

### Loading States
```html
<!-- Loading effects -->
<div class="loading-shimmer">Loading Shimmer Effect</div>
```

## 🎯 Focus States

### Focus Rings
```html
<!-- Focus utilities -->
<button class="focus-ring">Button with Focus Ring</button>
```

## 📱 Responsive Design

### Responsive Classes
```html
<!-- Responsive utilities -->
<div class="responsive-text">Responsive Text</div>
<div class="responsive-padding">Responsive Padding</div>
```

## 🎨 CSS Variables

### Using CSS Variables
```css
/* Custom CSS variables available */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
  --accent-color: #d946ef;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
}
```

## 🚀 Usage Examples

### Complete Component Example
```tsx
import React from 'react'

export default function ExampleComponent() {
  return (
    <div className="container-custom section-padding">
      <div className="card-hover animate-fade-in">
        <h1 className="text-gradient responsive-text">
          Welcome to Our Platform
        </h1>
        <p className="text-balance">
          This is an example of using custom Tailwind classes.
        </p>
        <div className="space-y-custom">
          <button className="btn-primary hover-lift">
            Get Started
          </button>
          <button className="btn-outline hover-glow">
            Learn More
          </button>
        </div>
      </div>
    </div>
  )
}
```

### Marketing Section Example
```tsx
export default function HeroSection() {
  return (
    <section className="bg-gradient-hero section-padding">
      <div className="container-custom">
        <div className="glass animate-slide-up">
          <h1 className="text-gradient text-4xl md:text-6xl font-bold">
            Transform Your Business
          </h1>
          <p className="text-white/90 responsive-text mt-6">
            Discover amazing features and take control of your business.
          </p>
          <div className="space-x-custom mt-8">
            <button className="btn-primary hover-lift">
              Get Started
            </button>
            <button className="btn-outline text-white border-white hover:bg-white hover:text-primary-600">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
```

### Dashboard Example
```tsx
export default function DashboardCard() {
  return (
    <div className="card-hover animate-fade-in">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-primary-100 rounded-lg">
          <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Revenue</h3>
          <p className="text-2xl font-bold text-primary-600">$45,231</p>
          <p className="text-sm text-green-600">+20.1% from last month</p>
        </div>
      </div>
    </div>
  )
}
```

## 📝 Best Practices

1. **Use semantic class names** - Choose descriptive names that explain the purpose
2. **Combine with existing Tailwind classes** - Mix custom classes with standard Tailwind utilities
3. **Maintain consistency** - Use the same patterns throughout your application
4. **Test responsiveness** - Ensure custom classes work well on all screen sizes
5. **Document new classes** - Add new custom classes to this documentation

## 🔧 Adding New Custom Classes

### In `tailwind.config.ts`
```typescript
// Add to theme.extend
theme: {
  extend: {
    colors: {
      'custom-color': '#your-color',
    },
    animation: {
      'custom-animation': 'customKeyframe 1s ease-in-out',
    },
    keyframes: {
      customKeyframe: {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
    },
  },
},
```

### In `globals.css`
```css
@layer components {
  .your-custom-class {
    @apply bg-blue-500 text-white px-4 py-2 rounded;
  }
}
```

This comprehensive set of custom classes provides a solid foundation for building beautiful, consistent, and maintainable user interfaces. 