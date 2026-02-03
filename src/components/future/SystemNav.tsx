import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Scan, Fingerprint, Database, Cpu } from "lucide-react";

export const SystemNav = () => {
  const [active, setActive] = useState<number | null>(null);

  const items = [
    { id: 0, icon: Scan, label: "SCAN" },
    { id: 1, icon: Fingerprint, label: "IDENTITY" },
    { id: 2, icon: Database, label: "MEMORY" },
    { id: 3, icon: Cpu, label: "PROCESS" },
  ];

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
      {items.map((item) => (
        <motion.button
          key={item.id}
          onHoverStart={() => setActive(item.id)}
          onHoverEnd={() => setActive(null)}
          whileHover={{ y: -5 }}
          className="relative group"
        >
          <div className="w-16 h-16 flex flex-col items-center justify-center bg-black/50 border border-white/10 rounded-lg backdrop-blur-md relative overflow-hidden">
            <div className="absolute inset-0 bg-cyan-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <item.icon className="text-cyan-400 w-6 h-6 mb-1 relative z-10" />
            <span className="text-[8px] font-mono text-cyan-400/80 tracking-widest relative z-10">{item.label}</span>
          </div>
          
          <AnimatePresence>
            {active === item.id && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: -10 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-black/80 border border-cyan-500/30 p-2 rounded text-[10px] text-cyan-300 text-center font-mono backdrop-blur-xl"
              >
                ACCESSING MODULE {item.label}_0{item.id}...
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      ))}
    </div>
  );
};
