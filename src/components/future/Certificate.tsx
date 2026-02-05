import React, { useState } from "react";
import { motion } from "motion/react";
import { Fingerprint, Download } from "lucide-react";
import { toast } from "sonner";
import signatureImg from "figma:asset/3d887c48f9d3441569c54e1069cb7c8434a713d0.png";

export const Certificate = ({ username }: { username: string }) => {
    const ADMIN_KEY = "NAVNEETOS195";

    const [date] = useState(
        new Date()
            .toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
            })
            .toUpperCase()
    );

    const handleDownload = () => {
        window.print();
        toast.success("ARTIFACT READY FOR OUTPUT");
    };

    return (
        <div className="w-full h-full flex items-center justify-center p-4 bg-black relative overflow-hidden print:bg-white print:p-0 print:overflow-visible">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)] print:hidden" />
            <div className="absolute top-0 left-0 w-full h-1 bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)] print:hidden" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)] print:hidden" />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, filter: "blur(10px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1 }}
                className="relative w-full max-w-4xl aspect-[1.6/1] bg-black border-2 border-green-500/50 p-8 flex flex-col justify-between shadow-[0_0_50px_rgba(34,197,94,0.2)] print:border-4 print:border-black print:shadow-none print:text-black print:bg-white print:h-full print:max-w-none"
            >
                {/* Header */}
                <div className="flex justify-between items-start border-b border-green-900/50 pb-6 print:border-black">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-green-900/20 rounded border border-green-500 flex items-center justify-center print:border-black">
                            <Fingerprint size={40} className="text-green-500 print:text-black" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-widest font-[Orbitron,sans-serif] print:text-black">
                                NEXUS_OS // SYSTEM CORE
                            </h1>
                            <div className="text-sm text-green-600 tracking-[0.5em] font-mono print:text-black">
                                ADMIN ACCESS VERIFIED
                            </div>
                        </div>
                    </div>

                    <div className="text-right font-mono text-green-800 print:text-black">
                        <div className="text-xs">ADMIN_KEY</div>
                        <div className="text-xl text-green-500 print:text-black">
                            {ADMIN_KEY}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 py-8">
                    <div className="text-green-700 tracking-widest text-sm font-mono print:text-black">
                        SYSTEM ACKNOWLEDGES THAT SUBJECT:
                    </div>

                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-200 to-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.45)] font-[Orbitron,sans-serif] uppercase print:text-black print:bg-none"
                    >
                        {username}
                    </motion.div>

                    <div className="text-green-700 tracking-widest text-sm font-mono max-w-xl leading-relaxed print:text-black">
                        SUCCESSFULLY BREACHED SECURITY PROTOCOLS AND IS GRANTED ROOT PRIVILEGES.
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-end border-t border-green-900/50 pt-6 print:border-black">
                    <div className="text-xs text-green-800 font-mono print:text-black">
                        <div>DATE_ISSUED: {date}</div>
                        <div>THIS OUTPUT WAS NOT GENERATED. IT WAS REACHED.</div>
                    </div>

                    <div className="text-right">
                        <div className="h-16">
                            <img src={signatureImg} alt="Signature" className="h-full w-auto object-contain opacity-90" />
                        </div>
                        <div className="text-[10px] text-green-600 uppercase tracking-widest border-t border-green-900/50 pt-1 mt-1 print:text-black">
                            System Architect
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Action */}
            <div className="absolute bottom-8 print:hidden">
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-green-900/20 hover:bg-green-500 hover:text-black text-green-500 border border-green-500 px-6 py-3 rounded transition-all"
                >
                    <Download size={18} />
                    PRINT_ARTIFACT
                </button>
            </div>
        </div>
    );
};
