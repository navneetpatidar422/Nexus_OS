import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

const CHARS = "ABCDEF0123456789";

export const DataStream = ({ side }: { side: "left" | "right" }) => {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
        setLines(prev => {
            const newLine = Array.from({length: 8}, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join(" ");
            const newLines = [newLine, ...prev];
            if (newLines.length > 30) newLines.pop();
            return newLines;
        });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
        className={`fixed top-0 ${side === "left" ? "left-4" : "right-4"} h-full overflow-hidden flex flex-col gap-1 py-4 pointer-events-none z-10 mix-blend-screen opacity-50`}
    >
        {lines.map((line, i) => (
            <motion.div 
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 - i * 0.03 }}
                className="font-mono text-[10px] text-cyan-500 font-bold"
            >
                {line}
            </motion.div>
        ))}
    </div>
  );
};
