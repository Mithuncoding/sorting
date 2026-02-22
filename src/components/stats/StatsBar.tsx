import React from 'react';
import { useSortingStore } from '../../store/sortingStore';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useSorting } from '../../hooks/useSorting';

export const StatsBar: React.FC = () => {
  const { 
    statistics, 
    secondaryStatistics,
    isRaceMode,
    currentFrameIndex, 
    totalFrames, 
    isPlaying, 
    isFinished 
  } = useSortingStore();
  const { playAnimation, pauseAnimation, resetAnimation, startSorting, jumpToFrame } = useSorting();

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = parseInt(e.target.value, 10);
    if (isPlaying) {
      pauseAnimation();
    }
    jumpToFrame(newVal);
  };

  return (
    <div className="h-auto md:h-16 py-3 md:py-0 border-t border-[--color-glass-border] flex flex-col items-stretch md:flex-row md:items-center px-4 md:px-6 gap-3 md:gap-6 text-sm glass-panel z-10 sticky bottom-0">
      
      {/* Top Row on Mobile: Controls + Stats */}
      <div className="flex justify-between items-center w-full md:w-auto">
        {/* Playback Controls */}
        <div className="flex gap-2 items-center md:border-r md:border-[#ffffff20] md:pr-6">
          <button 
            onClick={isPlaying ? pauseAnimation : (isFinished ? startSorting : playAnimation)}
            className="p-2 rounded-lg bg-[--color-neon-cyan]/10 text-[--color-neon-cyan] hover:bg-[--color-neon-cyan]/20 transition-colors"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button 
            onClick={resetAnimation}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <RotateCcw size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Mobile Only Stats */}
        <div className="flex md:hidden gap-3 items-center">
          <div className="flex flex-col items-end">
            <span className="text-[9px] uppercase tracking-wider text-gray-500">Comp</span>
            <span className="font-mono text-[--color-neon-cyan] leading-none text-xs">
              {statistics.comparisons.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] uppercase tracking-wider text-gray-500">Swap</span>
            <span className="font-mono text-[--color-neon-pink] leading-none text-xs">
              {statistics.swaps.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Timeline Scrubber */}
      <div className="flex-1 flex items-center gap-3 w-full group">
        <span className="text-[10px] md:text-xs text-gray-400 font-mono w-10 md:w-12 text-right shrink-0">
          {totalFrames > 0 ? `${Math.round((currentFrameIndex / totalFrames) * 100)}%` : '0%'}
        </span>
        <input 
          type="range" 
          min="0" 
          max={totalFrames > 0 ? totalFrames - 1 : 0}
          value={currentFrameIndex}
          onChange={handleSliderChange}
          disabled={totalFrames === 0}
          className="flex-1 h-2 bg-[#ffffff10] rounded-lg appearance-none cursor-pointer hover:bg-[#ffffff20] transition-colors accent-[--color-neon-cyan] disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <span className="text-[10px] md:text-xs text-gray-400 font-mono w-12 md:w-16 text-left shrink-0">
          {currentFrameIndex}/{totalFrames}
        </span>
      </div>

      {/* Desktop Only Stats */}
      <div className="hidden md:flex gap-4 items-center pl-6 border-l border-[#ffffff20]">
        
        {/* Primary Stats */}
        <div className="flex gap-4 items-center">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-wider text-gray-500">Comparisons{isRaceMode ? ' 1' : ''}</span>
            <span className="font-mono text-[--color-neon-cyan] leading-none">
              {statistics.comparisons.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-wider text-gray-500">Swaps{isRaceMode ? ' 1' : ''}</span>
            <span className="font-mono text-[--color-neon-pink] leading-none">
              {statistics.swaps.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Secondary Stats */}
        {isRaceMode && (
          <>
            <div className="w-px h-8 bg-white/10 mx-2" />
            <div className="flex gap-4 items-center">
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-wider text-gray-400">Comparisons 2</span>
                <span className="font-mono text-[--color-neon-cyan] leading-none opacity-80">
                  {secondaryStatistics.comparisons.toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-wider text-gray-400">Swaps 2</span>
                <span className="font-mono text-[--color-neon-pink] leading-none opacity-80">
                  {secondaryStatistics.swaps.toLocaleString()}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
