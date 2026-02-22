import type { AnimationFrame, ArrayElement } from '../types';

export const quickSort = (array: ArrayElement[]): AnimationFrame[] => {
  const animations: AnimationFrame[] = [];
  const arr = array.map(el => ({ ...el }));
  let comparisons = 0;
  let swaps = 0;

  animations.push({
    array: arr.map(el => ({ ...el })),
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: [],
    comparisons,
    swaps,
    highlightLine: 0,
  });

  const generateState = (comparing: number[], swapping: number[], line: number) => {
    animations.push({
      array: arr.map(el => ({ ...el })),
      comparingIndices: comparing,
      swappingIndices: swapping,
      sortedIndices: [],
      comparisons,
      swaps,
      highlightLine: line,
    });
  };

  const partition = (low: number, high: number): number => {
    const pivot = arr[high].value;
    let i = low - 1;

    for (let j = low; j < high; j++) {
      comparisons++;
      generateState([j, high], [], 4); // if array[j] < pivot

      if (arr[j].value < pivot) {
        i++;
        swaps++;
        generateState([], [i, j], 5); // swap(array[i], array[j])
        
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        
        generateState([], [i, j], 5);
      }
    }

    swaps++;
    generateState([], [i + 1, high], 6); // swap(array[i + 1], array[high])
    const temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    generateState([], [i + 1, high], 6);

    return i + 1;
  };

  const sort = (low: number, high: number) => {
    if (low < high) {
      const pi = partition(low, high);
      sort(low, pi - 1);
      sort(pi + 1, high);
    }
  };

  sort(0, arr.length - 1);

  animations.push({
    array: arr.map(el => ({ ...el })),
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: Array.from({length: arr.length}, (_, k) => k),
    comparisons,
    swaps,
  });

  return animations;
};
