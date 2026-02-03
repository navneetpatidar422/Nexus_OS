import React, { useState } from "react";
import { motion } from "motion/react";
import { ShieldCheck, Fingerprint, Cpu, Award, Download } from "lucide-react";
import { toast } from "sonner";
import signatureImg from "figma:asset/3d887c48f9d3441569c54e1069cb7c8434a713d0.png";

export const Certificate = ({ username }: { username: string }) => {
    const [id] = useState(Math.random().toString(36).substring(2, 10).toUpperCase());
    const [date] = useState(new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: '2-digit' }).toUpperCase());

    const handleDownload = () => {
        // html2canvas fails with modern Tailwind colors (oklab/oklch), so we use native print
        // which allows saving as PDF or printing directly.
        window.print();
        toast.success("ARTIFACT READY FOR OUTPUT");
    };

    return (
        <div className="w-full h-full flex items-center justify-center p-4 bg-black relative overflow-hidden print:bg-white print:p-0 print:overflow-visible">
            {/* Background Effects (Hidden in Print) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)] print:hidden" />
            <div className="absolute top-0 left-0 w-full h-1 bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)] print:hidden" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)] print:hidden" />

            <motion.div 
                initial={{ scale: 0.9, opacity: 0, filter: "blur(10px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1 }}
                id="nexus-certificate"
                className="relative w-full max-w-4xl aspect-[1.6/1] bg-black border-2 border-green-500/50 p-8 flex flex-col justify-between shadow-[0_0_50px_rgba(34,197,94,0.2)] print:border-4 print:border-black print:shadow-none print:text-black print:bg-white print:aspect-auto print:h-full print:max-w-none"
            >
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-green-500 print:border-black" />
                <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-green-500 print:border-black" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-green-500 print:border-black" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-green-500 print:border-black" />

                {/* Header */}
                <div className="flex justify-between items-start border-b border-green-900/50 pb-6 print:border-black">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-green-900/20 rounded border border-green-500 flex items-center justify-center print:border-black print:bg-transparent">
                            <ShieldCheck size={40} className="text-green-500 print:text-black" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-widest font-[Orbitron,sans-serif] print:text-black">NEXUS OS</h1>
                            <div className="text-sm text-green-600 tracking-[0.5em] font-mono print:text-black">CERTIFICATION_PROTOCOL</div>
                        </div>
                    </div>
                    <div className="text-right font-mono text-green-800 print:text-black">
                        <div className="text-xs">SERIAL_NO</div>
                        <div className="text-xl text-green-500 print:text-black">{id}</div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 py-8">
                    <div className="text-green-700 tracking-widest text-sm font-mono print:text-black">THIS CERTIFIES THAT</div>
                    
                    <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-200 to-green-500 filter drop-shadow-[0_0_10px_rgba(34,197,94,0.5)] font-[Orbitron,sans-serif] uppercase print:text-black print:filter-none print:bg-none"
                    >
                        {username}
                    </motion.div>

                    <div className="text-green-700 tracking-widest text-sm font-mono max-w-xl leading-relaxed print:text-black">
                        HAS SUCCESSFULLY NAVIGATED THE DECEPTIVE LAYERS OF THE NEXUS INTERFACE, 
                        DEMONSTRATING EXCEPTIONAL LOGIC, PATIENCE, AND META-COGNITIVE ADAPTABILITY.
                    </div>

                    <div className="flex gap-8 mt-8">
                        <div className="flex flex-col items-center gap-2">
                            <Cpu size={24} className="text-green-500 print:text-black" />
                            <span className="text-[10px] text-green-600 print:text-black">LOGIC_CORE</span>
                            <span className="text-white font-bold print:text-black">100%</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Fingerprint size={24} className="text-green-500 print:text-black" />
                            <span className="text-[10px] text-green-600 print:text-black">IDENTITY</span>
                            <span className="text-white font-bold print:text-black">VERIFIED</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Award size={24} className="text-green-500 print:text-black" />
                            <span className="text-[10px] text-green-600 print:text-black">RANK</span>
                            <span className="text-white font-bold print:text-black">ARCHITECT</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-end border-t border-green-900/50 pt-6 print:border-black">
                    <div className="text-xs text-green-800 font-mono print:text-black">
                        <div>DATE_ISSUED: {date}</div>
                        <div>ORIGIN: INDIA_SERVER_PRIME</div>
                    </div>
                    
                    <div className="text-right">
                        <div className="h-16 relative">
                            <img src={signatureImg} alt="Signature" className="h-full w-auto object-contain filter invert opacity-90 print:invert-0" />
                        </div>
                        <div className="text-[10px] text-green-600 uppercase tracking-widest border-t border-green-900/50 pt-1 mt-1 print:border-black print:text-black">
                            System Architect
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Actions */}
            <div className="absolute bottom-8 flex gap-4 print:hidden">
                <button onClick={handleDownload} className="flex items-center gap-2 bg-green-900/20 hover:bg-green-500 hover:text-black text-green-500 border border-green-500 px-6 py-3 rounded transition-all">
                    <Download size={18} />
                    PRINT_ARTIFACT
                </button>
            </div>
        </div>
    );
};
