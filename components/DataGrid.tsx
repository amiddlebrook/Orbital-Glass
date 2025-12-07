import React from 'react';
import { Card } from './ui/Card';
import { motion } from 'framer-motion';

const NODES = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    label: `NODE-US-E-${i.toString().padStart(3, '0')}`,
    val: Math.floor(Math.random() * 100),
    active: Math.random() > 0.2
}));

export const DataGrid: React.FC = () => {
  const MotionDiv = motion.div as any;
  
  return (
    <div className="h-full w-full p-2 flex flex-col">
        <div className="flex justify-between items-end mb-8 px-2">
            <div>
                <h1 className="text-3xl font-light text-white tracking-tight">Active Nodes</h1>
                <p className="font-mono text-sys-secondary text-xs tracking-wider mt-1">TOTAL CONNECTED: {NODES.length}</p>
            </div>
            <button className="px-5 py-2 rounded-lg border border-white/10 text-white font-mono text-xs hover:bg-white/5 transition-colors">
                REFRESH_GRID
            </button>
        </div>

        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {NODES.map((node) => (
                <MotionDiv
                    key={node.id}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: node.id * 0.03 }}
                    className="relative group cursor-pointer"
                >
                    <div className="relative glass-card h-40 rounded-lg p-5 flex flex-col justify-between border border-white/5 hover:border-sys-primary/40 transition-colors">
                        <div className="flex justify-between items-start">
                            <span className="font-mono text-[10px] text-white/40">{node.label}</span>
                            <div className={`w-1.5 h-1.5 rounded-full ${node.active ? 'bg-sys-success' : 'bg-sys-accent'}`}></div>
                        </div>

                        {/* Visual Data Representation */}
                        <div className="flex gap-1 h-12 items-end my-2">
                            {[1,2,3,4,5,6].map(bar => (
                                <MotionDiv 
                                    key={bar}
                                    className="flex-1 bg-white/10 rounded-sm"
                                    animate={{ height: `${Math.random() * 100}%` }}
                                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror", delay: bar * 0.1 }}
                                />
                            ))}
                        </div>

                        <div className="flex justify-between items-end">
                             <div className="text-[10px] font-mono text-sys-secondary uppercase">Load</div>
                             <div className="text-xl font-medium text-white">{node.val}%</div>
                        </div>
                    </div>
                </MotionDiv>
            ))}
        </div>
    </div>
  );
};