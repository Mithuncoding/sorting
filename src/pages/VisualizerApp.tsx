import { useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/controls/Sidebar';
import { Visualizer } from '../components/visualizer/Visualizer';
import { StatsBar } from '../components/stats/StatsBar';
import { useSorting } from '../hooks/useSorting';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { AlgorithmInfo } from '../components/learning/AlgorithmInfo';
import { useSortingStore } from '../store/sortingStore';

function App() {
  const { startSorting, pauseAnimation, resumeAnimation, resetAnimation } = useSorting();
  const isRaceMode = useSortingStore(state => state.isRaceMode);
  const algorithm = useSortingStore(state => state.algorithm);
  const secondaryAlgorithm = useSortingStore(state => state.secondaryAlgorithm);

  // Initialize keyboard shortcuts
  useKeyboardShortcuts(startSorting, pauseAnimation, resumeAnimation, resetAnimation);

  // Initialize array on mount
  useEffect(() => {
    resetAnimation();
  }, [resetAnimation]);

  return (
    <div className="min-h-screen bg-[--color-dark-bg] text-white flex flex-col font-sans relative overflow-hidden">
      {/* Background glow effects for premium feel */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[--color-neon-purple] rounded-full blur-[150px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[--color-neon-cyan] rounded-full blur-[150px] opacity-20 pointer-events-none" />

      <Header />
      
      <div className="flex-1 flex flex-col md:flex-row p-3 sm:p-4 md:p-6 gap-4 md:gap-6 overflow-y-auto md:overflow-hidden z-10 mx-auto w-full max-w-[1920px]">
        {/* On mobile, Sidebar comes after visualizer if we use flex-col and order, but a simpler layout is visualizer on top */}
        <div className="w-full md:w-80 shrink-0 order-2 md:order-1 relative z-20">
          <Sidebar />
        </div>

        <main className="flex-1 flex flex-col gap-4 md:gap-6 overflow-y-auto custom-scrollbar md:pr-2 order-1 md:order-2">
          
          {/* Top Visualization & Stats Area */}
          <section className="flex-1 min-h-[500px] glass-panel rounded-xl flex flex-col overflow-hidden relative shadow-2xl border border-white/5">
             <div className="flex-1 relative flex flex-col md:flex-row">
               <div className={`flex-1 relative flex flex-col ${isRaceMode ? 'border-b md:border-b-0 md:border-r border-white/10' : ''}`}>
                 {isRaceMode && <div className="absolute top-2 left-4 text-xs font-bold text-[--color-neon-cyan] bg-black/50 px-2 py-1 rounded z-10">{algorithm}</div>}
                 <Visualizer />
               </div>
               
               {isRaceMode && (
                 <div className="flex-1 relative flex flex-col">
                   <div className="absolute top-2 left-4 text-xs font-bold text-[--color-neon-pink] bg-black/50 px-2 py-1 rounded z-10">{secondaryAlgorithm}</div>
                   <Visualizer isSecondary={true} />
                 </div>
               )}
             </div>
             <StatsBar />
          </section>

          {/* Bottom Learning Mode Area */}
          <div className="flex flex-col 2xl:flex-row gap-6">
            <AlgorithmInfo />
            {isRaceMode && <AlgorithmInfo isSecondary={true} />}
          </div>
          
        </main>
      </div>
    </div>
  );
}

export default App;
