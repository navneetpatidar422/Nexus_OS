import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Lock,
  UserCheck,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

interface AdminPortalProps {
  username: string;
  onUnlock: () => void; // This will now typically lead to the Certificate
}

export const AdminPortal = ({
  username,
  onUnlock,
}: AdminPortalProps) => {
  const [step, setStep] = useState<
    "LOCKED" | "IDENTIFY" | "GRANTED"
  >("LOCKED");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleIdentify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Suspense delay
    setTimeout(() => {
      if (
        input.trim().toLowerCase() ===
        username.trim().toLowerCase()
      ) {
        setStep("GRANTED");
        toast.success("IDENTITY VERIFIED");
      } else {
        setLoading(false);
        toast.error("ACCESS DENIED: IDENTITY MISMATCH");
        setInput("");
      }
    }, 2000);
  };

  if (step === "GRANTED") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black text-green-500 font-mono">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex flex-col items-center"
        >
          <UserCheck
            size={80}
            className="mb-6 text-green-400"
          />
          <h1 className="text-4xl font-black tracking-widest mb-2 text-center text-white">
            ACCESS GRANTED
          </h1>
          <p className="text-sm text-green-600 mb-8 tracking-[0.5em]">
            WELCOME HOME, ARCHITECT
          </p>

          <button
            onClick={onUnlock}
            className="group relative px-8 py-4 bg-green-900/20 border border-green-500 hover:bg-green-500 hover:text-black transition-all overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2 font-bold tracking-widest">
              REVEAL CERTIFICATE <ArrowRight size={16} />
            </span>
            <motion.div
              className="absolute inset-0 bg-green-400"
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%" }}
              transition={{ type: "tween" }}
            />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black relative flex items-center justify-center p-4 overflow-hidden">
      {/* Matrix Rain / Cyber Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-green-500 to-transparent animate-[drop_3s_infinite]" />
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-green-500 to-transparent animate-[drop_5s_infinite_1s]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md border border-green-900 bg-black/80 backdrop-blur p-8 relative shadow-[0_0_50px_rgba(0,0,0,0.8)]"
      >
        <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-green-500" />
        <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-green-500" />

        <div className="flex flex-col items-center mb-8">
          <ShieldAlert
            size={48}
            className="text-red-500 mb-4 animate-pulse"
          />
          <h2 className="text-2xl font-bold text-red-500 tracking-widest">
            RESTRICTED AREA
          </h2>
          <div className="text-[10px] text-red-800 font-mono mt-1">
            LEVEL 5 SECURITY CLEARANCE REQUIRED
          </div>
        </div>

        <form
          onSubmit={handleIdentify}
          className="flex flex-col gap-6"
        >
          <div className="space-y-2">
            <label className="text-xs text-green-700 font-mono tracking-widest">
              IDENTIFY YOURSELF
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="w-full bg-black border-b-2 border-green-900 focus:border-green-500 text-green-500 p-2 outline-none text-center text-xl font-bold tracking-widest placeholder:text-green-900/30 uppercase"
              placeholder="WHO ARE YOU?"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-red-900/10 border border-red-900/50 text-red-500 hover:bg-red-500 hover:text-black transition-all font-mono font-bold tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "VERIFYING BIOMETRICS..."
              : "AUTHENTICATE"}
          </button>
        </form>

        <div className="mt-6 text-center text-[10px] text-green-900 font-mono">
          SESSION_ID:{" "}
          {Math.random()
            .toString(16)
            .slice(2, 10)
            .toUpperCase()}
          <br />
          IP_ORIGIN: INDIA_SECURE_NODE
        </div>
      </motion.div>
    </div>
  );
};