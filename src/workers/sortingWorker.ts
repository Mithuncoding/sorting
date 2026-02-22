import type { SortingAlgorithm, ArrayElement, AnimationFrame } from '../types';
import { getSortingAlgorithm } from '../algorithms';

export interface WorkerRequest {
  array: ArrayElement[];
  algorithm: SortingAlgorithm;
}

export interface WorkerResponse {
  type: 'SUCCESS' | 'ERROR';
  frames?: AnimationFrame[];
  error?: string;
}

self.onmessage = (e: MessageEvent<WorkerRequest>) => {
  try {
    const { array, algorithm } = e.data;
    const sortFunction = getSortingAlgorithm(algorithm);
    
    const frames = sortFunction(array);

    // Attach timeMs to the last frame or pass it along
    if (frames.length > 0) {
      frames[frames.length - 1] = {
        ...frames[frames.length - 1],
        // If sorting time wasn't tracked inside algo, just overwrite the last frame's stats block
        // Actually, we'll let the hook compute time based on worker response time.
      };
    }

    self.postMessage({ type: 'SUCCESS', frames } as WorkerResponse);
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    self.postMessage({ type: 'ERROR', error: errorMsg } as WorkerResponse);
  }
};
