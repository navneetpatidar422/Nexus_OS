import React, { useEffect, useRef } from "react";

export const Wormhole = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const stars: {x: number, y: number, z: number, o: number}[] = [];
    const numStars = 2000;
    const speed = 20;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * width,
        o: Math.random()
      });
    }

    const draw = () => {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);
      
      const cx = width / 2;
      const cy = height / 2;

      for (let i = 0; i < numStars; i++) {
        const star = stars[i];
        star.z -= speed;

        if (star.z <= 0) {
           star.x = (Math.random() - 0.5) * width * 2;
           star.y = (Math.random() - 0.5) * height * 2;
           star.z = width;
           star.o = Math.random();
        }

        const x = (star.x / star.z) * width + cx;
        const y = (star.y / star.z) * height + cy;
        const size = (1 - star.z / width) * 5;
        
        // Draw trail
        const ox = (star.x / (star.z + speed * 2)) * width + cx;
        const oy = (star.y / (star.z + speed * 2)) * height + cy;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(ox, oy);
        ctx.strokeStyle = `rgba(0, 255, 255, ${star.o})`;
        ctx.lineWidth = size / 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, size/2, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
      }

      // Text Overlay
      ctx.fillStyle = "rgba(0, 255, 255, 0.1)";
      ctx.font = "200px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("∞", cx, cy);

      requestAnimationFrame(draw);
    };

    const interval = setInterval(draw, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
        <canvas ref={canvasRef} className="absolute inset-0" />
        <div className="relative z-10 text-center pointer-events-none">
            <h1 className="text-6xl font-black text-white mix-blend-difference mb-4 tracking-tighter animate-pulse">
                REALITY_BREACHED
            </h1>
            <p className="text-cyan-500 font-mono tracking-[1em]">WELCOME HOME</p>
        </div>
    </div>
  );
};
