import type { AnimationFrame, ArrayElement } from '../types';

export const shellSort = (array: ArrayElement[]): AnimationFrame[] => {
  const animations: AnimationFrame[] = [];
  const arr = array.map(el => ({ ...el }));
  let comparisons = 0;
  let swaps = 0;
  const n = arr.length;

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

  generateState([], [], 0);

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      let j = i;
      while (j >= gap) {
        comparisons++;
        generateState([j - gap, j], [], 4); // if (a[j - gap] > a[j])
        
        if (arr[j - gap].value > arr[j].value) {
          swaps++;
          generateState([], [j, j - gap], 5); // trigger swap animation
          
          const temp = arr[j];
          arr[j] = arr[j - gap];
          arr[j - gap] = temp;
          
          generateState([], [j, j - gap], 5); // display post-swap
          j -= gap;
        } else {
          break;
        }
      }
    }
  }

  animations.push({
    array: arr.map(el => ({ ...el })),
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: Array.from({length: n}, (_, k) => k),
    comparisons,
    swaps,
    highlightLine: 0,
  });

  return animations;
};
