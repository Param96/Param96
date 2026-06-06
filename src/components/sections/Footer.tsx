"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Terminal as TerminalIcon, X } from "lucide-react";
import { Icon } from '@iconify/react';

export const Footer = () => {
  const [showTerminal, setShowTerminal] = useState(false);
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState<string[]>(["SYSTEM READY. Type 'help' to see available commands."]);

  const currentYear = new Date().getFullYear();

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const newOutput = [...output, `> ${command}`];

      switch (command.toLowerCase().trim()) {
        case "help":
          newOutput.push("Available commands: help, about, clear, sudo rm -rf /");
          break;
        case "about":
          newOutput.push("Param - AI Engineer & Founder. Building the future.");
          break;
        case "clear":
          setOutput([]);
          setCommand("");
          return;
        case "sudo rm -rf /":
          newOutput.push("Nice try. Access Denied.");
          break;
        case "ai":
        case "init ai":
          newOutput.push("Initializing Artificial General Intelligence... ERROR: Hardware limitations detected.");
          break;
        default:
          newOutput.push(`Command not found: ${command}`);
      }

      setOutput(newOutput);
      setCommand("");
    }
  };

  return (
    <footer id="connect" className="relative w-full py-10 mt-20 border-t border-white/10 z-10 bg-black/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Param
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            AI Engineer • Founder • Researcher
          </p>
        </div>

        <div className="flex gap-4">
          <a href="https://github.com/Param96" target="_blank" rel="noreferrer" className="p-3 glass rounded-full hover:border-primary/50 hover:text-primary transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <Icon icon="mdi:github" className="w-6 h-6" />
          </a>
          <a href="https://linkedin.com/in/paramp06" target="_blank" rel="noreferrer" className="p-3 glass rounded-full hover:border-secondary/50 hover:text-secondary transition-all hover:shadow-[0_0_15px_rgba(112,0,255,0.3)]">
            <Icon icon="mdi:linkedin" className="w-6 h-6" />
          </a>
          <a href="mailto:paramppatel100@gmail.com" className="p-3 glass rounded-full hover:border-red-500/50 hover:text-red-500 transition-all hover:shadow-[0_0_15px_rgba(255,0,0,0.3)]">
            <Mail className="w-6 h-6" />
          </a>
          <a href="#" className="p-3 glass rounded-full hover:border-gray-400/50 hover:text-white transition-all">
            <Icon icon="mdi:twitter" className="w-6 h-6" />
          </a>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-center items-center gap-4 text-gray-500 text-sm max-w-7xl mx-auto px-4">
        <p>© {currentYear} Param. All systems operational.</p>
        <button
          onClick={() => setShowTerminal(!showTerminal)}
          className="flex items-center gap-2 hover:text-primary transition-colors text-xs font-mono ml-0 md:ml-auto"
        >
          <TerminalIcon className="w-4 h-4" />
          [ACCESS TERMINAL]
        </button>
      </div>

      {/* Easter Egg Terminal */}
      <AnimatePresence>
        {showTerminal && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-4 right-4 md:bottom-20 md:right-10 w-[90vw] md:w-[400px] glass border-primary/30 rounded-xl overflow-hidden shadow-2xl z-50"
          >
            <div className="bg-black/80 px-4 py-2 border-b border-white/10 flex justify-between items-center">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-xs font-mono text-gray-400">root@param-sys:~</span>
              <button onClick={() => setShowTerminal(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 h-64 overflow-y-auto font-mono text-sm bg-black/90 text-green-400 custom-scrollbar">
              {output.map((line, i) => (
                <div key={i} className="mb-1">{line}</div>
              ))}
              <div className="flex items-center mt-2">
                <span className="mr-2 text-primary">{">"}</span>
                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyDown={handleCommand}
                  className="bg-transparent border-none outline-none flex-1 text-green-400 placeholder-green-800/50"
                  autoFocus
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
};