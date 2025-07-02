/**
 * GSAP Configuration and Setup
 * Centralized GSAP configuration with performance optimizations
 * and React-specific integrations
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { TextPlugin } from 'gsap/dist/TextPlugin';
import { useGSAP } from '@gsap/react';

// Register all GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin, useGSAP);

// Golden ratio timing for natural animations
const GOLDEN_RATIO = 0.618;

// Global GSAP defaults with performance optimizations
gsap.defaults({
  duration: GOLDEN_RATIO,
  ease: 'power2.out',
});

// Configure ScrollTrigger for optimal performance
ScrollTrigger.config({
  limitCallbacks: true, // Throttle callbacks for better performance
  syncInterval: 120, // Sync every 120ms instead of every frame
});

// Easing presets for consistent animations
export const EASES = {
  smooth: 'power2.out',
  sharp: 'power4.inOut',
  bounce: 'elastic.out(1, 0.3)',
  gentle: 'sine.inOut',
  dramatic: 'expo.out',
  natural: 'power1.inOut',
} as const;

// Duration presets based on golden ratio
export const DURATIONS = {
  instant: 0,
  fast: GOLDEN_RATIO * 0.5, // ~0.309s
  normal: GOLDEN_RATIO, // ~0.618s  
  slow: GOLDEN_RATIO * 1.618, // ~1s
  dramatic: GOLDEN_RATIO * 2.618, // ~1.618s
} as const;

// Stagger configurations for common patterns
export const STAGGERS = {
  quick: { amount: 0.2, ease: EASES.smooth },
  normal: { amount: 0.6, ease: EASES.smooth },
  slow: { amount: 1.2, ease: EASES.smooth },
  cascade: { amount: 0.8, from: 'start', ease: EASES.gentle },
} as const;

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Create a responsive animation that respects user preferences
 */
export const createAccessibleAnimation = (
  target: gsap.TweenTarget,
  vars: gsap.TweenVars,
  fallbackVars?: gsap.TweenVars
): gsap.core.Tween => {
  if (prefersReducedMotion()) {
    // Provide instant state change or reduced animation
    return gsap.set(target, fallbackVars || { ...vars, duration: 0 });
  }
  return gsap.to(target, vars);
};

/**
 * Batch DOM operations for better performance
 */
export const batchAnimation = (
  targets: string | NodeList | Element[],
  config: {
    onEnter?: (elements: Element[]) => void;
    onLeave?: (elements: Element[]) => void;
    onEnterBack?: (elements: Element[]) => void;
    onLeaveBack?: (elements: Element[]) => void;
    start?: string;
    end?: string;
  }
) => {
  return gsap.batch(targets, {
    interval: 0.1, // Time between batch calls
    batchMax: 5, // Maximum elements per batch
    ...config,
  });
};

/**
 * Create a timeline with common settings
 */
export const createTimeline = (config?: gsap.TimelineVars): gsap.core.Timeline => {
  return gsap.timeline({
    defaults: {
      duration: DURATIONS.normal,
      ease: EASES.smooth,
    },
    ...config,
  });
};

/**
 * Utility function for fade in animations
 */
export const fadeIn = (
  target: gsap.TweenTarget,
  config?: {
    duration?: number;
    delay?: number;
    y?: number;
    ease?: string;
  }
): gsap.core.Tween => {
  const { duration = DURATIONS.normal, delay = 0, y = 30, ease = EASES.smooth } = config || {};
  
  return createAccessibleAnimation(
    target,
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease,
    },
    { opacity: 1, y: 0 } // Fallback for reduced motion
  );
};

/**
 * Utility function for slide up animations
 */
export const slideUp = (
  target: gsap.TweenTarget,
  config?: {
    duration?: number;
    delay?: number;
    distance?: number;
    ease?: string;
  }
): gsap.core.Tween => {
  const { duration = DURATIONS.normal, delay = 0, distance = 50, ease = EASES.smooth } = config || {};
  
  return createAccessibleAnimation(
    target,
    {
      y: -distance,
      opacity: 1,
      duration,
      delay,
      ease,
    },
    { y: 0, opacity: 1 } // Fallback for reduced motion
  );
};

/**
 * Utility function for stagger animations
 */
export const staggerAnimation = (
  targets: gsap.TweenTarget,
  fromVars: gsap.TweenVars,
  staggerConfig: gsap.StaggerVars = STAGGERS.normal
): gsap.core.Tween => {
  if (prefersReducedMotion()) {
    // Show all elements immediately
    return gsap.set(targets, { opacity: 1, x: 0, y: 0 });
  }
  
  return gsap.from(targets, {
    ...fromVars,
    stagger: staggerConfig,
  });
};

/**
 * Initialize global GSAP settings
 */
export const initializeGSAP = (): void => {
  // Set up global error handling
  gsap.config({
    nullTargetWarn: process.env.NODE_ENV === 'development',
    trialWarn: false, // Disable trial warning if using proper license
  });

  // Refresh ScrollTrigger on route changes
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    });
  }
};

// Initialize GSAP when module loads
initializeGSAP();

// Export gsap instance for direct use
export { gsap, ScrollTrigger, TextPlugin, useGSAP };

// Export types for TypeScript
export type GSAPEase = typeof EASES[keyof typeof EASES];
export type GSAPDuration = typeof DURATIONS[keyof typeof DURATIONS];
export type GSAPStagger = typeof STAGGERS[keyof typeof STAGGERS];