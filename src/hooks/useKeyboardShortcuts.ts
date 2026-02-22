import { useEffect } from 'react';
import { useSortingStore } from '../store/sortingStore';

export const useKeyboardShortcuts = (
  startSorting: () => void,
  pauseAnimation: () => void,
  resumeAnimation: () => void,
  resetAnimation: () => void
) => {
  const store = useSortingStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is focused on an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;

      switch (e.key.toLowerCase()) {
        case ' ': // Spacebar
          e.preventDefault(); // Prevent scrolling
          if (store.isPlaying) {
            pauseAnimation();
          } else if (store.isPaused) {
            resumeAnimation();
          } else if (!store.isFinished) {
            startSorting();
          }
          break;
        case 'r':
          resetAnimation();
          break;
        case 'arrowup':
          e.preventDefault();
          store.setSpeedMs(Math.max(1, store.speedMs - 5));
          break;
        case 'arrowdown':
          e.preventDefault();
          store.setSpeedMs(Math.min(100, store.speedMs + 5));
          break;
        case 'arrowright':
          e.preventDefault();
          if (!store.isPlaying && !store.isPaused) {
            store.setArraySize(Math.min(1000, store.arraySize + 10));
            resetAnimation();
          }
          break;
        case 'arrowleft':
          e.preventDefault();
          if (!store.isPlaying && !store.isPaused) {
            store.setArraySize(Math.max(10, store.arraySize - 10));
            resetAnimation();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [store, startSorting, pauseAnimation, resumeAnimation, resetAnimation]);
};
