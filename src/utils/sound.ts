let audioContext: AudioContext | null = null;
let mainGainNode: GainNode | null = null;

// Pentatonic scale frequencies starting from C3 (roughly)
const PENTATONIC_SCALE = [
  130.81, // C3
  146.83, // D3
  164.81, // E3
  196.00, // G3
  220.00, // A3
  261.63, // C4
  293.66, // D4
  329.63, // E4
  392.00, // G4
  440.00, // A4
  523.25, // C5
  587.33, // D5
  659.25, // E5
  783.99, // G5
  880.00, // A5
  1046.50, // C6
];

export const initAudio = () => {
  if (!audioContext) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    mainGainNode = audioContext.createGain();
    mainGainNode.gain.value = 0.5; // Master volume
    mainGainNode.connect(audioContext.destination);
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
};

/**
 * Plays a note with optional stereo panning and melodic mapping
 * @param value The value of the element (1-100 typical)
 * @param index The index in the array (for panning)
 * @param arraySize Total size of array (for panning calculation)
 */
export const playNote = (value: number, index: number = 0, arraySize: number = 100) => {
  if (!audioContext || !mainGainNode) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const panner = audioContext.createStereoPanner();

  // 1. Melodic Mapping (Pentatonic)
  const scaleIndex = Math.floor((value / 101) * PENTATONIC_SCALE.length);
  const frequency = PENTATONIC_SCALE[scaleIndex] || 440;

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

  // 2. Stereo Panning (-1 for left, 1 for right)
  const panValue = (index / (arraySize - 1 || 1)) * 2 - 1;
  panner.pan.setValueAtTime(panValue, audioContext.currentTime);

  // 3. ADSR Envelope (Pluck)
  const now = audioContext.currentTime;
  const attack = 0.005;
  const decay = 0.1;
  
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.1, now + attack);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + attack + decay);

  // Route: Osc -> Gain -> Panner -> Master Gain
  oscillator.connect(gainNode);
  gainNode.connect(panner);
  panner.connect(mainGainNode);

  oscillator.start(now);
  oscillator.stop(now + attack + decay + 0.1);
};

export const mapValueToFrequency = (value: number, maxVal: number = 100) => {
  // Keeping this for compatibility but playNote now handles mapping internally
  const minFreq = 130;
  const maxFreq = 1046;
  return minFreq + ((value / maxVal) * (maxFreq - minFreq));
};
