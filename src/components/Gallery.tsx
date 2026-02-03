import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowRight } from "lucide-react";

interface ProjectProps {
  title: string;
  category: string;
  image: string;
  index: number;
}

const Project = ({ title, category, image, index }: ProjectProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="group relative cursor-pointer"
    >
      <div className="overflow-hidden rounded-2xl aspect-[4/3] mb-4 relative">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full"
        >
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
      </div>
      
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">{title}</h3>
          <p className="text-slate-500 text-sm">{category}</p>
        </div>
        <motion.div
          whileHover={{ x: 5 }}
          className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center text-white group-hover:border-purple-400 group-hover:bg-purple-400/10 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export const Gallery = () => {
  const projects = [
    {
      title: "Neon Horizon",
      category: "Immersive Web Experience",
      image: "https://images.unsplash.com/photo-1615511678275-bde5f97ecc17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwY3liZXJwdW5rJTIwY2l0eXxlbnwxfHx8fDE3NzAwNjQwNzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "Abstract Flow",
      category: "Brand Identity",
      image: "https://images.unsplash.com/photo-1673212815998-a6c519b96aae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbHVpZCUyMGFjcnlsaWMlMjBhcnR8ZW58MXx8fHwxNzcwMDY3OTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "Geometric Soul",
      category: "3D Motion Design",
      image: "https://images.unsplash.com/photo-1751644332113-2004a1b143f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMDNkJTIwY29sb3JmdWwlMjBzaGFwZXN8ZW58MXx8fHwxNzcwMDY3OTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "Minimal Space",
      category: "Architecture Visualization",
      image: "https://images.unsplash.com/photo-1665043548178-8e606eca11eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtaW5pbWFsJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3MDAxNjkxMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ];

  return (
    <section className="py-32 px-4 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-24">
        <h2 className="text-4xl md:text-6xl font-bold text-white max-w-xl">
          Selected Works <span className="text-purple-500">.</span>
        </h2>
        <p className="text-slate-400 mt-6 md:mt-0 max-w-sm">
          A collection of projects where design meets technology in perfect harmony.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-y-24">
        {projects.map((project, i) => (
          <div key={i} className={i % 2 === 1 ? "md:mt-24" : ""}>
            <Project {...project} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
};
