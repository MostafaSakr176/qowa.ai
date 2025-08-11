# Marketing & Dashboard Project

A modern Next.js application with separate marketing and dashboard sections, built with TypeScript and Tailwind CSS.

## Project Structure

```
src/
├── app/
│   ├── (marketing)/          # Marketing pages group
│   │   ├── layout.tsx        # Marketing layout
│   │   ├── page.tsx          # Marketing homepage
│   │   ├── about/
│   │   │   └── page.tsx      # About page
│   │   └── contact/
│   │       └── page.tsx      # Contact page
│   ├── (dashboard)/          # Dashboard pages group
│   │   ├── layout.tsx        # Dashboard layout with sidebar
│   │   └── dashboard/
│   │       ├── page.tsx      # Dashboard overview
│   │       ├── analytics/
│   │       │   └── page.tsx  # Analytics page
│   │       ├── users/
│   │       │   └── page.tsx  # Users management
│   │       └── settings/
│   │           └── page.tsx  # Settings page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Root page (marketing homepage)
│   └── globals.css           # Global styles
├── components/               # Shared components
│   ├── ui/                  # Basic UI components
│   │   ├── Button.tsx       # Reusable button component
│   │   ├── Card.tsx         # Reusable card component
│   │   └── index.ts         # Component exports
│   ├── layout/              # Layout components
│   │   ├── Header.tsx       # Header component
│   │   └── index.ts         # Component exports
│   ├── marketing/           # Marketing-specific components
│   ├── dashboard/           # Dashboard-specific components
│   │   ├── MetricCard.tsx   # Metric card component
│   │   └── index.ts         # Component exports
│   └── common/              # Common utility components
└── lib/                     # Utility functions and helpers

public/
├── media/                   # Media assets
│   ├── images/              # Images
│   │   ├── logos/           # Company logos
│   │   ├── hero/            # Hero section images
│   │   ├── features/        # Feature images
│   │   └── team/            # Team photos
│   ├── icons/               # Custom icons
│   ├── videos/              # Video files
│   └── documents/           # PDFs and documents
└── favicon.ico              # Website favicon
```

## Features

### Marketing Section
- **Modern Landing Page**: Beautiful hero section with call-to-action buttons
- **About Page**: Company information, mission, values, and team
- **Contact Page**: Contact form with company information and FAQ
- **Responsive Design**: Mobile-friendly layout with Tailwind CSS
- **Navigation**: Easy navigation between marketing pages and dashboard

### Dashboard Section
- **Overview Dashboard**: Key metrics, charts, and recent activity
- **Analytics Page**: Detailed analytics with traffic sources, conversion funnel, and performance metrics
- **Users Management**: User list with search, filtering, and management tools
- **Settings Page**: Profile settings, preferences, and account management
- **Sidebar Navigation**: Fixed sidebar with navigation links
- **Modern UI**: Clean, professional interface with cards and tables

### Shared Components
- **UI Components**: Reusable buttons, cards, inputs, and other basic UI elements
- **Layout Components**: Headers, footers, sidebars, and navigation components
- **Marketing Components**: Hero sections, feature cards, and contact forms
- **Dashboard Components**: Metric cards, charts, tables, and forms
- **Common Components**: Loading states, error boundaries, and utility components

### Media Assets
- **Organized Structure**: Separate folders for images, videos, icons, and documents
- **Optimized Assets**: Web-optimized images and media files
- **Easy Access**: Clear naming conventions and documentation

## Technology Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React**: Component-based UI library

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Pages Overview

### Marketing Pages
- `/` - Marketing homepage with hero section and features
- `/about` - Company information and team details
- `/contact` - Contact form and company information

### Dashboard Pages
- `/dashboard` - Main dashboard with overview metrics
- `/dashboard/analytics` - Detailed analytics and performance metrics
- `/dashboard/users` - User management and administration
- `/dashboard/settings` - Account settings and preferences

## Component Usage

### Using Shared Components

```tsx
// Import components
import { Button, Card } from '@/components/ui'
import { Header } from '@/components/layout'
import { MetricCard } from '@/components/dashboard'

// Use in your components
export default function MyPage() {
  return (
    <div>
      <Header />
      <Card>
        <h2>Welcome</h2>
        <Button variant="primary">Get Started</Button>
      </Card>
      <MetricCard 
        title="Revenue" 
        value="$45,231" 
        change="+20.1%" 
        changeType="positive"
      />
    </div>
  )
}
```

### Using Media Assets

```tsx
import Image from 'next/image'

// In components
<Image 
  src="/media/images/logos/logo-primary.png" 
  alt="Company Logo" 
  width={200} 
  height={100} 
/>
```

## Key Features

### Marketing Section
- ✅ Responsive design
- ✅ Modern UI with gradients and cards
- ✅ Call-to-action buttons
- ✅ Company information pages
- ✅ Contact form
- ✅ FAQ section

### Dashboard Section
- ✅ Sidebar navigation
- ✅ Overview dashboard with metrics
- ✅ Analytics with charts and data visualization
- ✅ User management with search and filtering
- ✅ Settings page with form controls
- ✅ Professional admin interface

### Shared Components
- ✅ Reusable UI components
- ✅ TypeScript interfaces
- ✅ Consistent styling with Tailwind CSS
- ✅ Easy import/export system
- ✅ Component documentation

### Media Assets
- ✅ Organized folder structure
- ✅ Optimized for web performance
- ✅ Clear naming conventions
- ✅ Usage documentation

## Customization

### Styling
The project uses Tailwind CSS for styling. You can customize:
- Colors in `tailwind.config.js`
- Global styles in `src/app/globals.css`
- Component-specific styles in individual components

### Content
- Update company information in marketing pages
- Modify dashboard metrics and data
- Customize navigation links in layouts
- Add new pages following the existing structure

### Adding New Components
1. Create a new component in the appropriate folder (`ui/`, `layout/`, `marketing/`, `dashboard/`, or `common/`)
2. Add TypeScript interfaces for props
3. Export from the folder's `index.ts` file
4. Import and use in your pages

### Adding New Media Assets
1. Place files in the appropriate `public/media/` subfolder
2. Follow the naming conventions documented in each folder's README
3. Optimize files for web use
4. Update components to reference the new assets

## Development

### File Structure Best Practices
- Use route groups `(marketing)` and `(dashboard)` for organization
- Keep layouts separate for different sections
- Use TypeScript for type safety
- Follow Next.js 14 App Router conventions
- Organize components by purpose and functionality

### Component Organization
- Each component is a separate file with TypeScript interfaces
- Use index files for easier imports
- Follow consistent naming conventions
- Document complex components with JSDoc comments

### Media Asset Organization
- Separate assets by type (images, videos, icons, documents)
- Use descriptive file names
- Optimize for web performance
- Document usage patterns

## Deployment

The project is ready for deployment on platforms like:
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Any static hosting service

## Contributing

1. Follow the existing code structure
2. Use TypeScript for all new files
3. Maintain responsive design
4. Test on different screen sizes
5. Follow the established naming conventions
6. Add components to the appropriate shared folders
7. Optimize media assets before adding

## License

This project is open source and available under the MIT License.
