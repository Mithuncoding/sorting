let audioContext: AudioContext | null = null;

export const initAudio = () => {
  if (!audioContext) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
};

export const playNote = (frequency: number) => {
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = 'sine'; // 'sine', 'square', 'sawtooth', 'triangle'
  oscillator.frequency.value = frequency;

  // Make it sound like a quick "blip"
  gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.1);
};

export const mapValueToFrequency = (value: number, maxVal: number = 100) => {
  // Map value (1-100) to a frequency range (e.g. 200Hz - 1000Hz)
  const minFreq = 200;
  const maxFreq = 1000;
  return minFreq + ((value / maxVal) * (maxFreq - minFreq));
};
