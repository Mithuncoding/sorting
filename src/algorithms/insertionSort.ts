import type { AnimationFrame, ArrayElement } from '../types';

export const insertionSort = (array: ArrayElement[]): AnimationFrame[] => {
  const animations: AnimationFrame[] = [];
  const arr = array.map(el => ({ ...el }));
  let comparisons = 0;
  let swaps = 0;
  const n = arr.length;

  animations.push({
    array: arr.map(el => ({ ...el })),
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: [0],
    comparisons,
    swaps,
    highlightLine: 0,
  });

  for (let i = 1; i < n; i++) {
    let j = i;
    
    if (j > 0) {
      comparisons++;
      animations.push({
        array: arr.map(el => ({ ...el })),
        comparingIndices: [j - 1, j],
        swappingIndices: [],
        sortedIndices: Array.from({length: i}, (_, k) => k),
        comparisons,
        swaps,
        highlightLine: 3, // j = i - 1
      });
    }
    
    while (j > 0 && arr[j].value < arr[j - 1].value) {
      swaps++;
      
      // Indicate swap potential
      animations.push({
        array: arr.map(el => ({ ...el })),
        comparingIndices: [],
        swappingIndices: [j - 1, j],
        sortedIndices: Array.from({length: i}, (_, k) => k),
        comparisons,
        swaps,
        highlightLine: 4, // while j >= 0 and a[j] > key
      });

      // Swap
      const temp = arr[j];
      arr[j] = arr[j - 1];
      arr[j - 1] = temp;
      
      // Swap completed
      animations.push({
        array: arr.map(el => ({ ...el })),
        comparingIndices: [],
        swappingIndices: [j - 1, j],
        sortedIndices: Array.from({length: i}, (_, k) => k),
        comparisons,
        swaps,
        highlightLine: 5, // a[j+1] = a[j]
      });

      j--;
      
      if (j > 0) {
        comparisons++;
        animations.push({
          array: arr.map(el => ({ ...el })),
          comparingIndices: [j - 1, j],
          swappingIndices: [],
          sortedIndices: Array.from({length: i}, (_, k) => k),
          comparisons,
          swaps,
          highlightLine: 6, // j = j - 1
        });
      }
    }
    
    // Mark up to i as sorted
    animations.push({
      array: arr.map(el => ({ ...el })),
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: Array.from({length: i + 1}, (_, k) => k),
      comparisons,
      swaps,
      highlightLine: 7, // a[j+1] = key
    });
  }

  // Ensure fully sorted
  animations.push({
    array: arr.map(el => ({ ...el })),
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: Array.from({length: n}, (_, k) => k),
    comparisons,
    swaps,
  });

  return animations;
};
