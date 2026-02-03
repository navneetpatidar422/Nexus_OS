import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

export const Watcher = ({ x, y }: { x: number, y: number }) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const angle = Math.atan2(e.clientY - y, e.clientX - x) * (180 / Math.PI);
      setRotation(angle);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y]);

  return (
    <motion.div
      className="absolute w-24 h-24 rounded-full bg-white border-4 border-black flex items-center justify-center overflow-hidden z-10 pointer-events-none shadow-[0_0_20px_rgba(255,255,255,0.5)]"
      style={{ left: x - 48, top: y - 48 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
    >
      <motion.div
        className="w-full h-full relative"
        style={{ rotate: rotation }}
      >
        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full absolute top-1 right-2" />
        </div>
        <img 
          src="https://images.unsplash.com/photo-1769432146976-db8e062df52c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXJyZWFsJTIwZXllJTIwY29sbGFnZXxlbnwxfHx8fDE3NzAwNjg0NTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          className="w-full h-full object-cover mix-blend-overlay opacity-50"
        />
      </motion.div>
    </motion.div>
  );
};
