"use client";

import { motion } from "framer-motion";
import { Code2, BrainCircuit, GitMerge, FileText, Terminal } from "lucide-react";

const stats = [
  {
    title: "Projects",
    value: "25+",
    icon: <Code2 className="w-6 h-6 text-primary" />,
    description: "Full-stack & AI Apps",
  },
  {
    title: "AI Models",
    value: "10+",
    icon: <BrainCircuit className="w-6 h-6 text-secondary" />,
    description: "Trained & Deployed",
  },
  {
    title: "Research",
    value: "2",
    icon: <FileText className="w-6 h-6 text-accent" />,
    description: "Published Papers",
  },
  {
    title: "Contributions",
    value: "500+",
    icon: <GitMerge className="w-6 h-6 text-green-400" />,
    description: "Open Source Commits",
  },
];

export const Stats = () => {
  return (
    <section className="relative w-full max-w-6xl mx-auto px-4 py-20 z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="glass relative overflow-hidden p-6 rounded-2xl border border-white/10 hover:border-primary/50 transition-colors group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              {stat.icon}
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all">
                {stat.icon}
              </div>
              <h3 className="text-gray-400 font-medium">{stat.title}</h3>
            </div>

            <div className="flex flex-col">
              <span className="text-4xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                {stat.value}
              </span>
              <span className="text-sm text-gray-500">
                {stat.description}
              </span>
            </div>

            {/* Hover gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </motion.div>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center">
        <h3 className="text-xl font-bold text-gray-300 mb-6 flex items-center gap-2">
          <Terminal size={20} className="text-primary" />
          GitHub Contribution Heatmap
        </h3>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="w-full max-w-4xl glass p-4 rounded-2xl border border-white/10 overflow-hidden"
        >
          {/* Using the image from README */}
          <picture className="w-full">
            <source media="(prefers-color-scheme: dark)" srcSet="https://raw.githubusercontent.com/Param96/Param96/output/github-contribution-grid-snake-dark.svg" />
            <img className="w-full h-auto drop-shadow-[0_0_15px_rgba(0,240,255,0.2)]" alt="github contribution grid snake animation" src="https://raw.githubusercontent.com/Param96/Param96/output/github-contribution-grid-snake-dark.svg" />
          </picture>
        </motion.div>
      </div>
    </section>
  );
};
