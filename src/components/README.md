# Shared Components

This folder contains reusable React components that can be used across different pages and sections of the application.

## Folder Structure

```
src/components/
├── ui/              # Basic UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   └── Modal.tsx
├── layout/          # Layout components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Sidebar.tsx
│   └── Navigation.tsx
├── marketing/       # Marketing-specific components
│   ├── HeroSection.tsx
│   ├── FeatureCard.tsx
│   └── ContactForm.tsx
├── dashboard/       # Dashboard-specific components
│   ├── MetricCard.tsx
│   ├── Chart.tsx
│   ├── UserTable.tsx
│   └── SettingsForm.tsx
└── common/          # Common utility components
    ├── Loading.tsx
    ├── ErrorBoundary.tsx
    └── SEO.tsx
```

## Component Guidelines

### Naming Convention
- Use PascalCase for component names
- Use descriptive names that indicate the component's purpose
- Add `.tsx` extension for TypeScript components

### File Structure
```tsx
// Example component structure
import React from 'react'

interface ComponentProps {
  title: string
  description?: string
}

export default function ComponentName({ title, description }: ComponentProps) {
  return (
    <div>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  )
}
```

### Import/Export Pattern
```tsx
// In component files
export default function ComponentName() {
  // component code
}

// In index files for easier imports
export { default as Button } from './Button'
export { default as Card } from './Card'
```

## Usage Examples

### Basic Component
```tsx
// src/components/ui/Button.tsx
import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  onClick?: () => void
}

export default function Button({ children, variant = 'primary', onClick }: ButtonProps) {
  const baseClasses = 'px-4 py-2 rounded-md font-medium'
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300'
  }

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
```

### Using Components
```tsx
// In any page or component
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function MyPage() {
  return (
    <Card>
      <h2>Welcome</h2>
      <Button variant="primary">Get Started</Button>
    </Card>
  )
}
```

## Best Practices

1. **Keep components focused** - Each component should have a single responsibility
2. **Use TypeScript** - Define proper interfaces for props
3. **Make components reusable** - Avoid hardcoding specific content
4. **Follow naming conventions** - Be consistent with file and component names
5. **Add proper documentation** - Include JSDoc comments for complex components
6. **Test components** - Create tests for reusable components
7. **Optimize for performance** - Use React.memo for expensive components

## Component Categories

### UI Components
Basic building blocks like buttons, inputs, cards, etc.

### Layout Components
Components that define the structure of pages (headers, footers, sidebars)

### Marketing Components
Components specific to marketing pages (hero sections, feature cards)

### Dashboard Components
Components specific to dashboard functionality (charts, tables, forms)

### Common Components
Utility components used across the application (loading states, error boundaries) 