import React, { useState } from "react";
import { motion } from "motion/react";

export const MathPuzzle = ({ onSolved }: { onSolved: () => void }) => {
    // Puzzle: Primes. 
    // 2, 3, 5, 7, 11, ?
    // Answer: 13.
    
    const [input, setInput] = useState("");
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() === "13") {
            onSolved();
        } else {
            setInput(""); 
            // Maybe shake effect logic handled by parent or toast
        }
    };

    return (
        <div className="w-full flex flex-col items-center justify-center h-full">
            <h2 className="text-xl font-mono text-purple-500 mb-8">SEQUENCE_ANALYSIS</h2>
            
            <div className="flex gap-4 md:gap-8 items-center mb-12">
                {[2, 3, 5, 7, 11].map((num, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="w-12 h-16 md:w-16 md:h-24 bg-slate-900 border border-purple-500/30 flex items-center justify-center text-2xl md:text-4xl font-black text-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                    >
                        {num}
                    </motion.div>
                ))}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="w-12 h-16 md:w-16 md:h-24 bg-purple-500/10 border-2 border-dashed border-purple-500 flex items-center justify-center"
                >
                    <span className="text-2xl animate-pulse">?</span>
                </motion.div>
            </div>

            <div className="font-mono text-slate-500 text-xs mb-8 max-w-md text-center">
                WARNING: ATOMIC DATA UNITS DETECTED.<br/>
                IDENTIFY THE NEXT INDIVISIBLE QUANTUM INTEGER.
            </div>

            <form onSubmit={handleSubmit} className="flex gap-4">
                 <input 
                    type="number" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="#"
                    className="bg-black border border-purple-500/50 text-purple-500 font-mono px-4 py-2 outline-none focus:border-purple-500 w-24 text-center text-xl placeholder:text-purple-900"
                    autoFocus
                />
                 <button type="submit" className="bg-purple-900/20 border border-purple-500 text-purple-500 px-4 py-2 hover:bg-purple-500 hover:text-black transition-colors font-mono text-xs">
                    VERIFY
                </button>
            </form>
        </div>
    );
};
