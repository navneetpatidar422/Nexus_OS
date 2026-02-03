import React, { useState } from "react";
import { motion, useAnimation } from "motion/react";
import { X, Minus, Maximize2 } from "lucide-react";

interface DraggableCardProps {
  children: React.ReactNode;
  title: string;
  initialX: string | number;
  initialY: string | number;
  rotate: number;
  zIndex: number;
  onFocus: () => void;
  bg?: string;
  textColor?: string;
  gravity: boolean;
}

export const DraggableCard = ({ 
  children, 
  title, 
  initialX, 
  initialY, 
  rotate, 
  zIndex, 
  onFocus,
  bg = "bg-white",
  textColor = "text-black",
  gravity
}: DraggableCardProps) => {
  const controls = useAnimation();
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <motion.div
      drag={!gravity} // Disable drag when gravity is on
      dragMomentum={false}
      initial={{ x: initialX, y: initialY, rotate: rotate, scale: 0 }}
      animate={
        gravity 
        ? { y: "85vh", rotate: 0, transition: { type: "spring", bounce: 0.2 } } 
        : { scale: 1, rotate: rotate }
      }
      whileDrag={{ scale: 1.05, rotate: 0, zIndex: 100 }}
      onPointerDown={onFocus}
      style={{ zIndex }}
      className={`absolute w-72 md:w-96 flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black ${bg} ${textColor}`}
    >
      {/* Header Bar */}
      <div 
        className="h-10 border-b-4 border-black flex items-center justify-between px-2 cursor-grab active:cursor-grabbing select-none bg-inherit"
      >
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full border-2 border-black bg-red-500" />
          <div className="w-3 h-3 rounded-full border-2 border-black bg-yellow-400" />
        </div>
        <span className="font-mono font-bold uppercase tracking-widest text-xs truncate max-w-[120px]">
          {title}
        </span>
        <div className="flex gap-2">
           <button onClick={() => setIsMinimized(!isMinimized)}>
             {isMinimized ? <Maximize2 size={14} /> : <Minus size={14} />}
           </button>
        </div>
      </div>

      {/* Content */}
      <motion.div 
        animate={{ height: isMinimized ? 0 : "auto" }}
        className="overflow-hidden"
      >
        <div className="p-4 font-mono">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};
