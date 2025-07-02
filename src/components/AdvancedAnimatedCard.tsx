import React, { useRef, useEffect, useState } from 'react';
import { useGSAP, useFLIPAnimations, animationPresets } from '../hooks/useAdvancedGSAP';
import gsap from 'gsap';

interface AdvancedAnimatedCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
  delay?: number;
  animationType?: 'flip' | 'morph' | 'magnetic' | 'liquid';
  layoutId?: string;
}

const AdvancedAnimatedCard: React.FC<AdvancedAnimatedCardProps> = ({
  children,
  onClick,
  selected = false,
  className = '',
  delay = 0,
  animationType = 'flip',
  layoutId
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { morphElement, createMagneticEffect } = useFLIPAnimations();

  // Use our custom useGSAP hook
  useGSAP(
    ({ selector }) => {
      const card = selector('[data-card]')[0] as HTMLElement;
      if (!card) return;

      // Initial entrance animation
      gsap.fromTo(card,
        animationPresets.cardEntrance.from,
        {
          ...animationPresets.cardEntrance.to,
          delay
        }
      );

      // Selection state animation
      if (selected) {
        gsap.to(card, {
          scale: 1.05,
          y: -10,
          boxShadow: '0 20px 40px rgba(234, 179, 8, 0.3)',
          borderColor: '#eab308',
          duration: 0.5,
          ease: 'back.out(1.7)'
        });
      } else {
        gsap.to(card, {
          scale: 1,
          y: 0,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          borderColor: '#d1d5db',
          duration: 0.3,
          ease: 'power2.out'
        });
      }

      // Cleanup function
      return () => {
        gsap.killTweensOf(card);
      };
    },
    [selected, delay],
    cardRef
  );

  // Advanced hover effects based on animation type
  useEffect(() => {
    if (!cardRef.current) return;

    const card = cardRef.current;

    const handleMouseEnter = () => {
      setIsHovered(true);

      switch (animationType) {
        case 'flip':
          gsap.to(card, {
            rotationY: 5,
            rotationX: 5,
            scale: 1.02,
            z: 50,
            duration: 0.4,
            ease: 'power2.out'
          });
          break;

        case 'morph':
          morphElement(card, {
            scale: 1.08,
            rotation: 2
          });
          break;

        case 'magnetic':
          createMagneticEffect([card]);
          break;

        case 'liquid':
          gsap.to(card, {
            borderRadius: '20px',
            scale: 1.03,
            duration: 0.6,
            ease: 'elastic.out(1, 0.6)'
          });
          break;
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);

      gsap.to(card, {
        rotationY: 0,
        rotationX: 0,
        scale: selected ? 1.05 : 1,
        z: 0,
        rotation: 0,
        borderRadius: '8px',
        duration: 0.4,
        ease: 'power2.out'
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (animationType === 'magnetic') {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) * 0.05;
        const deltaY = (e.clientY - centerY) * 0.05;

        gsap.to(card, {
          x: deltaX,
          y: deltaY,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('mousemove', handleMouseMove);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.removeEventListener('mousemove', handleMouseMove);
    };
  }, [animationType, selected, morphElement, createMagneticEffect]);

  return (
    <div
      ref={cardRef}
      data-card
      data-layout-id={layoutId}
      onClick={onClick}
      className={`cursor-pointer border-2 rounded-lg transition-colors duration-200 transform-gpu ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {children}
      
      {/* Hover glow effect */}
      {isHovered && (
        <div 
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            background: 'linear-gradient(45deg, rgba(234, 179, 8, 0.1), rgba(245, 158, 11, 0.1))',
            filter: 'blur(10px)',
            transform: 'scale(1.1)',
            zIndex: -1
          }}
        />
      )}
    </div>
  );
};

export default AdvancedAnimatedCard;