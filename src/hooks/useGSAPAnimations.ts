import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export const useGSAPAnimations = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Set initial states for all animated elements
    gsap.set('.animate-step', {
      opacity: 0,
      y: 100,
      scale: 0.9,
      rotationX: 15,
    });

    gsap.set('.animate-field', {
      opacity: 0,
      y: 60,
      scale: 0.95,
      rotationY: 5,
    });

    gsap.set('.animate-button', {
      opacity: 0,
      y: 40,
      scale: 0.9,
      rotationZ: 2,
    });

    gsap.set('.animate-progress', {
      scaleX: 0,
      transformOrigin: 'left center',
    });

    gsap.set('.animate-card', {
      opacity: 0,
      y: 80,
      scale: 0.8,
      rotationY: 15,
    });

    gsap.set('.animate-header', {
      opacity: 0,
      y: -50,
      scale: 1.1,
    });

    gsap.set('.animate-testimonial', {
      opacity: 0,
      x: 100,
      scale: 0.9,
    });

    // Create sophisticated entrance animations
    const createEntranceAnimation = () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
          scrub: false,
        }
      });

      // Header animation with parallax effect
      tl.to('.animate-header', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
      });

      // Step container with 3D entrance
      tl.to('.animate-step', {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 1.5,
        ease: 'power4.out',
      }, '-=0.8');

      // Staggered field animations with physics
      tl.to('.animate-field', {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationY: 0,
        duration: 1,
        stagger: {
          amount: 0.8,
          from: 'start',
          ease: 'power2.out',
        },
        ease: 'elastic.out(1, 0.6)',
      }, '-=1');

      // Card animations with magnetic effect
      tl.to('.animate-card', {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationY: 0,
        duration: 0.8,
        stagger: {
          amount: 0.6,
          grid: [2, 3],
          from: 'center',
        },
        ease: 'back.out(1.4)',
      }, '-=0.6');

      // Button animation with bounce
      tl.to('.animate-button', {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationZ: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.8)',
      }, '-=0.4');

      return tl;
    };

    // Create scroll-based parallax effects
    const createParallaxEffects = () => {
      // Background parallax
      gsap.to(container, {
        backgroundPosition: '50% 100%',
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });

      // Floating elements
      gsap.to('.animate-testimonial', {
        y: -30,
        rotation: 2,
        ease: 'none',
        scrollTrigger: {
          trigger: '.animate-testimonial',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        }
      });

      // Progress bar with momentum
      gsap.to('.animate-progress', {
        scaleX: 1,
        duration: 2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.animate-progress',
          start: 'top 90%',
          end: 'bottom 10%',
          scrub: 1,
        }
      });
    };

    // Create magnetic hover effects
    const createMagneticEffects = () => {
      const cards = container.querySelectorAll('.animate-card');
      const buttons = container.querySelectorAll('.animate-button');

      [...cards, ...buttons].forEach((element) => {
        const el = element as HTMLElement;
        
        el.addEventListener('mouseenter', () => {
          gsap.to(el, {
            scale: 1.05,
            z: 50,
            duration: 0.4,
            ease: 'power2.out',
          });
        });

        el.addEventListener('mouseleave', () => {
          gsap.to(el, {
            scale: 1,
            z: 0,
            duration: 0.4,
            ease: 'power2.out',
          });
        });

        el.addEventListener('mousemove', (e) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          
          gsap.to(el, {
            x: x * 0.1,
            y: y * 0.1,
            duration: 0.3,
            ease: 'power2.out',
          });
        });

        el.addEventListener('mouseleave', () => {
          gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.4,
            ease: 'elastic.out(1, 0.6)',
          });
        });
      });
    };

    // Initialize all animations
    createEntranceAnimation();
    createParallaxEffects();
    createMagneticEffects();

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      timelineRef.current?.kill();
    };
  }, []);

  // Enhanced step change animation with 3D effects
  const animateStepChange = (direction: 'next' | 'prev') => {
    return new Promise<void>((resolve) => {
      const tl = gsap.timeline({
        onComplete: resolve,
      });
      
      // Create 3D flip effect
      tl.to('.animate-step', {
        rotationY: direction === 'next' ? -90 : 90,
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
        ease: 'power2.in',
      });

      tl.set('.animate-step', {
        rotationY: direction === 'next' ? 90 : -90,
      });

      tl.to('.animate-step', {
        rotationY: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
      });

      // Stagger in new fields with wave effect
      tl.fromTo('.animate-field',
        {
          opacity: 0,
          y: 50,
          rotationX: 45,
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.6,
          stagger: {
            amount: 0.4,
            from: 'start',
            ease: 'sine.out',
          },
          ease: 'back.out(1.4)',
        },
        '-=0.4'
      );
    });
  };

  // Enhanced field focus with ripple effect
  const animateFieldFocus = (element: HTMLElement, focused: boolean) => {
    const tl = gsap.timeline();
    
    if (focused) {
      // Create ripple effect
      const ripple = document.createElement('div');
      ripple.className = 'absolute inset-0 rounded-lg bg-yellow-400 opacity-20';
      element.style.position = 'relative';
      element.appendChild(ripple);
      
      gsap.fromTo(ripple, 
        { scale: 0, opacity: 0.3 },
        { scale: 1.2, opacity: 0, duration: 0.6, ease: 'power2.out' }
      );
      
      setTimeout(() => ripple.remove(), 600);
    }

    tl.to(element, {
      scale: focused ? 1.02 : 1,
      y: focused ? -5 : 0,
      rotationX: focused ? -2 : 0,
      boxShadow: focused 
        ? '0 20px 40px rgba(234, 179, 8, 0.2)' 
        : '0 4px 6px rgba(0, 0, 0, 0.1)',
      duration: 0.4,
      ease: 'power2.out',
    });

    // Animate label with glow effect
    const label = element.previousElementSibling;
    if (label && label.tagName === 'LABEL') {
      tl.to(label, {
        color: focused ? '#eab308' : '#374151',
        scale: focused ? 1.05 : 1,
        textShadow: focused ? '0 0 10px rgba(234, 179, 8, 0.5)' : 'none',
        duration: 0.4,
        ease: 'power2.out',
      }, 0);
    }
  };

  // Enhanced button hover with energy effect
  const animateButtonHover = (element: HTMLElement, hovered: boolean) => {
    const tl = gsap.timeline();
    
    if (hovered) {
      // Create energy particles
      for (let i = 0; i < 3; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute w-1 h-1 bg-yellow-400 rounded-full pointer-events-none';
        element.style.position = 'relative';
        element.appendChild(particle);
        
        gsap.fromTo(particle,
          { 
            x: Math.random() * 20 - 10,
            y: Math.random() * 20 - 10,
            scale: 0,
            opacity: 1,
          },
          {
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
            scale: Math.random() * 2 + 1,
            opacity: 0,
            duration: 1 + Math.random(),
            ease: 'power2.out',
            onComplete: () => particle.remove(),
          }
        );
      }
    }

    tl.to(element, {
      scale: hovered ? 1.08 : 1,
      y: hovered ? -8 : 0,
      rotationZ: hovered ? (Math.random() - 0.5) * 2 : 0,
      boxShadow: hovered 
        ? '0 15px 35px rgba(234, 179, 8, 0.4)' 
        : '0 4px 6px rgba(0, 0, 0, 0.1)',
      duration: 0.4,
      ease: 'elastic.out(1, 0.6)',
    });
  };

  // Enhanced card selection with magnetic field effect
  const animateCardSelection = (element: HTMLElement, selected: boolean) => {
    const tl = gsap.timeline();
    
    if (selected) {
      // Create selection aura
      const aura = document.createElement('div');
      aura.className = 'absolute inset-0 rounded-lg border-2 border-yellow-400 pointer-events-none';
      element.style.position = 'relative';
      element.appendChild(aura);
      
      gsap.fromTo(aura,
        { scale: 1, opacity: 0 },
        { 
          scale: 1.1, 
          opacity: 0.6,
          duration: 0.3,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
        }
      );
    }
    
    tl.to(element, {
      scale: selected ? 1.08 : 1,
      y: selected ? -10 : 0,
      rotationY: selected ? 5 : 0,
      boxShadow: selected 
        ? '0 25px 50px rgba(234, 179, 8, 0.3)' 
        : '0 4px 6px rgba(0, 0, 0, 0.1)',
      borderColor: selected ? '#eab308' : '#d1d5db',
      duration: 0.5,
      ease: 'elastic.out(1, 0.8)',
    });

    return tl;
  };

  // Enhanced progress animation with wave effect
  const animateProgress = (progress: number) => {
    const tl = gsap.timeline();
    
    tl.to('.animate-progress', {
      scaleX: progress / 100,
      duration: 1.2,
      ease: 'power3.out',
    });

    // Add wave effect
    tl.to('.animate-progress', {
      skewX: 2,
      duration: 0.2,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1,
    }, '-=0.8');
  };

  // Enhanced price reveal with cinematic effect
  const animatePriceReveal = () => {
    const tl = gsap.timeline();

    // Screen flash effect
    const flash = document.createElement('div');
    flash.className = 'fixed inset-0 bg-yellow-400 pointer-events-none z-50';
    document.body.appendChild(flash);
    
    tl.fromTo(flash,
      { opacity: 0 },
      { 
        opacity: 0.3,
        duration: 0.1,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(flash, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => flash.remove(),
          });
        }
      }
    );

    // Competitor price with shake effect
    tl.fromTo('.competitor-price', 
      {
        opacity: 0,
        scale: 0.5,
        rotationZ: -10,
      },
      {
        opacity: 1,
        scale: 1,
        rotationZ: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.8)',
      },
      0.2
    );

    // Add shake to competitor price
    tl.to('.competitor-price', {
      x: -5,
      duration: 0.1,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: 5,
    }, '-=0.4');

    // Our price with explosion effect
    tl.fromTo('.our-price',
      {
        opacity: 0,
        scale: 0.1,
        rotationZ: 180,
      },
      {
        opacity: 1,
        scale: 1,
        rotationZ: 0,
        duration: 1.2,
        ease: 'elastic.out(1, 0.6)',
      },
      '-=0.4'
    );

    // Savings highlight with typewriter effect
    tl.fromTo('.savings-highlight',
      {
        opacity: 0,
        scale: 0.8,
        y: 30,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: 'back.out(1.4)',
      },
      '-=0.6'
    );

    // Final CTA with magnetic pulse
    tl.to('.final-cta', {
      scale: 1.05,
      boxShadow: '0 0 30px rgba(234, 179, 8, 0.6)',
      duration: 0.8,
      ease: 'power2.inOut',
      repeat: -1,
      yoyo: true,
    });

    return tl;
  };

  return {
    containerRef,
    animateStepChange,
    animateFieldFocus,
    animateButtonHover,
    animateCardSelection,
    animateProgress,
    animatePriceReveal,
  };
};