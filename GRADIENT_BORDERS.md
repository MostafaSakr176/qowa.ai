# Gradient Border Styles

This document explains how to use the shared gradient border styles in your project.

## CSS Utility Classes

### Basic Usage
Add these classes to any element to create gradient borders:

```html
<!-- Default blue gradient border -->
<div class="gradient-border rounded-lg p-4">
  Content here
</div>

<!-- Purple gradient border -->
<div class="gradient-border-purple rounded-lg p-4">
  Content here
</div>

<!-- Glowing gradient border -->
<div class="gradient-border-glow rounded-lg p-4">
  Content here
</div>

<!-- Animated gradient border -->
<div class="gradient-border-animated rounded-lg p-4">
  Content here
</div>
```

## React Component

### GradientBorder Component
Use the `GradientBorder` component for more control:

```tsx
import GradientBorder from '@/components/ui/gradient-border'

// Basic usage
<GradientBorder className="p-4 rounded-lg">
  <div>Your content here</div>
</GradientBorder>

// With different variants
<GradientBorder variant="purple" className="p-4 rounded-lg">
  <div>Purple gradient border</div>
</GradientBorder>

<GradientBorder variant="glow" className="p-4 rounded-lg">
  <div>Glowing border</div>
</GradientBorder>

<GradientBorder variant="animated" className="p-4 rounded-lg">
  <div>Animated border</div>
</GradientBorder>

// With hover effect
<GradientBorder hover className="p-4 rounded-lg">
  <div>Hover to scale</div>
</GradientBorder>

// Custom border width and radius
<GradientBorder 
  borderWidth={3} 
  borderRadius="12px" 
  className="p-4"
>
  <div>Custom styling</div>
</GradientBorder>
```

## Available Variants

1. **default** - Blue gradient border (matches your brand colors)
2. **purple** - Purple gradient border
3. **glow** - Blue gradient with blur effect
4. **animated** - Animated gradient that shifts colors

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Content to wrap |
| `className` | string | '' | Additional CSS classes |
| `variant` | 'default' \| 'purple' \| 'glow' \| 'animated' | 'default' | Border style variant |
| `borderWidth` | number | 2 | Border width in pixels |
| `borderRadius` | string | 'inherit' | Border radius |
| `hover` | boolean | false | Enable hover scale effect |

## Examples

### Cards with Gradient Borders
```tsx
<GradientBorder variant="animated" className="p-6 rounded-xl">
  <div className="text-center">
    <h3 className="text-xl font-bold text-white mb-2">Feature Title</h3>
    <p className="text-white/80">Feature description here</p>
  </div>
</GradientBorder>
```

### Buttons with Gradient Borders
```tsx
<GradientBorder hover className="rounded-full">
  <button className="px-6 py-3 bg-transparent text-white font-medium">
    Click Me
  </button>
</GradientBorder>
```

### Custom Styling
```tsx
<GradientBorder 
  variant="glow" 
  borderWidth={4} 
  borderRadius="20px"
  className="p-8"
>
  <div className="text-center">
    <h2 className="text-2xl font-bold text-white">Special Content</h2>
  </div>
</GradientBorder>
```

## Notes

- The gradient borders use CSS masks for clean edges
- All variants are responsive and work on all screen sizes
- The animated variant runs continuously
- Hover effects use Framer Motion for smooth animations
- Border width can be customized via the `borderWidth` prop 