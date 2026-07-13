"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Calendar, Briefcase, GraduationCap } from "lucide-react";

interface TimelineItem {
  id: string;
  year: string;
  title: string;
  company: string;
  description: string;
  skills: string[];
  type: "work" | "education" | "award";
}

interface DbTimelineItem {
  id: string;
  year: string;
  title: string;
  company: string;
  description: string;
  skills: string | null;
  type: "work" | "education" | "award";
}



export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [timelineItems, setTimelineItems] = React.useState<TimelineItem[] | null>(null);

  React.useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await fetch("/api/admin/timeline");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            // Map the database string skills to string[]
            const parsedData = data.map((item: DbTimelineItem) => ({
              ...item,
              skills: typeof item.skills === "string" 
                ? item.skills.split(",").map((s: string) => s.trim()).filter(Boolean) 
                : (Array.isArray(item.skills) ? item.skills : [])
            }));
            setTimelineItems(parsedData);
          } else {
            setTimelineItems([]);
          }
        } else {
          setTimelineItems([]);
        }
      } catch (err) {
        console.error("Error fetching timeline:", err);
        setTimelineItems([]);
      }
    };
    fetchTimeline();
  }, []);
  
  // Track scroll position inside this timeline container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end end"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 35,
  });

  const getStartYear = (yearStr: string): number => {
    const match = yearStr.match(/\b\d{4}\b/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const sortedItems = timelineItems ? [...timelineItems].sort((a, b) => getStartYear(b.year) - getStartYear(a.year)) : [];

  return (
    <section id="experience" className="w-full max-w-5xl mx-auto px-4 py-20 relative">
      <div className="mb-16 text-center md:text-left">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
          Experience & Journey
        </h2>
        <p className="text-muted text-sm max-w-md">
          A brief history of my career path, academic background, and professional focus.
        </p>
      </div>

      <div ref={containerRef} className="relative min-h-[400px]">
        {timelineItems === null ? (
          <div className="space-y-12 animate-pulse">
            {[1, 2, 3].map((idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={idx} className="relative flex flex-col md:flex-row md:justify-between items-start md:items-center w-full opacity-40">
                  <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-white/10 border-2 border-white/20 -translate-x-1/2 z-10" />
                  <div className={`w-full md:w-[45%] pl-12 md:pl-0 ${isEven ? "md:text-right md:order-1" : "md:order-2"}`}>
                    <div className={`h-4 bg-white/10 rounded w-24 mb-2 ${isEven ? "md:ml-auto" : ""}`} />
                    <div className={`h-6 bg-white/10 rounded w-48 mb-2 ${isEven ? "md:ml-auto" : ""}`} />
                    <div className={`h-3 bg-white/5 rounded w-32 ${isEven ? "md:ml-auto" : ""}`} />
                  </div>
                  <div className={`w-full md:w-[45%] pl-12 md:pl-0 ${isEven ? "md:order-2" : "md:text-left md:order-1"}`}>
                    <div className="glass-panel rounded-2xl p-5 md:p-6 space-y-3 bg-white/[0.01] border-white/5">
                      <div className="h-4 bg-white/10 rounded w-16" />
                      <div className="h-3 bg-white/10 rounded w-full" />
                      <div className="h-3 bg-white/10 rounded w-[80%]" />
                      <div className="flex gap-1.5 mt-2">
                        <div className="h-5 bg-white/5 rounded w-12" />
                        <div className="h-5 bg-white/5 rounded w-16" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : timelineItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center glass-panel rounded-3xl border border-white/5 bg-white/[0.01] max-w-md mx-auto">
            <p className="text-xs text-muted leading-relaxed">
              My journey details are currently being updated. Please check back soon or log in to the admin panel to add them.
            </p>
          </div>
        ) : (
          <>
            {/* Scroll-tracked Vertical Timeline Line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-white/10 -translate-x-[1px]" />
            <motion.div
              style={{ scaleY }}
              className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-indigo-500 via-fuchsia-500 to-pink-500 origin-top -translate-x-[1px] shadow-[0_0_12px_rgba(99,102,241,0.5)]"
            />

            <div className="space-y-12">
              {sortedItems.map((item, idx) => {
                const isEven = idx % 2 === 0;
            return (
              <div
                key={item.id}
                className="relative flex flex-col md:flex-row md:justify-between items-start md:items-center w-full"
              >
                {/* Visual Connector Dot */}
                <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-black border-2 border-indigo-500 -translate-x-1/2 z-10 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                </div>

                {/* Left Side Content (Desktop) */}
                <div
                  className={`w-full md:w-[45%] pl-12 md:pl-0 ${
                    isEven ? "md:text-right md:order-1" : "md:order-2"
                  }`}
                >
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 mb-2 font-mono">
                      <Calendar size={12} /> {item.year}
                    </span>
                    <h3 className="text-lg font-bold text-white leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted mb-3 font-semibold">
                      {item.company}
                    </p>
                  </motion.div>
                </div>

                {/* Right Side Content (Desktop) */}
                <div
                  className={`w-full md:w-[45%] pl-12 md:pl-0 ${
                    isEven ? "md:order-2" : "md:text-left md:order-1"
                  }`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                    className="glass-panel rounded-2xl p-5 md:p-6"
                  >
                    <div className="flex gap-2.5 items-center mb-3">
                      <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                        {item.type === "work" ? (
                          <Briefcase size={16} />
                        ) : (
                          <GraduationCap size={16} />
                        )}
                      </div>
                      <span className="text-[10px] text-muted font-bold uppercase tracking-wider">
                        {item.type === "work" ? "Professional" : "Academic"}
                      </span>
                    </div>
                    <p className="text-xs text-white/80 leading-relaxed mb-4">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 text-[10px] bg-white/5 border border-white/5 rounded text-white/70 hover:border-indigo-500/20 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            );
          })}
          </div>
        </>
      )}
    </div>
  </section>
  );
}
