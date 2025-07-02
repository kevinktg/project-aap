import React, { useRef, useState } from 'react';
import { useGSAP, animationPresets } from '../hooks/useAdvancedGSAP';
import gsap from 'gsap';

interface MorphingButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary';
  morphType?: 'scale' | 'liquid' | 'elastic' | 'magnetic';
}

const MorphingButton: React.FC<MorphingButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = '',
  variant = 'primary',
  morphType = 'elastic'
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isPressed, setIsPressed] = useState(false);

  useGSAP(
    ({ selector }) => {
      const button = selector('[data-button]')[0] as HTMLElement;
      if (!button) return;

      // Initial entrance animation
      gsap.fromTo(button,
        {
          opacity: 0,
          y: 30,
          scale: 0.8,
          rotationX: 45
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
          delay: 0.3
        }
      );

      // Hover animations based on morph type
      const handleMouseEnter = () => {
        if (disabled) return;

        switch (morphType) {
          case 'scale':
            gsap.to(button, {
              scale: 1.05,
              duration: 0.3,
              ease: 'power2.out'
            });
            break;

          case 'liquid':
            gsap.to(button, {
              borderRadius: '25px',
              scale: 1.02,
              duration: 0.6,
              ease: 'elastic.out(1, 0.6)'
            });
            break;

          case 'elastic':
            gsap.to(button, {
              scale: 1.08,
              y: -5,
              duration: 0.4,
              ease: 'elastic.out(1, 0.8)'
            });
            break;

          case 'magnetic':
            gsap.to(button, {
              scale: 1.03,
              boxShadow: '0 15px 35px rgba(234, 179, 8, 0.4)',
              duration: 0.3,
              ease: 'power2.out'
            });
            break;
        }
      };

      const handleMouseLeave = () => {
        if (disabled) return;

        gsap.to(button, {
          scale: 1,
          y: 0,
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          duration: 0.4,
          ease: 'elastic.out(1, 0.6)'
        });
      };

      const handleMouseDown = () => {
        if (disabled) return;
        setIsPressed(true);

        gsap.to(button, {
          scale: 0.95,
          duration: 0.1,
          ease: 'power2.out'
        });
      };

      const handleMouseUp = () => {
        if (disabled) return;
        setIsPressed(false);

        gsap.to(button, {
          scale: morphType === 'elastic' ? 1.08 : 1.03,
          duration: 0.2,
          ease: 'back.out(1.7)'
        });
      };

      // Magnetic effect for mouse movement
      const handleMouseMove = (e: MouseEvent) => {
        if (disabled || morphType !== 'magnetic') return;

        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) * 0.1;
        const deltaY = (e.clientY - centerY) * 0.1;

        gsap.to(button, {
          x: deltaX,
          y: deltaY,
          duration: 0.3,
          ease: 'power2.out'
        });
      };

      button.addEventListener('mouseenter', handleMouseEnter);
      button.addEventListener('mouseleave', handleMouseLeave);
      button.addEventListener('mousedown', handleMouseDown);
      button.addEventListener('mouseup', handleMouseUp);
      button.addEventListener('mousemove', handleMouseMove);

      return () => {
        button.removeEventListener('mouseenter', handleMouseEnter);
        button.removeEventListener('mouseleave', handleMouseLeave);
        button.removeEventListener('mousedown', handleMouseDown);
        button.removeEventListener('mouseup', handleMouseUp);
        button.removeEventListener('mousemove', handleMouseMove);
      };
    },
    [disabled, morphType],
    buttonRef
  );

  const baseClasses = `transform-gpu transition-colors duration-200 font-semibold rounded-lg px-6 py-3 ${className}`;
  const variantClasses = variant === 'primary' 
    ? 'bg-yellow-500 text-black hover:bg-yellow-600' 
    : 'bg-gray-300 text-gray-700 hover:bg-gray-400';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      ref={buttonRef}
      data-button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${disabledClasses}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {children}
      
      {/* Ripple effect on click */}
      {isPressed && (
        <div 
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
            animation: 'ripple 0.6s ease-out'
          }}
        />
      )}
    </button>
  );
};

export default MorphingButton;