import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary';
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = '',
  variant = 'primary'
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!buttonRef.current) return;

    const button = buttonRef.current;

    // Set initial state
    gsap.set(button, {
      opacity: 0,
      y: 20,
      scale: 0.95,
    });

    // Entrance animation
    gsap.to(button, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: 'back.out(1.7)',
      delay: 0.3,
    });

    // Hover interactions
    const handleMouseEnter = () => {
      if (disabled) return;
      
      gsap.to(button, {
        scale: 1.05,
        y: -3,
        duration: 0.3,
        ease: 'power2.out',
      });

      gsap.to(button, {
        boxShadow: variant === 'primary' 
          ? '0 10px 25px rgba(234, 179, 8, 0.3)' 
          : '0 8px 20px rgba(0, 0, 0, 0.15)',
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      if (disabled) return;
      
      gsap.to(button, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
      });

      gsap.to(button, {
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseDown = () => {
      if (disabled) return;
      
      gsap.to(button, {
        scale: 0.98,
        duration: 0.1,
        ease: 'power2.out',
      });
    };

    const handleMouseUp = () => {
      if (disabled) return;
      
      gsap.to(button, {
        scale: 1.05,
        duration: 0.2,
        ease: 'power2.out',
      });
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);
    button.addEventListener('mousedown', handleMouseDown);
    button.addEventListener('mouseup', handleMouseUp);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
      button.removeEventListener('mousedown', handleMouseDown);
      button.removeEventListener('mouseup', handleMouseUp);
    };
  }, [disabled, variant]);

  const baseClasses = `animate-button transition-colors duration-200 font-semibold rounded-lg px-6 py-3 ${className}`;
  const variantClasses = variant === 'primary' 
    ? 'bg-yellow-500 text-black hover:bg-yellow-600' 
    : 'bg-gray-300 text-gray-700 hover:bg-gray-400';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${disabledClasses}`}
    >
      {children}
    </button>
  );
};

export default AnimatedButton;