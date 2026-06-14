"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FileText, MapPin, ExternalLink, Cpu } from "lucide-react";
import { Github, Linkedin } from "../ui/icons";
import Tilt from "../ui/tilt";

export default function BentoHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [time, setTime] = useState("");

  // Update clock
  useEffect(() => {
    const updateClock = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setTime(new Intl.DateTimeFormat("en-US", options).format(new Date()));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // GSAP Bento Assembly Animation
  useEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll(".bento-card");
    
    // Set 3D perspective on parent
    gsap.set(containerRef.current, { perspective: 1000 });

    // Animate cards in
    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 60,
        scale: 0.85,
        rotationX: -15,
        rotationY: 10,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        rotationY: 0,
        duration: 1.2,
        stagger: 0.12,
        ease: "power4.out",
        clearProps: "transform", // Clear transforms so Framer motion tilt works properly after
      }
    );
  }, []);

  // Canvas 3D Particle Visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Track mouse coordinates over the visualizer card
    const mouse = { x: width / 2, y: height / 2, active: false };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const card = canvas.closest(".bento-card");
    if (card) {
      card.addEventListener("mousemove", handleMouseMove as EventListener);
      card.addEventListener("mouseleave", handleMouseLeave);
    }

    // Particle definition
    interface Particle {
      x: number;
      y: number;
      z: number;
      baseX: number;
      baseY: number;
      color: string;
      size: number;
      angle: number;
      speed: number;
    }

    const particles: Particle[] = [];
    const particleCount = 45;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 200 + 50, // 3D depth value
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        color: i % 2 === 0 ? "rgba(99, 102, 241, 0.45)" : "rgba(236, 72, 153, 0.3)", // Indigo and Pink
        size: Math.random() * 3 + 1.5,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.4 + 0.1,
      });
    }

    // Drawing loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw mathematical connecting lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        
        // Circular orbit movement
        p1.angle += p1.speed * 0.02;
        p1.x = p1.baseX + Math.cos(p1.angle) * 35;
        p1.y = p1.baseY + Math.sin(p1.angle) * 35;

        // Attract toward mouse if active
        if (mouse.active) {
          const dx = mouse.x - p1.x;
          const dy = mouse.y - p1.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120) {
            const force = (120 - dist) / 120;
            p1.x += (dx / dist) * force * 4;
            p1.y += (dy / dist) * force * 4;
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.size, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 80)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (card) {
        card.removeEventListener("mousemove", handleMouseMove as EventListener);
        card.removeEventListener("mouseleave", handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="w-full max-w-6xl mx-auto px-4 pt-16 md:pt-28 pb-12 flex flex-col items-center">
      {/* Bento Grid */}
      <div
        ref={containerRef}
        className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 grid-rows-auto"
      >
        {/* Card 1: Main Introduction (Col 2, Row 2) */}
        <div className="bento-card md:col-span-2 md:row-span-2 glass-panel rounded-3xl p-6 md:p-8 flex flex-col justify-between group">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-muted font-medium uppercase tracking-wider">
                Available for Projects
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Hi, I&apos;m <span className="text-indigo-400">Aswin</span>
            </h1>
            <p className="text-muted text-sm md:text-base leading-relaxed max-w-md">
              A software engineer specialized in designing exceptional, interactive, and high-performance web applications using modern web ecosystems.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-4 items-center">
            <a
              href="#contact"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/20 hover:scale-[1.03] active:scale-[0.98]"
            >
              Get in Touch
            </a>
            <div className="flex gap-3">
              <a
                href="https://github.com/rd-aswin"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all duration-200 hover:scale-[1.05]"
              >
                <Github size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all duration-200 hover:scale-[1.05]"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Card 2: Interactive 3D Canvas (Col 2, Row 2) */}
        <Tilt className="bento-card md:col-span-2 md:row-span-2 glass-panel rounded-3xl overflow-hidden relative min-h-[300px] flex flex-col justify-between group p-6">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10" />
          <div className="relative z-10">
            <span className="text-xs text-indigo-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Cpu size={14} className="animate-spin" style={{ animationDuration: "6s" }} /> Interactive Sandbox
            </span>
          </div>
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-indigo-300 transition-colors">
              Dynamic Visualizer
            </h3>
            <p className="text-xs text-muted max-w-xs">
              Move your cursor over this card to interact with the responsive 3D gravitational particle field.
            </p>
          </div>
        </Tilt>

        {/* Card 3: Location / Time Status (Col 1, Row 1) */}
        <div className="bento-card glass-panel rounded-3xl p-6 flex flex-col justify-between min-h-[160px]">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <MapPin size={20} />
            </div>
            <span className="text-[10px] text-muted uppercase tracking-wider font-mono">
              IST (UTC+5:30)
            </span>
          </div>
          <div>
            <h4 className="text-xs text-muted mb-1">Based In</h4>
            <p className="text-sm font-semibold text-white">Kerala, India</p>
            <p className="text-xs text-indigo-400/80 font-mono mt-1 font-semibold">{time || "12:00:00 PM"}</p>
          </div>
        </div>

        {/* Card 4: Quick Skills (Col 2, Row 1) */}
        <div className="bento-card md:col-span-2 glass-panel rounded-3xl p-6 flex flex-col justify-between min-h-[160px] group">
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-semibold text-white">Tech Stack Focus</h4>
            <span className="text-[10px] text-indigo-400/80 font-bold uppercase tracking-wider">
              Core
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {["Next.js", "React", "TypeScript", "Tailwind CSS", "GSAP", "Framer Motion"].map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 text-xs bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-200 rounded-lg text-white font-medium cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Card 5: Resume Download (Col 1, Row 1) */}
        <a
          href="/resume.pdf"
          target="_blank"
          className="bento-card glass-panel rounded-3xl p-6 flex flex-col justify-between min-h-[160px] group hover:border-indigo-500/20 hover:bg-white/[0.02] transition-all duration-300"
        >
          <div className="flex justify-between items-start">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl group-hover:scale-[1.05] transition-transform">
              <FileText size={20} />
            </div>
            <ExternalLink size={14} className="text-muted group-hover:text-white transition-colors" />
          </div>
          <div>
            <h4 className="text-xs text-muted mb-1">Documentation</h4>
            <p className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">
              Curriculum Vitae
            </p>
            <p className="text-[10px] text-muted mt-1">Download Resume PDF</p>
          </div>
        </a>
      </div>
    </section>
  );
}
