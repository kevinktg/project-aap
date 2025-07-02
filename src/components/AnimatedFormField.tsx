import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface AnimatedFormFieldProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedFormField: React.FC<AnimatedFormFieldProps> = ({ 
  children, 
  className = '', 
  delay = 0 
}) => {
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fieldRef.current) return;

    const element = fieldRef.current;

    // Set initial state
    gsap.set(element, {
      opacity: 0,
      y: 30,
      scale: 0.95,
    });

    // Create entrance animation
    const tl = gsap.timeline({ delay });
    tl.to(element, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: 'power3.out',
    });

    // Add hover interactions for input elements
    const inputs = element.querySelectorAll('input, select, textarea');
    inputs.forEach((input) => {
      const inputElement = input as HTMLElement;
      
      inputElement.addEventListener('focus', () => {
        gsap.to(inputElement, {
          scale: 1.02,
          y: -2,
          duration: 0.3,
          ease: 'power2.out',
        });

        // Animate label if it exists
        const label = inputElement.previousElementSibling;
        if (label && label.tagName === 'LABEL') {
          gsap.to(label, {
            color: '#eab308',
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out',
          });
        }
      });

      inputElement.addEventListener('blur', () => {
        gsap.to(inputElement, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
        });

        // Reset label
        const label = inputElement.previousElementSibling;
        if (label && label.tagName === 'LABEL') {
          gsap.to(label, {
            color: '#374151',
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          });
        }
      });
    });

    return () => {
      tl.kill();
    };
  }, [delay]);

  return (
    <div ref={fieldRef} className={`animate-field ${className}`}>
      {children}
    </div>
  );
};

export default AnimatedFormField;