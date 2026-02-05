import React, { useState, useEffect } from "react";
import { Globe, Radio, Activity, Zap } from "lucide-react";
import { motion } from "motion/react";

export const TelemetryPanel = () => {
    const [time, setTime] = useState(new Date());
    const [entropy, setEntropy] = useState(12.45);
    const [lat, setLat] = useState(28.6139);
    const [long, setLong] = useState(77.2090);
    const [fps, setFps] = useState(60);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
            setEntropy(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 2)));
            setLat(prev => prev + (Math.random() - 0.5) * 0.001);
            setLong(prev => prev + (Math.random() - 0.5) * 0.001);
            setFps(Math.floor(55 + Math.random() * 10));
        }, 100);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col gap-4 h-full">
            {/* HEX CLOCK */}
            <div className="border border-green-900/30 bg-black/50 p-4 rounded relative overflow-hidden group">
                <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors" />
                <div className="flex justify-between items-start mb-2">
                    <div className="text-[10px] text-green-600 tracking-widest flex items-center gap-2">
                        <Globe size={12} className="animate-spin-slow" />
                        GLOBAL_TIME
                    </div>
                    <div className="text-[10px] text-green-800">UTC+0</div>
                </div>
                <div className="text-3xl font-black font-mono text-white tracking-tight flex flex-col leading-none">
                    <span>{time.toLocaleTimeString('en-US', { hour12: false })}</span>
                    <span className="text-sm text-green-500/50 self-end">.{time.getMilliseconds().toString().padStart(3, '0')}</span>
                </div>
                <div className="mt-2 text-[10px] text-green-700 font-mono flex justify-between border-t border-green-900/30 pt-1">
                    <span>EPOCH: {Math.floor(time.getTime() / 1000)}</span>
                </div>
            </div>

            {/* LIVE COORDINATES */}
            <div className="grid grid-cols-2 gap-2">
                 <div className="bg-green-900/10 p-2 rounded border border-green-900/20">
                     <div className="text-[8px] text-green-600 mb-1">LATITUDE</div>
                     <div className="font-mono text-xs text-green-400">{lat.toFixed(6)}</div>
                 </div>
                 <div className="bg-green-900/10 p-2 rounded border border-green-900/20">
                     <div className="text-[8px] text-green-600 mb-1">LONGITUDE</div>
                     <div className="font-mono text-xs text-green-400">{long.toFixed(6)}</div>
                 </div>
            </div>

            {/* ENTROPY MONITOR */}
            <div className="flex-1 bg-black/40 border border-green-900/30 p-3 rounded relative flex flex-col">
                <div className="flex justify-between items-center mb-4">
                     <span className="text-[10px] text-green-500 tracking-widest flex items-center gap-1">
                         <Activity size={10} /> SYS_ENTROPY
                     </span>
                     <span className={`text-xs font-bold ${entropy > 50 ? "text-red-500" : "text-green-500"}`}>
                         {entropy.toFixed(2)}%
                     </span>
                </div>
                
                {/* Visualizer */}
                <div className="flex-1 flex items-end gap-1 overflow-hidden opacity-50">
                    {[...Array(20)].map((_, i) => (
                        <motion.div 
                            key={i}
                            className={`flex-1 ${i % 2 === 0 ? "bg-green-500" : "bg-green-700"}`}
                            animate={{ height: `${Math.random() * 100}%` }}
                            transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }}
                        />
                    ))}
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.8)_100%)]" />
            </div>

            {/* SYSTEM METRICS */}
             <div className="flex justify-between text-[10px] text-green-800 font-mono border-t border-green-900/30 pt-2">
                 <div className="flex items-center gap-1"><Zap size={10} /> {fps} FPS</div>
                 <div className="flex items-center gap-1"><Radio size={10} className={fps < 30 ? "text-red-500 animate-pulse" : "text-green-500"} /> LINK_STABLE</div>
             </div>
        </div>
    );
};