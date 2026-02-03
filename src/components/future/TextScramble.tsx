import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

interface TextScrambleProps {
  text: string;
  className?: string;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

export const TextScramble = ({ text, className }: TextScrambleProps) => {
  const [display, setDisplay] = useState(text);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let iteration = 0;
    
    // Constant low-level scramble
    const continuousScramble = setInterval(() => {
         // Randomly pick one character to scramble briefly
         if (Math.random() > 0.7) { // 30% chance to skip
             return;
         }
         const idx = Math.floor(Math.random() * text.length);
         const originalChar = text[idx];
         const randomChar = CHARS[Math.floor(Math.random() * CHARS.length)];
         
         setDisplay(prev => {
             const arr = prev.split("");
             arr[idx] = randomChar;
             return arr.join("");
         });

         setTimeout(() => {
             setDisplay(prev => {
                const arr = prev.split("");
                arr[idx] = originalChar;
                return arr.join("");
             });
         }, 100);

    }, 2000); // Every 2 seconds do a small glitch

    const scramble = () => {
      iteration = 0;
      clearInterval(interval);
      interval = setInterval(() => {
        setDisplay(prev => 
          text
            .split("")
            .map((char, index) => {
              if (index < iteration) return text[index];
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("")
        );

        if (iteration >= text.length) {
          clearInterval(interval);
        }

        iteration += 1 / 3;
      }, 30);
    };

    scramble();

    return () => {
        clearInterval(interval);
        clearInterval(continuousScramble);
    };
  }, [text]);

  return (
    <div className={`relative inline-block ${className}`}>
        <motion.span 
            className="relative z-10"
            animate={glitch ? { x: [-2, 2, -1, 1, 0], opacity: 0.8, color: "#4ade80" } : { x: 0, opacity: 1 }}
        >
            {display}
        </motion.span>
        {glitch && (
            <>
                <span className="absolute top-0 left-0 -ml-1 text-green-600 opacity-70 animate-pulse">{display}</span>
                <span className="absolute top-0 left-0 ml-1 text-white opacity-70 animate-pulse">{display}</span>
            </>
        )}
    </div>
  );
};
