import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX - 16);
      mouseY.set(e.clientY - 16);
      if (!isVisible) setIsVisible(true);
    };

    window.addEventListener("mousemove", moveCursor);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, [mouseX, mouseY, isVisible]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/50 z-[100] pointer-events-none mix-blend-difference hidden md:block"
      style={{
        x: cursorX,
        y: cursorY,
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
    </motion.div>
  );
};
