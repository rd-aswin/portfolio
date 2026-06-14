"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Inbox, Settings, FolderPlus, MessageSquare, Save, Plus, 
  Trash2, UploadCloud, CheckCircle2, ArrowLeft, RefreshCw
} from "lucide-react";
import { supabase, isSupabaseDemoMode } from "@/lib/supabase";
import FluidMesh from "@/components/background/fluid-mesh";
import Grain from "@/components/background/grain";

// Mock initial data for Demo mode
const mockSubmissions = [
  { id: "1", name: "David Kim", email: "david@cyber.security", message: "Hey Aswin, we're looking to consult on a distributed key-value database config syncing system next month. Let us know if you're open.", created_at: "2026-06-14T10:15:00Z" },
  { id: "2", name: "Alice Vance", email: "alice@vance.design", message: "Stunning WebGL shader refraction work on your website! Let's collaborate on an agency project.", created_at: "2026-06-14T09:20:00Z" }
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"inbox" | "config" | "projects" | "testimonials">("inbox");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [config, setConfig] = useState({
    owner_name: "Aswin",
    tagline: "Software Engineer Specialized in Resilient Systems",
    about_text: "A software engineer specialized in designing exceptional, interactive, and high-performance web applications using modern web ecosystems.",
    availability_status: "available",
    phone_number: "+918075483385",
    email_address: "aswin@example.com"
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [projects, setProjects] = useState<any[]>([
    { id: "aetherdb", title: "AetherDB", subtitle: "Distributed Raft Consensus Engine", tags: "Go, Raft, gRPC", image_public_id: "cld-sample-5" },
    { id: "prism-webgl", title: "Prism WebGL", subtitle: "Glass Refraction Simulator", tags: "WebGL, Three.js, GLSL", image_public_id: "cld-sample-5" }
  ]);
  const [newProject, setNewProject] = useState({ title: "", subtitle: "", tags: "", file: null as File | null });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [testimonials, setTestimonials] = useState<any[]>([
    { id: "1", author: "Sarah Jenkins", quote: "Aswin designed and implemented our core synchronization engine.", title: "CTO", company: "FinSphere Inc." }
  ]);
  const [newTestimonial, setNewTestimonial] = useState({ author: "", quote: "", title: "", company: "" });

  const [isUploading, setIsUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      if (isSupabaseDemoMode) {
        setSubmissions(mockSubmissions);
        return;
      }

      // Fetch submissions
      const { data: subs } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
      if (subs) setSubmissions(subs);
    };
    fetchData();
  }, []);

  const triggerSaveNotification = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerSaveNotification("Site Configuration Updated!");
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title) return;

    let publicId = "cld-sample-5"; // Fallback demo image

    if (newProject.file) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", newProject.file);

        // Upload using our secure server-side endpoint (No client key leaks!)
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData
        });
        const data = await res.json();
        if (data.public_id) {
          publicId = data.public_id;
        }
      } catch (err) {
        console.error("Upload error:", err);
      } finally {
        setIsUploading(false);
      }
    }

    const added = {
      id: Date.now().toString(),
      title: newProject.title,
      subtitle: newProject.subtitle,
      tags: newProject.tags,
      image_public_id: publicId
    };

    setProjects([...projects, added]);
    setNewProject({ title: "", subtitle: "", tags: "", file: null });
    triggerSaveNotification("Project Added!");
  };

  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonial.author || !newTestimonial.quote) return;

    const added = {
      id: Date.now().toString(),
      ...newTestimonial
    };

    setTestimonials([...testimonials, added]);
    setNewTestimonial({ author: "", quote: "", title: "", company: "" });
    triggerSaveNotification("Testimonial Added!");
  };

  const handleDeleteItem = (id: string, type: "project" | "testimonial" | "submission") => {
    if (type === "project") {
      setProjects(projects.filter(p => p.id !== id));
      triggerSaveNotification("Project Deleted");
    } else if (type === "testimonial") {
      setTestimonials(testimonials.filter(t => t.id !== id));
      triggerSaveNotification("Testimonial Deleted");
    } else {
      setSubmissions(submissions.filter(s => s.id !== id));
      triggerSaveNotification("Submission Removed");
    }
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden pb-16 selection:bg-indigo-500/30 selection:text-white">
      <FluidMesh />
      <Grain />

      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 pt-12">
        {/* Top Header Controls */}
        <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all duration-200 border border-white/5"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                Control Center
              </h1>
              <p className="text-xs text-muted">
                {isSupabaseDemoMode ? "Operating in Demo Mode" : "Secure Production Mode"}
              </p>
            </div>
          </div>

          {/* Tab Switchers */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
            {[
              { id: "inbox", label: "Inbox", icon: Inbox },
              { id: "config", label: "Config", icon: Settings },
              { id: "projects", label: "Projects", icon: FolderPlus },
              { id: "testimonials", label: "Feedback", icon: MessageSquare }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "inbox" | "config" | "projects" | "testimonials")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-muted hover:text-white"
                  }`}
                >
                  <Icon size={14} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Save Notifications */}
        <AnimatePresence>
          {saveStatus && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-6 left-1/2 -translate-x-1/2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-emerald-500/5 z-50 flex items-center gap-2"
            >
              <CheckCircle2 size={14} /> {saveStatus}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Layout container */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 min-h-[400px]">
          <AnimatePresence mode="wait">
            {/* 1. Inbox Submissions */}
            {activeTab === "inbox" && (
              <motion.div
                key="inbox"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-bold text-white mb-4">Contact Inbox</h2>
                {submissions.length > 0 ? (
                  <div className="space-y-4">
                    {submissions.map((sub) => (
                      <div key={sub.id} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex justify-between items-start gap-4 hover:border-indigo-500/10 transition-colors">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-sm text-white">{sub.name}</span>
                            <span className="text-xs text-indigo-400 font-mono">{sub.email}</span>
                          </div>
                          <p className="text-xs text-muted leading-relaxed max-w-xl">{sub.message}</p>
                          <span className="text-[10px] text-muted block font-mono">
                            {new Date(sub.created_at).toLocaleString()}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteItem(sub.id, "submission")}
                          className="p-2 text-muted hover:text-red-400 transition-colors rounded-lg bg-white/5 hover:bg-red-500/10"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted">No submissions in your inbox yet.</p>
                )}
              </motion.div>
            )}

            {/* 2. Global configuration */}
            {activeTab === "config" && (
              <motion.div
                key="config"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <h2 className="text-lg font-bold text-white mb-6">Global Customization</h2>
                <form onSubmit={handleSaveConfig} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white/80">Full Name</label>
                      <input
                        type="text"
                        value={config.owner_name}
                        onChange={(e) => setConfig({ ...config, owner_name: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white/80">Availability Status</label>
                      <select
                        value={config.availability_status}
                        onChange={(e) => setConfig({ ...config, availability_status: e.target.value })}
                        className="w-full px-4 py-3 bg-[#0d0d0d] border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
                      >
                        <option value="available">Available for Projects</option>
                        <option value="busy">Fully Booked</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white/80">Phone Number</label>
                      <input
                        type="text"
                        value={config.phone_number}
                        onChange={(e) => setConfig({ ...config, phone_number: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white/80">Short Tagline</label>
                      <input
                        type="text"
                        value={config.tagline}
                        onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white/80">Bio Description</label>
                      <textarea
                        rows={4}
                        value={config.about_text}
                        onChange={(e) => setConfig({ ...config, about_text: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none resize-none"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 pt-4">
                    <button
                      type="submit"
                      className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
                    >
                      <Save size={14} /> Save Changes
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* 3. Projects Showcase Editor */}
            {activeTab === "projects" && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-lg font-bold text-white mb-4">Manage Projects</h2>
                  
                  {/* Current Projects List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map((project) => (
                      <div key={project.id} className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex justify-between items-center gap-4">
                        <div>
                          <h4 className="font-bold text-sm text-white">{project.title}</h4>
                          <p className="text-[10px] text-indigo-400 font-medium">{project.subtitle}</p>
                          <p className="text-[9px] text-muted font-mono mt-1">Tags: {project.tags}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteItem(project.id, "project")}
                          className="p-2 text-muted hover:text-red-400 transition-colors rounded-lg bg-white/5 hover:bg-red-500/10"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Project Form */}
                <div className="border-t border-white/5 pt-8">
                  <h3 className="text-sm font-semibold text-white mb-4">Add New Project</h3>
                  <form onSubmit={handleAddProject} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-white/80">Project Title</label>
                        <input
                          type="text"
                          required
                          value={newProject.title}
                          onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
                          placeholder="e.g. AetherDB"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-white/80">Subtitle / Tagline</label>
                        <input
                          type="text"
                          value={newProject.subtitle}
                          onChange={(e) => setNewProject({ ...newProject, subtitle: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
                          placeholder="e.g. Distributed consensus engine"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-white/80">Technologies (Comma separated)</label>
                        <input
                          type="text"
                          value={newProject.tags}
                          onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
                          placeholder="e.g. Go, gRPC, Docker"
                        />
                      </div>
                    </div>

                    {/* Server-side file uploader */}
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-white/80">Project Screenshot (Cloudinary Upload)</label>
                        <div className="w-full aspect-video border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-4 bg-white/[0.01] hover:bg-white/[0.02] cursor-pointer transition-colors relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files && files.length > 0) {
                                setNewProject({ ...newProject, file: files[0] });
                              }
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          {newProject.file ? (
                            <div className="text-center">
                              <CheckCircle2 size={24} className="text-indigo-400 mx-auto mb-2" />
                              <p className="text-[10px] text-white font-medium">{newProject.file.name}</p>
                              <p className="text-[8px] text-muted mt-1">{(newProject.file.size / 1024).toFixed(1)} KB - Click to replace</p>
                            </div>
                          ) : (
                            <div className="text-center">
                              <UploadCloud size={24} className="text-muted mx-auto mb-2" />
                              <p className="text-[10px] text-white font-medium">Drag & Drop or Click to Select</p>
                              <p className="text-[8px] text-muted mt-1">Secure server-side uploading</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isUploading}
                          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                        >
                          {isUploading ? (
                            <>
                              <RefreshCw size={14} className="animate-spin" /> Uploading to Server...
                            </>
                          ) : (
                            <>
                              <Plus size={14} /> Add Project
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {/* 4. Testimonials manager */}
            {activeTab === "testimonials" && (
              <motion.div
                key="testimonials"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-lg font-bold text-white mb-4">Client Feedback List</h2>
                  <div className="space-y-4">
                    {testimonials.map((t) => (
                      <div key={t.id} className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <p className="text-xs italic text-white/90">
                            &quot;{t.quote}&quot;
                          </p>
                          <p className="text-[10px] text-indigo-400 font-semibold">{t.author} — <span className="text-muted font-normal">{t.title}, {t.company}</span></p>
                        </div>
                        <button
                          onClick={() => handleDeleteItem(t.id, "testimonial")}
                          className="p-2 text-muted hover:text-red-400 transition-colors rounded-lg bg-white/5 hover:bg-red-500/10"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/5 pt-8">
                  <h3 className="text-sm font-semibold text-white mb-4">Add Feedback</h3>
                  <form onSubmit={handleAddTestimonial} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-white/80">Author Name</label>
                        <input
                          type="text"
                          required
                          value={newTestimonial.author}
                          onChange={(e) => setNewTestimonial({ ...newTestimonial, author: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-white/80">Job Title</label>
                        <input
                          type="text"
                          value={newTestimonial.title}
                          onChange={(e) => setNewTestimonial({ ...newTestimonial, title: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-white/80">Company Name</label>
                        <input
                          type="text"
                          value={newTestimonial.company}
                          onChange={(e) => setNewTestimonial({ ...newTestimonial, company: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-white/80">Review / Quote</label>
                      <textarea
                        rows={3}
                        required
                        value={newTestimonial.quote}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, quote: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-1.5"
                    >
                      <Plus size={14} /> Add Testimonial
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
