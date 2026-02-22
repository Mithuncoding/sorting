import type { AnimationFrame, ArrayElement } from '../types';

export const heapSort = (array: ArrayElement[]): AnimationFrame[] => {
  const animations: AnimationFrame[] = [];
  const arr = array.map(el => ({ ...el }));
  let comparisons = 0;
  let swaps = 0;
  const n = arr.length;

  const generateState = (comparing: number[], swapping: number[], sorted: number[], line: number) => {
    animations.push({
      array: arr.map(el => ({ ...el })),
      comparingIndices: comparing,
      swappingIndices: swapping,
      sortedIndices: sorted,
      comparisons,
      swaps,
      highlightLine: line,
    });
  };

  generateState([], [], [], 0);

  const heapify = (size: number, i: number) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < size) {
      comparisons++;
      generateState([largest, left], [], [], 3); // heapify comparison
      if (arr[left].value > arr[largest].value) {
        largest = left;
      }
    }

    if (right < size) {
      comparisons++;
      generateState([largest, right], [], [], 3); // heapify comparison
      if (arr[right].value > arr[largest].value) {
        largest = right;
      }
    }

    if (largest !== i) {
      swaps++;
      generateState([], [i, largest], [], 4); // heapify swap
      
      const temp = arr[i];
      arr[i] = arr[largest];
      arr[largest] = temp;
      
      generateState([], [i, largest], [], 4);
      
      heapify(size, largest);
    }
  };

  // Build heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  // Extract elements
  const sorted: number[] = [];
  for (let i = n - 1; i > 0; i--) {
    swaps++;
    generateState([], [0, i], sorted, 6); // extract max
    
    const temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;
    
    sorted.push(i);
    generateState([], [0, i], sorted, 6);
    
    heapify(i, 0);
  }

  sorted.push(0); // the last element is sorted

  animations.push({
    array: arr.map(el => ({ ...el })),
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: sorted,
    comparisons,
    swaps,
    highlightLine: 0,
  });

  return animations;
};
