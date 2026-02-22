import { create } from 'zustand';
import type { SortingAlgorithm, VisualizationMode, DataDistribution, ArrayElement, SortingStatistics } from '../types';

interface SortingState {
  // Array State
  array: ArrayElement[];
  arraySize: number;
  setArray: (array: ArrayElement[]) => void;
  setArraySize: (size: number) => void;
  
  secondaryArray: ArrayElement[];
  setSecondaryArray: (array: ArrayElement[]) => void;
  
  // Settings
  algorithm: SortingAlgorithm;
  setAlgorithm: (algorithm: SortingAlgorithm) => void;
  speedMs: number;
  setSpeedMs: (speed: number) => void;
  visualizationMode: VisualizationMode;
  setVisualizationMode: (mode: VisualizationMode) => void;
  dataDistribution: DataDistribution;
  setDataDistribution: (type: DataDistribution) => void;
  customArrayInput: string;
  setCustomArrayInput: (input: string) => void;
  
  // Scrubber & Timeline
  currentFrameIndex: number;
  setCurrentFrameIndex: (index: number) => void;
  totalFrames: number;
  setTotalFrames: (total: number) => void;
  activeLine: number | null;
  setActiveLine: (line: number | null) => void;

  // Race Mode
  isRaceMode: boolean;
  setIsRaceMode: (isRace: boolean) => void;
  secondaryAlgorithm: SortingAlgorithm;
  setSecondaryAlgorithm: (algorithm: SortingAlgorithm) => void;
  secondaryActiveLine: number | null;
  setSecondaryActiveLine: (line: number | null) => void;
  
  // Playback State
  isPlaying: boolean;
  isPaused: boolean;
  isFinished: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsPaused: (isPaused: boolean) => void;
  setIsFinished: (isFinished: boolean) => void;
  
  // Stats
  statistics: SortingStatistics;
  setStatistics: (stats: Partial<SortingStatistics>) => void;
  secondaryStatistics: SortingStatistics;
  setSecondaryStatistics: (stats: Partial<SortingStatistics>) => void;
  
  // Toggles
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  isGodMode: boolean;
  setIsGodMode: (enabled: boolean) => void;
}

export const useSortingStore = create<SortingState>((set) => ({
  array: [],
  arraySize: 50,
  setArray: (array) => set({ array }),
  setArraySize: (size) => set({ arraySize: size }),
  
  secondaryArray: [],
  setSecondaryArray: (array) => set({ secondaryArray: array }),
  
  algorithm: 'Bubble Sort',
  setAlgorithm: (algorithm) => set({ algorithm }),
  speedMs: 50,
  setSpeedMs: (speed) => set({ speedMs: speed }),
  visualizationMode: 'bars',
  setVisualizationMode: (mode) => set({ visualizationMode: mode }),
  dataDistribution: 'random',
  setDataDistribution: (distribution) => set({ dataDistribution: distribution }),
  customArrayInput: '',
  setCustomArrayInput: (input) => set({ customArrayInput: input }),

  currentFrameIndex: 0,
  setCurrentFrameIndex: (index) => set({ currentFrameIndex: index }),
  totalFrames: 0,
  setTotalFrames: (total) => set({ totalFrames: total }),
  activeLine: null,
  setActiveLine: (line) => set({ activeLine: line }),

  isRaceMode: false,
  setIsRaceMode: (isRace) => set({ isRaceMode: isRace }),
  secondaryAlgorithm: 'Quick Sort',
  setSecondaryAlgorithm: (algorithm) => set({ secondaryAlgorithm: algorithm }),
  secondaryActiveLine: null,
  setSecondaryActiveLine: (line) => set({ secondaryActiveLine: line }),
  
  isPlaying: false,
  isPaused: false,
  isFinished: false,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setIsPaused: (isPaused) => set({ isPaused }),
  setIsFinished: (isFinished) => set({ isFinished }),
  
  statistics: { comparisons: 0, swaps: 0, timeMs: 0 },
  setStatistics: (stats) => set((state) => ({ 
    statistics: { ...state.statistics, ...stats } 
  })),
  secondaryStatistics: { comparisons: 0, swaps: 0, timeMs: 0 },
  setSecondaryStatistics: (stats) => set((state) => ({ 
    secondaryStatistics: { ...state.secondaryStatistics, ...stats } 
  })),
  
  soundEnabled: false,
  setSoundEnabled: (enabled: boolean) => set({ soundEnabled: enabled }),
  isGodMode: false,
  setIsGodMode: (enabled: boolean) => set({ isGodMode: enabled }),
}));
