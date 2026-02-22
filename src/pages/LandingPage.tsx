import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Activity, Zap, Shield, Sparkles, ChevronRight, BarChart3, Timer, Layers, ArrowRight, Cpu, Eye } from 'lucide-react';
import { Footer } from '../components/layout/Footer';

/* ─── Floating Orbs (pre-computed once) ─── */
const ORBS = [...Array(6)].map((_, i) => ({
  id: i,
  x: `${10 + Math.random() * 80}%`,
  y: `${10 + Math.random() * 80}%`,
  size: 200 + Math.random() * 400,
  color: ['#00f3ff', '#9d00ff', '#ff00ea', '#00ff88', '#ff6b00', '#00f3ff'][i],
  duration: 20 + Math.random() * 15,
  delay: i * 2,
}));

const PARTICLES = [...Array(80)].map((_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: 10 + Math.random() * 20,
  delay: Math.random() * 10,
  drift: (Math.random() - 0.5) * 30,
}));

/* ─── Animated Counter Hook ─── */
const useAnimatedCounter = (target: number, duration: number = 2000) => {
  const [count, setCount] = React.useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
};

/* ─── Animated Bars Preview ─── */
const AnimatedBarsPreview = () => {
  const bars = [35, 65, 25, 80, 45, 90, 55, 70, 40, 85, 30, 75, 50, 60, 95, 20];
  return (
    <div className="flex items-end gap-[3px] h-32 w-full max-w-xs mx-auto">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-t-sm"
          style={{
            background: `linear-gradient(to top, rgba(0,243,255,0.2), rgba(0,243,255,0.8))`,
            boxShadow: '0 0 10px rgba(0,243,255,0.3)',
          }}
          initial={{ height: 0 }}
          animate={{ height: `${h}%` }}
          transition={{ duration: 0.8, delay: i * 0.05, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
};

/* ─── Main Landing Page ─── */
const LandingPage: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left - rect.width / 2) / 30);
    mouseY.set((e.clientY - rect.top - rect.height / 2) / 30);
  };

  return (
    <div
      className="min-h-screen bg-[#02000a] text-white flex flex-col font-sans relative overflow-x-hidden selection:bg-[--color-neon-cyan]/30 selection:text-white"
      onMouseMove={handleMouseMove}
    >
      {/* ─── DEEP SPACE BACKGROUND ─── */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 pointer-events-none z-0">
        {ORBS.map((orb) => (
          <motion.div
            key={orb.id}
            className="absolute rounded-full"
            style={{
              left: orb.x,
              top: orb.y,
              width: orb.size,
              height: orb.size,
              background: `radial-gradient(circle, ${orb.color}15, transparent 70%)`,
              filter: `blur(80px)`,
            }}
            animate={{
              x: [0, 50, -30, 0],
              y: [0, -40, 30, 0],
              scale: [1, 1.2, 0.9, 1],
            }}
            transition={{
              duration: orb.duration,
              delay: orb.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>

      {/* Star Field */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              opacity: [0, 0.8, 0],
              y: [0, -100],
              x: [0, p.drift],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Scan Lines Effect */}
      <div className="absolute inset-0 pointer-events-none z-[2] opacity-[0.015]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />

      {/* ─── NAVBAR ─── */}
      <header className="w-full relative z-10 px-6 md:px-8 py-5 flex justify-between items-center max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[--color-neon-cyan] to-[--color-neon-purple] flex items-center justify-center shadow-[0_0_25px_rgba(0,243,255,0.4)]">
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="text-xl md:text-2xl font-bold tracking-tight">
            <span className="text-white">Sort</span>
            <span className="text-[--color-neon-cyan]">Craft</span>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/visualizer" className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:text-white hover:border-[--color-neon-cyan]/50 hover:bg-[--color-neon-cyan]/5 transition-all duration-300">
            <Play className="w-3.5 h-3.5" /> Open App
          </Link>
        </motion.div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <motion.main
        style={{ opacity }}
        className="flex-1 flex flex-col items-center justify-center z-10 text-center px-4 sm:px-6 max-w-6xl mx-auto pt-8 md:pt-16 pb-20"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[--color-neon-cyan]/20 bg-[--color-neon-cyan]/5 text-[--color-neon-cyan] mb-8 backdrop-blur-sm"
        >
          <span className="w-2 h-2 rounded-full bg-[--color-neon-cyan] animate-pulse" />
          <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase">9+ Sorting Algorithms • Live Visualization</span>
        </motion.div>

        {/* Main Heading */}
        <motion.div
          style={{ x: springX, y: springY }}
          className="relative"
        >
          <motion.h1
            className="text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight leading-[1.1] mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
          >
            <span className="block text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.08)]">
              See How Algorithms
            </span>
            <span className="block mt-2 bg-clip-text text-transparent bg-linear-to-r from-[--color-neon-cyan] via-[#7B61FF] to-[--color-neon-pink] animate-gradient-x">
              Actually Think.
            </span>
          </motion.h1>

          {/* Decorative glow behind heading */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[--color-neon-cyan] rounded-full blur-[120px] opacity-[0.04] pointer-events-none" />
        </motion.div>

        {/* Sub-heading */}
        <motion.p
          className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12 font-normal"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          Watch Bubble Sort, Quick Sort, Merge Sort and more come alive with
          <span className="text-white font-medium"> stunning animations</span>,
          <span className="text-[--color-neon-cyan] font-medium"> real-time stats</span>, and
          <span className="text-[--color-neon-purple] font-medium"> side-by-side code</span>.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="flex flex-col sm:flex-row gap-4 relative z-10 w-full sm:w-auto mb-20"
        >
          <Link to="/visualizer" className="w-full sm:w-auto">
            <button className="group relative w-full sm:w-auto px-10 py-4 bg-[--color-neon-cyan] text-[#030014] font-bold text-lg rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,243,255,0.3)] hover:shadow-[0_0_80px_rgba(0,243,255,0.5)] transition-all duration-500 transform hover:scale-[1.03] inline-flex items-center justify-center gap-3">
              <span className="absolute inset-0 bg-linear-to-r from-[--color-neon-cyan] via-white to-[--color-neon-cyan] opacity-0 group-hover:opacity-20 transition-opacity duration-500 animate-gradient-x" />
              <span className="relative z-10 flex items-center gap-2.5">
                Start Visualizing <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </Link>
          <a href="#features" className="px-10 py-4 rounded-2xl border border-white/10 bg-white/[0.03] text-white font-semibold text-lg hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto backdrop-blur-sm group">
            Learn More <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>

        {/* ─── LIVE PREVIEW CARD ─── */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="w-full max-w-4xl relative"
        >
          <div className="absolute -inset-1 bg-linear-to-r from-[--color-neon-cyan]/20 via-[--color-neon-purple]/20 to-[--color-neon-pink]/20 rounded-3xl blur-xl" />
          <div className="relative glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
            {/* Mock Window Chrome */}
            <div className="flex items-center gap-2 px-5 py-3 bg-black/40 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <span className="text-xs text-gray-500 ml-3 font-mono">sortcraft — algorithm visualizer</span>
            </div>

            {/* Preview Content */}
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                {/* Bars */}
                <div className="flex-1 w-full">
                  <AnimatedBarsPreview />
                  <p className="text-xs text-gray-500 mt-3 text-center font-mono">Bubble Sort • 16 elements</p>
                </div>
                {/* Stats */}
                <div className="flex-1 w-full grid grid-cols-2 gap-3">
                  <StatBox label="Comparisons" value="120" color="--color-neon-cyan" />
                  <StatBox label="Swaps" value="45" color="--color-neon-pink" />
                  <StatBox label="Time" value="O(n²)" color="--color-neon-purple" />
                  <StatBox label="Status" value="Sorting..." color="--color-neon-cyan" isLive />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.main>

      {/* ─── STATS COUNTER SECTION ─── */}
      <section className="relative z-10 py-16 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <CounterStat target={9} label="Algorithms" suffix="+" />
          <CounterStat target={3} label="Viz Modes" suffix="" />
          <CounterStat target={1000} label="Max Elements" suffix="+" />
          <CounterStat target={100} label="Speed Levels" suffix="%" />
        </div>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section id="features" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-[--color-neon-cyan] mb-4 block">Features</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Everything You Need to <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-[--color-neon-cyan] to-[--color-neon-purple]">Master Sorting</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Multiple Viz Modes"
              description="Switch between Bar Chart, Scatter Plot, and Color Wheel views to see data from every angle."
              color="--color-neon-cyan"
              delay={0}
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Web Worker Engine"
              description="Algorithms run on a separate thread so the UI stays buttery smooth, even with 1000+ elements."
              color="--color-neon-purple"
              delay={0.1}
            />
            <FeatureCard
              icon={<Layers className="w-6 h-6" />}
              title="Race Mode"
              description="Compare two algorithms side-by-side in real-time. Watch Quick Sort destroy Bubble Sort."
              color="--color-neon-pink"
              delay={0.2}
            />
            <FeatureCard
              icon={<Timer className="w-6 h-6" />}
              title="Time Travel Scrubber"
              description="Pause, rewind, fast-forward. Scrub through every single step of the algorithm timeline."
              color="--color-neon-cyan"
              delay={0.3}
            />
            <FeatureCard
              icon={<Eye className="w-6 h-6" />}
              title="Live Code Tracking"
              description="Watch pseudo-code highlight in sync with the animation. See exactly which line executes."
              color="--color-neon-purple"
              delay={0.4}
            />
            <FeatureCard
              icon={<Cpu className="w-6 h-6" />}
              title="Big-O Analytics"
              description="Real-time comparison count, swap count, and complexity classification for every algorithm."
              color="--color-neon-pink"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="relative z-10 py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Ready to <span className="bg-clip-text text-transparent bg-linear-to-r from-[--color-neon-cyan] to-[--color-neon-pink]">Visualize?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Jump in and start exploring algorithms interactively. No signup, no setup, just pure learning.
          </p>
          <Link to="/visualizer">
            <button className="group px-12 py-5 bg-linear-to-r from-[--color-neon-cyan] to-[--color-neon-purple] text-white font-bold text-xl rounded-2xl shadow-[0_0_60px_rgba(0,243,255,0.25)] hover:shadow-[0_0_100px_rgba(0,243,255,0.4)] transition-all duration-500 transform hover:scale-105 inline-flex items-center gap-3">
              Launch Visualizer <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

/* ─── Sub-components ─── */

const StatBox = ({ label, value, color, isLive }: { label: string; value: string; color: string; isLive?: boolean }) => (
  <div className="glass-panel rounded-xl p-4 border border-white/5">
    <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">{label}</p>
    <p className={`text-lg font-bold font-mono`} style={{ color: `var(${color})` }}>
      {value}
      {isLive && <span className="inline-block w-1.5 h-1.5 rounded-full bg-[--color-neon-cyan] ml-2 animate-pulse" />}
    </p>
  </div>
);

const CounterStat = ({ target, label, suffix }: { target: number; label: string; suffix: string }) => {
  const { count, ref } = useAnimatedCounter(target);
  return (
    <div ref={ref} className="text-center">
      <p className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
        {count}{suffix}
      </p>
      <p className="text-sm text-gray-500 mt-2 uppercase tracking-wider font-medium">{label}</p>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, color, delay }: {
  icon: React.ReactNode; title: string; description: string; color: string; delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -6 }}
    className="group relative p-7 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500 overflow-hidden"
  >
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{ background: `radial-gradient(ellipse at top left, var(${color}) 0%, transparent 60%)`, opacity: 0 }}
    />
    <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500"
      style={{ background: `radial-gradient(ellipse at top left, var(${color}), transparent 60%)` }}
    />
    <div className="relative z-10">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 border border-white/5 transition-colors duration-300"
        style={{ color: `var(${color})`, backgroundColor: `color-mix(in srgb, var(${color}) 8%, transparent)` }}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

export default LandingPage;
