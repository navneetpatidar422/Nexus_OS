import React, { useEffect, useRef } from "react";

export const HypnoTunnel = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const draw = () => {
      time += 0.02;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // Trails
      ctx.fillRect(0, 0, w, h);

      const maxRadius = Math.sqrt(cx * cx + cy * cy);
      
      for (let i = 0; i < 20; i++) {
        const angle = time + i * 0.5;
        const radius = (time * 100 + i * 50) % maxRadius;
        
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsl(${(time * 50 + i * 20) % 360}, 100%, 50%)`;
        ctx.lineWidth = 5 + i;
        ctx.stroke();

        // Extra chaos lines
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(
          cx + Math.cos(angle) * radius,
          cy + Math.sin(angle) * radius
        );
        ctx.strokeStyle = `hsla(${(time * 100) % 360}, 100%, 50%, 0.5)`;
        ctx.stroke();
      }

      requestAnimationFrame(draw);
    };

    const frame = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};
