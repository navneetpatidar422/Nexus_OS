import React from "react";
import { motion } from "motion/react";

export const GlitchText = ({ text }: { text: string }) => {
  return (
    <div className="relative inline-block group">
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -ml-0.5 text-red-500 opacity-0 group-hover:opacity-70 animate-pulse">
        {text}
      </span>
      <span className="absolute top-0 left-0 ml-0.5 text-blue-500 opacity-0 group-hover:opacity-70 animate-pulse delay-75">
        {text}
      </span>
    </div>
  );
};
