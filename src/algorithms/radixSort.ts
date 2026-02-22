import type { AnimationFrame, ArrayElement } from '../types';

export const radixSort = (array: ArrayElement[]): AnimationFrame[] => {
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

  // Find max value to know number of digits
  let max = arr[0].value;
  for (let i = 1; i < n; i++) {
    comparisons++;
    if (arr[i].value > max) {
      max = arr[i].value;
    }
  }

  // Do counting sort for every digit
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const output: ArrayElement[] = new Array(n);
    const count: number[] = new Array(10).fill(0);

    for (let i = 0; i < n; i++) {
      const digit = Math.floor(arr[i].value / exp) % 10;
      count[digit]++;
      generateState([i], [], arr, 4); // count[digit]++
    }

    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i].value / exp) % 10;
      output[count[digit] - 1] = arr[i];
      count[digit]--;
    }

    // copy output array to arr
    for (let i = 0; i < n; i++) {
      swaps++;
      arr[i] = output[i];
      generateState([], [i], arr, 6); // a[i] = output[i]
    }
  }

  // Final State
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
