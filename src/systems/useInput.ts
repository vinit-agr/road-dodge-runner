import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/gameStore.ts';

const SWIPE_THRESHOLD = 30;

export function useInput() {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const swipeLockedRef = useRef(false);

  const handleLane = useCallback((dir: -1 | 1) => {
    const { phase, switchLane } = useGameStore.getState();
    if (phase === 'playing') switchLane(dir);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handleLane(-1);
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        handleLane(1);
      }
      // Start / restart on Space or Enter
      if (e.key === ' ' || e.key === 'Enter') {
        const { phase, startGame, returnToMenu } = useGameStore.getState();
        if (phase === 'menu') startGame();
        else if (phase === 'gameover') returnToMenu();
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      swipeLockedRef.current = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!touchStartRef.current || swipeLockedRef.current) return;
      const touch = e.touches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      if (Math.abs(dx) > SWIPE_THRESHOLD) {
        handleLane(dx > 0 ? 1 : -1);
        swipeLockedRef.current = true;
      }
    };

    const onTouchEnd = () => {
      touchStartRef.current = null;
      swipeLockedRef.current = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [handleLane]);
}
