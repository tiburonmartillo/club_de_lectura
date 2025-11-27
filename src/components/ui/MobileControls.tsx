import React, { useRef } from 'react';

interface MobileControlsProps {
  onMoveStart: (direction: 'forward' | 'backward' | 'left' | 'right') => void;
  onMoveEnd: (direction: 'forward' | 'backward' | 'left' | 'right') => void;
  onRotate?: (deltaX: number, deltaY: number) => void;
  isNavigating: boolean;
}

export function MobileControls({ onMoveStart, onMoveEnd, onRotate, isNavigating }: MobileControlsProps) {
  // Only show on mobile devices
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (!isMobile || !isNavigating) return null;

  const handleMoveStart = (direction: 'forward' | 'backward' | 'left' | 'right') => {
    // Try to use callback first, then fallback to window functions
    if (onMoveStart) {
      onMoveStart(direction);
    } else if ((window as any).__playerMoveStart) {
      (window as any).__playerMoveStart(direction);
    }
  };

  const handleMoveEnd = (direction: 'forward' | 'backward' | 'left' | 'right') => {
    // Try to use callback first, then fallback to window functions
    if (onMoveEnd) {
      onMoveEnd(direction);
    } else if ((window as any).__playerMoveEnd) {
      (window as any).__playerMoveEnd(direction);
    }
  };

  // Handle rotation with touch
  const rotationRef = useRef<{ startX: number; startY: number; isActive: boolean } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && !rotationRef.current) {
      const touch = e.touches[0];
      rotationRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        isActive: true,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (rotationRef.current && e.touches.length === 1 && onRotate) {
      const touch = e.touches[0];
      const deltaX = (touch.clientX - rotationRef.current.startX) * 0.002;
      const deltaY = (touch.clientY - rotationRef.current.startY) * 0.002;
      onRotate(deltaX, deltaY);
      rotationRef.current.startX = touch.clientX;
      rotationRef.current.startY = touch.clientY;
    }
  };

  const handleTouchEnd = () => {
    rotationRef.current = null;
  };

  return (
    <>
      {/* Rotation area - center/upper area of screen (avoid bottom where movement controls are) */}
      <div
        className="fixed top-0 left-0 right-0 bottom-32 z-40 pointer-events-auto md:hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* Movement controls */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto md:hidden">
        <div className="relative w-64 h-64">
        {/* Central area */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-stone-900/80 border-2 border-amber-500/50 backdrop-blur-md"></div>
        </div>

        {/* Forward button (Up) */}
        <button
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-lg bg-stone-900/90 border-2 border-amber-500/70 backdrop-blur-md flex items-center justify-center text-amber-500 active:bg-amber-600/30 active:border-amber-400 touch-none select-none"
          onTouchStart={(e) => {
            e.preventDefault();
            handleMoveStart('forward');
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleMoveEnd('forward');
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            handleMoveStart('forward');
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            handleMoveEnd('forward');
          }}
          onMouseLeave={(e) => {
            e.preventDefault();
            handleMoveEnd('forward');
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>

        {/* Backward button (Down) */}
        <button
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-lg bg-stone-900/90 border-2 border-amber-500/70 backdrop-blur-md flex items-center justify-center text-amber-500 active:bg-amber-600/30 active:border-amber-400 touch-none select-none"
          onTouchStart={(e) => {
            e.preventDefault();
            handleMoveStart('backward');
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleMoveEnd('backward');
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            handleMoveStart('backward');
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            handleMoveEnd('backward');
          }}
          onMouseLeave={(e) => {
            e.preventDefault();
            handleMoveEnd('backward');
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Left button */}
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 w-14 h-14 rounded-lg bg-stone-900/90 border-2 border-amber-500/70 backdrop-blur-md flex items-center justify-center text-amber-500 active:bg-amber-600/30 active:border-amber-400 touch-none select-none"
          onTouchStart={(e) => {
            e.preventDefault();
            handleMoveStart('left');
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleMoveEnd('left');
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            handleMoveStart('left');
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            handleMoveEnd('left');
          }}
          onMouseLeave={(e) => {
            e.preventDefault();
            handleMoveEnd('left');
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right button */}
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 w-14 h-14 rounded-lg bg-stone-900/90 border-2 border-amber-500/70 backdrop-blur-md flex items-center justify-center text-amber-500 active:bg-amber-600/30 active:border-amber-400 touch-none select-none"
          onTouchStart={(e) => {
            e.preventDefault();
            handleMoveStart('right');
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleMoveEnd('right');
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            handleMoveStart('right');
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            handleMoveEnd('right');
          }}
          onMouseLeave={(e) => {
            e.preventDefault();
            handleMoveEnd('right');
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      </div>
    </>
  );
}

