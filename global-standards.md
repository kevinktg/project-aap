# Global Development Standards

## Project Overview
This is a Next.js 15 + GSAP + TypeScript starter project optimized for AI-assisted development using Cline or Kilo Code. The project follows modern web development best practices with a focus on performance, accessibility, and maintainability.

## Coding Standards

### File Naming
- Use PascalCase for React components: `Button.tsx`, `AnimatedSection.tsx`
- Use camelCase for utilities and hooks: `useGSAP.ts`, `formatDate.ts`
- Use kebab-case for non-component files: `global-styles.css`, `api-routes.ts`
- Use descriptive names that clearly indicate purpose

### Code Organization
- Group related functionality into logical directories
- Use index files for clean imports
- Keep components focused and single-purpose
- Separate business logic from presentation

### Import Rules
- Always use absolute imports via path aliases (`@/components/*`)
- Order imports: external libraries → internal modules → relative imports
- Group imports with empty lines between categories
- Use named imports over default imports when possible

### TypeScript Requirements
- Always define proper types and interfaces
- Use strict mode configuration
- Avoid `any` type - use proper typing or `unknown`
- Define component prop interfaces explicitly
- Use generic types for reusable components

### Code Quality
- Write self-documenting code with clear variable names
- Add JSDoc comments for complex functions
- Keep functions small and focused (< 50 lines)
- Use early returns to reduce nesting
- Prefer composition over inheritance

## Error Handling
- Always handle async operations with proper error boundaries
- Use try-catch blocks for API calls
- Provide meaningful error messages
- Log errors appropriately (warn/error levels only)

## Performance
- Use dynamic imports for code splitting
- Optimize images with Next.js Image component
- Implement proper loading states
- Use React.memo for expensive components
- Avoid unnecessary re-renders with useCallback/useMemo

## Accessibility
- Always include proper ARIA labels
- Ensure keyboard navigation works
- Maintain proper heading hierarchy
- Use semantic HTML elements
- Test with screen readers
- Respect prefers-reduced-motion for animations

## Testing
- Write unit tests for utility functions
- Create integration tests for components
- Use meaningful test descriptions
- Mock external dependencies
- Aim for 80%+ test coverage on critical paths