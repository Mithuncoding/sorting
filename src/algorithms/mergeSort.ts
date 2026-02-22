import type { AnimationFrame, ArrayElement } from '../types';

export const mergeSort = (array: ArrayElement[]): AnimationFrame[] => {
  const animations: AnimationFrame[] = [];
  const arr = array.map(el => ({ ...el }));
  const aux = array.map(el => ({ ...el }));
  let comparisons = 0;
  let swaps = 0; // In merge sort, we count assignments as swaps for visual simplicity

  const merge = (low: number, mid: number, high: number) => {
    for (let k = low; k <= high; k++) {
      aux[k] = { ...arr[k] };
    }

    let i = low;
    let j = mid + 1;

    for (let k = low; k <= high; k++) {
      // Highlight comparison
      if (i <= mid && j <= high) {
        comparisons++;
        animations.push({
          array: arr.map(el => ({ ...el })),
          comparingIndices: [i, j],
          swappingIndices: [],
          sortedIndices: [],
          comparisons,
          swaps,
          highlightLine: 3, // compare left and right
        });
      }

      if (i > mid) {
        arr[k] = { ...aux[j++] };
        swaps++;
      } else if (j > high) {
        arr[k] = { ...aux[i++] };
        swaps++;
      } else if (aux[j].value < aux[i].value) {
        arr[k] = { ...aux[j++] };
        swaps++;
      } else {
        arr[k] = { ...aux[i++] };
        swaps++;
      }

      // Highlight the overwrite (swap)
      animations.push({
        array: arr.map(el => ({ ...el })),
        comparingIndices: [],
        swappingIndices: [k],
        sortedIndices: [],
        comparisons,
        swaps,
        highlightLine: 4, // overwrite from aux to arr
      });
    }
  };

  const sort = (low: number, high: number) => {
    if (high <= low) return;
    const mid = low + Math.floor((high - low) / 2);
    sort(low, mid);
    sort(mid + 1, high);
    merge(low, mid, high);
  };

  animations.push({
    array: arr.map(el => ({ ...el })),
    comparingIndices: [],
    swappingIndices: [],
    sortedIndices: [],
    comparisons,
    swaps,
    highlightLine: 0,
  });

  sort(0, arr.length - 1);

  // Final push
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
