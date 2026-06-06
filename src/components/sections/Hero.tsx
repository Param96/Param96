"use client";

import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import { ArrowRight, Terminal } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative flex flex-col h-screen w-full justify-center items-center px-4 overflow-hidden mt-[-50px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center justify-center w-full max-w-5xl z-10"
      >
        <div className="glass px-6 py-2 rounded-full mb-6 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.2)] flex items-center gap-2">
          <Terminal size={16} className="text-primary" />
          <span className="text-sm text-cyan-50 tracking-wider">SYSTEM.INITIALIZE()</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-center tracking-tighter mb-4">
          Hi, I&apos;m <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Param</span>
        </h1>

        <div className="text-2xl md:text-4xl font-medium text-gray-300 h-[60px] flex items-center justify-center text-center">
          <Typewriter
            options={{
              strings: [
                "AI Engineer",
                "Agentic AI Builder",
                "ML Researcher",
                "Founder & President of E-Cell",
              ],
              autoStart: true,
              loop: true,
              deleteSpeed: 50,
              delay: 80,
              wrapperClassName: "glow-text",
            }}
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-6 text-gray-400 max-w-2xl text-center text-lg md:text-xl"
        >
          Building full-stack applications while experimenting with AI/ML integrations and real-world use cases. I prefer building things that work over talking about things that might.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 mt-10"
        >
          <a href="#projects" className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-bold text-black transition-all duration-200 bg-primary font-pj rounded-xl hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)]">
            View Projects
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#connect" className="glass relative inline-flex items-center justify-center px-8 py-3 text-base font-bold text-white transition-all duration-200 rounded-xl hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 border border-white/20 hover:border-primary/50">
            Connect
          </a>
        </motion.div>
      </motion.div>

      {/* Cyberpunk decor elements */}
      <div className="absolute bottom-10 left-10 hidden md:block">
        <div className="flex flex-col gap-2 opacity-50">
          <div className="w-1 h-16 bg-gradient-to-b from-primary to-transparent"></div>
          <div className="w-1 h-2 bg-primary"></div>
          <div className="w-1 h-2 bg-primary"></div>
        </div>
      </div>

      <div className="absolute top-32 right-10 hidden md:block font-mono text-xs text-primary/40 text-right">
        <div>SYS_STATUS: ONLINE</div>
        <div>MEM: 64.2TB</div>
        <div>NET: CONNECTED</div>
        <div className="mt-2 text-secondary/40">INITIALIZING NEURAL NET...</div>
      </div>
    </section>
  );
};