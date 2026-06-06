"use client";

import { motion } from "framer-motion";
import { Tilt } from "react-tilt";
import { ExternalLink, Cpu, Lock, Network, Database, Brain } from "lucide-react";
import { Icon } from '@iconify/react';

const projects = [
  {
    title: "IPO Prediction AI",
    description: "Machine learning model predicting Initial Public Offering success rates using historical financial data and market sentiment analysis.",
    icon: <Database className="w-8 h-8" />,
    tech: ["Python", "XGBoost", "Pandas", "FastAPI"],
    github: "#",
    demo: "#",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Agentic Course Verification System",
    description: "Multi-agent system that autonomously verifies course content, checks for academic integrity, and generates quality reports.",
    icon: <Brain className="w-8 h-8" />,
    tech: ["LangChain", "OpenAI", "React", "Node.js"],
    github: "#",
    demo: "#",
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "GPS-Denied Drone Navigation",
    description: "Computer vision based autonomous navigation system for drones operating in environments without GPS signals.",
    icon: <Network className="w-8 h-8" />,
    tech: ["OpenCV", "TensorFlow", "C++", "ROS"],
    github: "#",
    demo: "#",
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "ML Data Auditing Agent",
    description: "Automated tool for detecting bias, data drift, and anomalies in training datasets before model deployment.",
    icon: <Cpu className="w-8 h-8" />,
    tech: ["Python", "Scikit-learn", "Streamlit"],
    github: "#",
    demo: "#",
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Cybersecurity Research",
    description: "Published research on utilizing adversarial neural networks to strengthen intrusion detection systems.",
    icon: <Lock className="w-8 h-8" />,
    tech: ["PyTorch", "Research", "Security"],
    github: "#",
    demo: "#",
    color: "from-cyan-500 to-blue-500",
  },
];

export const Projects = () => {
  return (
    <section id="projects" className="relative w-full max-w-7xl mx-auto px-4 py-20 z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Featured Systems
          </span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          A selection of my most impactful projects bridging the gap between theoretical AI and practical applications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Tilt
              options={{
                max: 15,
                scale: 1.02,
                speed: 400,
                glare: true,
                "max-glare": 0.2,
              }}
              className="h-full"
            >
              <div className="h-full glass rounded-2xl p-6 border border-white/10 hover:border-primary/50 transition-colors relative overflow-hidden group flex flex-col">
                {/* Background Gradient Blob */}
                <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${project.color} rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity`} />

                <div className="mb-6 inline-flex p-3 rounded-xl bg-white/5 border border-white/10 text-white relative z-10">
                  {project.icon}
                </div>

                <h3 className="text-xl font-bold text-white mb-3 relative z-10">{project.title}</h3>

                <p className="text-gray-400 text-sm mb-6 flex-grow relative z-10">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                  {project.tech.map((t) => (
                    <span key={t} className="text-xs font-mono px-2 py-1 rounded-md bg-white/5 border border-white/10 text-cyan-200">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 relative z-10 mt-auto pt-4 border-t border-white/10">
                  <a href={project.github} className="flex items-center gap-2 text-sm text-gray-300 hover:text-primary transition-colors">
                    <Icon icon="mdi:github" className="w-5 h-5" />
                    Source
                  </a>
                  <a href={project.demo} className="flex items-center gap-2 text-sm text-gray-300 hover:text-primary transition-colors ml-auto">
                    Live Demo
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </Tilt>
          </motion.div>
        ))}
      </div>
    </section>
  );
};