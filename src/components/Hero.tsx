import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const textVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    })
  };

  return (
    <section ref={ref} className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.15),rgba(0,0,0,0))]" />
      
      <motion.div style={{ y, opacity }} className="z-10 text-center px-4">
        <div className="overflow-hidden">
          <motion.h1 
            custom={0}
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="text-6xl md:text-9xl font-black tracking-tighter text-white mb-2"
          >
            DIGITAL
          </motion.h1>
        </div>
        <div className="overflow-hidden">
          <motion.h1 
            custom={1}
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="text-6xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
          >
            ALCHEMY
          </motion.h1>
        </div>
        
        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="mt-8 text-slate-400 text-lg md:text-xl max-w-lg mx-auto"
        >
          We transmute bold ideas into stunning digital experiences through code and motion.
        </motion.p>
      </motion.div>

      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <div className="w-[1px] h-24 bg-gradient-to-b from-purple-500 to-transparent mx-auto" />
      </motion.div>
    </section>
  );
};
