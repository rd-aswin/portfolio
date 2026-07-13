"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, ArrowRight, Layers, Award } from "lucide-react";
import { CldImage } from "next-cloudinary";
import { Github } from "../ui/icons";
import Tilt from "../ui/tilt";

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  detailedDescription: string;
  tags: string[];
  role: string;
  metrics: string;
  github: string;
  demo: string;
  color: string;
  image_public_id?: string;
}

interface DbProject {
  id: string;
  title: string;
  subtitle?: string;
  tags?: string;
  image_public_id?: string;
  description?: string;
  detailed_description?: string;
  role?: string;
  metrics?: string;
  github_url?: string;
  demo_url?: string;
  color?: string;
}

const projectsData: Project[] = [
  {
    id: "aetherdb",
    title: "AetherDB",
    subtitle: "Distributed Raft Consensus Engine",
    description: "A high-throughput distributed key-value store written in Go with raft consensus, exposing gRPC endpoints.",
    detailedDescription: "AetherDB is designed for highly resilient configuration management. It implements the Raft Consensus Protocol from scratch in Go to provide strong consistency (CP in CAP). It exposes an ultra-fast gRPC API and includes a React-based monitoring dashboard showing real-time leader elections, heartbeat latency, and replication logs.",
    tags: ["Go", "Raft Consensus", "gRPC", "React", "Docker"],
    role: "Lead Systems Engineer",
    metrics: "15,000+ writes/sec, <3ms replication latency",
    github: "https://github.com/rd-aswin/aetherdb",
    demo: "https://github.com/rd-aswin/aetherdb",
    color: "from-indigo-600 to-blue-500",
  },
  {
    id: "prism-webgl",
    title: "Prism WebGL",
    subtitle: "Glass Refraction Simulator",
    description: "An interactive browser simulation of real-time 3D optical glass refraction and dispersion physics using Three.js.",
    detailedDescription: "Prism WebGL is an experimental 3D render simulator allowing users to interact with glass shapes (prisms, lenses, spheres). It implements custom GLSL fragment shaders simulating Chromatic Aberration and Fresnel refraction index calculations. Highly optimized to achieve a locked 60fps on mobile browsers.",
    tags: ["WebGL", "Three.js", "GLSL Shaders", "React Three Fiber"],
    role: "Creative Developer",
    metrics: "Locked 60fps on mobile with 200k+ dynamic vertices",
    github: "https://github.com/rd-aswin/prism-webgl",
    demo: "https://github.com/rd-aswin/prism-webgl",
    color: "from-fuchsia-600 to-pink-500",
  },
  {
    id: "novus-ai",
    title: "Novus AI",
    subtitle: "Autonomous Agent Orchestrator",
    description: "A developer agent framework that automates test generation, syntax fixes, and deployment validation.",
    detailedDescription: "Novus AI runs as a background assistant that monitors git staging, analyzes changes, generates comprehensive unit tests, resolves ESLint/compilation errors autonomously, and validates deployments using headless browser scripts. Features a highly interactive terminal-style desktop client.",
    tags: ["TypeScript", "Node.js", "LLM APIs", "Puppeteer", "Git Hooks"],
    role: "Full Stack Developer",
    metrics: "Reduces manual PR testing cycles by 40%",
    github: "https://github.com/rd-aswin/novus-ai",
    demo: "https://github.com/rd-aswin/novus-ai",
    color: "from-emerald-600 to-teal-500",
  },
];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[] | null>(null);

  // Disable scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/admin/projects");
        if (res.ok) {
          const dbProjects = await res.json();
          if (dbProjects && dbProjects.length > 0) {
            // Merge database projects with static details
            const merged = dbProjects.map((dbProj: DbProject) => {
              const staticProj = projectsData.find(p => p.id === dbProj.id);
              
              const tagsArray = typeof dbProj.tags === "string" 
                ? dbProj.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
                : (Array.isArray(dbProj.tags) ? dbProj.tags : []);

              return {
                id: dbProj.id,
                title: dbProj.title,
                subtitle: dbProj.subtitle || "",
                description: dbProj.description || staticProj?.description || dbProj.subtitle || "",
                detailedDescription: dbProj.detailed_description || staticProj?.detailedDescription || dbProj.subtitle || "No description provided yet.",
                tags: tagsArray.length > 0 ? tagsArray : (staticProj?.tags || []),
                role: dbProj.role || staticProj?.role || "Developer",
                metrics: dbProj.metrics || staticProj?.metrics || "Ready",
                github: dbProj.github_url || staticProj?.github || "#",
                demo: dbProj.demo_url || staticProj?.demo || "#",
                color: dbProj.color || staticProj?.color || "from-indigo-600 to-violet-500",
                image_public_id: dbProj.image_public_id || staticProj?.image_public_id || ""
              };
            });
            setProjects(merged);
          } else {
            setProjects([]);
          }
        } else {
          setProjects([]);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setProjects([]);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section id="projects" className="w-full max-w-6xl mx-auto px-4 py-20 relative">
      <div className="mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
          Selected Projects
        </h2>
        <p className="text-muted text-sm max-w-md">
          A selection of system design, computer graphics, and automation systems. Click on any card for technical deep-dives.
        </p>
      </div>

      {projects === null ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="glass-panel rounded-3xl p-6 h-80 flex flex-col justify-between border-white/5 bg-white/[0.01] opacity-40">
              <div className="space-y-4">
                <div className="h-32 rounded-2xl bg-white/5 mb-6" />
                <div className="h-6 bg-white/10 rounded w-48" />
                <div className="space-y-2 mt-3">
                  <div className="h-3 bg-white/10 rounded w-full" />
                  <div className="h-3 bg-white/10 rounded w-[60%]" />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <div className="h-5 bg-white/5 rounded w-12" />
                <div className="h-5 bg-white/5 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center glass-panel rounded-3xl border border-white/5 bg-white/[0.01] max-w-md mx-auto">
          <p className="text-xs text-muted leading-relaxed">
            My projects portfolio is currently being updated. Please check back soon or log in to the admin panel to add them.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Tilt key={project.id} className="h-full">
              <motion.div
                layoutId={`card-container-${project.id}`}
                onClick={() => setSelectedProject(project)}
                className="glass-panel rounded-3xl p-6 h-full flex flex-col justify-between cursor-pointer group hover:border-white/10 transition-colors duration-300"
              >
              <div>
                {/* Decorative colored gradient thumbnail */}
                <div
                  className={`w-full h-36 rounded-2xl bg-gradient-to-tr ${project.color} opacity-80 group-hover:opacity-100 transition-opacity duration-300 mb-6 relative overflow-hidden flex items-center justify-center`}
                >
                  {project.image_public_id ? (
                    <CldImage
                      src={project.image_public_id}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
                  )}
                  <div className="absolute bottom-4 left-4 text-white font-mono text-xs font-bold bg-black/30 px-3 py-1 rounded-full border border-white/5 z-10">
                    {project.role}
                  </div>
                </div>

                <motion.h3
                  layoutId={`card-title-${project.id}`}
                  className="text-xl font-semibold text-white mb-1 group-hover:text-indigo-400 transition-colors"
                >
                  {project.title}
                </motion.h3>
                <p className="text-xs text-indigo-300 font-medium mb-3">
                  {project.subtitle}
                </p>
                <p className="text-xs text-muted leading-relaxed mb-4">
                  {project.description}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[10px] bg-white/5 border border-white/5 rounded text-white/70"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="px-2 py-0.5 text-[10px] bg-white/5 border border-white/5 rounded text-white/40">
                      +{project.tags.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center text-xs text-indigo-400 group-hover:text-indigo-300 font-semibold gap-1">
                  Technical Deep-Dive <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          </Tilt>
        ))}
      </div>
      )}
      {/* Shared Layout Expanded Modal Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Darkened backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              layoutId={`card-container-${selectedProject.id}`}
              className="w-full max-w-2xl bg-[#0c0c0e] border border-white/10 rounded-3xl overflow-hidden relative z-10 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              {/* Header Gradient */}
              <div
                className={`w-full h-48 bg-gradient-to-tr ${selectedProject.color} relative p-8 flex flex-col justify-end overflow-hidden`}
              >
                {selectedProject.image_public_id ? (
                  <CldImage
                    src={selectedProject.image_public_id}
                    alt={selectedProject.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover opacity-80"
                  />
                ) : null}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white/80 hover:text-white transition-all border border-white/5 z-10"
                >
                  <X size={18} />
                </button>
                <div className="absolute top-4 left-4 text-xs font-mono font-bold bg-black/40 px-3 py-1 rounded-full border border-white/5 text-indigo-300 z-10">
                  {selectedProject.role}
                </div>
                <motion.h3
                  layoutId={`card-title-${selectedProject.id}`}
                  className="text-2xl md:text-3xl font-bold text-white mb-1 z-10"
                >
                  {selectedProject.title}
                </motion.h3>
                <p className="text-white/90 text-sm font-medium z-10">
                  {selectedProject.subtitle}
                </p>
              </div>

              {/* Modal Body */}
              <div className="p-6 md:p-8 space-y-6">
                <div>
                  <h4 className="text-xs text-muted font-bold uppercase tracking-wider mb-2">Project Overview</h4>
                  <p className="text-sm text-white/90 leading-relaxed">
                    {selectedProject.detailedDescription}
                  </p>
                </div>

                {/* Key Metrics / Specs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-500/15 text-indigo-400 rounded-xl">
                      <Layers size={18} />
                    </div>
                    <div>
                      <h5 className="text-[10px] text-muted uppercase tracking-wider font-semibold">Performance Metrics</h5>
                      <p className="text-xs text-white font-medium">{selectedProject.metrics}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-500/15 text-indigo-400 rounded-xl">
                      <Award size={18} />
                    </div>
                    <div>
                      <h5 className="text-[10px] text-muted uppercase tracking-wider font-semibold">My Role</h5>
                      <p className="text-xs text-white font-medium">{selectedProject.role}</p>
                    </div>
                  </div>
                </div>

                {/* Technologies used */}
                <div>
                  <h4 className="text-xs text-muted font-bold uppercase tracking-wider mb-3">Technologies Employed</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-white/5 border border-white/5 hover:border-indigo-500/20 rounded-xl text-xs text-white/95 font-medium transition-all"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-white/5 flex gap-4">
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm rounded-xl transition-all border border-white/5"
                  >
                    <Github size={16} /> Repository
                  </a>
                  <a
                    href={selectedProject.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/20"
                  >
                    <ExternalLink size={16} /> Live Demo
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
