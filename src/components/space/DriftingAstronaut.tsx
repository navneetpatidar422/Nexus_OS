import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue, useTransform, useVelocity, AnimatePresence } from "motion/react";

const ParachuteSVG = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
    {/* Cords */}
    <path d="M20,80 L100,180 M180,80 L100,180 M60,80 L100,180 M140,80 L100,180" stroke="white" strokeWidth="1" opacity="0.5" />
    {/* Canopy */}
    <path d="M10,80 Q100,-20 190,80" fill="none" stroke="white" strokeWidth="2" />
    <path d="M10,80 Q100,10 190,80" fill="rgba(255,255,255,0.1)" stroke="none" />
    <path d="M10,80 Q50,30 100,30 T190,80" fill="none" stroke="white" strokeWidth="1" strokeDasharray="5 5" opacity="0.5" />
  </svg>
);

export const DriftingAstronaut = () => {
  const [landingPhase, setLandingPhase] = useState(true);
  
  // Mouse position trackers
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);

  // Physics values
  const x = useSpring(mouseX, { damping: 50, stiffness: 400, mass: 1 }); // Responsive spring for mouse tracking
  const y = useSpring(mouseY, { damping: 50, stiffness: 400, mass: 1 });

  // Astronaut specific physics (lagging behind cursor)
  const astroX = useSpring(x, { damping: 20, stiffness: 50, mass: 5 }); // Heavy lag
  const astroY = useSpring(y, { damping: 20, stiffness: 50, mass: 5 });

  const velocityX = useVelocity(astroX);
  const rotate = useTransform(velocityX, [-1000, 1000], [30, -30]);
  const thrusterOpacity = useTransform(velocityX, (v) => Math.min(Math.abs(v) / 500, 1));

  useEffect(() => {
    // Override initial position for landing
    astroY.set(-500); 
    
    // Simulate drop
    const dropTimer = setTimeout(() => {
        astroY.set(window.innerHeight / 2);
    }, 100);

    const landTimer = setTimeout(() => {
        setLandingPhase(false);
    }, 2500);

    const handleMove = (e: MouseEvent) => {
      if (!landingPhase) {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      }
    };

    window.addEventListener("mousemove", handleMove);
    return () => {
        window.removeEventListener("mousemove", handleMove);
        clearTimeout(dropTimer);
        clearTimeout(landTimer);
    };
  }, [landingPhase]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <motion.div
        style={{ 
          x: astroX, 
          y: astroY,
          rotate: landingPhase ? 0 : rotate
        }}
        className="absolute w-64 h-64 -ml-32 -mt-32 flex flex-col items-center justify-center"
      >
        <AnimatePresence>
            {landingPhase && (
                <motion.div 
                    initial={{ opacity: 0, y: 50, scale: 0.5 }}
                    animate={{ opacity: 1, y: -100, scale: 1.5 }}
                    exit={{ opacity: 0, y: -200, scale: 0.5 }}
                    transition={{ duration: 1 }}
                    className="absolute bottom-full w-64 h-64"
                >
                    <ParachuteSVG />
                </motion.div>
            )}
        </AnimatePresence>

        <div className="relative w-48 h-48">
            <img 
                src="https://images.unsplash.com/photo-1768005419000-d53e45851b50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc3Ryb25hdXQlMjBmbG9hdGluZyUyMGluJTIwZGVlcCUyMHNwYWNlfGVufDF8fHx8MTc3MDA2ODc5MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
                alt="Astronaut"
                className="w-full h-full object-contain mix-blend-screen filter contrast-125 brightness-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            />
            
            {/* Thruster flare */}
            {!landingPhase && (
                <motion.div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-cyan-500/20 blur-2xl rounded-full -z-10"
                    style={{ opacity: thrusterOpacity }}
                />
            )}
        </div>
      </motion.div>
    </div>
  );
};
