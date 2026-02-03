import React, { useRef, useEffect } from "react";

export const HyperSpace = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Star state
    const stars: { x: number, y: number, z: number, pz: number, color: string }[] = [];
    const numStars = 1500;
    
    const colors = ["#ffffff", "#ffe9c4", "#d4fbff"];

    const initStars = () => {
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * width - width / 2,
          y: Math.random() * height - height / 2,
          z: Math.random() * width,
          pz: 0,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
        stars[i].pz = stars[i].z;
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", resize);
    initStars();
    resize();

    const draw = () => {
      // Create trailing effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Speed is constant for a chill ride, or we could bind it again. 
      // Let's make it fast.
      const speed = 15;

      for (let i = 0; i < numStars; i++) {
        let star = stars[i];
        
        star.z -= speed;
        
        if (star.z <= 0) {
          star.z = width;
          star.pz = width;
          star.x = Math.random() * width - cx;
          star.y = Math.random() * height - cy;
        }

        const k = 128.0 / star.z;
        const px = star.x * k + cx;
        const py = star.y * k + cy;

        const pk = 128.0 / star.pz;
        const ppx = star.x * pk + cx;
        const ppy = star.y * pk + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height && star.z < width) {
          const size = (1 - star.z / width) * 2;
          
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(ppx, ppy);
          ctx.lineWidth = size;
          ctx.strokeStyle = star.color;
          ctx.stroke();
        }

        star.pz = star.z;
      }

      requestAnimationFrame(draw);
    };

    const frame = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 bg-black" />;
};
