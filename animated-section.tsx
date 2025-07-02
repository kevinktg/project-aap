'use client';

/**
 * AnimatedSection Component
 * Demonstrates best practices for GSAP animations in React with TypeScript
 */

import React, { useRef } from 'react';
import { useGSAP } from '@/hooks/useGSAP';
import { fadeIn, staggerAnimation, DURATIONS, EASES } from '@/lib/gsap';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade' | 'slide' | 'stagger';
  delay?: number;
  trigger?: 'immediate' | 'scroll';
}

export function AnimatedSection({
  children,
  className,
  animation = 'fade',
  delay = 0,
  trigger = 'immediate',
}: AnimatedSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll('[data-animate]');
    
    if (elements.length === 0) return;

    // Initial state - hide elements
    gsap.set(elements, { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    });

    if (trigger === 'immediate') {
      // Immediate animation
      switch (animation) {
        case 'fade':
          fadeIn(elements, {
            duration: DURATIONS.normal,
            delay,
            ease: EASES.smooth,
          });
          break;

        case 'slide':
          gsap.to(elements, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: DURATIONS.slow,
            delay,
            ease: EASES.dramatic,
          });
          break;

        case 'stagger':
          staggerAnimation(elements, {
            opacity: 0,
            y: 50,
            scale: 0.9,
          }, {
            amount: 0.6,
            ease: EASES.smooth,
          });
          break;
      }
    } else {
      // Scroll-triggered animation
      ScrollTrigger.batch(elements, {
        onEnter: (batch) => {
          switch (animation) {
            case 'fade':
              fadeIn(batch, {
                duration: DURATIONS.normal,
                delay,
              });
              break;

            case 'slide':
              gsap.to(batch, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: DURATIONS.slow,
                delay,
                ease: EASES.dramatic,
                stagger: 0.1,
              });
              break;

            case 'stagger':
              staggerAnimation(batch, {
                opacity: 0,
                y: 30,
                scale: 0.95,
              });
              break;
          }
        },
        start: 'top 80%',
        once: true,
      });
    }
  }, { 
    scope: containerRef,
    dependencies: [animation, delay, trigger],
    respectReducedMotion: true,
  });

  return (
    <div 
      ref={containerRef}
      className={cn('relative', className)}
    >
      {React.Children.map(children, (child, index) => (
        <div key={index} data-animate>
          {child}
        </div>
      ))}
    </div>
  );
}

// Example usage component
export function AnimatedSectionExample() {
  return (
    <div className="space-y-8 p-8">
      <AnimatedSection animation="fade" className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Fade Animation</h2>
        <p className="text-gray-600">This section fades in smoothly.</p>
      </AnimatedSection>

      <AnimatedSection 
        animation="slide" 
        delay={0.2} 
        trigger="scroll"
        className="bg-blue-100 p-6 rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Slide Animation</h2>
        <p className="text-gray-600">This section slides up when scrolled into view.</p>
      </AnimatedSection>

      <AnimatedSection 
        animation="stagger" 
        trigger="scroll"
        className="bg-green-100 p-6 rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Stagger Animation</h2>
        <p className="text-gray-600">Each child element animates with a stagger.</p>
        <p className="text-gray-600">Creating a beautiful cascading effect.</p>
        <p className="text-gray-600">Perfect for lists and content blocks.</p>
      </AnimatedSection>
    </div>
  );
}