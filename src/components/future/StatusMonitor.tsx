import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Wifi, X, AlertTriangle } from "lucide-react";

interface StatusMonitorProps {
  level: number;
}

export const StatusMonitor = ({ level }: StatusMonitorProps) => {
  const [logs, setLogs] = React.useState<string[]>([]);
  const [wifiWindow, setWifiWindow] = useState(false);
  const [wifiStatus, setWifiStatus] = useState<"DISCONNECTED" | "CONNECTING" | "CONNECTED">("DISCONNECTED");
  const [glitch, setGlitch] = useState(false);

  // Random Logs
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => [`> [SYSTEM] ${new Date().toLocaleTimeString()}`, ...prev].slice(0, 3));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Level 1: Wifi Logic
  // Opens a small window randomly. User must click "CONNECT".
  React.useEffect(() => {
    if (level !== 2 || wifiStatus === "CONNECTED") return;

    const loop = setInterval(() => {
        setWifiWindow(true);
        // Auto close after 2s
        setTimeout(() => {
             if (wifiStatus !== "CONNECTED") setWifiWindow(false);
        }, 2000);
    }, 5000); // Every 5s

    return () => clearInterval(loop);
  }, [level, wifiStatus]);

  const handleConnect = () => {
      setWifiStatus("CONNECTING");
      setTimeout(() => setWifiStatus("CONNECTED"), 1000);
  };

  return (
    <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="fixed top-24 right-8 w-64 bg-black/80 border border-cyan-500/30 backdrop-blur-md p-4 rounded-xl z-20 flex flex-col gap-4"
    >
        <div className="flex justify-between items-center border-b border-cyan-500/30 pb-2">
            <span className="text-xs font-mono text-cyan-500 tracking-widest">SYS_MONITOR</span>
        </div>

        {/* Wifi Connection Puzzle Window */}
        <AnimatePresence>
            {wifiWindow && level === 2 && wifiStatus !== "CONNECTED" && (
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -left-40 top-0 bg-slate-800 border border-white p-4 rounded shadow-2xl w-32 text-center z-50"
                >
                    <div className="text-[10px] mb-2 font-bold text-white">NETWORK FOUND</div>
                    <button 
                        onClick={handleConnect}
                        className="bg-green-500 text-black text-xs px-2 py-1 rounded font-bold hover:bg-green-400"
                    >
                        CONNECT
                    </button>
                </motion.div>
            )}
        </AnimatePresence>

        {/* System Options (Clickable distractions) */}
        <div className="grid grid-cols-2 gap-2">
            <div onClick={() => setGlitch(true)} className="bg-cyan-900/20 p-2 rounded border border-cyan-500/10 hover:bg-red-500/20 cursor-pointer transition-colors group">
                 <span className="text-[10px] text-cyan-300 group-hover:text-red-300">KERNEL</span>
            </div>
            <div className="bg-cyan-900/20 p-2 rounded border border-cyan-500/10 cursor-not-allowed opacity-50">
                 <span className="text-[10px] text-cyan-300">PROXY</span>
            </div>
        </div>

        {/* Logs */}
        <div className="bg-black border border-cyan-500/20 p-2 rounded relative overflow-hidden h-24">
            <div className="text-[10px] font-mono text-green-400 opacity-80 h-full overflow-hidden flex flex-col justify-end">
                {wifiStatus === "CONNECTED" && <div className="text-green-500 font-bold">&gt; KEY: SKY_NET_ACTIVE</div>}
                {logs.map((log, i) => (
                    <div key={i}>{log}</div>
                ))}
            </div>
        </div>
        
        {glitch && (
            <div className="fixed inset-0 bg-white z-[999] mix-blend-difference" onAnimationEnd={() => setGlitch(false)}>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black font-black text-9xl">ERROR</div>
            </div>
        )}
    </motion.div>
  );
};
