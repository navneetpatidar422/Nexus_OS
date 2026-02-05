import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export const VirtualKeyboard = () => {
    const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
    const [randomGlow, setRandomGlow] = useState<string | null>(null);

    const ROWS = [
        ["ESC", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "BACK"],
        ["TAB", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]"],
        ["CAPS", "A", "S", "D", "F", "G", "H", "J", "K", "L", ":", "ENTER"],
        ["SHIFT", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "SHIFT"],
        ["SPACE"]
    ];

    // Listen to real keyboard events
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toUpperCase();
            let mappedKey = key;
            if (key === " ") mappedKey = "SPACE";
            if (key === "ESCAPE") mappedKey = "ESC";
            if (key === "BACKSPACE") mappedKey = "BACK";
            if (key === "ENTER") mappedKey = "ENTER";
            if (key === "SHIFT") mappedKey = "SHIFT";
            if (key === "CAPSLOCK") mappedKey = "CAPS";
            if (key === "TAB") mappedKey = "TAB";
            
            setActiveKeys(prev => new Set(prev).add(mappedKey));
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            const key = e.key.toUpperCase();
            let mappedKey = key;
            if (key === " ") mappedKey = "SPACE";
            if (key === "ESCAPE") mappedKey = "ESC";
            if (key === "BACKSPACE") mappedKey = "BACK";
            if (key === "ENTER") mappedKey = "ENTER";
            if (key === "SHIFT") mappedKey = "SHIFT";
            if (key === "CAPSLOCK") mappedKey = "CAPS";
            if (key === "TAB") mappedKey = "TAB";

            setActiveKeys(prev => {
                const next = new Set(prev);
                next.delete(mappedKey);
                return next;
            });
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    const handleVirtualClick = (key: string) => {
        // Visual feedback
        setActiveKeys(prev => new Set(prev).add(key));
        setTimeout(() => setActiveKeys(prev => {
            const next = new Set(prev);
            next.delete(key);
            return next;
        }), 150);

        // Dispatch custom event for other components to listen to
        const event = new CustomEvent("virtual-keydown", { detail: key });
        window.dispatchEvent(event);
    };

    // Random "Idle" Glitch Effect
    useEffect(() => {
        const interval = setInterval(() => {
            const allKeys = ROWS.flat();
            const randomKey = allKeys[Math.floor(Math.random() * allKeys.length)];
            setRandomGlow(randomKey);
            setTimeout(() => setRandomGlow(null), 200);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full flex justify-center perspective-[800px] overflow-hidden py-4">
            <div 
                className="flex flex-col gap-2 items-center origin-bottom transform-style-3d rotate-x-[20deg]"
                style={{ transform: "rotateX(25deg) scale(0.85)" }}
            >
                {/* Holographic Base */}
                <div className="absolute inset-0 bg-green-500/5 blur-xl rounded-full transform scale-150" />
                
                {ROWS.map((row, i) => (
                    <div key={i} className="flex gap-2">
                        {row.map((key, j) => {
                            const isActive = activeKeys.has(key);
                            const isGlitch = randomGlow === key;
                            const isSpace = key === "SPACE";
                            
                            return (
                                <motion.div 
                                    key={j} 
                                    animate={{ 
                                        y: isActive ? 2 : 0,
                                        boxShadow: isActive 
                                            ? "0 0 15px 2px rgba(34,197,94,0.6), inset 0 0 10px rgba(34,197,94,0.4)" 
                                            : isGlitch 
                                                ? "0 0 10px 1px rgba(34,197,94,0.4)" 
                                                : "0 4px 0 rgba(10,40,20,0.8), 0 0 0 1px rgba(34,197,94,0.2)"
                                    }}
                                    className={`
                                        relative
                                        border border-green-900/40 text-[10px] text-green-500 font-mono flex items-center justify-center rounded-sm
                                        backdrop-blur-sm transition-colors duration-75
                                        ${isSpace ? "w-72 h-10" : "w-10 h-10"}
                                        ${["SHIFT", "ENTER", "CAPS", "BACK", "TAB"].includes(key) ? "w-20" : ""}
                                        ${isActive ? "bg-green-500/20 text-white border-green-400" : "bg-black/60 hover:bg-green-900/20"}
                                        cursor-pointer
                                    `}
                                    onClick={() => handleVirtualClick(key)}
                                >
                                    {isSpace ? (
                                        <div className="w-full h-full flex items-center justify-center opacity-20">
                                            <div className="w-12 h-1 bg-green-500 rounded-full" />
                                        </div>
                                    ) : key}
                                    
                                    {/* Key Reflection/Depth */}
                                    <div className="absolute top-0 left-0 w-full h-[50%] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                                </motion.div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};