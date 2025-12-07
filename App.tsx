import React, { useState, useEffect, useRef } from 'react';
import { SolarNavigation } from './components/SolarNavigation';
import { Dashboard } from './components/Dashboard';
import { DataGrid } from './components/DataGrid';
import { ProcessFlow } from './components/ProcessFlow';
import { ControlPanel } from './components/ControlPanel';
import { ViewState, Particle } from './types';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewState>(ViewState.OVERVIEW);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const MotionDiv = motion.div as any;

  // Background Simulation (Network Packets)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: Particle[] = Array.from({ length: 60 }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2, 
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.3 + 0.1
    }));

    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            // Draw Node
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
            ctx.fill();

            // Draw Connections (Network lines)
            particles.forEach(p2 => {
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    // Tech blue connection lines
                    ctx.strokeStyle = `rgba(59, 130, 246, ${0.05 * (1 - dist/100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });

        animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const renderContent = () => {
    switch (activeView) {
      case ViewState.OVERVIEW: return <Dashboard />;
      case ViewState.NETWORK: return <DataGrid />;
      case ViewState.WORKFLOW: return <ProcessFlow />;
      case ViewState.ANALYTICS: return <ControlPanel />;
      case ViewState.SETTINGS: return <div className="p-10 text-white font-light">SYSTEM CONFIGURATION</div>;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="h-screen w-screen bg-sys-bg overflow-hidden relative font-sans text-slate-300 selection:bg-sys-primary/20">
      {/* Background Layer */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle at 50% 100%, #11141c 0%, #050505 100%)' }}
      />
      
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

      {/* Main Content Layer */}
      <div className="absolute inset-0 z-10 flex flex-col">
          {/* Header */}
          <div className="h-16 w-full flex items-center justify-between px-6 md:px-10 pointer-events-none border-b border-white/5 bg-[#050505]/50 backdrop-blur-sm">
               <div className="flex items-center gap-3 pointer-events-auto">
                   <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                        <div className="w-3 h-3 bg-sys-primary rounded-sm shadow-glow-sm"></div>
                   </div>
                   <div className="flex flex-col">
                       <div className="font-medium text-sm text-white tracking-wide">ORBITAL</div>
                       <div className="font-mono text-[9px] text-sys-secondary uppercase tracking-widest">Enterprise OS</div>
                   </div>
               </div>
               
               <div className="hidden md:flex items-center gap-6 font-mono text-[10px] text-sys-secondary tracking-widest pointer-events-auto">
                    <div>STATUS: <span className="text-sys-success">OPTIMAL</span></div>
                    <div>BUILD: <span className="text-white/60">v2.4.0</span></div>
               </div>
          </div>

          {/* Viewport */}
          <div className="flex-1 w-full max-w-[1600px] mx-auto relative overflow-hidden">
             <AnimatePresence mode="wait">
                <MotionDiv
                    key={activeView}
                    initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
                    transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
                    className="h-full w-full pb-32 px-4 md:px-10 py-6 overflow-y-auto custom-scrollbar"
                >
                    {renderContent()}
                </MotionDiv>
             </AnimatePresence>
          </div>
      </div>

      {/* Floating Dock */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
        <SolarNavigation activeView={activeView} onViewChange={setActiveView} />
      </div>
    </div>
  );
};

export default App;