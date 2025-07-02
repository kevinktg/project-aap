import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface TextSelectionUnderlineProps {
  children: React.ReactNode;
  className?: string;
  underlineColor?: string;
  animationDuration?: number;
}

const TextSelectionUnderline: React.FC<TextSelectionUnderlineProps> = ({
  children,
  className = '',
  underlineColor = '#eab308',
  animationDuration = 0.3
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!containerRef.current || !underlineRef.current) return;

    const container = containerRef.current;
    const underlinePath = underlineRef.current;
    
    // Set initial state
    gsap.set(underlinePath, {
      strokeDasharray: '0 1000',
      opacity: 0
    });

    const handleSelectionChange = () => {
      const selection = window.getSelection();
      
      if (!selection || selection.rangeCount === 0) {
        // Hide underline when no selection
        gsap.to(underlinePath, {
          strokeDasharray: '0 1000',
          opacity: 0,
          duration: animationDuration,
          ease: 'power2.out'
        });
        return;
      }

      const range = selection.getRangeAt(0);
      const selectedText = range.toString().trim();
      
      if (!selectedText || !container.contains(range.commonAncestorContainer)) {
        return;
      }

      // Get selection bounds
      const rects = range.getClientRects();
      if (rects.length === 0) return;

      const containerRect = container.getBoundingClientRect();
      const firstRect = rects[0];
      const lastRect = rects[rects.length - 1];

      // Calculate relative positions
      const startX = firstRect.left - containerRect.left;
      const endX = lastRect.right - containerRect.left;
      const y = firstRect.bottom - containerRect.top - 2;

      // Create wavy underline path
      const pathLength = endX - startX;
      const waveHeight = 3;
      const waveFrequency = 0.02;
      
      let pathData = `M ${startX} ${y}`;
      
      for (let x = 0; x <= pathLength; x += 2) {
        const waveY = y + Math.sin(x * waveFrequency) * waveHeight;
        pathData += ` L ${startX + x} ${waveY}`;
      }

      // Update path
      underlinePath.setAttribute('d', pathData);
      
      // Calculate path length for animation
      const totalLength = underlinePath.getTotalLength();
      
      // Animate underline appearance
      gsap.fromTo(underlinePath, 
        {
          strokeDasharray: `0 ${totalLength}`,
          opacity: 0
        },
        {
          strokeDasharray: `${totalLength} ${totalLength}`,
          opacity: 1,
          duration: animationDuration,
          ease: 'power2.out'
        }
      );
    };

    // Listen for selection changes
    document.addEventListener('selectionchange', handleSelectionChange);
    
    // Also listen for mouse up to catch quick selections
    container.addEventListener('mouseup', () => {
      setTimeout(handleSelectionChange, 10);
    });

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      container.removeEventListener('mouseup', handleSelectionChange);
    };
  }, [animationDuration]);

  return (
    <div 
      ref={containerRef}
      className={`relative ${className}`}
      style={{ userSelect: 'text' }}
    >
      {children}
      
      {/* SVG underline */}
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{
          width: '100%',
          height: '100%',
          overflow: 'visible'
        }}
      >
        <path
          ref={underlineRef}
          stroke={underlineColor}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: `drop-shadow(0 0 3px ${underlineColor}40)`
          }}
        />
      </svg>
    </div>
  );
};

export default TextSelectionUnderline;