"use client";

import { motion } from "framer-motion";

const skills = [
  { name: "Python", category: "Languages", level: 95 },
  { name: "TensorFlow", category: "AI/ML", level: 85 },
  { name: "PyTorch", category: "AI/ML", level: 80 },
  { name: "LangChain", category: "AI/ML", level: 90 },
  { name: "Ollama", category: "AI/ML", level: 85 },
  { name: "FastAPI", category: "Backend", level: 88 },
  { name: "React", category: "Frontend", level: 92 },
  { name: "Docker", category: "DevOps", level: 85 },
  { name: "XGBoost", category: "AI/ML", level: 75 },
  { name: "OpenCV", category: "Computer Vision", level: 80 },
];

export const Skills = () => {
  return (
    <section id="skills" className="relative w-full max-w-6xl mx-auto px-4 py-20 z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">
            Technical Arsenal
          </span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Equipped with cutting-edge tools to build robust AI agents, scalable backends, and immersive frontends.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            className="flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-200">{skill.name}</span>
              <span className="text-xs text-primary/80 font-mono">{skill.category}</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.05, duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-secondary to-primary relative"
              >
                <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/50 blur-[2px]" />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3D decorative elements could go here or floating tech icons */}
      <div className="mt-20 glass p-8 rounded-2xl border border-white/10 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
        <h3 className="text-2xl font-bold mb-4 relative z-10 glow-text text-primary">System Architecture Specialization</h3>
        <p className="text-gray-300 max-w-3xl mx-auto relative z-10">
          My core expertise lies in bridging the gap between cutting-edge ML research and production-ready applications.
          I build full-stack architectures where AI agents seamlessly interact with modern web interfaces.
        </p>
      </div>
    </section>
  );
};