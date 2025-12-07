import React from 'react';
import { ViewState, NavNode } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Server, GitMerge, BarChart2, Settings } from 'lucide-react';

interface Props {
  activeView: ViewState;
  onViewChange: (view: ViewState) => void;
}

const NODES: NavNode[] = [
  { id: ViewState.OVERVIEW, label: 'OVERVIEW', icon: 'LayoutGrid' },
  { id: ViewState.NETWORK, label: 'NETWORK', icon: 'Server' },
  { id: ViewState.WORKFLOW, label: 'PIPELINE', icon: 'GitMerge' },
  { id: ViewState.ANALYTICS, label: 'METRICS', icon: 'BarChart2' },
  { id: ViewState.SETTINGS, label: 'SYSTEM', icon: 'Settings' },
];

const getIcon = (name: string) => {
  switch(name) {
    case 'LayoutGrid': return <LayoutGrid size={20} />;
    case 'Server': return <Server size={20} />;
    case 'GitMerge': return <GitMerge size={20} />;
    case 'BarChart2': return <BarChart2 size={20} />;
    case 'Settings': return <Settings size={20} />;
    default: return <LayoutGrid size={20} />;
  }
};

export const SolarNavigation: React.FC<Props> = ({ activeView, onViewChange }) => {
  const MotionDiv = motion.div as any;

  return (
    <div className="relative group">
       {/* Dock Container */}
       <div className="
          flex items-center gap-3 px-4 py-3 rounded-2xl 
          glass-panel border border-white/10 
          bg-[#0A0A0A]/80 backdrop-blur-2xl
          shadow-[0_10px_40px_rgba(0,0,0,0.5)]
          relative z-10
       ">
           {NODES.map((node) => {
             const isActive = node.id === activeView;
             
             return (
               <button
                 key={node.id}
                 onClick={() => onViewChange(node.id)}
                 className="relative flex flex-col items-center justify-center w-12 h-12"
               >
                 {/* Hover/Active Interaction Wrapper */}
                 <MotionDiv
                    className={`
                        relative z-20 flex items-center justify-center w-10 h-10 rounded-xl
                        transition-all duration-300 border
                        ${isActive 
                            ? 'bg-sys-primary text-white border-sys-primary shadow-[0_0_20px_rgba(59,130,246,0.4)]' 
                            : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10 hover:border-white/20 hover:text-white'}
                    `}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.95 }}
                 >
                    {getIcon(node.icon)}
                 </MotionDiv>

                 {/* Label */}
                 <AnimatePresence>
                     {isActive && (
                         <MotionDiv
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 24 }} 
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute pointer-events-none"
                         >
                             <div className="text-[10px] font-mono font-medium text-sys-primary whitespace-nowrap tracking-wider">
                                 {node.label}
                             </div>
                         </MotionDiv>
                     )}
                 </AnimatePresence>

                 {/* Holographic Projection Beam */}
                 <AnimatePresence>
                    {isActive && (
                        <MotionDiv
                            layoutId="projectionBeam"
                            className="absolute bottom-full left-1/2 -translate-x-1/2 w-16 h-24 pointer-events-none -z-10"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 96 }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="w-full h-full bg-gradient-to-t from-sys-primary/10 to-transparent" 
                                 style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)' }} 
                            />
                        </MotionDiv>
                    )}
                 </AnimatePresence>

                 {/* Active Indicator Line */}
                 {isActive && (
                    <MotionDiv 
                        layoutId="activeTabIndicator"
                        className="absolute -bottom-3 w-1 h-1 rounded-full bg-sys-primary" 
                    />
                 )}
               </button>
             );
           })}
       </div>
    </div>
  );
};