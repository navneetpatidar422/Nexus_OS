import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

interface BootSequenceProps {
  onComplete: (name: string) => void;
}

export const BootSequence = ({ onComplete }: BootSequenceProps) => {
  const [stage, setStage] = useState<"BIOS" | "KERNEL" | "TYPING" | "READY" | "NAME_PROMPT" | "NAME_INPUT">("BIOS");
  const [lines, setLines] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Real-ish Backend Boot Logs
  const BIOS_LOGS = [
      "ACPI: Core revision 2026.1",
      "PCI: Probing PCI hardware",
      "PCI: Auxiliary System [8086:9c3a] detected",
      "SCSI subsystem initialized",
      "libata version 3.00 loaded.",
      "usbcore: registered new interface driver usbfs",
      "usbcore: registered new interface driver hub",
      "usbcore: registered new interface driver device",
      "Bluetooth: Core ver 2.22",
      "NET: Registered protocol family 2",
      "IP route cache hash table entries: 32768 (order: 5, 131072 bytes)",
      "TCP established hash table entries: 131072 (order: 8, 1048576 bytes)",
      "TCP bind hash table entries: 65536 (order: 7, 524288 bytes)",
      "TCP: Hash tables configured (established 131072 bind 65536)",
      "NET: Registered protocol family 1",
      "NET: Registered protocol family 17",
      "VFS: Disk quotas dquot_6.6.0",
      "io scheduler noop registered",
      "io scheduler deadline registered",
      "io scheduler cfq registered (default)",
      "Serial: 8250/16550 driver, 4 ports, IRQ sharing enabled",
      "brd: module loaded",
      "loop: module loaded",
      "NEXUS_OS: Integrity Check... OK",
      "NEXUS_OS: Mounting Root Filesystem...",
  ];

  // Stage 1: BIOS Post (Fast scrolling text)
  useEffect(() => {
    if (stage !== "BIOS") return;

    let i = 0;
    const interval = setInterval(() => {
        if (i >= BIOS_LOGS.length) {
            clearInterval(interval);
            setStage("KERNEL");
        } else {
            setLines(p => [...p, BIOS_LOGS[i]]);
            if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            i++;
        }
    }, 20); // Fast scroll

    return () => clearInterval(interval);
  }, [stage]);

  // Stage 2: Kernel Load (The Bar)
  const [loadPercent, setLoadPercent] = useState(0);
  useEffect(() => {
      if (stage !== "KERNEL") return;
      
      const interval = setInterval(() => {
          setLoadPercent(prev => {
              const increment = Math.random() * 5;
              const next = prev + increment;
              if (next >= 100) {
                  clearInterval(interval);
                  setStage("TYPING");
                  return 100;
              }
              return next;
          });
      }, 50);
      return () => clearInterval(interval);
  }, [stage]);

  // Stage 3: Typing Instructions
  useEffect(() => {
    if (stage !== "TYPING") return;

    const bootText = [
      " ",
      "SYSTEM_READY.",
      "USER_INTERVENTION_REQUIRED.",
      "INITIATE_HANDSHAKE_PROTOCOL...",
      " ",
      "TYPE 'INIT' TO START."
    ];

    let currentLine = 0;
    const typeLine = () => {
        if (currentLine >= bootText.length) {
            setStage("READY");
            setTimeout(() => inputRef.current?.focus(), 100);
            return;
        }
        setLines(prev => [...prev, bootText[currentLine]]);
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        currentLine++;
        setTimeout(typeLine, 300);
    };

    typeLine();
  }, [stage]);

  // Stage 5: Name Prompt
  useEffect(() => {
      if (stage !== "NAME_PROMPT") return;
      setLines(prev => [...prev, " ", "IDENTITY_REQUIRED.", "ENTER_OPERATOR_NAME:"]);
      setStage("NAME_INPUT");
      setInput("");
      setTimeout(() => inputRef.current?.focus(), 100);
  }, [stage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (stage === "READY") {
        if (input.toUpperCase().trim() === "INIT") {
            setLines(prev => [...prev, "> EXEC_INIT", "INITIALIZING..."]);
            setStage("NAME_PROMPT");
        } else {
            setLines(prev => [...prev, `> ${input}`, "ERR: KERNEL_PANIC. TRY 'INIT'."]);
            setInput("");
        }
    } else if (stage === "NAME_INPUT") {
        if (input.trim().length > 0) {
            setLines(prev => [...prev, `> ${input.toUpperCase()}`, "IDENTITY_VERIFIED.", "ACCESS_GRANTED."]);
            const name = input.toUpperCase();
            setTimeout(() => onComplete(name), 1000);
        } else {
             setLines(prev => [...prev, "ERR: IDENTITY_NULL."]);
        }
    }

    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] font-mono text-xs md:text-sm text-slate-300 overflow-hidden flex flex-col p-4 md:p-12 selection:bg-white selection:text-black cursor-text">
      
      {/* CRT Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))]" style={{ backgroundSize: "100% 2px, 3px 100%" }} />
      <div className="absolute inset-0 pointer-events-none z-50 opacity-20 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

      {/* Main Console Area */}
      <div className="max-w-4xl w-full mx-auto h-full flex flex-col">
          
          {/* Header */}
          <div className="mb-4 text-slate-500 border-b border-slate-800 pb-2 flex justify-between">
              <span>NEXUS_BIOS v9.0</span>
              <span>MEM: 64MB OK</span>
          </div>

          {/* Logs */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide font-mono pb-8 text-green-500/80">
                {lines.map((line, i) => {
                    if (!line) return null;
                    return (
                        <div key={i} className="mb-0.5 break-words">
                            {line.startsWith(">") ? <span className="text-white font-bold">{line}</span> : line}
                        </div>
                    );
                })}

                {/* The "Real" Loading Bar */}
                {stage === "KERNEL" && (
                    <div className="mt-4 mb-4">
                        <div className="mb-1 text-white">LOADING_KERNEL_MODULES...</div>
                        <div className="w-full h-4 bg-slate-900 border border-slate-700 p-0.5">
                            <motion.div 
                                className="h-full bg-white"
                                style={{ width: `${loadPercent}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>/usr/bin/nexus_core</span>
                            <span>{Math.round(loadPercent)}%</span>
                        </div>
                    </div>
                )}

                {/* Input Prompt */}
                {(stage === "READY" || stage === "NAME_INPUT") && (
                    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-4 opacity-100">
                        <span className="text-white font-bold animate-pulse">{">"}</span>
                        <input 
                            ref={inputRef}
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="bg-transparent border-none outline-none text-white w-full uppercase font-bold"
                            autoFocus
                            spellCheck={false}
                            placeholder={stage === "READY" ? "AWAITING_COMMAND..." : "ENTER_NAME..."}
                        />
                        <div className="w-2 h-4 bg-white animate-pulse" />
                    </form>
                )}
          </div>
      </div>
    </div>
  );
};
