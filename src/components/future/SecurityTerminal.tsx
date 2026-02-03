import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Unlock, Lock, AlertTriangle } from "lucide-react";

interface SecurityTerminalProps {
  onUnlock: () => void;
}

export const SecurityTerminal = ({ onUnlock }: SecurityTerminalProps) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [gameState, setGameState] = useState<"IDLE" | "SHOWING" | "PLAYING" | "SUCCESS" | "FAIL">("IDLE");
  const [level, setLevel] = useState(1);

  // Generate sequence
  const startParam = () => {
    const newSeq = [...sequence, Math.floor(Math.random() * 9)];
    setSequence(newSeq);
    setPlayerSequence([]);
    setGameState("SHOWING");
  };

  // Play sequence
  useEffect(() => {
    if (gameState === "SHOWING") {
      let i = 0;
      const interval = setInterval(() => {
        if (i >= sequence.length) {
          clearInterval(interval);
          setGameState("PLAYING");
          return;
        }
        // Flash the node (handled by index prop in render)
        // We trigger a custom event or just use a shared state for "activeNode"
        // Let's use a local visual state
        const nodeIndex = sequence[i];
        document.getElementById(`node-${nodeIndex}`)?.classList.add("active-node");
        setTimeout(() => {
          document.getElementById(`node-${nodeIndex}`)?.classList.remove("active-node");
        }, 300);
        
        i++;
      }, 600);
      return () => clearInterval(interval);
    }
  }, [gameState, sequence]);

  const handleNodeClick = (index: number) => {
    if (gameState !== "PLAYING") return;

    // Flash immediately
    document.getElementById(`node-${index}`)?.classList.add("active-node");
    setTimeout(() => {
        document.getElementById(`node-${index}`)?.classList.remove("active-node");
    }, 200);

    const newPlayerSeq = [...playerSequence, index];
    setPlayerSequence(newPlayerSeq);

    // Check correctness
    if (newPlayerSeq[newPlayerSeq.length - 1] !== sequence[newPlayerSeq.length - 1]) {
      setGameState("FAIL");
      setTimeout(() => {
        setSequence([]);
        setPlayerSequence([]);
        setGameState("IDLE");
        setLevel(1);
      }, 1500);
      return;
    }

    // Check completion
    if (newPlayerSeq.length === sequence.length) {
      if (level >= 3) {
        setGameState("SUCCESS");
        setTimeout(onUnlock, 1000);
      } else {
        setLevel(l => l + 1);
        setTimeout(startParam, 1000); // Start next level
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-md mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-mono text-cyan-500 mb-2 flex items-center justify-center gap-2">
          {gameState === "SUCCESS" ? <Unlock /> : <Lock />}
          SECURITY_LAYER_0{level}
        </h2>
        <p className="text-xs text-cyan-500/50 font-mono">
          {gameState === "IDLE" && "INITIATE_HANDSHAKE_PROTOCOL..."}
          {gameState === "SHOWING" && "RECEIVING_PATTERN..."}
          {gameState === "PLAYING" && "REPEAT_SEQUENCE..."}
          {gameState === "FAIL" && "PATTERN_MISMATCH. RESETTING..."}
          {gameState === "SUCCESS" && "ACCESS_GRANTED"}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8 relative">
        {/* Background glow for the grid */}
        <div className="absolute inset-0 bg-cyan-500/5 blur-3xl -z-10" />
        
        {[...Array(9)].map((_, i) => (
          <motion.button
            key={i}
            id={`node-${i}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNodeClick(i)}
            className={`
              w-20 h-20 rounded border border-cyan-500/30 bg-black/50 backdrop-blur-sm
              transition-all duration-200
              hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]
              focus:outline-none
              [&.active-node]:bg-cyan-500 [&.active-node]:shadow-[0_0_30px_rgba(0,255,255,0.8)] [&.active-node]:text-black
              flex items-center justify-center text-cyan-900/0 font-black text-2xl
            `}
          >
            {/* Inner detail */}
            <div className="w-2 h-2 rounded-full bg-cyan-500/20" />
          </motion.button>
        ))}
      </div>

      {gameState === "IDLE" && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.05, backgroundColor: "rgba(6,182,212,0.2)" }}
          onClick={startParam}
          className="px-8 py-3 border border-cyan-500 text-cyan-500 font-mono text-sm tracking-widest hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all rounded"
        >
          START_DECRYPTION
        </motion.button>
      )}

      {gameState === "FAIL" && (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 font-mono text-sm flex items-center gap-2 bg-red-900/20 px-4 py-2 rounded border border-red-500/20"
        >
            <AlertTriangle size={14} />
            NEURAL_LINK_SEVERED
        </motion.div>
      )}
    </div>
  );
};
