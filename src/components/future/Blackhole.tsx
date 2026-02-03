import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Disc, Zap, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface BlackholeProps {
    onCommand: (cmd: string) => void;
}

export const Blackhole = ({ onCommand }: BlackholeProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [key, setKey] = useState("");
    const [warping, setWarping] = useState(false);

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        const input = key.toUpperCase().trim();
        
        if (input === "NAVNEETOS195" || input === "NAVNEETOS196") {
            setWarping(true);
            setTimeout(() => {
                onCommand(input);
                setWarping(false);
                setIsOpen(false);
                setKey("");
            }, 2000);
        } else {
            toast.error("SINGULARITY COLLAPSE: INVALID KEY");
            setKey("");
        }
    };

    return (
        <>
            {/* Trigger Button */}
            <button 
                onClick={() => setIsOpen(true)}
                className="group relative flex items-center gap-2 mt-4 opacity-50 hover:opacity-100 transition-opacity"
            >
                <div className="relative w-8 h-8 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black rounded-full border border-purple-900 shadow-[0_0_15px_rgba(168,85,247,0.5)] group-hover:shadow-[0_0_25px_rgba(168,85,247,0.8)] transition-all" />
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="w-full h-full rounded-full border-t-2 border-purple-500 opacity-70"
                    />
                </div>
                <div className="text-[10px] text-purple-900 font-mono tracking-widest group-hover:text-purple-400 transition-colors">
                    BLK_HOLE_PROTOCOL
                </div>
            </button>

            {/* Modal Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm"
                    >
                        {/* Event Horizon Visuals */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <motion.div 
                                animate={{ scale: [1, 1.2, 1], rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] bg-[radial-gradient(circle,transparent_40%,rgba(88,28,135,0.1)_60%,transparent_70%)]"
                            />
                        </div>

                        <motion.div 
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            className="relative w-full max-w-md bg-black border border-purple-900/50 p-8 shadow-[0_0_100px_rgba(147,51,234,0.3)] overflow-hidden rounded-full aspect-square flex flex-col items-center justify-center text-center"
                        >
                            {/* Inner Swirl */}
                            <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(147,51,234,0.1)_180deg,transparent_360deg)] animate-[spin_4s_linear_infinite]" />
                            
                            {warping ? (
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="text-2xl font-black text-white mb-2 tracking-[0.5em] animate-pulse">WARPING</div>
                                    <div className="text-xs text-purple-400 font-mono">BENDING SPACETIME COORDINATES...</div>
                                </div>
                            ) : (
                                <div className="relative z-10 w-full max-w-[200px]">
                                    <Disc size={48} className="text-purple-500 mx-auto mb-6 animate-spin-slow" />
                                    
                                    <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-600 mb-2">
                                        EVENT HORIZON
                                    </h2>
                                    <p className="text-[10px] text-purple-300/60 font-mono mb-6 leading-relaxed">
                                        GRAVITATIONAL SINGULARITY DETECTED.<br/>
                                        INSERT QUANTUM KEY TO BYPASS LINEAR TIME.
                                    </p>

                                    <form onSubmit={handleUnlock} className="relative">
                                        <input 
                                            type="text" 
                                            value={key}
                                            onChange={(e) => setKey(e.target.value)}
                                            className="w-full bg-purple-900/10 border border-purple-500/30 rounded px-3 py-2 text-xs text-center text-purple-200 focus:border-purple-500 outline-none placeholder:text-purple-800/50"
                                            placeholder="ENTER_KEY"
                                            autoFocus
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setIsOpen(false)}
                                            className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-[10px] text-red-500 hover:text-red-400"
                                        >
                                            ABORT SEQUENCE
                                        </button>
                                    </form>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
