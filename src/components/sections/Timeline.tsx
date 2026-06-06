"use client";

import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Award, Rocket } from "lucide-react";

const experiences = [
  {
    title: "Founder & President",
    company_name: "E-Cell",
    icon: <Rocket />,
    iconBg: "#0a0a0a",
    date: "Present",
    points: [
      "Leading initiatives to foster entrepreneurship and innovation.",
      "Organizing hackathons, workshops, and networking events for aspiring founders.",
      "Building a community of developers and creators.",
    ],
  },
  {
    title: "Machine Learning Researcher",
    company_name: "Academic Research",
    icon: <Briefcase />,
    iconBg: "#0a0a0a",
    date: "2023 - Present",
    points: [
      "Publishing research on intersection of AI and cybersecurity.",
      "Developing novel approaches for anomaly detection using neural networks.",
      "Collaborating with professors and peers on data-driven studies.",
    ],
  },
  {
    title: "AI Engineer Intern",
    company_name: "Tech Startup",
    icon: <Briefcase />,
    iconBg: "#0a0a0a",
    date: "Summer 2023",
    points: [
      "Built and deployed agentic workflows using LangChain and OpenAI.",
      "Optimized internal data pipelines reducing processing time by 40%.",
      "Created internal dashboard for monitoring ML model drift.",
    ],
  },
  {
    title: "Computer Science Degree",
    company_name: "University",
    icon: <GraduationCap />,
    iconBg: "#0a0a0a",
    date: "2021 - Present",
    points: [
      "Focusing on Artificial Intelligence, Data Structures, and Algorithms.",
      "Consistent high academic standing while managing extracurricular leadership.",
      "Winner of University's Annual Hackathon 2023.",
    ],
  },
];

const ExperienceCard = ({ experience }: any) => {
  return (
    <VerticalTimelineElement
      contentStyle={{
        background: "rgba(255, 255, 255, 0.03)",
        backdropFilter: "blur(10px)",
        color: "#fff",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 0 20px rgba(0, 240, 255, 0.05)",
        borderRadius: "1rem",
      }}
      contentArrowStyle={{ borderRight: "7px solid  rgba(255, 255, 255, 0.1)" }}
      date={experience.date}
      iconStyle={{
        background: experience.iconBg,
        color: "#00f0ff",
        border: "2px solid rgba(0, 240, 255, 0.5)",
        boxShadow: "0 0 10px rgba(0, 240, 255, 0.5)"
      }}
      icon={experience.icon}
    >
      <div>
        <h3 className="text-white text-[24px] font-bold">{experience.title}</h3>
        <p className="text-gray-400 text-[16px] font-semibold" style={{ margin: 0 }}>
          {experience.company_name}
        </p>
      </div>

      <ul className="mt-5 list-disc ml-5 space-y-2">
        {experience.points.map((point: string, index: number) => (
          <li
            key={`experience-point-${index}`}
            className="text-white-100 text-[14px] pl-1 tracking-wider text-gray-300"
          >
            {point}
          </li>
        ))}
      </ul>
    </VerticalTimelineElement>
  );
};

export const Timeline = () => {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 py-20 z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">
            Journey & Milestones
          </span>
        </h2>
      </div>

      <div className="mt-10 flex flex-col">
        <VerticalTimeline lineColor="rgba(255, 255, 255, 0.1)">
          {experiences.map((experience, index) => (
            <ExperienceCard
              key={`experience-${index}`}
              experience={experience}
            />
          ))}
        </VerticalTimeline>
      </div>
    </section>
  );
};