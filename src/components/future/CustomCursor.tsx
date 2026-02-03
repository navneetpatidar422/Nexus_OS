import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

export const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Check if hovering interactive element
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('button') || target.closest('a') || target.closest('.interactive');
      setHovering(!!isInteractive);
    };

    const handleDown = () => setClicking(true);
    const handleUp = () => setClicking(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
    };
  }, []);

  return (
    <>
      {/* Main Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-cyan-500 rounded-full pointer-events-none z-[100] mix-blend-difference"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: clicking ? 0.5 : 1
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
      />
      
      {/* Trailing Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-cyan-500 rounded-full pointer-events-none z-[99]"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: hovering ? 1.5 : 1,
          borderColor: clicking ? "rgba(255, 0, 0, 0.8)" : "rgba(0, 255, 255, 0.5)",
          borderWidth: hovering ? 2 : 1
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
      />

      {/* Crosshair Lines */}
      <motion.div 
        className="fixed pointer-events-none z-[98] bg-cyan-500/20"
        style={{ height: '100vh', width: '1px', left: 0 }}
        animate={{ x: mousePosition.x }}
        transition={{ duration: 0 }}
      />
       <motion.div 
        className="fixed pointer-events-none z-[98] bg-cyan-500/20"
        style={{ width: '100vw', height: '1px', top: 0 }}
        animate={{ y: mousePosition.y }}
        transition={{ duration: 0 }}
      />
    </>
  );
};
