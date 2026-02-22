import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full relative z-10 border-t border-[--color-glass-border] mt-auto">
      <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col items-center justify-center gap-4">
        <p className="flex items-center gap-2 text-gray-400 font-medium text-sm">
          Built with <Heart className="w-4 h-4 text-red-500 animate-pulse" /> by
          <span className="bg-clip-text text-transparent bg-linear-to-r from-[--color-neon-cyan] to-[--color-neon-pink] font-bold">
            Mithun
          </span>
        </p>
        <span className="text-xs text-gray-600">
          © {new Date().getFullYear()} SortCraft. All rights reserved.
        </span>
      </div>
    </footer>
  );
};
