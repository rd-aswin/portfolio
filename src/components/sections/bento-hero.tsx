"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FileText, MapPin, ExternalLink, Activity, Target, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin } from "../ui/icons";
import Tilt from "../ui/tilt";

export default function BentoHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState("");
  const [activeTab, setActiveTab] = useState<"activity" | "now">("activity");
  const [config, setConfig] = useState({
    owner_name: "Aswin",
    about_text: "A software engineer specialized in designing exceptional, interactive, and high-performance web applications using modern web ecosystems.",
    availability_status: "available",
    resume_url: "/resume.pdf",
    focus_working_on: "",
    focus_learning: "",
    focus_goal: "",
    jamming_to: "",
    tech_stack: "Next.js, React, TypeScript, Tailwind CSS, GSAP, Framer Motion",
    github_url: "https://github.com/rd-aswin",
    linkedin_url: "https://linkedin.com"
  });

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

  const [githubActivity, setGithubActivity] = useState({
    levels: [] as number[],
    totalContributions: 2481,
    longestStreak: 42,
    isLoading: true
  });

  useEffect(() => {
    const fetchGithubActivity = async () => {
      const username = config.github_url ? config.github_url.split("/").filter(Boolean).pop() : "rd-aswin";
      if (!username) return;
      
      try {
        const res = await fetch(`/api/github-activity?username=${username}`);
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.levels)) {
            setGithubActivity({
              levels: data.levels,
              totalContributions: data.totalContributions ?? 0,
              longestStreak: data.longestStreak ?? 0,
              isLoading: false
            });
          }
        }
      } catch (err) {
        console.error("Error fetching GitHub activity:", err);
      }
    };
    fetchGithubActivity();
  }, [config.github_url]);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/admin/config");
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setConfig({
              owner_name: data.owner_name,
              about_text: data.about_text,
              availability_status: data.availability_status,
              resume_url: data.resume_url || "/resume.pdf",
              focus_working_on: data.focus_working_on || "",
              focus_learning: data.focus_learning || "",
              focus_goal: data.focus_goal || "",
              jamming_to: data.jamming_to || "",
              tech_stack: data.tech_stack || "Next.js, React, TypeScript, Tailwind CSS, GSAP, Framer Motion",
              github_url: data.github_url || "https://github.com/rd-aswin",
              linkedin_url: data.linkedin_url || "https://linkedin.com"
            });
          }
        }
      } catch (err) {
        console.error("Error fetching site config:", err);
      }
    };
    fetchConfig();
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

  // Generate GitHub contributions (7 days x 17 columns = 119 squares)
  const renderGithubGrid = () => {
    const levelColors = ["bg-[#161b22]", "bg-[#0e4429]", "bg-[#006d32]", "bg-[#26a641]", "bg-[#39d353]"];
    const grid = [];
    const seeds = [
      0, 1, 0, 2, 0, 0, 1, 3, 0, 4, 1, 0, 2, 0, 3, 0, 1,
      1, 0, 2, 0, 3, 0, 0, 1, 2, 0, 3, 4, 0, 1, 0, 2, 0,
      0, 2, 0, 1, 0, 4, 2, 0, 1, 0, 0, 2, 0, 3, 1, 0, 2,
      3, 0, 1, 0, 0, 1, 0, 2, 3, 0, 1, 2, 0, 4, 0, 1, 3,
      0, 4, 1, 0, 2, 0, 3, 0, 1, 0, 2, 0, 3, 0, 0, 1, 2,
      1, 0, 3, 2, 0, 1, 0, 4, 1, 0, 2, 0, 3, 1, 0, 2, 0,
      0, 2, 0, 1, 3, 0, 2, 0, 1, 0, 4, 2, 0, 1, 0, 3, 1
    ];

    const activeLevels = githubActivity.levels.length > 0 
      ? githubActivity.levels.slice(-119) 
      : seeds;

    // Pad activeLevels if it contains fewer than 119 items
    while (activeLevels.length < 119) {
      activeLevels.unshift(0);
    }

    for (let i = 0; i < 119; i++) {
      const level = activeLevels[i];
      const colorClass = levelColors[level >= 0 && level <= 4 ? level : 0];
      grid.push(
        <div
          key={i}
          className={`w-[10px] h-[10px] rounded-[2px] ${colorClass} transition-colors duration-300 hover:scale-[1.2] hover:ring-1 hover:ring-indigo-400 cursor-default`}
        />
      );
    }
    return grid;
  };

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
              <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${config.availability_status === "available" ? "bg-emerald-500" : "bg-amber-500"}`} />
              <span className="text-xs text-muted font-medium uppercase tracking-wider">
                {config.availability_status === "available" ? "Available for Projects" : "Fully Booked"}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Hi, I&apos;m <span className="text-indigo-400">{config.owner_name}</span>
            </h1>
            <p className="text-muted text-sm md:text-base leading-relaxed max-w-md">
              {config.about_text}
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
                href={config.github_url}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all duration-200 hover:scale-[1.05]"
              >
                <Github size={18} />
              </a>
              <a
                href={config.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all duration-200 hover:scale-[1.05]"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Card 2: Toggleable GitHub Activity & Current Focus (Col 2, Row 2) */}
        <Tilt className="bento-card md:col-span-2 md:row-span-2 glass-panel rounded-3xl overflow-hidden relative min-h-[300px] flex flex-col justify-between group p-6">
          {/* Header & Toggle Controls */}
          <div className="relative z-10 flex justify-between items-center w-full pb-3 border-b border-white/5">
            <span className="text-xs text-indigo-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              {activeTab === "activity" ? (
                <>
                  <Activity size={14} className="animate-pulse" /> GitHub Activity
                </>
              ) : (
                <>
                  <Target size={14} className="animate-bounce" style={{ animationDuration: "3s" }} /> What I&apos;m Doing Now
                </>
              )}
            </span>

            {/* Toggle Tabs */}
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
              <button
                onClick={() => setActiveTab("activity")}
                className={`px-3 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                  activeTab === "activity"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-muted hover:text-white"
                }`}
              >
                Activity
              </button>
              <button
                onClick={() => setActiveTab("now")}
                className={`px-3 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                  activeTab === "now"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-muted hover:text-white"
                }`}
              >
                Focus
              </button>
            </div>
          </div>

          {/* Tab Content Panels */}
          <div className="flex-1 w-full flex items-center relative py-4">
            <AnimatePresence mode="wait">
              {activeTab === "activity" ? (
                <motion.div
                  key="activity-panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="w-full space-y-4"
                >
                  {/* Contribution Grid */}
                  <div className="flex gap-[4px] flex-wrap max-w-sm mx-auto justify-center">
                    {renderGithubGrid()}
                  </div>

                  {/* GitHub Statistics */}
                  <div className="flex justify-around items-center border-t border-white/5 pt-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-white">
                        {githubActivity.isLoading ? "..." : githubActivity.totalContributions.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-muted">Commits This Year</p>
                    </div>
                    <div className="w-[1px] h-6 bg-white/5" />
                    <div>
                      <p className="text-lg font-bold text-white">
                        {githubActivity.isLoading ? "..." : `${githubActivity.longestStreak} Days`}
                      </p>
                      <p className="text-[10px] text-muted">Longest Streak</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="now-panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="w-full space-y-3 px-2 text-xs"
                >
                  <div className="space-y-2">
                    <p className="leading-relaxed">
                      <span className="text-indigo-400 font-bold mr-2">⚡ Building:</span> 
                      {config.focus_working_on || "Distributed key-value engines and custom GLSL shader configurations."}
                    </p>
                    <p className="leading-relaxed">
                      <span className="text-indigo-400 font-bold mr-2">📚 Learning:</span> 
                      {config.focus_learning || "WebGPU pipelines and systems programming with Rust."}
                    </p>
                    <p className="leading-relaxed">
                      <span className="text-indigo-400 font-bold mr-2">🎯 Goal:</span> 
                      {config.focus_goal || "Engineering resilient, high-speed interfaces and network consensus layers."}
                    </p>
                  </div>

                  {/* Listening To Status */}
                  <div className="mt-3 p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl animate-pulse">
                      <Music size={14} />
                    </div>
                    <div>
                      <h5 className="text-[9px] text-muted uppercase tracking-wider font-semibold">Currently Jamming To</h5>
                      <p className="text-[11px] text-white font-medium">{config.jamming_to || "Synthwave Focus Beats"}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
            {config.tech_stack.split(",").map((s) => s.trim()).filter(Boolean).map((skill) => (
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
          href={config.resume_url}
          target="_blank"
          rel="noreferrer"
          className="bento-card glass-panel rounded-3xl p-6 flex flex-col justify-between min-h-[160px] group hover:border-indigo-500/20 hover:bg-white/[0.02] transition-all duration-300 relative"
        >
          <div className="flex justify-between items-start">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl group-hover:scale-[1.05] transition-transform">
              <FileText size={20} />
            </div>
            <span className="absolute top-6 right-6 text-muted group-hover:text-white transition-colors">
              <ExternalLink size={14} />
            </span>
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
