# React & Next.js Development Rules

## Next.js 15 App Router Patterns

### File-based Routing
- Use `page.tsx` for route pages
- Use `layout.tsx` for shared layouts
- Use `loading.tsx` for loading UI
- Use `error.tsx` for error boundaries
- Use `not-found.tsx` for 404 pages
- Use route groups `(auth)` for organization without affecting URL structure

### Server Components (Default)
- Use Server Components by default for better performance
- Only use Client Components when necessary (`'use client'`)
- Move client-only logic to custom hooks
- Keep Server Components pure and side-effect free

### Data Fetching
- Use `fetch()` with Next.js enhancements in Server Components
- Implement proper error handling for data fetching
- Use Suspense boundaries for streaming
- Cache data appropriately with Next.js caching strategies

## React Best Practices

### Component Structure
```tsx
// 1. Imports (external → internal → relative)
import React from 'react';
import { SomeLibrary } from 'external-lib';

import { CustomHook } from '@/hooks/useCustomHook';
import { ComponentProps } from '@/types/components';

import styles from './Component.module.css';

// 2. Type definitions
interface ComponentProps {
  title: string;
  optional?: boolean;
}

// 3. Component definition
export function Component({ title, optional = false }: ComponentProps) {
  // 4. Hooks (useState, useEffect, custom hooks)
  const [state, setState] = useState(false);
  
  // 5. Event handlers
  const handleClick = useCallback(() => {
    setState(prev => !prev);
  }, []);
  
  // 6. Render
  return (
    <div className={styles.wrapper}>
      <h1>{title}</h1>
    </div>
  );
}
```

### Hooks Rules
- Always use custom hooks for reusable logic
- Keep hooks focused and single-purpose
- Use proper dependency arrays in useEffect
- Prefer useCallback for event handlers
- Use useMemo for expensive calculations only

### State Management
- Use local state (useState) for component-specific state
- Use context for cross-component state that doesn't change often
- Consider Zustand or similar for complex global state
- Avoid prop drilling beyond 2-3 levels

## Next.js Performance Optimization

### Bundle Optimization
- Use dynamic imports for large components: `const Component = dynamic(() => import('./Component'))`
- Implement proper code splitting at route level
- Use Next.js Image component for all images
- Optimize fonts with next/font

### Caching Strategy
- Use revalidate for ISR when appropriate
- Implement proper cache headers
- Use unstable_cache for expensive operations
- Consider edge caching for static content

### SEO & Meta
- Always include proper meta tags in layout.tsx
- Use generateMetadata for dynamic meta tags
- Implement structured data where relevant
- Ensure proper OpenGraph tags

## Error Handling

### Error Boundaries
```tsx
// Create error.tsx in route segments
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-container">
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

### API Routes
- Always return proper HTTP status codes
- Implement request validation
- Use proper error response format
- Add request/response logging

## TypeScript Integration

### Component Props
```tsx
// Always define explicit prop interfaces
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({ variant, size = 'md', children, onClick }: ButtonProps) {
  // Component implementation
}
```

### Generic Components
```tsx
interface SelectProps<T> {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  getLabel: (option: T) => string;
}

export function Select<T>({ options, value, onChange, getLabel }: SelectProps<T>) {
  // Generic component implementation
}
```

## Form Handling

### Server Actions (Next.js 15)
```tsx
// Use Server Actions for form submissions
async function createUser(formData: FormData) {
  'use server';
  
  const name = formData.get('name') as string;
  // Process form data
}

export function UserForm() {
  return (
    <form action={createUser}>
      <input name="name" required />
      <button type="submit">Create User</button>
    </form>
  );
}
```

### Client-side Forms
- Use controlled components for form inputs
- Implement proper form validation
- Provide loading and error states
- Use React Hook Form for complex forms

## Styling Guidelines

### CSS Modules
- Use CSS Modules for component-specific styles
- Follow BEM naming convention in CSS classes
- Keep styles close to components
- Use CSS custom properties for theming

### Tailwind CSS
- Use utility-first approach
- Create component classes in globals.css for repeated patterns
- Use @apply directive sparingly
- Follow consistent spacing scale

## Accessibility Requirements

### Semantic HTML
- Use proper heading hierarchy (h1 → h2 → h3)
- Use semantic elements (nav, main, article, section)
- Include proper ARIA labels and roles
- Ensure keyboard navigation works

### Focus Management
- Implement visible focus indicators
- Manage focus for modals and overlays
- Use skip links for navigation
- Test with keyboard-only navigation

## Testing Standards

### Component Testing
- Test component behavior, not implementation
- Use React Testing Library for component tests
- Mock external dependencies
- Test accessibility with @testing-library/jest-dom

### Integration Testing
- Test user workflows end-to-end
- Use Playwright for E2E tests
- Test responsive behavior
- Validate form submissions and API interactions