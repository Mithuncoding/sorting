import React, { useState } from 'react';
import { Play, Pause, RotateCcw, FastForward, Settings2, Volume2, VolumeX, ChevronDown } from 'lucide-react';
import { initAudio } from '../../utils/sound';
import { useSortingStore } from '../../store/sortingStore';
import { useSorting } from '../../hooks/useSorting';
import type { SortingAlgorithm, DataDistribution, VisualizationMode } from '../../types';

const DATA_DISTRIBUTIONS: { label: string, value: DataDistribution }[] = [
  { label: 'Random', value: 'random' },
  { label: 'Nearly Sorted', value: 'nearly_sorted' },
  { label: 'Reversed', value: 'reversed' },
  { label: 'Few Unique', value: 'few_unique' },
  { label: 'Sawtooth 📈', value: 'sawtooth' },
  { label: 'Sinusoidal 🌊', value: 'sinusoidal' },
  { label: 'Bell Curve 🔔', value: 'bell_curve' },
  { label: 'Pyramid ⛰️', value: 'pyramid' },
  { label: 'Custom Input', value: 'custom' }
];

const VIZ_MODES: { label: string, value: VisualizationMode, desc: string }[] = [
  { label: 'Bars', value: 'bars', desc: 'Height = value' },
  { label: 'Scatter', value: 'scatter', desc: 'X=pos, Y=value' },
  { label: 'Color', value: 'color', desc: 'Hue = value' },
  { label: 'Matrix', value: 'matrix', desc: '2D grid of colors' }
];

const ALGORITHMS: SortingAlgorithm[] = [
  'Bubble Sort',
  'Selection Sort',
  'Insertion Sort',
  'Merge Sort',
  'Quick Sort',
  'Heap Sort',
  'Shell Sort',
  'Radix Sort',
  'Counting Sort'
];

export const Sidebar: React.FC = () => {
  const store = useSortingStore();
  const { startSorting, pauseAnimation, resumeAnimation, resetAnimation } = useSorting();
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <aside className="w-full md:w-80 glass-panel p-4 md:p-6 rounded-xl flex flex-col gap-6 overflow-y-auto z-10 custom-scrollbar">
      <div className="flex items-center gap-2">
        <Settings2 className="w-5 h-5 text-[--color-neon-pink]" />
        <h2 className="text-xl font-semibold">Controls</h2>
        <button
          onClick={() => {
            initAudio();
            store.setSoundEnabled(!store.soundEnabled);
          }}
          className="ml-auto p-2 rounded-full hover:bg-white/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          title="Toggle Sound"
        >
          {store.soundEnabled ? <Volume2 className="w-5 h-5 text-[--color-neon-cyan]" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
        </button>
        {/* Mobile collapse toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          title="Toggle Controls"
        >
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* Collapsible content — always visible on desktop, toggle on mobile */}
      <div className={`flex flex-col gap-6 ${isCollapsed ? 'hidden md:flex' : 'flex'}`}>
      {/* Array Size */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <label className="text-gray-300">Array Size</label>
          <span className="text-[--color-neon-cyan]">{store.arraySize}</span>
        </div>
        <input 
          type="range" 
          min="10" 
          max="1000" 
          step="10"
          value={store.arraySize}
          onChange={(e) => {
            store.setArraySize(Number(e.target.value));
            resetAnimation();
          }}
          disabled={store.isPlaying || store.isPaused}
          className="w-full accent-[--color-neon-cyan]"
        />
      </div>

      {/* Speed */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <label className="text-gray-300">Speed (ms delay)</label>
          <span className="text-[--color-neon-purple]">{101 - store.speedMs}</span>
        </div>
        <input 
          type="range" 
          min="1" 
          max="100" 
          value={store.speedMs}
          onChange={(e) => store.setSpeedMs(Number(e.target.value))}
          className="w-full accent-[--color-neon-purple]"
        />
      </div>

      {/* Visualization Mode */}
      <div className="space-y-2">
        <label className="text-sm text-gray-300">Display Mode</label>
        <div className="grid grid-cols-4 gap-1 bg-black/40 p-1 rounded-lg border border-[--color-glass-border]">
          {VIZ_MODES.map(mode => (
            <button
              key={mode.value}
              onClick={() => store.setVisualizationMode(mode.value)}
              title={mode.desc}
              className={`text-[10px] py-1.5 rounded-md transition-colors ${
                store.visualizationMode === mode.value 
                  ? 'bg-[--color-neon-purple] text-white shadow-[0_0_10px_rgba(157,0,255,0.4)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-gray-500 italic">
          {VIZ_MODES.find(m => m.value === store.visualizationMode)?.desc || ''}
        </p>
      </div>

      {/* Data Distribution */}
      <div className="space-y-2">
        <label className="text-sm text-gray-300">Data Distribution</label>
        <select 
          className="w-full bg-[#1a1a1a] border border-[--color-glass-border] rounded-md p-2 text-white text-sm focus:outline-none focus:border-[--color-neon-cyan]"
          value={store.dataDistribution}
          onChange={(e) => {
             store.setDataDistribution(e.target.value as DataDistribution);
             // Use setTimeout since update is slightly deferred in React 18, 
             // but Zustand is immediate so resetAnimation() should pick it up if it uses getState()
             // wait, useSorting.ts resetAnimation uses useSortingStore.getState(), so it's safe.
             setTimeout(resetAnimation, 0);
          }}
          disabled={store.isPlaying || store.isPaused}
        >
          {DATA_DISTRIBUTIONS.map(dist => (
            <option key={dist.value} value={dist.value}>{dist.label}</option>
          ))}
        </select>
      </div>

      {store.dataDistribution === 'custom' && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex justify-between items-center text-sm">
             <label className="text-gray-300">Custom Array Data</label>
             <button onClick={resetAnimation} className="text-xs text-[--color-neon-cyan] hover:underline">Apply</button>
          </div>
          <input 
            type="text" 
            placeholder="e.g. 50, 10, 100, 20"
            value={store.customArrayInput}
            onChange={(e) => store.setCustomArrayInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') resetAnimation() }}
            disabled={store.isPlaying || store.isPaused}
            className="w-full bg-[#1a1a1a] border border-[--color-glass-border] rounded-md p-2 text-white text-sm focus:outline-none focus:border-[--color-neon-cyan] font-mono"
          />
        </div>
      )}

      {/* Race Mode & God Mode Toggle */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-300">Race Mode (Side-by-Side)</label>
          <button
            onClick={() => {
              store.setIsRaceMode(!store.isRaceMode);
              setTimeout(resetAnimation, 0);
            }}
            disabled={store.isPlaying || store.isPaused}
            className={`w-10 h-5 rounded-full relative transition-colors ${store.isRaceMode ? 'bg-[--color-neon-cyan]' : 'bg-white/10'}`}
          >
            <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${store.isRaceMode ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm text-[--color-neon-pink] font-bold">GOD MODE ⚡</label>
          <button
            onClick={() => {
              store.setIsGodMode(!store.isGodMode);
            }}
            className={`w-10 h-5 rounded-full relative transition-colors ${store.isGodMode ? 'bg-[--color-neon-pink] shadow-[0_0_15px_rgba(255,0,234,0.5)]' : 'bg-white/10'}`}
          >
            <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${store.isGodMode ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Algorithm Selection */}
      <div className="space-y-2">
        <label className="text-sm text-gray-300">{store.isRaceMode ? 'Algorithm (Primary)' : 'Algorithm'}</label>
        <select 
          className="w-full bg-[#1a1a1a] border border-[--color-glass-border] rounded-md p-2 text-white text-sm focus:outline-none focus:border-[--color-neon-cyan]"
          value={store.algorithm}
          onChange={(e) => store.setAlgorithm(e.target.value as SortingAlgorithm)}
          disabled={store.isPlaying || store.isPaused}
        >
          {ALGORITHMS.map(algo => (
            <option key={algo} value={algo}>{algo}</option>
          ))}
        </select>
      </div>

      {store.isRaceMode && (
        <div className="space-y-2 animate-in fade-in zoom-in duration-200">
          <label className="text-sm text-[--color-neon-pink]">Algorithm (Secondary)</label>
          <select 
            className="w-full bg-[#1a1a1a] border border-[--color-glass-border] rounded-md p-2 text-white text-sm focus:outline-none focus:border-[--color-neon-pink]"
            value={store.secondaryAlgorithm}
            onChange={(e) => store.setSecondaryAlgorithm(e.target.value as SortingAlgorithm)}
            disabled={store.isPlaying || store.isPaused}
          >
            {ALGORITHMS.map(algo => (
              <option key={algo} value={algo}>{algo}</option>
            ))}
          </select>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {(!store.isPlaying && !store.isPaused) ? (
          <button 
            onClick={startSorting}
            className="flex items-center justify-center gap-2 bg-neon-cyan text-black font-semibold py-2 px-4 rounded-md hover:bg-cyan-400 transition-colors col-span-2"
          >
            <Play className="w-4 h-4" /> Start Sorting
          </button>
        ) : store.isPlaying ? (
          <button 
            onClick={pauseAnimation}
            className="flex items-center justify-center gap-2 bg-yellow-500 text-black font-semibold py-2 px-4 rounded-md hover:bg-yellow-400 transition-colors col-span-2"
          >
            <Pause className="w-4 h-4" /> Pause
          </button>
        ) : (
          <button 
            onClick={resumeAnimation}
            className="flex items-center justify-center gap-2 bg-neon-cyan text-black font-semibold py-2 px-4 rounded-md hover:bg-cyan-400 transition-colors col-span-2"
          >
            <FastForward className="w-4 h-4" /> Resume
          </button>
        )}

        <button 
          onClick={resetAnimation}
          className="flex items-center justify-center gap-2 bg-transparent border border-[--color-glass-border] text-white hover:bg-white/5 font-semibold py-2 px-4 rounded-md transition-colors col-span-2"
        >
          <RotateCcw className="w-4 h-4" /> Reset Array
        </button>
      </div>
      </div>
    </aside>
  );
};
