# GSAP Animation Development Rules

## GSAP Setup & Configuration

### GSAP Installation & Licensing
- Use GSAP 3.12.7+ with @gsap/react hook for React integration
- For production: ensure proper GSAP licensing (Standard "No Charge" license for one-time fee projects, Business Green for multiple end users)
- Only use bonus plugins if you have proper Club GreenSock membership
- Import plugins from `/dist/` path in React: `import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'`

### Plugin Registration
```typescript
// Always register plugins before use
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { TextPlugin } from 'gsap/dist/TextPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, TextPlugin, useGSAP);
```

## React Integration Best Practices

### useGSAP Hook (Required)
- ALWAYS use useGSAP hook instead of useEffect for GSAP animations
- useGSAP automatically handles cleanup with gsap.context()
- Provides scoping for selector text safety

```typescript
import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export function AnimatedComponent() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // All GSAP code here is automatically cleaned up
    gsap.to('.animate-me', { 
      x: 100, 
      duration: 1,
      ease: 'power2.out'
    });
  }, { scope: container }); // Scope limits selectors to container

  return (
    <div ref={container}>
      <div className="animate-me">Content</div>
    </div>
  );
}
```

### SSR Compatibility
- Use custom `useIsomorphicLayoutEffect` hook for SSR safety
- Always check for `window` object before DOM manipulation
- Initialize animations on client-side only

```typescript
// Custom hook for SSR safety
import { useLayoutEffect, useEffect } from 'react';

export const useIsomorphicLayoutEffect = 
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
```

### Context and Cleanup
- Always use gsap.context() for proper cleanup
- Revert all animations when component unmounts
- Use scoped selectors to prevent conflicts

```typescript
useGSAP(() => {
  const ctx = gsap.context(() => {
    gsap.timeline()
      .to('.element1', { x: 100 })
      .to('.element2', { y: 50 });
  }, container);

  return () => ctx.revert(); // Automatic cleanup
}, { scope: container });
```

## Animation Performance Optimization

### Hardware Acceleration
- Use transform properties (x, y, scale, rotation) instead of CSS properties
- Prefer `x: 100` over `left: '100px'`
- Use `will-change: transform` sparingly and remove after animation

### Golden Ratio Timing
```typescript
// Use golden ratio for natural timing (0.618)
gsap.defaults({ 
  duration: 0.618, 
  ease: 'power2.out' 
});

// Common easing functions
const EASES = {
  smooth: 'power2.out',
  bounce: 'elastic.out(1, 0.3)',
  sharp: 'power4.inOut',
  gentle: 'sine.inOut'
};
```

### Batch DOM Operations
```typescript
// Batch DOM reads and writes
gsap.batch('.items', {
  onEnter: (elements) => {
    gsap.from(elements, {
      y: 50,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6
    });
  },
  onLeave: (elements) => {
    gsap.to(elements, { opacity: 0.3 });
  },
});
```

## ScrollTrigger Best Practices

### Proper ScrollTrigger Setup
```typescript
useGSAP(() => {
  gsap.registerPlugin(ScrollTrigger);
  
  ScrollTrigger.create({
    trigger: '.trigger-element',
    start: 'top 80%',
    end: 'bottom 20%',
    onEnter: () => gsap.to('.target', { opacity: 1 }),
    onLeave: () => gsap.to('.target', { opacity: 0.5 }),
    markers: process.env.NODE_ENV === 'development', // Only in dev
  });
  
  // Refresh on window resize
  const handleResize = () => ScrollTrigger.refresh();
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  };
}, { scope: container });
```

### Scroll-based Animations
```typescript
// Pin elements during scroll
ScrollTrigger.create({
  trigger: '.pin-section',
  start: 'top top',
  end: '+=300%',
  pin: true,
  scrub: 1, // Smooth scrubbing
  animation: gsap.timeline()
    .to('.element1', { x: 100 })
    .to('.element2', { rotation: 360 }, '<') // Start with previous
});
```

### Performance Configuration
```typescript
// Optimize ScrollTrigger performance
ScrollTrigger.config({
  limitCallbacks: true, // Throttle callbacks
  syncInterval: 120, // Sync every 120ms instead of every frame
});
```

## Animation Patterns

### Stagger Animations
```typescript
// Stagger text animations
gsap.from('.text-lines', {
  y: 50,
  opacity: 0,
  duration: 0.8,
  stagger: {
    amount: 0.6, // Total stagger duration
    from: 'start', // Direction: start, end, center, random
    ease: 'power2.out'
  }
});
```

### Timeline Management
```typescript
const tl = gsap.timeline({ paused: true });

tl.to('.element1', { x: 100, duration: 0.5 })
  .to('.element2', { y: 50, duration: 0.3 }, '-=0.2') // Overlap by 0.2s
  .call(() => console.log('Animation complete'));

// Control timeline
const playAnimation = () => tl.play();
const reverseAnimation = () => tl.reverse();
```

### Responsive Animations
```typescript
useGSAP(() => {
  const mm = gsap.matchMedia();
  
  mm.add('(min-width: 768px)', () => {
    // Desktop animations
    gsap.to('.desktop-element', { x: 200 });
  });
  
  mm.add('(max-width: 767px)', () => {
    // Mobile animations
    gsap.to('.mobile-element', { x: 100 });
  });
  
  return () => mm.revert();
}, { scope: container });
```

## Accessibility Considerations

### Respect User Preferences
```typescript
useGSAP(() => {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // Provide instant state changes
    gsap.set('.animated-element', { opacity: 1, x: 0 });
  } else {
    // Full animation
    gsap.from('.animated-element', { 
      opacity: 0, 
      x: 50, 
      duration: 0.6 
    });
  }
}, { scope: container });
```

### Focus Management
```typescript
// Ensure focus is maintained during animations
const handleFocusableAnimation = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  
  gsap.to(element, {
    opacity: 0,
    onComplete: () => {
      // Hide from screen readers during animation
      element.setAttribute('aria-hidden', 'true');
    }
  });
};
```

## Error Handling & Debugging

### Development Helpers
```typescript
// Add markers only in development
if (process.env.NODE_ENV === 'development') {
  ScrollTrigger.create({
    trigger: '.element',
    markers: true,
    onUpdate: (self) => console.log('Progress:', self.progress)
  });
}
```

### Animation Validation
```typescript
useGSAP(() => {
  // Validate elements exist before animating
  const elements = container.current?.querySelectorAll('.animate-target');
  
  if (!elements || elements.length === 0) {
    console.warn('No animation targets found');
    return;
  }
  
  gsap.from(elements, { opacity: 0, y: 30 });
}, { scope: container });
```

## Common Anti-patterns to Avoid

### DON'T
- ❌ Use useEffect for GSAP animations (memory leaks)
- ❌ Animate CSS properties directly (use transform instead)
- ❌ Forget to register plugins
- ❌ Use querySelector in React (use refs instead)
- ❌ Animate without checking prefers-reduced-motion
- ❌ Apply will-change permanently
- ❌ Nest timelines unnecessarily

### DO
- ✅ Use useGSAP hook for all GSAP animations
- ✅ Use transform properties for performance
- ✅ Register plugins before use
- ✅ Use refs for DOM access
- ✅ Respect accessibility preferences
- ✅ Remove will-change after animations complete
- ✅ Keep animations simple and purposeful