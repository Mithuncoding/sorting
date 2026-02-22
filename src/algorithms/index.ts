import type { SortingAlgorithm, AnimationFrame, ArrayElement } from '../types';
import { bubbleSort } from './bubbleSort';
import { selectionSort } from './selectionSort';
import { insertionSort } from './insertionSort';
import { mergeSort } from './mergeSort';
import { quickSort } from './quickSort';
import { heapSort } from './heapSort';
import { shellSort } from './shellSort';
import { radixSort } from './radixSort';
import { countingSort } from './countingSort';

export const getSortingAlgorithm = (
  algorithmName: SortingAlgorithm
): ((array: ArrayElement[]) => AnimationFrame[]) => {
  switch (algorithmName) {
    case 'Bubble Sort': return bubbleSort;
    case 'Selection Sort': return selectionSort;
    case 'Insertion Sort': return insertionSort;
    case 'Merge Sort': return mergeSort;
    case 'Quick Sort': return quickSort;
    case 'Heap Sort': return heapSort;
    case 'Shell Sort': return shellSort;
    case 'Radix Sort': return radixSort;
    case 'Counting Sort': return countingSort;
    default: return quickSort;
  }
};

export { 
  bubbleSort, 
  selectionSort, 
  insertionSort, 
  mergeSort, 
  quickSort, 
  heapSort, 
  shellSort, 
  radixSort, 
  countingSort 
};
