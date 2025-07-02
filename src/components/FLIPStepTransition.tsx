import React, { useRef, useEffect } from 'react';
import { useGSAP, useFLIPAnimations } from '../hooks/useAdvancedGSAP';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';

interface FLIPStepTransitionProps {
  children: React.ReactNode;
  currentStep: number;
  direction: 'next' | 'prev' | null;
  onTransitionComplete?: () => void;
}

const FLIPStepTransition: React.FC<FLIPStepTransitionProps> = ({
  children,
  currentStep,
  direction,
  onTransitionComplete
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousStepRef = useRef<number>(currentStep);
  const { animateLayoutChange } = useFLIPAnimations();

  // Use FLIP for smooth step transitions
  useGSAP(
    ({ selector }) => {
      if (direction && previousStepRef.current !== currentStep) {
        const container = containerRef.current;
        if (!container) return;

        // Record the state before React updates
        const state = Flip.getState(container.children);

        // After React renders the new step, animate the transition
        requestAnimationFrame(() => {
          Flip.from(state, {
            duration: 0.8,
            ease: 'power2.inOut',
            absolute: true,
            onComplete: onTransitionComplete,
            onEnter: (elements) => {
              // Animate new step entering
              const enterDirection = direction === 'next' ? 100 : -100;
              
              gsap.fromTo(elements,
                {
                  x: enterDirection,
                  opacity: 0,
                  rotationY: direction === 'next' ? 15 : -15,
                  scale: 0.9
                },
                {
                  x: 0,
                  opacity: 1,
                  rotationY: 0,
                  scale: 1,
                  duration: 0.8,
                  ease: 'power3.out',
                  stagger: 0.1
                }
              );
            },
            onLeave: (elements) => {
              // Animate old step leaving
              const exitDirection = direction === 'next' ? -100 : 100;
              
              gsap.to(elements, {
                x: exitDirection,
                opacity: 0,
                rotationY: direction === 'next' ? -15 : 15,
                scale: 0.9,
                duration: 0.6,
                ease: 'power2.in'
              });
            }
          });
        });

        previousStepRef.current = currentStep;
      }
    },
    [currentStep, direction],
    containerRef
  );

  return (
    <div 
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {children}
    </div>
  );
};

export default FLIPStepTransition;