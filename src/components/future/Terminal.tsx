import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal as TerminalIcon, X, ChevronRight, HelpCircle, Minus } from "lucide-react";

interface TerminalProps {
  level: number;
  onCommand: (cmd: string) => void;
  logs: string[];
  hint: string;
}

export const Terminal = ({ level, onCommand, logs, hint }: TerminalProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onCommand(input.trim());
    setInput("");
  };

  return (
    <>
      {/* Minimized Trigger */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 right-4 z-50 bg-black/80 border border-green-500/50 text-green-500 p-3 rounded-full hover:bg-green-900/20 hover:shadow-[0_0_15px_rgba(0,255,0,0.3)] transition-all"
          >
            <TerminalIcon size={24} />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-black font-bold flex items-center justify-center animate-bounce">
                !
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Terminal Window - Draggable */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            drag
            dragMomentum={false}
            initial={{ opacity: 0, scale: 0.9, y: 20, x: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-20 right-4 w-[90vw] md:w-[450px] h-[350px] z-[60] bg-[#0c0c0c]/95 border border-green-500/30 rounded-lg shadow-2xl backdrop-blur-md flex flex-col overflow-hidden font-mono text-sm"
          >
            {/* Header */}
            <div className="bg-green-900/20 p-2 flex justify-between items-center border-b border-green-500/30 cursor-grab active:cursor-grabbing">
              <div className="flex items-center gap-2 text-green-500 pointer-events-none">
                <TerminalIcon size={14} />
                <span className="font-bold tracking-wider">ROOT_ACCESS // LVL_{level}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsOpen(false)} className="text-green-500/50 hover:text-green-500">
                  <Minus size={14} />
                </button>
              </div>
            </div>

            {/* Hint Area */}
            <div className="bg-green-900/10 p-3 border-b border-green-500/10 text-green-400 text-xs italic flex items-start gap-2 select-text">
                <HelpCircle size={14} className="shrink-0 mt-0.5" />
                <p>MISSION: {hint}</p>
            </div>

            {/* Logs Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-transparent select-text">
              {logs.map((log, i) => (
                <div key={i} className={`${log.startsWith(">") ? "text-cyan-300 font-bold mt-2" : "text-green-500/80"} break-words`}>
                  {log}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-2 bg-black/50 border-t border-green-500/30 flex items-center gap-2">
              <ChevronRight size={16} className="text-green-500 animate-pulse" />
              <input
                autoFocus
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter decryption key..."
                className="flex-1 bg-transparent border-none outline-none text-green-500 placeholder-green-500/30 font-bold"
                spellCheck={false}
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
