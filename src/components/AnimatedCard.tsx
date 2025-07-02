import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface AnimatedCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
  delay?: number;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  onClick,
  selected = false,
  className = '',
  delay = 0
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const card = cardRef.current;

    // Set initial state
    gsap.set(card, {
      opacity: 0,
      y: 30,
      scale: 0.95,
    });

    // Entrance animation
    gsap.to(card, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: 'power3.out',
      delay,
    });

    // Selection animation
    gsap.to(card, {
      scale: selected ? 1.05 : 1,
      y: selected ? -5 : 0,
      duration: 0.3,
      ease: 'back.out(1.7)',
    });

    gsap.to(card, {
      boxShadow: selected 
        ? '0 15px 35px rgba(234, 179, 8, 0.3)' 
        : '0 4px 6px rgba(0, 0, 0, 0.1)',
      borderColor: selected ? '#eab308' : '#d1d5db',
      duration: 0.3,
      ease: 'power2.out',
    });

  }, [selected, delay]);

  useEffect(() => {
    if (!cardRef.current) return;

    const card = cardRef.current;

    const handleMouseEnter = () => {
      if (!selected) {
        gsap.to(card, {
          scale: 1.02,
          y: -2,
          duration: 0.3,
          ease: 'power2.out',
        });

        gsap.to(card, {
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    const handleMouseLeave = () => {
      if (!selected) {
        gsap.to(card, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
        });

        gsap.to(card, {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [selected]);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`animate-field cursor-pointer border-2 rounded-lg transition-colors duration-200 ${className}`}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;