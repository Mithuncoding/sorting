import type { AnimationFrame, ArrayElement } from '../types';

export const countingSort = (array: ArrayElement[]): AnimationFrame[] => {
  const animations: AnimationFrame[] = [];
  const arr = array.map(el => ({ ...el }));
  let comparisons = 0;
  let swaps = 0;
  const n = arr.length;

  const generateState = (comparing: number[], swapping: number[], currentArr: ArrayElement[], line: number) => {
    animations.push({
      array: currentArr.map(el => ({ ...el })),
      comparingIndices: comparing,
      swappingIndices: swapping,
      sortedIndices: [],
      comparisons,
      swaps,
      highlightLine: line,
    });
  };

  generateState([], [], arr, 0);

  let max = arr[0].value;
  for (let i = 1; i < n; i++) {
    comparisons++;
    if (arr[i].value > max) max = arr[i].value;
    generateState([i], [], arr, 1); // find max loop
  }

  const count = new Array(max + 1).fill(0);
  const output = new Array(n);

  for (let i = 0; i < n; i++) {
    count[arr[i].value]++;
    generateState([i], [], arr, 3); // count occurrences
  }

  for (let i = 1; i <= max; i++) {
    count[i] += count[i - 1];
  }

  for (let i = n - 1; i >= 0; i--) {
    output[count[arr[i].value] - 1] = arr[i];
    count[arr[i].value]--;
  }

  // We don't animate the intermediate count array transformations 
  // because the visualizer only shows the main array

  for (let i = 0; i < n; i++) {
    swaps++;
    arr[i] = output[i];
    generateState([], [i], arr, 6); // Build output array
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
