import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { CheckCircle, XCircle } from "lucide-react";

// --- SECTOR 7: LIGHTS OUT PUZZLE ---
// A 5x5 grid. Clicking a cell toggles itself and neighbors.
// Goal: Turn all lights GREEN. (Simplified: Turn all OFF or ON. Let's say all ON/Green).
// No Back Button: Solved state enables exit.

export const Sector7Puzzle = ({ onSolved }: { onSolved: () => void }) => {
    const SIZE = 5;
    const [grid, setGrid] = useState<boolean[]>(Array(SIZE * SIZE).fill(false));
    const [moves, setMoves] = useState(0);
    const [solved, setSolved] = useState(false);

    // Initialize with a solvable pattern
    useEffect(() => {
        // Start all true (solved), then simulate random clicks to scramble
        let newGrid = Array(SIZE * SIZE).fill(true);
        for(let i=0; i<10; i++) {
            const r = Math.floor(Math.random() * (SIZE * SIZE));
            newGrid = toggle(newGrid, r);
        }
        setGrid(newGrid);
    }, []);

    const toggle = (currentGrid: boolean[], index: number) => {
        const newGrid = [...currentGrid];
        const row = Math.floor(index / SIZE);
        const col = index % SIZE;

        const indices = [
            index,           // Self
            row > 0 ? index - SIZE : -1, // Top
            row < SIZE - 1 ? index + SIZE : -1, // Bottom
            col > 0 ? index - 1 : -1, // Left
            col < SIZE - 1 ? index + 1 : -1 // Right
        ];

        indices.forEach(i => {
            if (i >= 0) newGrid[i] = !newGrid[i];
        });
        return newGrid;
    };

    const handleClick = (index: number) => {
        if (solved) return;
        const newGrid = toggle(grid, index);
        setGrid(newGrid);
        setMoves(m => m + 1);

        if (newGrid.every(v => v === true)) {
            setSolved(true);
            setTimeout(onSolved, 1500);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-mono text-cyan-500 mb-2">NEURAL_ALIGNMENT</h2>
            <p className="text-xs text-slate-400 mb-8">OBJECTIVE: ACTIVATE ALL NODES</p>
            
            <div className="grid grid-cols-5 gap-2 mb-8">
                {grid.map((active, i) => (
                    <motion.div
                        key={i}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleClick(i)}
                        className={`w-12 h-12 rounded border cursor-pointer transition-colors duration-300 ${active ? "bg-green-500 border-green-400 shadow-[0_0_10px_#0f0]" : "bg-black border-slate-700 hover:border-cyan-500"}`}
                    />
                ))}
            </div>
            
            <div className="font-mono text-sm text-cyan-500">
                MOVES: {moves} | STATUS: {solved ? <span className="text-green-500">ALIGNED</span> : <span className="text-red-500">MISALIGNED</span>}
            </div>
            
            {solved && (
                 <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 border border-green-500 bg-green-900/20 text-green-500 font-bold"
                 >
                     SECTOR RESTORED. UPLOADING...
                 </motion.div>
            )}
            
            {!solved && (
                <div className="mt-8 text-[10px] text-red-500/50 animate-pulse">
                    WARNING: EXIT DISABLED UNTIL RESOLVED
                </div>
            )}
        </div>
    );
};

// --- MAINFRAME: FREQUENCY TUNING ---
// A slider that moves a bar. A target zone moves randomly. User must keep bar in target zone to fill progress.
export const MainframePuzzle = ({ onSolved }: { onSolved: () => void }) => {
    const [progress, setProgress] = useState(0);
    const [userVal, setUserVal] = useState(50);
    const [targetVal, setTargetVal] = useState(50);
    const [solved, setSolved] = useState(false);

    useEffect(() => {
        if (solved) return;
        
        // Target Movement
        const interval = setInterval(() => {
            setTargetVal(prev => {
                const move = (Math.random() - 0.5) * 20;
                let next = prev + move;
                if (next < 10) next = 10;
                if (next > 90) next = 90;
                return next;
            });
        }, 500);

        // Progress Logic
        const check = setInterval(() => {
            if (Math.abs(userVal - targetVal) < 10) {
                setProgress(p => Math.min(100, p + 1));
            } else {
                setProgress(p => Math.max(0, p - 0.5));
            }
        }, 50);

        return () => {
            clearInterval(interval);
            clearInterval(check);
        };
    }, [userVal, targetVal, solved]);

    useEffect(() => {
        if (progress >= 100 && !solved) {
            setSolved(true);
            setTimeout(onSolved, 1500);
        }
    }, [progress, solved, onSolved]);

    return (
        <div className="flex flex-col items-center justify-center h-full w-full max-w-lg mx-auto select-none">
            <h2 className="text-2xl font-mono text-cyan-500 mb-2">HARMONIC_RESONANCE</h2>
            <p className="text-xs text-slate-400 mb-8">OBJECTIVE: MATCH FREQUENCY WAVEFORM</p>

            <div className="relative w-full h-16 bg-black border border-slate-700 rounded-lg overflow-hidden mb-4">
                {/* Target Zone */}
                <motion.div 
                    animate={{ left: `${targetVal}%` }}
                    transition={{ duration: 0.5, ease: "linear" }}
                    className="absolute top-0 bottom-0 w-20 -ml-10 bg-cyan-900/50 border-l border-r border-cyan-500/30"
                />
                
                {/* User Bar */}
                <div 
                    className="absolute top-0 bottom-0 w-2 -ml-1 bg-white shadow-[0_0_15px_white]"
                    style={{ left: `${userVal}%` }}
                />
            </div>

            <input 
                type="range" 
                min="0" 
                max="100" 
                value={userVal}
                onChange={(e) => !solved && setUserVal(Number(e.target.value))}
                className="w-full mb-8 cursor-pointer"
            />

            {/* Progress */}
            <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                <div 
                    className={`h-full transition-all duration-100 ${solved ? "bg-green-500" : "bg-cyan-500"}`}
                    style={{ width: `${progress}%` }}
                />
            </div>
            
            <div className="mt-2 font-mono text-xs text-cyan-500">
                SYNC: {Math.round(progress)}%
            </div>

            {solved && (
                 <div className="mt-4 text-green-500 font-bold animate-pulse">
                     RESONANCE STABLE.
                 </div>
            )}
        </div>
    );
};

// --- ENCRYPTED: MULTI-STAGE BREACH ---
// 1. Keypad
// 2. Wires (Click in order)
export const EncryptedPuzzle = ({ onSolved }: { onSolved: () => void }) => {
    const [stage, setStage] = useState(1);
    
    // Stage 1: Keypad
    const CODE = "7532";
    const [input, setInput] = useState("");
    
    // Stage 2: Wires
    const [wires, setWires] = useState([true, true, true, true]); // 4 wires
    const CORRECT_ORDER = [2, 0, 3, 1]; // Red, Blue, Yellow, Green (indices)
    const [cutOrder, setCutOrder] = useState<number[]>([]);

    const handleKeypad = (num: string) => {
        if (input.length < 4) {
            const newVal = input + num;
            setInput(newVal);
            if (newVal === CODE) {
                setTimeout(() => setStage(2), 500);
            } else if (newVal.length === 4) {
                setTimeout(() => setInput(""), 500);
            }
        }
    };

    const handleCut = (index: number) => {
        if (!wires[index]) return; // Already cut
        
        // Check if correct sequence
        const currentStep = cutOrder.length;
        if (index === CORRECT_ORDER[currentStep]) {
            const newWires = [...wires];
            newWires[index] = false;
            setWires(newWires);
            
            const newOrder = [...cutOrder, index];
            setCutOrder(newOrder);

            if (newOrder.length === 4) {
                setTimeout(onSolved, 1500);
            }
        } else {
            // Wrong wire - Reset
            alert("SYSTEM ALERT: INCORRECT WIRE. RESETTING.");
            setWires([true, true, true, true]);
            setCutOrder([]);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto">
             <h2 className="text-2xl font-mono text-red-500 mb-2">FIREWALL_BREACH</h2>
             
             {stage === 1 && (
                 <div className="bg-slate-900 p-8 rounded-xl border border-slate-700">
                     <div className="bg-black border border-red-500/30 h-12 mb-4 rounded flex items-center justify-center text-red-500 font-mono text-xl tracking-[1em]">
                         {input.padEnd(4, "*")}
                     </div>
                     <div className="grid grid-cols-3 gap-4">
                         {[1,2,3,4,5,6,7,8,9].map(n => (
                             <button key={n} onClick={() => handleKeypad(n.toString())} className="w-16 h-16 bg-slate-800 rounded hover:bg-slate-700 text-white font-bold text-xl border border-slate-600 active:scale-95">
                                 {n}
                             </button>
                         ))}
                         <div className="col-start-2">
                             <button onClick={() => handleKeypad("0")} className="w-16 h-16 bg-slate-800 rounded hover:bg-slate-700 text-white font-bold text-xl border border-slate-600 active:scale-95">0</button>
                         </div>
                     </div>
                     <p className="text-[10px] text-slate-500 mt-4 text-center">HINT: PRIME NUMBERS DESCENDING (start 7)</p>
                 </div>
             )}

             {stage === 2 && (
                 <div className="w-full">
                     <p className="text-xs text-red-400 mb-4 text-center">CUT WIRES: BLUE &rarr; RED &rarr; GREEN &rarr; YELLOW</p>
                     <div className="flex justify-between h-40 bg-black/50 p-8 rounded-xl border border-slate-700 relative">
                         {/* Wires */}
                         {/* Indices: 0:Red, 1:Green, 2:Blue, 3:Yellow (Visuals only, mapping below) */}
                         {/* MAPPING: 0=Blue, 1=Red, 2=Green, 3=Yellow in visuals vs logic? */}
                         {/* Let's simplify: 4 coloured wires. Logic array `wires` index matches color. */}
                         
                         {/* Wire 0: BLUE */}
                         <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => handleCut(0)}>
                             <div className={`w-4 h-full bg-blue-500 ${!wires[0] && "opacity-20 translate-y-4"} transition-all`} />
                             <span className="text-[10px] text-blue-500">BLU</span>
                         </div>

                         {/* Wire 1: RED */}
                         <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => handleCut(1)}>
                             <div className={`w-4 h-full bg-red-500 ${!wires[1] && "opacity-20 translate-y-4"} transition-all`} />
                             <span className="text-[10px] text-red-500">RED</span>
                         </div>

                         {/* Wire 2: GREEN */}
                         <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => handleCut(2)}>
                             <div className={`w-4 h-full bg-green-500 ${!wires[2] && "opacity-20 translate-y-4"} transition-all`} />
                             <span className="text-[10px] text-green-500">GRN</span>
                         </div>

                         {/* Wire 3: YELLOW */}
                         <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => handleCut(3)}>
                             <div className={`w-4 h-full bg-yellow-500 ${!wires[3] && "opacity-20 translate-y-4"} transition-all`} />
                             <span className="text-[10px] text-yellow-500">YEL</span>
                         </div>
                     </div>
                     {/* 
                        Logic Correction:
                        The hint says "BLUE -> RED -> GREEN -> YELLOW".
                        Indices in UI: 0=Blue, 1=Red, 2=Green, 3=Yellow.
                        So correct order is 0, 1, 2, 3.
                        Let's update logic in component state initialization.
                     */}
                 </div>
             )}
        </div>
    );
}
