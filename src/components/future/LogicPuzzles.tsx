import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { shuffle } from "lodash"; // Assuming lodash is available or I'll implement shuffle

// Helper
const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};

// Puzzle 1: Sequence Lock (Click 1-5)
export const SequenceLock = ({ onSolved }: { onSolved: () => void }) => {
    const [target, setTarget] = useState(1);
    const [numbers, setNumbers] = useState([1, 2, 3, 4, 5, 6]);
    const [shuffled, setShuffled] = useState(numbers);

    useEffect(() => {
        setShuffled(shuffleArray(numbers));
    }, []);

    const handleClick = (num: number) => {
        if (num === target) {
            if (num === 6) {
                onSolved();
            } else {
                setTarget(prev => prev + 1);
                setShuffled(shuffleArray(numbers)); // Scramble on every click
            }
        } else {
            setTarget(1); // Reset on fail
            // Shake effect handled by parent toast or local state?
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full gap-8">
            <div className="text-green-500 font-mono text-sm tracking-widest animate-pulse">
                SEQUENCE_VERIFICATION: {target}/6
            </div>
            <div className="grid grid-cols-3 gap-4">
                {shuffled.map((num) => (
                    <motion.button
                        key={num}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleClick(num)}
                        className={`
                            w-16 h-16 rounded border-2 flex items-center justify-center text-xl font-bold font-mono transition-colors
                            ${num < target ? "border-green-500 bg-green-900/50 text-green-300 opacity-50 cursor-default" : "border-green-500/50 hover:border-green-500 hover:bg-green-500 hover:text-black text-green-500"}
                        `}
                    >
                        {num < target ? "OK" : `0${num}`}
                    </motion.button>
                ))}
            </div>
            <div className="text-[10px] text-green-700 font-mono">
                &gt; INPUT_SEQUENCE_ASCENDING
            </div>
        </div>
    );
};

// Puzzle 2: Pattern Match (Simon Says style)
export const PatternMatch = ({ onSolved }: { onSolved: () => void }) => {
    const [sequence, setSequence] = useState<number[]>([]);
    const [userSequence, setUserSequence] = useState<number[]>([]);
    const [playing, setPlaying] = useState(false);
    const [flash, setFlash] = useState<number | null>(null);

    // Start game
    useEffect(() => {
        const newSeq = [0, 1, 2, 3].map(() => Math.floor(Math.random() * 9)); // 4 step sequence
        setSequence(newSeq);
        playSequence(newSeq);
    }, []);

    const playSequence = async (seq: number[]) => {
        setPlaying(true);
        setUserSequence([]);
        for (let i = 0; i < seq.length; i++) {
            await new Promise(r => setTimeout(r, 500));
            setFlash(seq[i]);
            await new Promise(r => setTimeout(r, 500));
            setFlash(null);
        }
        setPlaying(false);
    };

    const handleGridClick = (index: number) => {
        if (playing) return;
        
        // Flash user click
        setFlash(index);
        setTimeout(() => setFlash(null), 200);

        const nextIndex = userSequence.length;
        if (sequence[nextIndex] === index) {
            const newUserSeq = [...userSequence, index];
            setUserSequence(newUserSeq);
            
            if (newUserSeq.length === sequence.length) {
                setTimeout(onSolved, 500);
            }
        } else {
            // Wrong
            playSequence(sequence); // Replay
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full gap-8">
             <div className="text-green-500 font-mono text-sm tracking-widest">
                {playing ? "OBSERVE_PATTERN..." : "REPEAT_SEQUENCE"}
            </div>
            <div className="grid grid-cols-3 gap-2">
                {[...Array(9)].map((_, i) => (
                    <div
                        key={i}
                        onClick={() => handleGridClick(i)}
                        className={`
                            w-16 h-16 border border-green-900 transition-all duration-100 cursor-pointer
                            ${flash === i ? "bg-green-400 shadow-[0_0_20px_rgba(34,197,94,0.8)] border-green-400" : "bg-black hover:bg-green-900/20"}
                        `}
                    />
                ))}
            </div>
        </div>
    );
};

// Puzzle 3: Identify Anomaly (Click the different one)
export const AnomalyDetection = ({ onSolved }: { onSolved: () => void }) => {
    const [chars, setChars] = useState<string[]>([]);
    
    useEffect(() => {
        // Generate grid of random hex codes, one is slightly different
        const base = "AF4";
        const anomaly = "AF5";
        const grid = Array(15).fill(base);
        grid[Math.floor(Math.random() * 15)] = anomaly;
        setChars(grid);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-full gap-6">
            <div className="text-green-500 font-mono text-sm tracking-widest">
                LOCATE_ANOMALY
            </div>
            <div className="grid grid-cols-4 gap-4">
                 {chars.map((char, i) => (
                     <button
                        key={i}
                        onClick={() => {
                            if (char === "AF5") onSolved();
                            else {
                                // Scramble again?
                            }
                        }}
                        className="text-xs font-mono text-green-700 hover:text-green-400 p-2 border border-green-900/30 hover:border-green-500"
                     >
                         0x{char}
                     </button>
                 ))}
            </div>
        </div>
    );
};
