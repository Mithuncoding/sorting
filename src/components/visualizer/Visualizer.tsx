import React from 'react';
import { useSortingStore } from '../../store/sortingStore';
import { motion } from 'framer-motion';

export const Visualizer: React.FC<{ isSecondary?: boolean }> = ({ isSecondary = false }) => {
  const store = useSortingStore();
  const array = isSecondary ? store.secondaryArray : store.array;
  const { arraySize, visualizationMode } = store;

  // If array is very large, render simple divs without framer-motion for performance,
  // or use Canvas. For now we use standard DOM divs, without layout animations when array > 100.
  const isLargeArray = arraySize > 100;

  const renderBars = () => (
    <div className="w-full flex justify-center items-end h-[80%] gap-px">
      {array.map((element) => {
        let bgStyle = 'bg-gradient-to-t from-white/10 to-white/50 border-white/10';
        let shadowStyle = 'none';

        if (element.isSorted) {
          bgStyle = 'bg-gradient-to-t from-[#00ff88]/20 to-[#00ff88] border-[#00ff88]/50';
          shadowStyle = '0 0 10px rgba(0,255,136,0.3)';
        } else if (element.isSwapping) {
          bgStyle = 'bg-gradient-to-t from-[--color-neon-pink]/40 to-[--color-neon-pink] border-[--color-neon-pink]/80 z-10';
          shadowStyle = '0 0 20px var(--color-neon-pink)';
        } else if (element.isComparing) {
          bgStyle = 'bg-gradient-to-t from-[--color-neon-purple]/40 to-[--color-neon-purple] border-[--color-neon-purple]/80 z-10';
          shadowStyle = '0 0 20px var(--color-neon-purple)';
        }

        return isLargeArray ? (
          <div
            key={element.id}
            className={`rounded-t-sm transition-colors duration-100 flex-1 mx-[0.5px] ${element.isSorted ? 'bg-[#00ff88]' : element.isSwapping ? 'bg-[--color-neon-pink]' : element.isComparing ? 'bg-[--color-neon-purple]' : 'bg-white/60'}`}
            style={{ height: `${element.value}%` }}
          />
        ) : (
          <motion.div
            layout
            transition={{ type: 'tween', duration: 0.15 }}
            key={element.id}
            className={`rounded-t-md border-t border-l border-r shadow-[0_0_10px_rgba(255,255,255,0.05)] flex-1 mx-[1px] ${bgStyle}`}
            style={{
              height: `${element.value}%`,
              boxShadow: shadowStyle
            }}
          />
        );
      })}
    </div>
  );

  const renderScatter = () => (
    <div className="w-full h-[80%] relative flex justify-center border-b border-l border-white/10 p-4">
      {array.map((element, index) => {
        let bgStyle = 'bg-white/60';
        let shadowStyle = '0 0 5px rgba(255,255,255,0.2)';

        if (element.isSorted) {
          bgStyle = 'bg-[#00ff88]';
          shadowStyle = '0 0 15px rgba(0,255,136,0.6)';
        } else if (element.isSwapping) {
          bgStyle = 'bg-[--color-neon-pink] scale-150 z-10';
          shadowStyle = '0 0 20px var(--color-neon-pink)';
        } else if (element.isComparing) {
          bgStyle = 'bg-[--color-neon-purple] scale-150 z-10';
          shadowStyle = '0 0 20px var(--color-neon-purple)';
        }
        
        const xPos = (index / array.length) * 100;
        const yPos = element.value;

        return (
          <div
            key={element.id}
            className={`absolute w-2 h-2 rounded-full transition-all duration-200 ${bgStyle}`}
            style={{
              left: `${xPos}%`,
              bottom: `${yPos}%`,
              boxShadow: shadowStyle
            }}
          />
        );
      })}
    </div>
  );

  const renderColorWheel = () => {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="relative w-full max-w-md aspect-square rounded-full flex items-center justify-center overflow-hidden border-2 border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black/50">
           {array.map((element, index) => {
              const hue = Math.floor((element.value / 100) * 360);
              const angle = (index / array.length) * 360;
              const isHighlight = element.isSwapping || element.isComparing;
              const lightness = isHighlight ? '70%' : '50%';
              const widthPct = (100 / array.length) * 2; 
              
              return (
                <div
                  key={element.id}
                  className="absolute top-1/2 left-1/2 origin-top-left h-[50%]"
                  style={{
                     width: `${widthPct}%`,
                     transform: `rotate(${angle}deg)`,
                     backgroundColor: `hsl(${hue}, 100%, ${lightness})`,
                     boxShadow: isHighlight ? `0 0 20px hsl(${hue}, 100%, 80%)` : 'none',
                     zIndex: isHighlight ? 10 : 1,
                     opacity: element.isSorted ? 0.9 : 1
                  }}
                />
              );
           })}
           {/* Center hollow cut-out for a ring effect */}
           <div className="absolute w-1/3 h-1/3 bg-black rounded-full z-20 shadow-[inset_0_0_20px_rgba(0,0,0,1)]" />
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col justify-end items-center px-4 pb-4 overflow-hidden">
      {visualizationMode === 'bars' && renderBars()}
      {visualizationMode === 'scatter' && renderScatter()}
      {visualizationMode === 'color' && renderColorWheel()}
    </div>
  );
};
