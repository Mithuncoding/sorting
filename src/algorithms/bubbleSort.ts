import type { AnimationFrame, ArrayElement } from '../types';

export const bubbleSort = (array: ArrayElement[]): AnimationFrame[] => {
  const animations: AnimationFrame[] = [];
  const arr = array.map(el => ({ ...el }));
  let comparisons = 0;
  let swaps = 0;
  const n = arr.length;
  
  // Initial state
  animations.push({
    array: arr.map(el => ({ ...el })),
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: [],
    comparisons,
    swaps,
    highlightLine: 0,
  });

  for (let i = 0; i < n; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      
      // Highlight comparing
      animations.push({
        array: arr.map(el => ({ ...el })),
        comparingIndices: [j, j + 1],
        swappingIndices: [],
        sortedIndices: Array.from({length: i}, (_, k) => n - 1 - k),
        comparisons,
        swaps,
        highlightLine: 2, // for j from 0 to N - i - 1
      });

      if (arr[j].value > arr[j + 1].value) {
        swaps++;
        swapped = true;
        
        // Highlight swapping before actual swap
        animations.push({
          array: arr.map(el => ({ ...el })),
          comparingIndices: [],
          swappingIndices: [j, j + 1],
          sortedIndices: Array.from({length: i}, (_, k) => n - 1 - k),
          comparisons,
          swaps,
          highlightLine: 3, // if a[j] > a[j+1]
        });

        // Swap
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        // Highlight swapping after swap
        animations.push({
          array: arr.map(el => ({ ...el })),
          comparingIndices: [],
          swappingIndices: [j, j + 1],
          sortedIndices: Array.from({length: i}, (_, k) => n - 1 - k),
          comparisons,
          swaps,
          highlightLine: 4, // swap(a[j], a[j+1])
        });
      }
    }
    
    // Mark n-i-1 as sorted
    animations.push({
      array: arr.map(el => ({ ...el })),
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: Array.from({length: i + 1}, (_, k) => n - 1 - k),
      comparisons,
      swaps,
    });

    if (!swapped) break;
  }
  
  // Final state
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
