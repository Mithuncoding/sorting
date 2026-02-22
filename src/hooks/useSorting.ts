import { useEffect } from 'react';
import { useSortingStore } from '../store/sortingStore';
import { generateRandomArray, generateReversedArray, generateNearlySortedArray, generateFewUniqueArray, parseCustomArray } from '../utils/arrayGenerators';
import type { AnimationFrame, ArrayElement } from '../types';
import SortingWorker from '../workers/sortingWorker?worker';
import confetti from 'canvas-confetti';
import { playNote, mapValueToFrequency } from '../utils/sound';

// Global Singleton State for playback orchestration
let globalWorker: Worker | null = null;
let globalSecondaryWorker: Worker | null = null;
let globalAnimationFrames: AnimationFrame[] = [];
let globalSecondaryAnimationFrames: AnimationFrame[] = [];
let globalCurrentFrameIndex = 0;
let globalTimer: number | null = null;
let globalWorkersFinished = 0;

const playAnimation = () => {
  const store = useSortingStore.getState();
  store.setIsPlaying(true);
  store.setIsPaused(false);
  store.setIsFinished(false);
  if (globalTimer) clearTimeout(globalTimer);
  animate();
};

const animate = () => {
  const store = useSortingStore.getState();
  const isRaceMode = store.isRaceMode;
  const maxFrames = isRaceMode 
    ? Math.max(globalAnimationFrames.length, globalSecondaryAnimationFrames.length) 
    : globalAnimationFrames.length;

  if (globalCurrentFrameIndex >= maxFrames) {
    store.setIsPlaying(false);
    store.setIsFinished(true);
    
    // Fire Confetti on finish
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00f3ff', '#9d00ff', '#ff00ea']
    });
    return;
  }

  // Primary Render
  const primaryIdx = Math.min(globalCurrentFrameIndex, globalAnimationFrames.length > 0 ? globalAnimationFrames.length - 1 : 0);
  if (primaryIdx >= 0 && globalAnimationFrames.length > 0) {
    const frame = globalAnimationFrames[primaryIdx];
    
    const highlightedArray = frame.array.map((el, i) => ({
      ...el,
      isComparing: frame.comparingIndices.includes(i),
      isSwapping: frame.swappingIndices.includes(i),
      isSorted: frame.sortedIndices.includes(i),
    }));
    store.setArray(highlightedArray);

    // Play sound if enabled (only from primary to avoid chaos)
    if (store.soundEnabled && globalCurrentFrameIndex < globalAnimationFrames.length) {
      if (frame.swappingIndices.length > 0) {
        const val = frame.array[frame.swappingIndices[0]].value;
        playNote(mapValueToFrequency(val, 100));
      } else if (frame.comparingIndices.length > 0) {
        const val = frame.array[frame.comparingIndices[0]].value;
        playNote(mapValueToFrequency(val, 100));
      }
    }

    store.setStatistics({
      comparisons: frame.comparisons,
      swaps: frame.swaps,
    });
    store.setActiveLine(frame.highlightLine ?? null);
  }

  // Secondary Render
  if (isRaceMode) {
    const secondaryIdx = Math.min(globalCurrentFrameIndex, globalSecondaryAnimationFrames.length > 0 ? globalSecondaryAnimationFrames.length - 1 : 0);
    if (secondaryIdx >= 0 && globalSecondaryAnimationFrames.length > 0) {
      const frame2 = globalSecondaryAnimationFrames[secondaryIdx];
      const highlightedArray2 = frame2.array.map((el, i) => ({
        ...el,
        isComparing: frame2.comparingIndices.includes(i),
        isSwapping: frame2.swappingIndices.includes(i),
        isSorted: frame2.sortedIndices.includes(i),
      }));
      store.setSecondaryArray(highlightedArray2);

      store.setSecondaryStatistics({
        comparisons: frame2.comparisons,
        swaps: frame2.swaps,
      });
      store.setSecondaryActiveLine(frame2.highlightLine ?? null);
    }
  }

  globalCurrentFrameIndex++;
  store.setCurrentFrameIndex(globalCurrentFrameIndex);

  if (!useSortingStore.getState().isPaused) {
    const nextDelay = 101 - useSortingStore.getState().speedMs;
    globalTimer = window.setTimeout(() => {
      requestAnimationFrame(animate);
    }, nextDelay);
  }
};

const pauseAnimation = () => {
  const store = useSortingStore.getState();
  store.setIsPaused(true);
  store.setIsPlaying(false);
  if (globalTimer) clearTimeout(globalTimer);
};

const resumeAnimation = () => {
  const store = useSortingStore.getState();
  if (store.isPaused && !store.isFinished) {
    store.setIsPaused(false);
    store.setIsPlaying(true);
    if (globalTimer) clearTimeout(globalTimer);
    // Wait for next tick so state syncs before scheduling loop
    setTimeout(() => {
      animate();
    }, 0);
  }
};

const resetAnimation = () => {
  if (globalTimer) clearTimeout(globalTimer);
  
  const currentStore = useSortingStore.getState();
  
  currentStore.setIsPlaying(false);
  currentStore.setIsPaused(false);
  currentStore.setIsFinished(false);
  
  let newArr: ArrayElement[];
  switch (currentStore.dataDistribution) {
    case 'reversed':
      newArr = generateReversedArray(currentStore.arraySize);
      break;
    case 'nearly_sorted':
      newArr = generateNearlySortedArray(currentStore.arraySize);
      break;
    case 'few_unique':
      newArr = generateFewUniqueArray(currentStore.arraySize);
      break;
    case 'custom':
      newArr = parseCustomArray(currentStore.customArrayInput) || generateRandomArray(currentStore.arraySize);
      if (newArr.length !== currentStore.arraySize) {
        currentStore.setArraySize(newArr.length);
      }
      break;
    case 'random':
    default:
      newArr = generateRandomArray(currentStore.arraySize);
      break;
  }
  
  currentStore.setArray(newArr);
  currentStore.setSecondaryArray([...newArr]);
  currentStore.setStatistics({ comparisons: 0, swaps: 0, timeMs: 0 });
  currentStore.setSecondaryStatistics({ comparisons: 0, swaps: 0, timeMs: 0 });
  
  globalAnimationFrames = [];
  globalSecondaryAnimationFrames = [];
  globalCurrentFrameIndex = 0;
  globalWorkersFinished = 0;
  
  currentStore.setCurrentFrameIndex(0);
  currentStore.setTotalFrames(0);
  currentStore.setActiveLine(null);
  currentStore.setSecondaryActiveLine(null);
};

const startSorting = () => {
  const store = useSortingStore.getState();
  if (store.isPlaying) return;
  
  const maxFrames = store.isRaceMode 
    ? Math.max(globalAnimationFrames.length, globalSecondaryAnimationFrames.length) 
    : globalAnimationFrames.length;
    
  if (store.isFinished || globalCurrentFrameIndex >= maxFrames) {
    const arrCopy = store.array.map(el => ({ ...el, isComparing: false, isSwapping: false, isSorted: false }));
    store.setArray(arrCopy);
    store.setSecondaryArray([...arrCopy]);
  }

  const unhighlightedArray = useSortingStore.getState().array.map(el => ({
    ...el,
    isComparing: false,
    isSwapping: false,
    isSorted: false,
  }));

  globalWorkersFinished = 0;
  try {
    if (globalWorker) {
      globalWorker.postMessage({
        array: unhighlightedArray,
        algorithm: store.algorithm,
      });
      
      if (store.isRaceMode && globalSecondaryWorker) {
        globalSecondaryWorker.postMessage({
          array: unhighlightedArray,
          algorithm: store.secondaryAlgorithm,
        });
      }
    } else {
      console.error("Worker not initialized");
      store.setIsPlaying(false);
    }
  } catch (error) {
     console.error("Worker error during postMessage:", error);
     store.setIsPlaying(false);
  }
};

const jumpToFrame = (index: number) => {
  const currentStore = useSortingStore.getState();
  const isRaceMode = currentStore.isRaceMode;
  const maxFrames = isRaceMode 
    ? Math.max(globalAnimationFrames.length, globalSecondaryAnimationFrames.length) 
    : globalAnimationFrames.length;
  
  if (index >= 0 && index < maxFrames) {
    globalCurrentFrameIndex = index;
    currentStore.setCurrentFrameIndex(index);
    
    const primaryIdx = Math.min(index, globalAnimationFrames.length > 0 ? globalAnimationFrames.length - 1 : 0);
    if (primaryIdx >= 0 && globalAnimationFrames.length > 0) {
      const frame = globalAnimationFrames[primaryIdx];
      const highlightedArray = frame.array.map((el, i) => ({
        ...el,
        isComparing: frame.comparingIndices.includes(i),
        isSwapping: frame.swappingIndices.includes(i),
        isSorted: frame.sortedIndices.includes(i),
      }));
      
      currentStore.setArray(highlightedArray);
      currentStore.setStatistics({
        comparisons: frame.comparisons,
        swaps: frame.swaps,
      });
      currentStore.setActiveLine(frame.highlightLine ?? null);
    }

    if (isRaceMode) {
      const secondaryIdx = Math.min(index, globalSecondaryAnimationFrames.length > 0 ? globalSecondaryAnimationFrames.length - 1 : 0);
      if (secondaryIdx >= 0 && globalSecondaryAnimationFrames.length > 0) {
        const frame2 = globalSecondaryAnimationFrames[secondaryIdx];
        const highlightedArray2 = frame2.array.map((el, i) => ({
          ...el,
          isComparing: frame2.comparingIndices.includes(i),
          isSwapping: frame2.swappingIndices.includes(i),
          isSorted: frame2.sortedIndices.includes(i),
        }));
        
        currentStore.setSecondaryArray(highlightedArray2);
        currentStore.setSecondaryStatistics({
          comparisons: frame2.comparisons,
          swaps: frame2.swaps,
        });
        currentStore.setSecondaryActiveLine(frame2.highlightLine ?? null);
      }
    }
  }
};

// The Hook itself now just sets up the workers ONCE.
export const useSorting = () => {
  useEffect(() => {
    // Only initialize once across the entire application lifecycle
    if (!globalWorker) {
      globalWorker = new SortingWorker();
      globalSecondaryWorker = new SortingWorker();
      
      const handleMessage = (isSecondary: boolean) => (e: MessageEvent) => {
        const { type, frames, error } = e.data;
        if (type === 'SUCCESS' && frames) {
          if (isSecondary) {
            globalSecondaryAnimationFrames = frames;
          } else {
            globalAnimationFrames = frames;
          }
          
          const store = useSortingStore.getState();
          const isRaceMode = store.isRaceMode;
          const expectedFinishes = isRaceMode ? 2 : 1;
          globalWorkersFinished += 1;
          
          if (globalWorkersFinished >= expectedFinishes) {
            globalCurrentFrameIndex = 0;
            
            const maxFrames = isRaceMode 
               ? Math.max(globalAnimationFrames.length, globalSecondaryAnimationFrames.length)
               : globalAnimationFrames.length;
               
            store.setTotalFrames(maxFrames);
            store.setStatistics({ comparisons: 0, swaps: 0 });
            store.setSecondaryStatistics({ comparisons: 0, swaps: 0 });
            playAnimation();
          }
        } else {
          console.error('Worker Error:', error);
          useSortingStore.getState().setIsPlaying(false);
        }
      };

      globalWorker.onmessage = handleMessage(false);
      globalSecondaryWorker!.onmessage = handleMessage(true);
    }
  }, []);

  return {
    startSorting,
    pauseAnimation,
    resumeAnimation,
    resetAnimation,
    playAnimation,
    jumpToFrame,
  };
};
