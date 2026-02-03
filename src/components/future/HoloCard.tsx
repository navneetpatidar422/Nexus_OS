import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

interface HoloCardProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
  delay?: number;
}

export const HoloCard = ({ title, subtitle, children, delay = 0 }: HoloCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    
    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-sm group"
    >
      <div 
        className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-xl border border-white/10 backdrop-blur-md"
        style={{ transform: "translateZ(0px)" }}
      />
      
      {/* Glow border on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-50 blur-sm transition-opacity duration-500" style={{ transform: "translateZ(-10px)" }} />
      
      <div className="relative p-6 flex flex-col gap-4 text-white rounded-xl overflow-hidden">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10" 
            style={{ 
                backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.5) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
            }} 
        />
        
        <div style={{ transform: "translateZ(20px)" }}>
            <h3 className="text-sm font-mono text-cyan-400 tracking-widest uppercase mb-1">{subtitle}</h3>
            <h2 className="text-2xl font-bold tracking-tighter">{title}</h2>
            <div className="w-10 h-0.5 bg-gradient-to-r from-cyan-400 to-transparent my-4" />
        </div>

        <div style={{ transform: "translateZ(10px)" }} className="text-sm text-slate-300 leading-relaxed font-light">
          {children}
        </div>
        
        {/* Decorative corner markers */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500" />
      </div>
    </motion.div>
  );
};
