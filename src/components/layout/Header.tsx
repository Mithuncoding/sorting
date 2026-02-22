import React from 'react';
import { Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header className="px-6 py-4 glass-panel border-b border-[--color-glass-border] flex items-center justify-between z-10 transition-all duration-300 shadow-[0_4px_30px_rgba(0,243,255,0.05)]">
      <Link to="/" className="flex items-center gap-3 hover:scale-105 transition-transform duration-300 group cursor-pointer">
        <Activity className="text-[--color-neon-cyan] w-8 h-8 group-hover:drop-shadow-[0_0_8px_rgba(0,243,255,0.8)] transition-all" />
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-[--color-neon-cyan] to-[--color-neon-purple] drop-shadow-sm group-hover:drop-shadow-[0_0_12px_rgba(157,0,255,0.4)] transition-all">
          SortCraft
        </h1>
      </Link>
    </header>
  );
};
