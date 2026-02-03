import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Crosshair, Radio, AlertTriangle } from "lucide-react";

export const SpaceHUD = () => {
    const [scanned, setScanned] = useState(false);

    return (
        <div className="fixed inset-0 z-10 pointer-events-none p-4 md:p-8 flex flex-col justify-between font-mono select-none">
            {/* Top Bar */}
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2">
                    <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: 200 }} 
                        className="h-0.5 bg-cyan-500/50" 
                    />
                    <div className="flex items-center gap-2 text-cyan-500">
                        <Radio size={16} className="animate-pulse" />
                        <h1 className="text-xl tracking-[0.3em] font-bold">ZERO_G</h1>
                    </div>
                    <div className="text-[10px] text-cyan-500/70">SYSTEMS OPTIMAL // O2 LEVELS: 98%</div>
                </div>
                
                <div className="text-right text-cyan-500 text-xs space-y-1">
                    <div className="flex items-center justify-end gap-2">
                        <span>CRITICAL VELOCITY</span>
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    </div>
                    <div>SECTOR 7G</div>
                </div>
            </div>

            {/* Center Reticle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                 <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-[60vh] h-[60vh] border border-cyan-500/20 rounded-full border-dashed" 
                 />
                 <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-10 left-10 right-10 bottom-10 border border-cyan-500/10 rounded-full" 
                 />
            </div>

            {/* Bottom Bar */}
            <div className="flex justify-between items-end">
                <div className="text-cyan-500/50 text-[10px] md:text-xs max-w-[200px] leading-tight">
                    <AlertTriangle size={12} className="inline mb-1 mr-1" />
                    CAUTION: EXTREME G-FORCES MAY CAUSE DISORIENTATION.
                </div>
                <button 
                    onClick={() => setScanned(true)}
                    className="pointer-events-auto group relative px-6 py-2 overflow-hidden"
                >
                    <span className="relative z-10 text-cyan-500 font-bold tracking-widest text-sm group-hover:text-black transition-colors">
                        {scanned ? "SCAN_COMPLETE" : "INIT_SCAN"}
                    </span>
                    <div className="absolute inset-0 border border-cyan-500 skew-x-[-12deg]" />
                    <div className="absolute inset-0 bg-cyan-500 skew-x-[-12deg] translate-y-full group-hover:translate-y-0 transition-transform" />
                </button>
            </div>

            {/* Scan Overlay Effect */}
            <AnimatePresence>
                {scanned && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-cyan-900/10 pointer-events-none backdrop-blur-[1px]"
                    >
                         <div className="absolute top-0 left-0 w-full h-2 bg-cyan-400/50 shadow-[0_0_50px_cyan] animate-[scan_2s_ease-in-out_infinite]" />
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @keyframes scan {
                    0% { top: -10%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 110%; opacity: 0; }
                }
            `}</style>
        </div>
    );
};
