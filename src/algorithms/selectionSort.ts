import type { AnimationFrame, ArrayElement } from '../types';

export const selectionSort = (array: ArrayElement[]): AnimationFrame[] => {
  const animations: AnimationFrame[] = [];
  const arr = array.map(el => ({ ...el }));
  let comparisons = 0;
  let swaps = 0;
  const n = arr.length;

  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      comparisons++;
      
      // Highlight comparing
      animations.push({
        array: arr.map(el => ({ ...el })),
        comparingIndices: [minIdx, j],
        swappingIndices: [],
        sortedIndices: Array.from({length: i}, (_, k) => k),
        comparisons,
        swaps,
        highlightLine: 3, // for j from i+1 to N
      });

      if (arr[j].value < arr[minIdx].value) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      swaps++;
      // Highlight swap
      animations.push({
        array: arr.map(el => ({ ...el })),
        comparingIndices: [],
        swappingIndices: [i, minIdx],
        sortedIndices: Array.from({length: i}, (_, k) => k),
        comparisons,
        swaps,
        highlightLine: 5, // swap(a[i], a[minIdx])
      });

      // Swap
      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;

      // Highlight array after swap
      animations.push({
        array: arr.map(el => ({ ...el })),
        comparingIndices: [],
        swappingIndices: [i, minIdx],
        sortedIndices: Array.from({length: i}, (_, k) => k),
        comparisons,
        swaps,
        highlightLine: 5, // swap(a[i], a[minIdx])
      });
    }

    // Mark i as sorted
    animations.push({
      array: arr.map(el => ({ ...el })),
      comparingIndices: [],
      swappingIndices: [],
      sortedIndices: Array.from({length: i + 1}, (_, k) => k),
      comparisons,
      swaps,
    });
  }

  // Final sorted state ensure all elements are marked sorted
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
