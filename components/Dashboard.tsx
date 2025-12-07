import React from 'react';
import { Card } from './ui/Card';
import { motion } from 'framer-motion';
import { Activity, Globe, Zap, Server, Shield } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const MotionDiv = motion.div as any;

  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-1 md:grid-cols-12 grid-rows-auto md:grid-rows-6 gap-6 min-h-[700px] h-full pb-8">
        
        {/* Main Status */}
        <Card title="Global Status" subtitle="System.Root" className="col-span-1 md:col-span-12 lg:col-span-8 row-span-4" glow>
            <div className="h-full flex flex-col relative overflow-hidden min-h-[300px]">
                {/* Visualizer */}
                <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
                     <MotionDiv 
                        className="w-48 md:w-96 h-48 md:h-96 rounded-full border border-sys-primary/20"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                     />
                     <MotionDiv 
                        className="absolute w-36 md:w-72 h-36 md:h-72 border border-white/10"
                        style={{ borderRadius: '40%' }}
                        animate={{ rotate: -360 }}
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                     />
                     <div className="absolute w-32 h-32 bg-sys-primary/5 rounded-full blur-3xl"></div>
                </div>

                <div className="absolute top-4 right-4 text-right">
                    <div className="flex gap-1 justify-end mb-2">
                        <span className="w-1.5 h-1.5 bg-sys-success rounded-full animate-pulse"></span>
                    </div>
                    <div className="font-mono text-[10px] text-sys-secondary uppercase">Live Connection</div>
                </div>

                <div className="relative z-10 grid grid-cols-2 gap-8 mt-auto">
                    <div>
                        <div className="text-4xl md:text-6xl font-light text-white tracking-tight">99.9<span className="text-xl text-sys-primary font-mono">%</span></div>
                        <div className="text-xs font-mono text-sys-secondary uppercase tracking-wider mt-2">Uptime</div>
                    </div>
                    <div>
                        <div className="text-4xl md:text-6xl font-light text-white tracking-tight">412<span className="text-xl text-white/40 font-mono">ms</span></div>
                        <div className="text-xs font-mono text-sys-secondary uppercase tracking-wider mt-2">Global Latency</div>
                    </div>
                </div>
            </div>
        </Card>

        {/* Side Metrics */}
        <div className="col-span-1 md:col-span-12 lg:col-span-4 row-span-4 flex flex-col gap-6">
            <Card className="flex-1 bg-gradient-to-br from-sys-primary/5 to-transparent">
                <div className="flex items-center gap-4 h-full">
                    <div className="p-3 bg-white/5 rounded-lg text-sys-primary border border-white/5"><Globe size={20} /></div>
                    <div>
                        <div className="text-2xl font-medium text-white">Online</div>
                        <div className="text-[10px] text-sys-secondary font-mono uppercase tracking-wider">Network State</div>
                    </div>
                </div>
            </Card>
            <Card className="flex-1">
                 <div className="flex items-center gap-4 h-full">
                    <div className="p-3 bg-white/5 rounded-lg text-sys-success border border-white/5"><Shield size={20} /></div>
                    <div>
                        <div className="text-2xl font-medium text-white">Secure</div>
                        <div className="text-[10px] text-sys-secondary font-mono uppercase tracking-wider">Firewall</div>
                    </div>
                </div>
            </Card>
            <Card className="flex-1">
                 <div className="flex items-center gap-4 h-full">
                    <div className="p-3 bg-white/5 rounded-lg text-sys-accent border border-white/5"><Server size={20} /></div>
                    <div>
                        <div className="text-2xl font-medium text-white">84%</div>
                        <div className="text-[10px] text-sys-secondary font-mono uppercase tracking-wider">Load Balance</div>
                    </div>
                </div>
            </Card>
        </div>

        {/* Bottom Log */}
        <Card title="Event Stream" subtitle="Real-time" className="col-span-1 md:col-span-12 row-span-2 min-h-[150px]">
            <div className="flex gap-4 overflow-x-auto pb-4 pt-2 snap-x">
                {[1,2,3,4,5,6].map(i => (
                    <MotionDiv 
                        key={i} 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="snap-start min-w-[220px] p-4 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-sys-primary/30 transition-all cursor-pointer group flex flex-col justify-between"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-mono text-sys-primary">LOG_00{i}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-sys-success"></span>
                        </div>
                        <div className="text-sm text-white/80 group-hover:text-white transition-colors">
                            Authorization verified.
                        </div>
                        <div className="text-[10px] text-white/30 font-mono mt-2">
                            10:24:0{i} AM
                        </div>
                    </MotionDiv>
                ))}
            </div>
        </Card>
      </div>
    </div>
  );
};