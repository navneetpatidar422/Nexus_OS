import React, { useState, useEffect } from "react";
import { BootSequence } from "./components/future/BootSequence";
import { Certificate } from "./components/future/Certificate";
import { VirtualKeyboard } from "./components/future/VirtualKeyboard";
import { TextScramble } from "./components/future/TextScramble";
import { TicTacToePuzzle } from "./components/future/TicTacToePuzzle";
import { ChessPuzzle } from "./components/future/ChessPuzzle";
import { Sector7Puzzle, MainframePuzzle, EncryptedPuzzle } from "./components/future/DetailViews";
import { AdminPortal } from "./components/future/AdminPortal";
import { Blackhole } from "./components/future/Blackhole";
import { WarpGrid } from "./components/future/WarpGrid";
import { DataStream } from "./components/future/DataStream";
import { CustomCursor } from "./components/CustomCursor";
import { SequenceLock, PatternMatch, AnomalyDetection } from "./components/future/LogicPuzzles";
import { TelemetryPanel } from "./components/future/TelemetryPanel";
import { motion, AnimatePresence } from "motion/react";
import { Activity, Wifi, Lock, ShieldAlert, Database, Grid3X3, Layers, User, Globe, Clock, Terminal, FileCode, FolderClosed, Key, ShieldCheck } from "lucide-react";
import { toast, Toaster } from "sonner";
import { Trash2, FileText } from "lucide-react";
import signatureImg from "figma:asset/3d887c48f9d3441569c54e1069cb7c8434a713d0.png";

// --- MODULE DEFINITIONS ---
// 3 Puzzles per folder logic
const MODULES = [
    {
        id: "MOD_0",
        name: "SYSTEM_ROOT",
        icon: FolderClosed,
        puzzles: [
            { id: 101, hint: "Sequence Lock", code: "SEQ_OK" },
            { id: 102, hint: "Anomaly Detection", code: "ANOMALY_FIXED" },
            { id: 103, hint: "Pattern Sync", code: "SYNC_COMPLETE" }
        ]
    },
    {
        id: "MOD_1",
        name: "DATA_LAYER",
        icon: Database,
        puzzles: [
            { id: 201, hint: "Memory Restoration", code: "MEM_OK" }, // Lights Out
            { id: 202, hint: "Hidden Process", code: "GHOST_FOUND" },
            { id: 203, hint: "Visual Logic", code: "VISUAL_OK" }
        ]
    },
    {
        id: "MOD_2",
        name: "SECTOR_7",
        icon: Grid3X3,
        puzzles: [
            { id: 301, hint: "Tactical AI", code: "CHESS_MATE" },
            { id: 302, hint: "Zero Sum", code: "TIC_TAC_TOE" },
            { id: 303, hint: "Frequency Resonance", code: "FREQ_MATCH" }
        ]
    },
    {
        id: "ADMIN_ACCESS",
        name: "ADMIN_ACCESS",
        icon: Key,
        puzzles: [
             { id: 999, hint: "The Final Variable", code: "42" }
        ]
    }
];

// --- WINNERS LIST ---
const INITIAL_WINNERS = [
    "Navneet Patidar", 
    "User012"
];

export default function App() {
  const [booted, setBooted] = useState(false);
  const [username, setUsername] = useState("GUEST");
  const [winners, setWinners] = useState<string[]>(INITIAL_WINNERS);
  
  // Progression State
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [completedPuzzles, setCompletedPuzzles] = useState<number[]>([]); 
  const [activeView, setActiveView] = useState<string>("DASHBOARD"); 
  const [wifiConnected, setWifiConnected] = useState(false);
  const [devMode, setDevMode] = useState(false);

  // Timer State (30 Minutes)
  const INITIAL_TIME = 30 * 60;
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME); 

  // Dashboard Visuals
  const [logs, setLogs] = useState<string[]>(["SYSTEM_INIT...", "WAITING_FOR_NETWORK..."]);

  // Timer Effect & Reset Logic
  useEffect(() => {
    if (!booted) return;
    const timer = setInterval(() => {
        setTimeLeft(prev => {
            if (prev <= 0) {
                clearInterval(timer);
                // Reset Game
                toast.error("SYSTEM FAILURE: TIMEOUT. REBOOTING...");
                setTimeout(() => window.location.reload(), 3000);
                return 0;
            }
            // Warning at 2 mins (120s)
            if (prev === 120) {
                toast.warning("CRITICAL WARNING: SYSTEM PURGE IMMINENT");
            }
            return prev - 1;
        });
    }, 1000);
    return () => clearInterval(timer);
  }, [booted]);

  const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Keyboard Listener for Admin Code
  useEffect(() => {
    let buffer = "";
    const handler = (e: KeyboardEvent) => {
        buffer += e.key.toUpperCase();
        if (buffer.length > 20) buffer = buffer.slice(-20);
        if (buffer.includes("NAVNEETOS195")) {
             setActiveView("ADMIN_PORTAL"); 
             toast.success("GOD MODE: ADMIN PORTAL UNLOCKED");
        }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleBootComplete = (name: string) => {
      setUsername(name);
      setBooted(true);
      setCompletedPuzzles([]); 
  };

  const handlePuzzleSolve = (puzzleId: number, code: string) => {
      if (completedPuzzles.includes(puzzleId)) return;
      
      setCompletedPuzzles(prev => [...prev, puzzleId]);
      toast.success(`PUZZLE SOLVED: ${code}`);
      setLogs(prev => [`> [SUCCESS] ${code} VERIFIED`, ...prev]);

      const currentModule = MODULES[currentModuleIndex];
      // Check if ALL puzzles in current module are done
      const allDone = currentModule.puzzles.every(p => [...completedPuzzles, puzzleId].includes(p.id));
      
      if (allDone) {
          toast.success(`MODULE ${currentModule.name} UNLOCKED.`);
          if (currentModuleIndex < MODULES.length - 1) {
              setCurrentModuleIndex(prev => prev + 1);
          } else {
              setActiveView("ADMIN_PORTAL");
              return;
          }
      }
      
      setTimeout(() => setActiveView("DASHBOARD"), 1500);
  };

  const handleDevSelect = (targetModIndex: number, targetPuzzleId: number) => {
      const newCompleted: number[] = [];
      
      // Add all puzzles from previous modules
      for (let m = 0; m < targetModIndex; m++) {
          MODULES[m].puzzles.forEach(p => newCompleted.push(p.id));
      }
      
      // Add puzzles from current module up to target
      const targetMod = MODULES[targetModIndex];
      for (const p of targetMod.puzzles) {
          if (p.id === targetPuzzleId) break;
          newCompleted.push(p.id);
      }
      
      setCompletedPuzzles(newCompleted);
      setCurrentModuleIndex(targetModIndex);
      setWifiConnected(true); 
      setActiveView("PUZZLE");
      toast.success("WARP_DRIVE ENGAGED: SKIPPING SECTORS");
  };

  const renderActivePuzzle = () => {
      const currentModule = MODULES[currentModuleIndex];
      const nextPuzzle = currentModule.puzzles.find(p => !completedPuzzles.includes(p.id));

      if (!nextPuzzle) return <div className="text-green-500 font-mono">MODULE COMPLETE. STANDBY...</div>;

      switch (nextPuzzle.id) {
          // --- MOD 0 ---
          case 101: return <SequenceLock onSolved={() => handlePuzzleSolve(101, "SEQ_OK")} />;
          case 102: return <AnomalyDetection onSolved={() => handlePuzzleSolve(102, "ANOMALY_FIXED")} />;
          case 103: return <PatternMatch onSolved={() => handlePuzzleSolve(103, "SYNC_COMPLETE")} />;
          
          // --- MOD 1 ---
          case 201: return <Sector7Puzzle onSolved={() => handlePuzzleSolve(201, "MEM_OK")} />;
          case 202: 
                // Click-based hidden file
               return (
                  <div className="w-full h-full relative bg-slate-900/50 border border-green-900 overflow-hidden flex items-center justify-center">
                      <div className="text-green-900 text-xs font-mono animate-pulse">Scanning for ghost signatures...</div>
                      <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: [0,1,0], scale: [0.5, 1, 0.5], x: [0, 100, -100, 0], y: [0, -50, 50, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute cursor-pointer p-4 bg-green-500/20 border border-green-500 rounded-full"
                        onClick={() => handlePuzzleSolve(202, "GHOST_FOUND")}
                      >
                           <FileCode size={24} className="text-green-400" />
                      </motion.div>
                  </div>
               );
          case 203: return <EncryptedPuzzle onSolved={() => handlePuzzleSolve(203, "VISUAL_OK")} />;
          
          // --- MOD 2 ---
          case 301: return <ChessPuzzle onSolved={() => handlePuzzleSolve(301, "CHESS_MATE")} />;
          case 302: return <TicTacToePuzzle onSolved={() => handlePuzzleSolve(302, "TIC_TAC_TOE")} />;
          case 303: return <MainframePuzzle onSolved={() => handlePuzzleSolve(303, "FREQ_MATCH")} />;

          // --- ADMIN ---
          case 999: 
             return (
                 <div className="flex flex-col items-center justify-center h-full font-mono">
                     <motion.div
                         initial={{ scale: 0.9, opacity: 0 }}
                         animate={{ scale: 1, opacity: 1 }}
                         transition={{ duration: 0.5 }}
                         className="flex flex-col items-center"
                     >
                         <div className="text-red-500 mb-4 text-2xl font-black tracking-widest animate-pulse">FINAL_VARIABLE</div>
                         <div className="text-green-700 text-xs mb-8 max-w-md text-center">
                             "I AM THE UNIVERSAL CONSTANT. THE ANSWER TO LIFE, THE UNIVERSE, AND EVERYTHING."
                         </div>
                         <input type="text" className="bg-black border-b-2 border-red-500 text-red-500 p-2 text-center outline-none text-4xl w-32 focus:border-red-400 font-bold placeholder-red-900" autoFocus placeholder="??" onChange={(e) => { if (e.target.value === "42") handlePuzzleSolve(999, "42"); }} />
                     </motion.div>
                 </div>
             );
             
          default: return <div>UNKNOWN_MODULE</div>;
      }
  };

  if (!booted) return <BootSequence onComplete={handleBootComplete} />;
  
  if (activeView === "DEV_SELECTOR") {
      return (
          <div className="w-full h-full bg-black text-green-500 font-mono p-8 overflow-y-auto z-50 relative">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-black text-purple-500 mb-8 tracking-widest border-b border-purple-900 pb-4 flex justify-between items-center">
                    <span>DEV_MODE // LEVEL_SELECTOR</span>
                    <span className="text-xs bg-purple-900/20 px-2 py-1 rounded text-purple-300">GOD_ACCESS</span>
                </h1>
                <div className="grid gap-8 pb-20">
                    {MODULES.map((mod, mIdx) => (
                        <div key={mod.id} className="border border-green-900/50 p-6 rounded-lg bg-green-900/5">
                            <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2 border-b border-green-900/30 pb-2">
                                <mod.icon className="text-purple-500" /> 
                                <span className="text-purple-400">{mod.name}</span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {mod.puzzles.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => handleDevSelect(mIdx, p.id)}
                                        className="text-left border border-green-500/30 p-4 hover:bg-purple-600 hover:border-purple-500 hover:text-white transition-all group bg-black rounded relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-1">
                                            <div className="w-2 h-2 rounded-full bg-purple-500/50 group-hover:bg-white" />
                                        </div>
                                        <div className="text-[10px] text-green-700 group-hover:text-white/70 mb-1">ID: {p.id}</div>
                                        <div className="font-bold text-sm">{p.hint}</div>
                                        <div className="text-[10px] mt-2 opacity-50 font-mono">CODE: {p.code}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <button 
                    onClick={() => setActiveView("DASHBOARD")}
                    className="fixed bottom-8 right-8 bg-red-900/20 text-red-500 border border-red-500 px-6 py-3 hover:bg-red-500 hover:text-black transition-all font-bold tracking-widest z-50 backdrop-blur"
                >
                    EXIT DEV_MODE
                </button>
              </div>
          </div>
      );
  }

  const handleAdminUnlock = () => {
      // Add current user to winners list
      setWinners(prev => {
          const newList = [username, ...prev];
          // Keep only top 5
          return newList.slice(0, 5);
      });
      setActiveView("CERTIFICATE");
  };

  if (activeView === "ADMIN_PORTAL") {
      return <AdminPortal username={username} onUnlock={handleAdminUnlock} />;
  }
  if (activeView === "CERTIFICATE") {
      return <Certificate username={username} />;
  }

  return (
    <main className="w-screen h-screen bg-[#050505] text-green-500 font-mono overflow-hidden flex flex-col relative selection:bg-green-500 selection:text-black cursor-none">
        <Toaster theme="dark" position="top-center" />
        <CustomCursor />
        
        <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
            <WarpGrid active={activeView === "DASHBOARD"} />
            <DataStream side="left" />
            <DataStream side="right" />
        </div>

        <div className="flex-1 grid grid-cols-[280px_1fr_280px] gap-4 p-4 h-full relative z-10">
            
            {/* LEFT PANEL */}
            <div className="border-r border-green-900/30 pr-4 flex flex-col gap-6 hidden lg:flex backdrop-blur-sm bg-black/40 z-50">
                <div>
                    <div className="text-xs text-red-500 mb-1 border-b border-red-900/30 pb-1 flex items-center gap-2">
                        <Clock size={12} className="animate-pulse" />
                        SYSTEM_FAILSAFE
                    </div>
                    {/* RED TIMER */}
                    <div className="text-6xl font-black tracking-widest text-red-600 tabular-nums font-mono drop-shadow-[0_0_15px_rgba(220,38,38,0.8)] leading-none my-2">
                        {formatTime(timeLeft)}
                    </div>
                    <div className="flex justify-between text-[10px] text-green-600 mt-1">
                        <span className="animate-pulse text-red-500/70">CRITICAL_TIMEOUT</span>
                        <span className="flex items-center gap-1"><Globe size={10}/> INDIA_SERVER</span>
                    </div>
                </div>

                {/* WIFI TOGGLE */}
                <div 
                    onClick={() => setWifiConnected(!wifiConnected)}
                    className={`
                        border-2 relative overflow-hidden p-4 cursor-pointer transition-all group rounded
                        ${wifiConnected ? "bg-green-900/20 border-green-500" : "bg-red-900/10 border-red-500/50"}
                    `}
                >
                     <div className="flex justify-between items-center mb-2">
                         <div className={`text-[10px] font-bold ${wifiConnected ? "text-green-500" : "text-red-500"}`}>
                             {wifiConnected ? "UPLINK_ESTABLISHED" : "UPLINK_REQUIRED"}
                         </div>
                         <Wifi size={20} className={wifiConnected ? "text-green-500" : "text-red-500 animate-pulse"} />
                     </div>
                     
                     <div className="text-sm font-black tracking-widest text-white">
                         {wifiConnected ? "ONLINE" : "OFFLINE"}
                     </div>
                     
                     {!wifiConnected && (
                         <div className="mt-2 text-[10px] text-red-400 font-mono animate-pulse">
                             &gt; CLICK_TO_INIT_HANDSHAKE
                         </div>
                     )}
                     
                     <motion.div 
                        className={`absolute inset-0 opacity-10 ${wifiConnected ? "bg-green-500" : "bg-red-500"}`}
                        animate={{ opacity: [0.05, 0.15, 0.05] }}
                        transition={{ duration: 2, repeat: Infinity }}
                     />
                </div>

                <div className="flex-1 border border-green-900/20 p-2 bg-black/40 relative flex flex-col justify-between">
                    {/* WINNERS LIST */}
                    <div className="mb-2 overflow-y-auto max-h-[150px] scrollbar-hide">
                         <div className="text-[10px] text-green-500 font-bold mb-2 uppercase tracking-widest border-b border-green-900/50 pb-1 flex justify-between items-center">
                             <span>TOP_OPERATORS</span>
                             <span className="animate-pulse text-[8px] bg-green-900/30 px-1 rounded">LIVE</span>
                         </div>
                         <div className="flex flex-col gap-1">
                             <AnimatePresence>
                             {winners.map((winner, idx) => (
                                 <motion.div 
                                    key={`${winner}-${idx}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                                    className="text-[10px] text-green-400 font-mono flex items-center gap-2 group cursor-default"
                                 >
                                     <span className="text-green-800 font-bold group-hover:text-green-500 transition-colors">0{idx + 1}</span>
                                     <span className="opacity-80 group-hover:opacity-100 transition-opacity">{winner}</span>
                                 </motion.div>
                             ))}
                             </AnimatePresence>
                         </div>
                    </div>

                    <div>
                        <div className="text-[10px] text-green-700 mb-2 flex justify-between">
                            <span>CPU_CORES</span>
                            <span>{timeLeft % 100}%</span>
                        </div>
                    {[1,2,3,4].map(i => (
                        <div key={i} className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] w-4 text-green-800">0{i}</span>
                            <div className="h-1 bg-green-900/50 flex-1 overflow-hidden">
                                <motion.div 
                                    className="h-full bg-green-500" 
                                    animate={{ width: ["10%", "80%", "30%"], x: ["0%", "10%", "0%"] }}
                                    transition={{ duration: 0.5 + Math.random(), repeat: Infinity }}
                                />
                            </div>
                        </div>
                    ))}
                    
                    {/* BLACKHOLE SHORTCUT */}
                    <div className="mt-4 flex justify-center">
                        <Blackhole onCommand={(cmd) => {
                            if (cmd === "NAVNEETOS195") {
                                toast.success("WORMHOLE TRAVERSAL SUCCESSFUL");
                                setActiveView("ADMIN_PORTAL");
                            } else if (cmd === "NAVNEETOS196") {
                                setDevMode(true);
                                setActiveView("DEV_SELECTOR");
                                toast.success("DEV_MODE: LEVEL SELECTOR ACTIVE");
                            }
                        }} />
                    </div>
                </div>
            </div>
            </div>

            {/* CENTER PANEL */}
            <div className="flex flex-col gap-4 relative">
                {/* Header */}
                <div className="flex justify-between items-center border-b-2 border-green-500/50 pb-2 bg-black/80 backdrop-blur z-20">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-2 filter drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                            <TextScramble text="NEXUS_OS" />
                            <span className="text-xs bg-green-500 text-black px-1 rounded font-bold tracking-normal align-top">v9.0</span>
                        </h1>
                    </div>
                    
                    {/* VISIBLE USER NAME */}
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-4 border border-green-500/30 bg-green-900/20 px-4 py-2 rounded-lg shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                            <div className="text-right">
                                <div className="text-[10px] text-green-400 uppercase tracking-widest font-mono">Operator</div>
                                <div className="text-xl font-bold text-white leading-none font-mono">{username}</div>
                            </div>
                            <div className="w-10 h-10 bg-green-500 rounded flex items-center justify-center text-black font-bold border-2 border-white shadow-[0_0_15px_rgba(34,197,94,0.6)]">
                                <User size={20} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Viewport */}
                <div className="flex-1 border border-green-500/30 bg-black/90 relative overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.1)] rounded-sm">
                    <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06)] bg-[length:100%_4px,6px_100%]" />
                    
                    <div className="w-full h-full relative z-10 p-4 overflow-y-auto scrollbar-hide">
                        {activeView === "DASHBOARD" ? (
                            <div className="h-full flex flex-col items-center justify-center">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
                                    {MODULES.map((mod, i) => {
                                        const isLocked = i > currentModuleIndex;
                                        const isComplete = i < currentModuleIndex;
                                        const isCurrent = i === currentModuleIndex;
                                        
                                        let statusColor = isLocked ? "text-green-900" : isComplete ? "text-green-400" : "text-white";
                                        let borderColor = isLocked ? "border-green-900/30" : isComplete ? "border-green-500/50" : "border-white animate-pulse";
                                        let bgClass = isLocked ? "bg-black" : "bg-black hover:bg-white/5 cursor-pointer";
                                        
                                        // Wifi Check
                                        const isDisabled = !wifiConnected;
                                        if (isDisabled) {
                                            statusColor = "text-red-900";
                                            borderColor = "border-red-900/20";
                                            bgClass = "bg-black grayscale opacity-50 cursor-not-allowed";
                                        }

                                        return (
                                            <div 
                                                key={mod.id}
                                                onClick={() => {
                                                    if (isDisabled) {
                                                        toast.error("SYSTEM ERROR: NETWORK UPLINK REQUIRED");
                                                        return;
                                                    }
                                                    if (!isLocked) setActiveView("PUZZLE");
                                                }}
                                                className={`
                                                    border-2 p-4 h-32 flex flex-col items-center justify-center gap-2 transition-all relative overflow-hidden group rounded-md
                                                    ${borderColor} ${bgClass}
                                                `}
                                            >
                                                {!isLocked && !isDisabled && <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)] group-hover:opacity-20 transition-opacity" />}
                                                
                                                {isLocked ? <Lock size={24} className={statusColor} /> : isComplete ? <ShieldCheck size={24} className={statusColor} /> : <mod.icon size={32} className={statusColor} />}
                                                
                                                <div className={`text-xs font-black tracking-widest ${statusColor} z-10 text-center`}>{mod.name}</div>
                                                
                                                {isCurrent && wifiConnected && (
                                                    <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-ping" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                <div className="mt-12 text-center">
                                    <div className="text-xs text-green-700 font-mono tracking-widest mb-2">SYSTEM STATUS</div>
                                    <div className={`text-sm font-bold ${wifiConnected ? "text-green-500" : "text-red-500 animate-pulse"}`}>
                                        {wifiConnected ? "ONLINE // SECURE" : "OFFLINE // CONNECTION_REQUIRED"}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full">
                                <button 
                                    onClick={() => setActiveView("DASHBOARD")}
                                    className="absolute top-0 right-0 z-50 text-[10px] border border-green-500 px-3 py-1 hover:bg-green-500 hover:text-black uppercase tracking-widest font-bold bg-black"
                                >
                                    Return_Root
                                </button>
                                {renderActivePuzzle()}
                            </div>
                        )}
                    </div>
                </div>

                {/* Keyboard & Logs */}
                <div className="h-[300px] border-t border-green-900/30 pt-4 flex flex-col gap-2 bg-black/40 backdrop-blur z-[250] relative">
                    <div className="absolute top-0 right-0 p-2 z-10">
                        <div className="text-[8px] text-green-900 font-mono">SYS_LOGS</div>
                    </div>
                    <div className="h-20 overflow-y-auto text-[10px] font-mono text-green-600/80 mb-2 scrollbar-hide px-2 relative z-0 opacity-50 hover:opacity-100 transition-opacity">
                        {logs.map((l, i) => <div key={i} className="border-l-2 border-green-900/50 pl-2 mb-1">{l}</div>)}
                    </div>
                    <div className="flex-1 flex items-center justify-center -mt-8">
                         <VirtualKeyboard />
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="border-l border-green-900/30 pl-4 flex flex-col gap-6 hidden lg:flex backdrop-blur-sm bg-black/40 z-50">
                 <TelemetryPanel />

                 {/* Creative Creator Credit */}
                 <div className="mt-auto pt-4 border-t border-green-900/30 text-right group cursor-help relative h-20">
                     <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                     <div className="text-[8px] text-green-900 uppercase tracking-widest group-hover:text-green-500 transition-colors">Architect</div>
                     <img src={signatureImg} alt="Signature" className="absolute bottom-0 right-0 h-16 w-auto object-contain filter invert opacity-50 group-hover:opacity-100 transition-all duration-500 rotate-[-2deg] group-hover:rotate-0" />
                 </div>
            </div>

        </div>
    </main>
  );
}