# Sorting Algorithm Visualizer

A stunning, God-tier production-level sorting visualizer built with React, TypeScript, TailwindCSS v4, Zustand, and Framer Motion.
Features immersive dark-mode neon glassmorphism UI and smooth 60fps animations.

## Features

- **9 Sorting Algorithms**: Bubble, Selection, Insertion, Merge, Quick, Heap, Shell, Radix, Counting.
- **High Performance**: Heavy array processing is done off the main thread using Web Workers.
- **Controls**: Array Size (10-1000), Speed (1-100), Play/Pause/Resume/Reset.
- **Metrics**: Real-time comparisons, swaps tracking.
- **God-Tier Experience**: Glassmorphic UI with neon highlights, animated array interactions, and a confetti win screen.

## Tech Stack

- Frontend: `React 18` + `Vite` + `TypeScript`
- State Management: `Zustand`
- Styling: `TailwindCSS v4`
- Animations: `Framer Motion`
- Compute: `Web Workers API`

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Deployment

This app can be deployed easily with Vercel:

1. Push this repository to GitHub.
2. Link the repository to your Vercel account.
3. Vercel will automatically detect Vite and configure the build settings. Just hit "Deploy".

## Performance Notes

Arrays up to 100 elements use Framer Motion physics for ultra-smooth spring animations.
For sizes from 100 to 1000, it falls back to lightning-fast DOM rendering to prevent frame drops in React while maintaining colors via CSS transitions.

## Future scope

- Sound module (Web Audio API)
- PWA Support
- Code details panel
