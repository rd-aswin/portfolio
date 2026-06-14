import React from "react";
import FluidMesh from "@/components/background/fluid-mesh";
import Grain from "@/components/background/grain";
import BentoHero from "@/components/sections/bento-hero";
import Projects from "@/components/sections/projects";
import Timeline from "@/components/sections/timeline";
import Testimonials from "@/components/sections/testimonials";
import Contact from "@/components/sections/contact";
import UploadShowcase from "@/components/ui/upload-showcase";

export default function Home() {
  return (
    <div className="relative min-h-screen text-white overflow-hidden pb-16 selection:bg-indigo-500/30 selection:text-white">
      {/* Immersive Background */}
      <FluidMesh />
      <Grain />

      {/* Main Sections */}
      <main className="relative z-10 space-y-16">
        <BentoHero />
        <Projects />
        <Timeline />
        <Testimonials />
        <UploadShowcase />
        <Contact />
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full text-center py-8 border-t border-white/5 mt-20">
        <p className="text-xs text-muted">
          &copy; {new Date().getFullYear()} RD Aswin. All Rights Reserved. Built with Next.js, Tailwind, and Framer Motion.
        </p>
      </footer>
    </div>
  );
}
