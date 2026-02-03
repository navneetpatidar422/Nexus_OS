import React, { useEffect, useRef } from "react";

export const WarpGrid = ({ active }: { active: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let time = 0;
    
    // Grid settings
    const gridSize = 40;
    const points: {x: number, y: number, ox: number, oy: number}[] = [];
    
    // Mouse interaction
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetX = mouseX;
    let targetY = mouseY;

    const initPoints = () => {
      points.length = 0;
      for (let x = 0; x <= width + gridSize; x += gridSize) {
        for (let y = 0; y <= height + gridSize; y += gridSize) {
          points.push({ x, y, ox: x, oy: y });
        }
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initPoints();
    };

    const handleMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMove);
    resize();

    const draw = () => {
      // Smooth mouse
      mouseX += (targetX - mouseX) * 0.1;
      mouseY += (targetY - mouseY) * 0.1;

      // Fade effect
      ctx.fillStyle = active ? "rgba(5, 5, 10, 0.3)" : "rgba(5, 5, 10, 0.1)"; 
      ctx.fillRect(0, 0, width, height);

      time += active ? 0.05 : 0.01;

      // Update points
      ctx.strokeStyle = active ? "rgba(0, 255, 255, 0.3)" : "rgba(0, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      
      const waveHeight = active ? 20 : 5;

      points.forEach(p => {
        // Distance to mouse (Warp effect)
        const dx = p.ox - mouseX;
        const dy = p.oy - mouseY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const maxDist = 300;
        
        let shiftX = 0;
        let shiftY = 0;

        if (dist < maxDist) {
            const force = (1 - dist / maxDist) * (active ? -50 : 20); // Push or Pull
            const angle = Math.atan2(dy, dx);
            shiftX = Math.cos(angle) * force;
            shiftY = Math.sin(angle) * force;
        }

        // Sine wave drift
        const wave = Math.sin(dist * 0.01 - time) * waveHeight;
        
        p.x = p.ox + shiftX;
        p.y = p.oy + shiftY + wave;
      });

      // Draw Lines
      // We'll draw only horizontal lines for the "retro" feel, or both for grid
      // Drawing horizontal
      ctx.beginPath();
      for (let i = 0; i < points.length; i++) {
          const p = points[i];
          // Check if right neighbor exists (same row)
          if (i + 1 < points.length && points[i+1].ox > p.ox) {
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(points[i+1].x, points[i+1].y);
          }
          // Check if bottom neighbor exists
          // This is tricky with a flat array. Let's skip vertical lines for performance/style 
          // or calculate index.
          // Let's keep it abstract - dots and horizontal lines
      }
      ctx.stroke();

      // Draw Dots
      ctx.fillStyle = active ? "#00ffff" : "#005555";
      points.forEach(p => {
          if (Math.random() > 0.95) { // Glitchy flicker
             ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
          }
      });

      requestAnimationFrame(draw);
    };

    const frame = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(frame);
    };
  }, [active]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};
