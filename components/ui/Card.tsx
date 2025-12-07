import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({ title, subtitle, children, className = '', glow = false }) => {
  const MotionDiv = motion.div as any;

  return (
    <MotionDiv 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative flex flex-col glass-card rounded-lg overflow-hidden
        ${glow ? 'shadow-glow border-sys-primary/40' : ''}
        ${className}
      `}
    >
      {(title || subtitle) && (
        <div className="p-5 border-b border-white/5 bg-white/[0.02] backdrop-blur-md flex justify-between items-center">
          <div>
              {title && <h3 className="text-lg font-medium text-white tracking-wide">{title}</h3>}
              {subtitle && <p className="text-[10px] font-mono text-sys-secondary uppercase tracking-wider mt-0.5">{subtitle}</p>}
          </div>
          {/* Tech decoration dots */}
          <div className="flex gap-1">
              <div className="w-1 h-1 rounded-full bg-white/20"></div>
              <div className="w-1 h-1 rounded-full bg-white/20"></div>
          </div>
        </div>
      )}
      
      {/* Optical fiber line effect */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sys-primary to-transparent opacity-20"></div>

      <div className="p-5 flex-1 relative z-10">
        {children}
      </div>
      
      {/* Corner accents - Tech Style */}
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-sys-primary/30 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-sys-primary/30 pointer-events-none"></div>
    </MotionDiv>
  );
};