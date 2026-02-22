import type { ArrayElement } from '../types';

export const generateRandomArray = (size: number): ArrayElement[] => {
  const array: ArrayElement[] = [];
  for (let i = 0; i < size; i++) {
    array.push({
      id: `${i}-${Math.random().toString(36).substring(2, 9)}`,
      value: Math.floor(Math.random() * 100) + 1, // values 1 to 100
      isComparing: false,
      isSwapping: false,
      isSorted: false,
    });
  }
  return array;
};

export const generateReversedArray = (size: number): ArrayElement[] => {
  const array: ArrayElement[] = [];
  for (let i = size; i > 0; i--) {
    array.push({
      id: `${i}-${Math.random().toString(36).substring(2, 9)}`,
      value: Math.floor((i / size) * 100) || 1,
      isComparing: false,
      isSwapping: false,
      isSorted: false,
    });
  }
  return array;
};

export const generateNearlySortedArray = (size: number): ArrayElement[] => {
  const array = generateRandomArray(size).sort((a, b) => a.value - b.value);
  // Swap a few elements to make it nearly sorted
  const swapCount = Math.max(1, Math.floor(size * 0.05));
  for (let i = 0; i < swapCount; i++) {
    const idx1 = Math.floor(Math.random() * size);
    const idx2 = Math.floor(Math.random() * size);
    // Swap values
    const temp = array[idx1].value;
    array[idx1].value = array[idx2].value;
    array[idx2].value = temp;
  }
  return array;
};

export const generateFewUniqueArray = (size: number): ArrayElement[] => {
  const array: ArrayElement[] = [];
  const uniqueValues = [10, 30, 50, 70, 90]; // Only 5 possible values
  for (let i = 0; i < size; i++) {
    const randomVal = uniqueValues[Math.floor(Math.random() * uniqueValues.length)];
    array.push({
      id: `${i}-${Math.random().toString(36).substring(2, 9)}`,
      value: randomVal,
      isComparing: false,
      isSwapping: false,
      isSorted: false,
    });
  }
  return array;
};

export const parseCustomArray = (input: string): ArrayElement[] | null => {
  try {
    const values = input.split(',').map(v => parseInt(v.trim(), 10));
    if (values.some(isNaN) || values.length === 0) return null;
    
    // Normalize values between 1 and 100 for consistent rendering
    const max = Math.max(...values, 100);
    const scale = 100 / max;

    return values.map((val, i) => ({
      id: `${i}-${Math.random().toString(36).substring(2, 9)}`,
      value: Math.max(1, Math.min(100, Math.floor(val * scale))), // Keep between 1-100
      isComparing: false,
      isSwapping: false,
      isSorted: false,
    }));
  } catch {
    return null;
  }
};
