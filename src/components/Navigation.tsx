import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "motion/react";
import { ArrowRight, Menu, X, Instagram, Twitter, Linkedin, Github } from "lucide-react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuVariants = {
    open: {
      clipPath: "inset(0% 0% 0% 0% round 0px)",
      transition: {
        type: "spring",
        bounce: 0,
        duration: 0.7,
        delayChildren: 0.3,
        staggerChildren: 0.05
      }
    },
    closed: {
      clipPath: "inset(10% 50% 90% 50% round 10px)",
      transition: {
        type: "spring",
        bounce: 0,
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    closed: { opacity: 0, y: 20, transition: { duration: 0.2 } }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center mix-blend-difference text-white">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl font-black tracking-tighter"
      >
        NEBULA
      </motion.div>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="z-50 relative p-2"
      >
        <motion.div
          animate={isOpen ? "open" : "closed"}
          className="flex flex-col gap-1.5 items-end"
        >
          <motion.span 
            variants={{
              closed: { rotate: 0, y: 0 },
              open: { rotate: 45, y: 8 }
            }}
            className="w-8 h-0.5 bg-white block origin-center" 
          />
          <motion.span 
            variants={{
              closed: { opacity: 1 },
              open: { opacity: 0 }
            }}
            className="w-6 h-0.5 bg-white block" 
          />
          <motion.span 
            variants={{
              closed: { rotate: 0, y: 0 },
              open: { rotate: -45, y: -8 }
            }}
            className="w-4 h-0.5 bg-white block origin-center" 
          />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 bg-black flex flex-col items-center justify-center z-40"
          >
            <motion.ul className="flex flex-col gap-8 text-center">
              {["Work", "Studio", "Services", "Contact"].map((item) => (
                <motion.li key={item} variants={itemVariants}>
                  <a href="#" className="text-5xl md:text-7xl font-bold hover:text-purple-400 transition-colors">
                    {item}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
            
            <motion.div variants={itemVariants} className="mt-12 flex gap-6">
              <Instagram className="w-6 h-6 hover:text-purple-400 cursor-pointer" />
              <Twitter className="w-6 h-6 hover:text-purple-400 cursor-pointer" />
              <Linkedin className="w-6 h-6 hover:text-purple-400 cursor-pointer" />
              <Github className="w-6 h-6 hover:text-purple-400 cursor-pointer" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
