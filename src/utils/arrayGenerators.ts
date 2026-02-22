import type { ArrayElement } from '../types';

const createArrayElement = (value: number, id: string): ArrayElement => ({
  id,
  value,
  isComparing: false,
  isSwapping: false,
  isSorted: false,
});

export const generateRandomArray = (size: number): ArrayElement[] => {
  const array: ArrayElement[] = [];
  for (let i = 0; i < size; i++) {
    array.push(createArrayElement(Math.floor(Math.random() * 100) + 1, `${i}-${Math.random().toString(36).substring(2, 9)}`));
  }
  return array;
};

export const generateReversedArray = (size: number): ArrayElement[] => {
  const array: ArrayElement[] = [];
  for (let i = size; i > 0; i--) {
    array.push(createArrayElement(Math.floor((i / size) * 100) || 1, `${i}-${Math.random().toString(36).substring(2, 9)}`));
  }
  return array;
};

export const generateNearlySortedArray = (size: number): ArrayElement[] => {
  const array = generateRandomArray(size).sort((a, b) => a.value - b.value);
  const swapCount = Math.max(1, Math.floor(size * 0.05));
  for (let i = 0; i < swapCount; i++) {
    const idx1 = Math.floor(Math.random() * size);
    const idx2 = Math.floor(Math.random() * size);
    const temp = array[idx1].value;
    array[idx1].value = array[idx2].value;
    array[idx2].value = temp;
  }
  return array;
};

export const generateFewUniqueArray = (size: number): ArrayElement[] => {
  const array: ArrayElement[] = [];
  const uniqueValues = [10, 30, 50, 70, 90];
  for (let i = 0; i < size; i++) {
    const randomVal = uniqueValues[Math.floor(Math.random() * uniqueValues.length)];
    array.push(createArrayElement(randomVal, `${i}-${Math.random().toString(36).substring(2, 9)}`));
  }
  return array;
};

/* ─── Advanced V6 Mathematical Distributions ─── */

export const generateSawtoothArray = (size: number): ArrayElement[] => {
  const array: ArrayElement[] = [];
  const teeth = 3;
  const toothSize = Math.floor(size / teeth);
  for (let i = 0; i < size; i++) {
    const val = ((i % toothSize) / toothSize) * 90 + 5;
    array.push(createArrayElement(Math.floor(val), `${i}-${Math.random().toString(36).substring(2, 9)}`));
  }
  return array;
};

export const generateSinusoidalArray = (size: number): ArrayElement[] => {
  const array: ArrayElement[] = [];
  for (let i = 0; i < size; i++) {
    const val = (Math.sin((i / size) * Math.PI * 4) * 45) + 50;
    array.push(createArrayElement(Math.floor(val), `${i}-${Math.random().toString(36).substring(2, 9)}`));
  }
  return array;
};

export const generateBellCurveArray = (size: number): ArrayElement[] => {
  const array: ArrayElement[] = [];
  for (let i = 0; i < size; i++) {
    // Box-Muller transform for normal distribution
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    const standardNormal = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    // Scale standard normal (avg 0, stdDev 1) to (avg 50, range ~1-100)
    const val = Math.max(1, Math.min(100, (standardNormal * 15) + 50));
    array.push(createArrayElement(Math.floor(val), `${i}-${Math.random().toString(36).substring(2, 9)}`));
  }
  return array;
};

export const generatePyramidArray = (size: number): ArrayElement[] => {
  const array: ArrayElement[] = [];
  const mid = size / 2;
  for (let i = 0; i < size; i++) {
    const distanceFromMid = Math.abs(i - mid);
    const val = 100 - (distanceFromMid / mid) * 95;
    array.push(createArrayElement(Math.floor(val), `${i}-${Math.random().toString(36).substring(2, 9)}`));
  }
  return array;
};

export const parseCustomArray = (input: string): ArrayElement[] | null => {
  try {
    const values = input.split(',').map(v => parseInt(v.trim(), 10));
    if (values.some(isNaN) || values.length === 0) return null;
    const max = Math.max(...values, 100);
    const scale = 100 / max;
    return values.map((val, i) => createArrayElement(Math.max(1, Math.min(100, Math.floor(val * scale))), `${i}-${Math.random().toString(36).substring(2, 9)}`));
  } catch {
    return null;
  }
};
