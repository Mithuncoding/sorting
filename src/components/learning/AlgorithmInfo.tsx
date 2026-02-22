import React from 'react';
import { useSortingStore } from '../../store/sortingStore';
import { BookOpen, Clock, HardDrive, Info } from 'lucide-react';
import { getAlgorithmDetails } from '../../utils/algorithmDetails';

export const AlgorithmInfo: React.FC<{ isSecondary?: boolean }> = ({ isSecondary = false }) => {
  const store = useSortingStore();
  const algorithm = isSecondary ? store.secondaryAlgorithm : store.algorithm;
  const activeLine = isSecondary ? store.secondaryActiveLine : store.activeLine;
  const details = getAlgorithmDetails(algorithm);

  if (!details) return null;

  return (
    <div className="w-full glass-panel border border-[--color-glass-border] rounded-xl p-6 shadow-xl flex flex-col gap-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[--color-neon-purple] rounded-full blur-[80px] opacity-20 pointer-events-none" />
      
      <div className="flex items-center gap-3 border-b border-white/10 pb-4 relative z-10">
        <BookOpen className={`w-6 h-6 ${isSecondary ? 'text-[--color-neon-pink]' : 'text-[--color-neon-cyan]'}`} />
        <h2 className="text-2xl font-bold tracking-tight text-white">{details.name} Algorithm {isSecondary ? '(Secondary)' : ''}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        
        {/* Description & Complexity */}
        <div className="flex flex-col gap-6">
          <div className="space-y-2 text-gray-300 leading-relaxed text-sm">
            <p className="flex gap-2"><Info className="w-4 h-4 shrink-0 mt-0.5 text-[--color-neon-pink]" /> {details.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Time Complexity */}
            <div className="bg-black/40 border border-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3 text-gray-400">
                <Clock className="w-4 h-4 text-[--color-neon-cyan]" />
                <span className="text-xs font-semibold uppercase tracking-wider">Time Complexity</span>
              </div>
              <div className="flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Best:</span> <span className="font-mono text-green-400">{details.timeComplexity.best}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Average:</span> <span className="font-mono text-yellow-400">{details.timeComplexity.average}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Worst:</span> <span className="font-mono text-red-400">{details.timeComplexity.worst}</span></div>
              </div>
            </div>

            {/* Space Complexity */}
            <div className="bg-black/40 border border-white/5 rounded-lg p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3 text-gray-400">
                  <HardDrive className="w-4 h-4 text-[--color-neon-purple]" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Space Complexity</span>
                </div>
                <div className="flex flex-col gap-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Worst:</span> <span className="font-mono text-blue-400">{details.spaceComplexity}</span></div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 text-xs text-gray-500 text-center">
                {details.stable ? <span className="text-green-500/80">Stable Sort</span> : <span className="text-red-500/80">Unstable Sort</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Pseudo Code */}
        <div className="h-full">
          <div className="h-full bg-black/60 border border-[--color-glass-border] rounded-lg p-4 font-mono text-sm overflow-x-auto custom-scrollbar relative">
             <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[--color-neon-cyan] to-[--color-neon-purple] opacity-50" />
             <pre className="text-gray-300 leading-relaxed font-mono">
               {details.pseudoCode.split('\n').map((line: string, index: number) => (
                 <div  
                   key={index} 
                   className={`px-2 py-0.5 rounded transition-colors duration-200 ${
                     activeLine === index 
                       ? isSecondary ? 'bg-[--color-neon-pink]/20 text-white border-l-2 border-[--color-neon-pink]' : 'bg-[--color-neon-cyan]/20 text-white border-l-2 border-[--color-neon-cyan]' 
                       : 'border-l-2 border-transparent'
                   }`}
                 >
                   <span className="text-gray-600 mr-4 select-none">{String(index).padStart(2, ' ')}</span>
                   {line}
                 </div>
               ))}
             </pre>
          </div>
        </div>

      </div>
    </div>
  );
};
