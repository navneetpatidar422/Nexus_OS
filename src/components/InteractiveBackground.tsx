import React from "react";
import { motion, useScroll, useTransform } from "motion/react";

export const InteractiveBackground = () => {
  const { scrollYProgress } = useScroll();
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <motion.div
        style={{ y: y1, rotate }}
        className="absolute top-[10%] left-[5%] w-[30vw] h-[30vw] rounded-full bg-purple-900/20 blur-[100px]"
      />
      <motion.div
        style={{ y: y2, rotate: useTransform(scrollYProgress, [0, 1], [0, -45]) }}
        className="absolute bottom-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-blue-900/10 blur-[120px]"
      />
    </div>
  );
};
