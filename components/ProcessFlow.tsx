import React from 'react';
import { Card } from './ui/Card';
import { motion } from 'framer-motion';

export const ProcessFlow: React.FC = () => {
  const MotionDiv = motion.div as any;

  return (
    <div className="h-full w-full p-2 flex flex-col">
         <Card title="Pipeline Execution" subtitle="Workflow" className="h-full relative overflow-hidden">
             
             {/* Background Tech Lines */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
                 <line x1="0" y1="50%" x2="100%" y2="50%" stroke="white" strokeWidth="1" strokeDasharray="5 5" />
             </svg>

             <div className="flex items-center justify-around h-full relative z-10 px-8 md:px-20">
                 
                 {[
                     { step: '01', title: 'Ingest', desc: 'Data Collection' },
                     { step: '02', title: 'Process', desc: 'Transformation' },
                     { step: '03', title: 'Deploy', desc: 'Production' }
                 ].map((item, i) => (
                     <React.Fragment key={i}>
                         <div className="relative group flex flex-col items-center">
                             {/* Central Node */}
                             <div className="w-24 h-24 rounded-2xl border border-white/10 bg-[#0A0A0A] flex flex-col items-center justify-center relative z-10 group-hover:-translate-y-2 transition-transform duration-300 shadow-xl">
                                 <span className="font-mono text-[10px] text-sys-primary mb-1">{item.step}</span>
                                 <span className="font-medium text-white">{item.title}</span>
                                 
                                 {/* Status Ring */}
                                 <div className="absolute -inset-1 rounded-2xl border border-sys-primary/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                             </div>

                             {/* Desc */}
                             <div className="absolute top-full mt-6 text-center">
                                 <p className="font-mono text-[10px] uppercase tracking-wider text-sys-secondary">{item.desc}</p>
                             </div>
                         </div>

                         {i < 2 && (
                             <div className="flex-1 h-[1px] bg-white/10 relative overflow-hidden mx-8">
                                 <MotionDiv 
                                    className="absolute inset-0 bg-sys-primary w-1/3"
                                    animate={{ x: ['-100%', '300%'] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
                                 />
                             </div>
                         )}
                     </React.Fragment>
                 ))}

             </div>
         </Card>
    </div>
  );
};