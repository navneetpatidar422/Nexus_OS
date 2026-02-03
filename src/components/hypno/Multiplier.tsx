import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const PHRASES = [
  "DON'T CLICK",
  "WHY?",
  "STOP",
  "MORE?",
  "CHAOS",
  "HELP",
  "ERROR",
  "404",
  "RUN",
  "HIDE"
];

export const Multiplier = () => {
  const [buttons, setButtons] = useState([{ id: 0, x: 50, y: 50, text: "DO NOT CLICK" }]);

  const spawn = (id: number) => {
    if (buttons.length > 50) return; // Safety cap

    const newButtons = [];
    // Spawn 2 new buttons at random locations
    for (let i = 0; i < 2; i++) {
      newButtons.push({
        id: Date.now() + i + Math.random(),
        x: Math.random() * 80 + 10, // 10% to 90%
        y: Math.random() * 80 + 10,
        text: PHRASES[Math.floor(Math.random() * PHRASES.length)]
      });
    }
    setButtons([...buttons, ...newButtons]);
  };

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      <AnimatePresence>
        {buttons.map((btn) => (
          <motion.button
            key={btn.id}
            initial={{ scale: 0, rotate: Math.random() * 360 }}
            animate={{ scale: 1, rotate: Math.random() * 20 - 10 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.2, rotate: 0 }}
            whileTap={{ scale: 0.8 }}
            onClick={(e) => {
                spawn(btn.id);
            }}
            className="absolute px-6 py-3 bg-white border-4 border-black font-black text-xl shadow-[4px_4px_0px_black] hover:bg-yellow-400 hover:shadow-[6px_6px_0px_red] active:shadow-none pointer-events-auto cursor-help mix-blend-hard-light whitespace-nowrap"
            style={{ 
              left: `${btn.x}%`, 
              top: `${btn.y}%`,
            }}
          >
            {btn.text}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
};
