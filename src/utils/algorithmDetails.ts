import type { SortingAlgorithm } from '../types';

export interface AlgorithmDetails {
  name: string;
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  stable: boolean;
  pseudoCode: string;
}

export const algorithmDictionary: Record<SortingAlgorithm, AlgorithmDetails> = {
  'Bubble Sort': {
    name: 'Bubble Sort',
    description: 'Bubble sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: true,
    pseudoCode: `for i from 0 to N - 1
  for j from 0 to N - i - 1
    if a[j] > a[j+1]
      swap(a[j], a[j+1])`
  },
  'Selection Sort': {
    name: 'Selection Sort',
    description: 'Selection sort divides the input list into two parts: a sorted sublist of items which is built up from left to right at the front of the list and a sublist of the remaining unsorted items that occupy the rest of the list.',
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: false,
    pseudoCode: `for i from 0 to N - 1
  min_idx = i
  for j from i+1 to N
    if a[j] < a[min_idx]
      min_idx = j
  swap(a[i], a[min_idx])`
  },
  'Insertion Sort': {
    name: 'Insertion Sort',
    description: 'Insertion sort iterates, consuming one input element each repetition, and growing a sorted output list. At each iteration, it removes one element from the input data, finds the location it belongs within the sorted list, and inserts it there.',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: true,
    pseudoCode: `for i from 1 to N - 1
  key = a[i]
  j = i - 1
  while j >= 0 and a[j] > key
    a[j+1] = a[j]
    j = j - 1
  a[j+1] = key`
  },
  'Merge Sort': {
    name: 'Merge Sort',
    description: 'Merge sort is an efficient, general-purpose, and comparison-based sorting algorithm. Most implementations produce a stable sort, which means that the order of equal elements is the same in the input and output. It is a divide and conquer algorithm.',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
    stable: true,
    pseudoCode: `MergeSort(arr[], l,  r)
  If r > l
    mid = (l + r)/2
    MergeSort(arr, l, mid)
    MergeSort(arr, mid+1, r)
    Merge(arr, l, mid, r)`
  },
  'Quick Sort': {
    name: 'Quick Sort',
    description: 'Quicksort is an in-place sorting algorithm. It is a divide-and-conquer algorithm. It works by selecting a \'pivot\' element from the array and partitioning the other elements into two sub-arrays, according to whether they are less than or greater than the pivot.',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    spaceComplexity: 'O(log n)',
    stable: false,
    pseudoCode: `QuickSort(arr[], low, high)
  if low < high
    pi = partition(arr, low, high)
    QuickSort(arr, low, pi - 1)
    QuickSort(arr, pi + 1, high)

partition(arr, low, high)
  // standard lomuto or hoare scheme`
  },
  'Heap Sort': {
    name: 'Heap Sort',
    description: 'Heapsort is a comparison-based sorting algorithm. Heapsort can be thought of as an improved selection sort: like selection sort, heapsort divides its input into a sorted and an unsorted region, and it iteratively shrinks the unsorted region by extracting the largest element.',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(1)',
    stable: false,
    pseudoCode: `HeapSort(arr)
  BuildMaxHeap(arr)
  for i from length(arr) downto 2
    swap arr[1] with arr[i]
    heap_size[arr] = heap_size[arr] - 1
    MaxHeapify(arr, 1)`
  },
  'Shell Sort': {
    name: 'Shell Sort',
    description: 'Shellsort is an in-place comparison sort. It can be seen as either a generalization of sorting by exchange (bubble sort) or sorting by insertion (insertion sort). The method starts by sorting pairs of elements far apart from each other, then progressively reducing the gap between elements to be compared.',
    timeComplexity: { best: 'O(n log n)', average: 'O(n^(4/3))', worst: 'O(n^(3/2))' },
    spaceComplexity: 'O(1)',
    stable: false,
    pseudoCode: `for gap = N/2 down to 1
  for i = gap to N
    temp = a[i]
    for j = i; j >= gap and a[j - gap] > temp; j -= gap
      a[j] = a[j - gap]
    a[j] = temp`
  },
  'Radix Sort': {
    name: 'Radix Sort',
    description: 'Radix sort is a non-comparative sorting algorithm. It avoids comparison by creating and distributing elements into buckets according to their radix. For elements with more than one significant digit, this bucketing process is repeated for each digit, while preserving the ordering of the prior step.',
    timeComplexity: { best: 'O(nk)', average: 'O(nk)', worst: 'O(nk)' },
    spaceComplexity: 'O(n + k)',
    stable: true,
    pseudoCode: `RadixSort(arr)
  max_val = max(arr)
  for exp = 1, 10, 100... while max_val / exp > 0
    CountingSort(arr, exp)`
  },
  'Counting Sort': {
    name: 'Counting Sort',
    description: 'Counting sort is an algorithm for sorting a collection of objects according to keys that are small integers; that is, it is an integer sorting algorithm. It operates by counting the number of objects that have each distinct key value, and using arithmetic on those counts to determine the positions of each key value in the output sequence.',
    timeComplexity: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n + k)' },
    spaceComplexity: 'O(n + k)',
    stable: true,
    pseudoCode: `CountingSort(arr)
  max = max(arr)
  count array of size max + 1
  for each x in arr
    count[x]++
  for i = 1 to max
    count[i] += count[i-1]
  output = array of size N
  for i = N-1 downto 0
    output[count[arr[i]] - 1] = arr[i]
    count[arr[i]]--`
  }
};

export const getAlgorithmDetails = (algorithm: SortingAlgorithm): AlgorithmDetails | null => {
  return algorithmDictionary[algorithm] || null;
};
