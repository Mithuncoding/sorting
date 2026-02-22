export type SortingAlgorithm = 
  | 'Bubble Sort'
  | 'Selection Sort'
  | 'Insertion Sort'
  | 'Merge Sort'
  | 'Quick Sort'
  | 'Heap Sort'
  | 'Shell Sort'
  | 'Radix Sort'
  | 'Counting Sort';

export type VisualizationMode = 'bars' | 'scatter' | 'color';

export type DataDistribution = 
  | 'random' 
  | 'nearly_sorted' 
  | 'reversed' 
  | 'few_unique' 
  | 'custom';

export interface ArrayElement {
  id: string;      // Unique identifier for React keys
  value: number;   // The actual value being sorted
  isComparing?: boolean;
  isSwapping?: boolean;
  isSorted?: boolean;
}

export interface AnimationFrame {
  array: ArrayElement[];
  comparingIndices: number[];
  swappingIndices: number[];
  sortedIndices: number[];
  comparisons: number;
  swaps: number;
  highlightLine?: number; // For pseudocode highlighting
}

export interface SortingStatistics {
  comparisons: number;
  swaps: number;
  timeMs: number;
}
