import React, { useEffect, useRef } from "react";

export const NoiseBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    resize();

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      
      const idata = ctx.createImageData(w, h);
      const buffer32 = new Uint32Array(idata.data.buffer);
      const len = buffer32.length;

      for (let i = 0; i < len; i++) {
        if (Math.random() < 0.1) {
          // Random colored noise
          buffer32[i] = 0xff000000 | (Math.random() * 0xffffff);
        } else if (Math.random() < 0.05) {
           // White specs
           buffer32[i] = 0xffffffff;
        } else {
           // Transparent mostly
           buffer32[i] = 0x00000000;
        }
      }

      ctx.putImageData(idata, 0, 0);
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none opacity-20 mix-blend-screen"
    />
  );
};
