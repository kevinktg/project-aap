# Next.js 15 + GSAP Starter

A production-ready **Next.js 15** starter template with **GSAP animations**, **TypeScript**, and **AI assistant optimization** for **Cline** and **Kilo Code**.

## 🚀 Quick Start

```bash
# Clone or download this project
git clone [your-repo-url] my-project
cd my-project

# Install dependencies
npm install
# or
pnpm install
# or
yarn install

# Set up environment variables
cp .env.example .env.local

# Start development server with Turbopack
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## ✨ Features

### Modern Stack
- **Next.js 15.1.6** with App Router and React 19
- **GSAP 3.12.7** with official React integration (`@gsap/react`)
- **TypeScript 5.7.2** with strict configuration
- **Tailwind CSS 3.4.17** with custom design system
- **Turbopack** for blazingly fast development builds

### AI Assistant Optimization
- **Modular .clinerules** system for dynamic rule management
- **Memory Bank** for persistent context across Cline/Kilo sessions
- **Comprehensive documentation** and inline comments
- **VS Code workspace** configuration for optimal AI assistance

### Performance & Quality
- **ESLint 9** + **Prettier 3.4** for code quality
- **Husky** + **lint-staged** for pre-commit hooks
- **Golden ratio timing** for natural animations
- **Accessibility-first** animation patterns

## 📁 Project Structure

```
├── .clinerules/              # AI assistant rules (active)
│   ├── 00-global-standards.md
│   ├── 10-react-nextjs.md
│   ├── 20-gsap-animations.md
│   └── 30-typescript.md
├── .clinerules-bank/         # Inactive rules storage
├── memory_bank/              # Project context for AI assistants
│   ├── brief.md
│   ├── tech-stack.md
│   └── architecture.md
├── .vscode/                  # VS Code workspace settings
├── src/
│   ├── app/                  # Next.js App Router
│   ├── components/           # React components
│   │   ├── ui/              # Reusable UI components
│   │   ├── layout/          # Layout components
│   │   └── animations/      # GSAP animation components
│   ├── lib/                 # Utilities and configurations
│   │   └── gsap/           # GSAP setup and helpers
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript definitions
│   └── styles/              # Global styles
└── public/                  # Static assets
```

## 🎨 GSAP Integration

### Quick Example

```tsx
'use client';

import { useRef } from 'react';
import { useGSAP } from '@/hooks/useGSAP';
import { fadeIn, DURATIONS, EASES } from '@/lib/gsap';

export function AnimatedComponent() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    fadeIn('.animate-me', {
      duration: DURATIONS.normal,
      ease: EASES.smooth,
    });
  }, { scope: container });

  return (
    <div ref={container}>
      <div className="animate-me">This will fade in!</div>
    </div>
  );
}
```

### Available Animations

- **fadeIn()** - Smooth fade in with optional slide
- **slideUp()** - Slide up from bottom with fade
- **staggerAnimation()** - Staggered animations for multiple elements
- **createAccessibleAnimation()** - Respects `prefers-reduced-motion`

### Custom Hooks

- **useGSAP()** - Enhanced version with SSR safety and accessibility
- **useScrollAnimation()** - Scroll-triggered animations
- **useTimeline()** - Timeline management with controls
- **useIntersectionAnimation()** - Intersection Observer animations

## 🤖 AI Assistant Setup

### For Cline Users

1. **Install Cline extension** in VS Code
2. **Configure API provider** (OpenRouter recommended for cost-effectiveness)
3. **Rules are automatically loaded** from `.clinerules/` directory
4. **Memory Bank provides context** across sessions

#### Recommended Models
- **Primary**: Claude 3.5 Sonnet (best for contextual understanding)
- **Cost-effective**: DeepSeek R1 (97% cost reduction vs Claude)
- **Hybrid**: DeepSeek for planning + Claude for execution

### For Kilo Code Users

1. **Install Kilo Code extension** in VS Code
2. **Sign up for free $20 credits** or configure your API keys
3. **Initialize Memory Bank** in Architect mode
4. **Memory Bank files automatically loaded** for persistent context

### Dynamic Rule Management

Move rules between active (`.clinerules/`) and inactive (`.clinerules-bank/`) folders based on context:

```bash
# Activate client-specific rules
mv .clinerules-bank/client-specific.md .clinerules/

# Deactivate when switching projects
mv .clinerules/client-specific.md .clinerules-bank/
```

## 🔧 Development Workflow

### Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type checking
```

### Code Quality

- **Automatic formatting** on save with Prettier
- **ESLint errors fixed** on save where possible
- **Pre-commit hooks** ensure quality before commits
- **Import organization** and unused import removal

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_APP_NAME="My Next.js App"
NEXT_PUBLIC_API_URL="https://api.example.com"

# Add your own variables following Next.js conventions
# Client-side: NEXT_PUBLIC_*
# Server-side: No prefix needed
```

## 🎯 Performance Optimizations

### GSAP Performance
- **Hardware acceleration** with transform properties
- **Golden ratio timing** (0.618s) for natural animations
- **Batch DOM operations** for better performance
- **Automatic cleanup** with `gsap.context()`

### Next.js Optimizations
- **Bundle splitting** with GSAP-specific chunks
- **Image optimization** with Next.js Image component
- **Font optimization** with `next/font`
- **Compression** and **ETags** enabled

### Bundle Analysis

```bash
npm run build
npx @next/bundle-analyzer
```

## ♿ Accessibility

### Animation Accessibility
- **Respects `prefers-reduced-motion`** automatically
- **Focus management** during animations
- **Semantic HTML** structure maintained
- **ARIA labels** and **screen reader** considerations

### Testing Accessibility

```bash
# Install axe-core for accessibility testing
npm install --save-dev @axe-core/react

# Test with screen readers
# Test keyboard navigation
# Validate with axe-core
```

## 📱 Responsive Design

### Breakpoint System

```css
/* Tailwind CSS breakpoints */
sm: '640px'   /* Small devices */
md: '768px'   /* Medium devices */
lg: '1024px'  /* Large devices */
xl: '1280px'  /* Extra large devices */
2xl: '1536px' /* 2X Extra large devices */
```

### Responsive Animations

```tsx
useResponsiveAnimation({
  mobile: () => gsap.to('.element', { x: 50 }),
  tablet: () => gsap.to('.element', { x: 100 }),
  desktop: () => gsap.to('.element', { x: 200 }),
});
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel --prod
```

### Environment Variables for Production
- Set all `NEXT_PUBLIC_*` variables in your hosting platform
- Ensure GSAP licensing compliance for production use

### Other Platforms
- **Netlify**: Use `npm run build` and deploy `out/` folder
- **AWS Amplify**: Connect your Git repository
- **Docker**: Dockerfile included for containerized deployment

## 📖 Learning Resources

### GSAP Documentation
- [GSAP React Guide](https://gsap.com/resources/React/)
- [ScrollTrigger Documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [GSAP Easing Visualizer](https://gsap.com/docs/v3/Eases)

### Next.js 15 Features
- [App Router Documentation](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Next.js 15 Release Notes](https://nextjs.org/blog/next-15)

### AI Assistant Resources
- [Cline Documentation](https://github.com/clinebot/cline)
- [Kilo Code Documentation](https://kilocode.ai/docs)

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Follow the coding standards** (enforced by ESLint/Prettier)
4. **Update documentation** if needed
5. **Submit a pull request**

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **GreenSock** for the amazing GSAP animation library
- **Vercel** for Next.js and incredible tooling
- **Cline** and **Kilo Code** teams for AI-assisted development
- **Tailwind CSS** for the utility-first CSS framework

---

**Built with ❤️ for developers using AI assistants**

For questions, issues, or contributions, please visit our [GitHub repository](https://github.com/your-username/nextjs-gsap-starter).