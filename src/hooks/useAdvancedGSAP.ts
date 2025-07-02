import { useEffect, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';

// Register FLIP plugin
gsap.registerPlugin(Flip);

// Custom useGSAP hook for React
export const useGSAP = (
  callback: (context: { selector: (selector: string) => gsap.TweenTarget }) => void | (() => void),
  dependencies: any[] = [],
  scope?: React.RefObject<HTMLElement>
) => {
  const cleanupRef = useRef<(() => void) | void>();

  useLayoutEffect(() => {
    // Cleanup previous animations
    if (cleanupRef.current) {
      cleanupRef.current();
    }

    const context = gsap.context(() => {
      const selector = (sel: string) => {
        return scope?.current ? scope.current.querySelectorAll(sel) : gsap.utils.toArray(sel);
      };

      cleanupRef.current = callback({ selector });
    }, scope?.current);

    return () => {
      context.revert();
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, dependencies);

  return cleanupRef;
};

// FLIP Animation utilities
export const useFLIPAnimations = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const animateCardTransition = (
    fromCards: HTMLElement[],
    toCards: HTMLElement[],
    options: {
      duration?: number;
      ease?: string;
      stagger?: number;
      onComplete?: () => void;
    } = {}
  ) => {
    const {
      duration = 0.8,
      ease = 'power2.inOut',
      stagger = 0.1,
      onComplete
    } = options;

    // Record initial state
    const state = Flip.getState(fromCards);

    // Apply changes (this would be done by React state update)
    // The DOM changes happen here via React re-render

    // Animate from old state to new state
    return Flip.from(state, {
      duration,
      ease,
      stagger,
      scale: true,
      absolute: true,
      onComplete,
      onEnter: (elements) => {
        // Animate new elements entering
        gsap.fromTo(elements, 
          {
            opacity: 0,
            scale: 0.5,
            rotationY: 90
          },
          {
            opacity: 1,
            scale: 1,
            rotationY: 0,
            duration: duration * 0.6,
            ease: 'back.out(1.7)'
          }
        );
      },
      onLeave: (elements) => {
        // Animate elements leaving
        gsap.to(elements, {
          opacity: 0,
          scale: 0.5,
          rotationY: -90,
          duration: duration * 0.4,
          ease: 'power2.in'
        });
      }
    });
  };

  const morphElement = (
    element: HTMLElement,
    targetState: {
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      rotation?: number;
      scale?: number;
    },
    options: {
      duration?: number;
      ease?: string;
      onComplete?: () => void;
    } = {}
  ) => {
    const { duration = 0.6, ease = 'power3.out', onComplete } = options;

    return gsap.to(element, {
      ...targetState,
      duration,
      ease,
      onComplete,
      transformOrigin: 'center center'
    });
  };

  const createMagneticEffect = (elements: HTMLElement[]) => {
    elements.forEach((element) => {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) * 0.1;
        const deltaY = (e.clientY - centerY) * 0.1;

        gsap.to(element, {
          x: deltaX,
          y: deltaY,
          duration: 0.3,
          ease: 'power2.out'
        });
      };

      const handleMouseLeave = () => {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.6)'
        });
      };

      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseleave', handleMouseLeave);
      };
    });
  };

  const createParallaxCards = (cards: HTMLElement[]) => {
    cards.forEach((card, index) => {
      const speed = 0.5 + (index * 0.1);
      
      gsap.to(card, {
        y: () => window.scrollY * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
  };

  const animateStepTransition = (
    direction: 'next' | 'prev',
    currentStep: HTMLElement,
    nextStep: HTMLElement
  ) => {
    const tl = gsap.timeline();

    // Record FLIP state
    const state = Flip.getState([currentStep, nextStep]);

    if (direction === 'next') {
      // Slide out current step
      tl.to(currentStep, {
        x: '-100%',
        opacity: 0,
        rotationY: -15,
        duration: 0.5,
        ease: 'power2.in'
      });

      // Slide in next step
      tl.fromTo(nextStep,
        {
          x: '100%',
          opacity: 0,
          rotationY: 15
        },
        {
          x: '0%',
          opacity: 1,
          rotationY: 0,
          duration: 0.6,
          ease: 'power3.out'
        },
        '-=0.2'
      );
    } else {
      // Slide out current step
      tl.to(currentStep, {
        x: '100%',
        opacity: 0,
        rotationY: 15,
        duration: 0.5,
        ease: 'power2.in'
      });

      // Slide in previous step
      tl.fromTo(nextStep,
        {
          x: '-100%',
          opacity: 0,
          rotationY: -15
        },
        {
          x: '0%',
          opacity: 1,
          rotationY: 0,
          duration: 0.6,
          ease: 'power3.out'
        },
        '-=0.2'
      );
    }

    return tl;
  };

  const createLiquidMorph = (element: HTMLElement, targetShape: string) => {
    const tl = gsap.timeline();

    // Create morphing effect using clip-path
    tl.to(element, {
      clipPath: targetShape,
      duration: 0.8,
      ease: 'power3.inOut'
    });

    return tl;
  };

  const animateLayoutChange = (container: HTMLElement) => {
    const state = Flip.getState(container.children);

    // After React updates the DOM, animate the changes
    return Flip.from(state, {
      duration: 0.7,
      ease: 'power2.inOut',
      stagger: 0.05,
      absolute: true,
      scale: true,
      onEnter: (elements) => {
        gsap.fromTo(elements,
          {
            opacity: 0,
            scale: 0,
            rotation: 180
          },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.5,
            ease: 'back.out(1.7)'
          }
        );
      },
      onLeave: (elements) => {
        gsap.to(elements, {
          opacity: 0,
          scale: 0,
          rotation: -180,
          duration: 0.3,
          ease: 'power2.in'
        });
      }
    });
  };

  return {
    containerRef,
    animateCardTransition,
    morphElement,
    createMagneticEffect,
    createParallaxCards,
    animateStepTransition,
    createLiquidMorph,
    animateLayoutChange
  };
};

// Advanced animation presets
export const animationPresets = {
  // Card entrance animations
  cardEntrance: {
    from: {
      opacity: 0,
      y: 100,
      scale: 0.8,
      rotationX: 45
    },
    to: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotationX: 0,
      duration: 0.8,
      ease: 'back.out(1.4)'
    }
  },

  // Button hover effects
  buttonHover: {
    scale: 1.05,
    y: -5,
    boxShadow: '0 15px 35px rgba(234, 179, 8, 0.4)',
    duration: 0.3,
    ease: 'power2.out'
  },

  // Text reveal animations
  textReveal: {
    from: {
      opacity: 0,
      y: 50,
      skewY: 5
    },
    to: {
      opacity: 1,
      y: 0,
      skewY: 0,
      duration: 0.6,
      ease: 'power3.out'
    }
  },

  // Morphing transitions
  morphTransition: {
    duration: 0.8,
    ease: 'power3.inOut',
    transformOrigin: 'center center'
  },

  // Liquid animations
  liquidFlow: {
    duration: 1.2,
    ease: 'power2.inOut',
    yoyo: true,
    repeat: -1
  }
};

// Performance optimization utilities
export const optimizeAnimations = () => {
  // Force hardware acceleration
  gsap.set('[data-animate]', {
    force3D: true,
    transformPerspective: 1000
  });

  // Batch DOM reads/writes
  gsap.ticker.lagSmoothing(0);
  
  // Use will-change for animated elements
  const animatedElements = document.querySelectorAll('[data-animate]');
  animatedElements.forEach(el => {
    (el as HTMLElement).style.willChange = 'transform, opacity';
  });
};