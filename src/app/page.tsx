import StarsCanvas from "@/components/canvas/Stars";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Timeline } from "@/components/sections/Timeline";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="relative z-0 bg-[#030014] w-full h-full overflow-x-hidden selection:bg-cyan-500/30">
      <StarsCanvas />

      {/* Container for main content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        <Hero />
        <Stats />
        <Skills />
        <Projects />
        <Timeline />
        <Footer />
      </div>
    </main>
  );
}