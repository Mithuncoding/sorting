import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-8 py-8 flex flex-col items-center justify-center gap-3">
        <p className="flex items-center gap-2 text-gray-400 font-medium text-sm">
          Built with <Heart className="w-4 h-4 text-red-500 animate-pulse" /> by
          <span className="text-neon-cyan font-bold">Mithun</span>
        </p>
        <span className="text-xs text-gray-600">
          © {new Date().getFullYear()} SortCraft. All rights reserved.
        </span>
      </div>
    </footer>
  );
};
