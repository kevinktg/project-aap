# Technology Stack Documentation

## Core Framework
**Next.js 15.1.6**
- **App Router**: File-based routing with nested layouts
- **React Server Components**: Default server-side rendering for performance
- **Turbopack**: Fast bundler for development builds
- **Built-in Optimizations**: Image optimization, font optimization, bundle analysis

## React Ecosystem
**React 19.1.0**
- **New Hooks**: useActionState, useFormStatus for enhanced form handling
- **Concurrent Features**: Automatic batching, Suspense improvements
- **React Compiler**: Experimental automatic optimization

## Animation Library
**GSAP 3.12.7**
- **Core Library**: Timeline, Tween, and basic animations
- **@gsap/react 2.1.2**: Official React integration with useGSAP hook
- **ScrollTrigger**: Scroll-based animations and interactions
- **Performance**: Hardware-accelerated animations with 60fps targets

## TypeScript Setup
**TypeScript 5.7.2**
- **Strict Mode**: Full type safety with strict configuration
- **Path Mapping**: Absolute imports with @ aliases
- **Build Integration**: Next.js built-in TypeScript support
- **Type Definitions**: Comprehensive typing for all components and utilities

## Styling Framework
**Tailwind CSS 3.4.17**
- **Utility-First**: Rapid UI development with utility classes
- **Design System**: Consistent spacing, colors, and typography
- **Dark Mode**: Built-in dark mode support
- **Custom Components**: Component-layer utilities for common patterns

## Development Tooling

### Code Quality
- **ESLint 9.17.0**: Code linting with Next.js and TypeScript rules
- **Prettier 3.4.2**: Code formatting with consistent style
- **Husky 9.1.7**: Git hooks for pre-commit quality checks
- **lint-staged 15.3.0**: Run linters on staged files only

### Build Tools
- **PostCSS 8.5.2**: CSS processing and optimization
- **Autoprefixer 10.4.20**: Automatic vendor prefixing
- **SWC**: Fast Rust-based compiler for TypeScript and JSX

## AI Assistant Integration

### Cline/Kilo Code Optimization
- **Modular Rules**: Organized .clinerules system for different contexts
- **Memory Bank**: Persistent project context across sessions
- **Documentation**: Comprehensive inline documentation and comments

### VS Code Configuration
- **Settings**: Optimized workspace settings for AI assistants
- **Extensions**: Recommended extensions for enhanced productivity
- **Tasks**: Pre-configured build and development tasks
- **Launch**: Debug configurations for development

## Performance & SEO

### Core Web Vitals
- **LCP Optimization**: Image optimization and critical resource loading
- **CLS Prevention**: Proper layout shift prevention techniques
- **FID Enhancement**: Client-side hydration optimization

### SEO Features
- **Meta Tags**: Dynamic and static meta tag management
- **Structured Data**: Schema.org integration capabilities
- **Sitemap**: Automatic sitemap generation
- **Open Graph**: Social media sharing optimization

## Environment & Deployment

### Environment Management
- **Environment Variables**: Proper .env handling with Next.js conventions
- **Type Safety**: Environment variable typing and validation
- **Development/Production**: Separate configurations for different environments

### Deployment Ready
- **Vercel Optimization**: Optimized for Vercel deployment
- **Static Export**: Support for static site generation when needed
- **Docker**: Containerization support for custom deployments

## Browser Support
- **Modern Browsers**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **Progressive Enhancement**: Graceful degradation for older browsers
- **Mobile Optimization**: Full responsive design with mobile-first approach

## Development Dependencies

### Testing Framework (Ready for Integration)
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing utilities
- **Playwright**: End-to-end testing capabilities

### Utility Libraries
- **clsx**: Conditional className utility
- **class-variance-authority**: Type-safe className variants
- **tailwind-merge**: Tailwind class merging utility

## Project Architecture

### Directory Structure
```
src/
├── app/           # Next.js App Router pages and layouts
├── components/    # Reusable React components
├── lib/           # Utility libraries and configurations
├── hooks/         # Custom React hooks
├── types/         # TypeScript type definitions
└── styles/        # Global and component styles
```

### Component Organization
- **UI Components**: Reusable interface elements
- **Layout Components**: Page structure and navigation
- **Animation Components**: GSAP-powered animated elements

### State Management
- **Local State**: React useState for component-specific state
- **Server State**: Next.js built-in data fetching and caching
- **Global State**: React Context for shared application state

## Security Considerations
- **Content Security Policy**: Configured headers for XSS protection
- **Environment Variables**: Proper secret management
- **Type Safety**: Compile-time error prevention
- **Input Validation**: Client and server-side validation patterns

## Scalability Features
- **Code Splitting**: Automatic and manual code splitting strategies
- **Bundle Optimization**: Webpack optimizations for production builds
- **Caching Strategy**: Proper HTTP caching and Next.js caching
- **Image Optimization**: Next.js Image component with WebP/AVIF support