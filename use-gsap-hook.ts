/**
 * Custom useGSAP Hook
 * Enhanced version of @gsap/react useGSAP with additional safety and features
 */

import { useRef, useLayoutEffect, useEffect, RefObject, DependencyList } from 'react';
import { gsap } from 'gsap';
import { useGSAP as useGSAPOriginal } from '@gsap/react';

// Use layout effect for browser, regular effect for SSR
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface UseGSAPConfig {
  scope?: RefObject<Element>;
  dependencies?: DependencyList;
  revertOnUpdate?: boolean;
  respectReducedMotion?: boolean;
}

/**
 * Enhanced useGSAP hook with SSR safety and accessibility features
 */
export function useGSAP(
  callback: () => void | (() => void),
  config: UseGSAPConfig = {}
) {
  const {
    scope,
    dependencies = [],
    revertOnUpdate = true,
    respectReducedMotion = true,
  } = config;

  const contextRef = useRef<gsap.Context | null>(null);
  const prefersReducedMotion = useRef<boolean>(false);

  // Check for reduced motion preference
  useIsomorphicLayoutEffect(() => {
    if (typeof window !== 'undefined' && respectReducedMotion) {
      prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }, [respectReducedMotion]);

  useIsomorphicLayoutEffect(() => {
    // Clean up previous context if revertOnUpdate is true
    if (revertOnUpdate && contextRef.current) {
      contextRef.current.revert();
    }

    // Create new context
    contextRef.current = gsap.context(() => {
      // Only run animations if user doesn't prefer reduced motion or if we're ignoring the preference
      if (!respectReducedMotion || !prefersReducedMotion.current) {
        const cleanup = callback();
        return cleanup;
      }
    }, scope?.current);

    // Return cleanup function
    return () => {
      if (contextRef.current) {
        contextRef.current.revert();
        contextRef.current = null;
      }
    };
  }, dependencies);

  // Return the context for manual control if needed
  return contextRef.current;
}

/**
 * Hook for scroll-based animations with proper cleanup
 */
export function useScrollAnimation(
  callback: () => gsap.core.Tween | gsap.core.Timeline | (() => void),
  dependencies: DependencyList = []
) {
  const animationRef = useRef<gsap.core.Tween | gsap.core.Timeline | null>(null);

  useIsomorphicLayoutEffect(() => {
    // Clean up previous animation
    if (animationRef.current) {
      animationRef.current.kill();
    }

    // Create new animation
    const animation = callback();
    
    if (animation && typeof animation !== 'function') {
      animationRef.current = animation;
    }

    // Return cleanup function
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
        animationRef.current = null;
      }
    };
  }, dependencies);

  return animationRef.current;
}

/**
 * Hook for managing GSAP timelines with play/pause controls
 */
export function useTimeline(
  timelineCreator: () => gsap.core.Timeline,
  dependencies: DependencyList = []
) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useIsomorphicLayoutEffect(() => {
    // Clean up previous timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // Create new timeline
    timelineRef.current = timelineCreator();

    // Return cleanup function
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, dependencies);

  const controls = {
    play: () => timelineRef.current?.play(),
    pause: () => timelineRef.current?.pause(),
    reverse: () => timelineRef.current?.reverse(),
    restart: () => timelineRef.current?.restart(),
    seek: (time: number) => timelineRef.current?.seek(time),
    timeline: timelineRef.current,
  };

  return controls;
}

/**
 * Hook for entrance animations with intersection observer
 */
export function useIntersectionAnimation(
  animationConfig: {
    onEnter?: () => gsap.core.Tween | gsap.core.Timeline;
    onLeave?: () => gsap.core.Tween | gsap.core.Timeline;
    threshold?: number;
    rootMargin?: string;
  },
  dependencies: DependencyList = []
) {
  const elementRef = useRef<Element | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!elementRef.current || typeof window === 'undefined') return;

    const { onEnter, onLeave, threshold = 0.1, rootMargin = '0px' } = animationConfig;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && onEnter) {
            onEnter();
          } else if (!entry.isIntersecting && onLeave) {
            onLeave();
          }
        });
      },
      { threshold, rootMargin }
    );

    observerRef.current.observe(elementRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [animationConfig.threshold, animationConfig.rootMargin, ...dependencies]);

  return elementRef;
}

/**
 * Hook for hover animations
 */
export function useHoverAnimation(
  config: {
    onHover: () => gsap.core.Tween | gsap.core.Timeline;
    onLeave: () => gsap.core.Tween | gsap.core.Timeline;
  },
  dependencies: DependencyList = []
) {
  const elementRef = useRef<HTMLElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseEnter = () => config.onHover();
    const handleMouseLeave = () => config.onLeave();

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, dependencies);

  return elementRef;
}

/**
 * Hook for responsive animations based on screen size
 */
export function useResponsiveAnimation(
  animationConfig: {
    mobile?: () => gsap.core.Tween | gsap.core.Timeline;
    tablet?: () => gsap.core.Tween | gsap.core.Timeline;
    desktop?: () => gsap.core.Tween | gsap.core.Timeline;
  },
  dependencies: DependencyList = []
) {
  const animationRef = useRef<gsap.core.Tween | gsap.core.Timeline | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    // Clean up previous animation
    if (animationRef.current) {
      animationRef.current.kill();
    }

    const updateAnimation = () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }

      const width = window.innerWidth;
      
      if (width < 768 && animationConfig.mobile) {
        animationRef.current = animationConfig.mobile();
      } else if (width < 1024 && animationConfig.tablet) {
        animationRef.current = animationConfig.tablet();
      } else if (animationConfig.desktop) {
        animationRef.current = animationConfig.desktop();
      }
    };

    // Initial animation
    updateAnimation();

    // Listen for resize events
    window.addEventListener('resize', updateAnimation);

    return () => {
      window.removeEventListener('resize', updateAnimation);
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, dependencies);

  return animationRef.current;
}

// Export the original useGSAP for direct usage when needed
export { useGSAP as useGSAPOriginal } from '@gsap/react';

// Re-export the custom useGSAP as default
export { useGSAP as default };

// Export utility types
export interface GSAPHookConfig extends UseGSAPConfig {}
export interface TimelineControls {
  play: () => gsap.core.Timeline | undefined;
  pause: () => gsap.core.Timeline | undefined;
  reverse: () => gsap.core.Timeline | undefined;
  restart: () => gsap.core.Timeline | undefined;
  seek: (time: number) => gsap.core.Timeline | undefined;
  timeline: gsap.core.Timeline | null;
}