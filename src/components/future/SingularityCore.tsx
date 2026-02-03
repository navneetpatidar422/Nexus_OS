import React, { useEffect, useRef } from "react";

export const SingularityCore = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let time = 0;
    
    // Mouse interaction
    let mouseX = width / 2;
    let mouseY = height / 2;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMove);
    resize();

    const particles: {x: number, y: number, r: number, a: number, s: number}[] = [];
    const numParticles = 200;

    for(let i=0; i<numParticles; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 2 + 0.5,
            a: Math.random() * Math.PI * 2,
            s: Math.random() * 0.02 + 0.005
        });
    }

    const draw = () => {
      ctx.fillStyle = "rgba(5, 5, 10, 0.1)"; // Deep fade
      ctx.fillRect(0, 0, width, height);

      time += 0.01;
      
      const cx = width / 2;
      const cy = height / 2;

      // Draw grid
      ctx.strokeStyle = "rgba(0, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      const gridSize = 50;
      
      // Perspective Grid Effect
      // We'll just draw a flat grid that warps near mouse
      
      // Update particles to swirl around mouse
      particles.forEach(p => {
          // Distance to mouse
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          // Orbital velocity
          const force = 1000 / (dist + 100);
          
          p.a += p.s + force * 0.001;
          
          // Move towards mouse slightly (gravity)
          p.x += Math.cos(p.a) * 2 + dx * 0.01;
          p.y += Math.sin(p.a) * 2 + dy * 0.01;
          
          // Reset if too close or far
          if (dist < 10) {
              p.x = Math.random() * width;
              p.y = Math.random() * height;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 255, 255, ${Math.min(1, 100/dist)})`;
          ctx.fill();
          
          // Connections
          if (dist < 150) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(mouseX, mouseY);
              ctx.strokeStyle = `rgba(0, 255, 255, ${0.2 - dist/1000})`;
              ctx.stroke();
          }
      });

      // Draw "Core" at mouse
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 20 + Math.sin(time * 10) * 2, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.shadowBlur = 20;
      ctx.shadowColor = "cyan";
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Rings
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 40 + Math.cos(time * 5) * 5, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0, 255, 255, 0.5)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 60 + Math.sin(time * 3) * 10, time, time + Math.PI);
      ctx.strokeStyle = "rgba(255, 0, 255, 0.5)";
      ctx.stroke();

      requestAnimationFrame(draw);
    };

    const frame = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 bg-[#05050a]" />;
};
