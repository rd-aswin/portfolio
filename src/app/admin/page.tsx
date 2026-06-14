"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Inbox, Settings, FolderPlus, MessageSquare, ArrowLeft, CheckCircle2 } from "lucide-react";

import { isSupabaseDemoMode } from "@/lib/supabase";
import FluidMesh from "@/components/background/fluid-mesh";
import Grain from "@/components/background/grain";

// Subcomponents
import AdminLogin from "@/components/admin/AdminLogin";
import AdminInbox from "@/components/admin/AdminInbox";
import AdminConfig from "@/components/admin/AdminConfig";
import AdminProjects from "@/components/admin/AdminProjects";
import AdminTestimonials from "@/components/admin/AdminTestimonials";

// Types
import { ContactSubmission, SiteConfig, ProjectItem, TestimonialItem } from "@/types";

// Mock initial data for Demo mode
const mockSubmissions: ContactSubmission[] = [
  { id: "1", name: "David Kim", email: "david@cyber.security", message: "Hey Aswin, we're looking to consult on a distributed key-value database config syncing system next month. Let us know if you're open.", created_at: "2026-06-14T10:15:00Z" },
  { id: "2", name: "Alice Vance", email: "alice@vance.design", message: "Stunning WebGL shader refraction work on your website! Let's collaborate on an agency project.", created_at: "2026-06-14T09:20:00Z" }
];

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  
  const [activeTab, setActiveTab] = useState<"inbox" | "config" | "projects" | "testimonials">("inbox");
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [config, setConfig] = useState<SiteConfig>({
    owner_name: "Aswin",
    tagline: "Software Engineer Specialized in Resilient Systems",
    about_text: "A software engineer specialized in designing exceptional, interactive, and high-performance web applications using modern web ecosystems.",
    availability_status: "available",
    phone_number: "+918075483385",
    email_address: "aswin@example.com"
  });

  const [projects, setProjects] = useState<ProjectItem[]>([
    { id: "aetherdb", title: "AetherDB", subtitle: "Distributed Raft Consensus Engine", tags: "Go, Raft, gRPC", image_public_id: "cld-sample-5" },
    { id: "prism-webgl", title: "Prism WebGL", subtitle: "Glass Refraction Simulator", tags: "WebGL, Three.js, GLSL", image_public_id: "cld-sample-5" }
  ]);
  const [newProject, setNewProject] = useState({ title: "", subtitle: "", tags: "", file: null as File | null });

  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([
    { id: "1", author: "Sarah Jenkins", quote: "Aswin designed and implemented our core synchronization engine.", title: "CTO", company: "FinSphere Inc." }
  ]);
  const [newTestimonial, setNewTestimonial] = useState({ author: "", quote: "", title: "", company: "" });

  const [isUploading, setIsUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Check session storage on mount
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem("admin_authenticated");
    if (sessionAuth === "true") {
      const sessionPass = sessionStorage.getItem("admin_password");
      setTimeout(() => {
        if (sessionPass) {
          setPassword(sessionPass);
        }
        setIsAuthenticated(true);
      }, 0);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "aswinadmin";
    if (password === correctPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_authenticated", "true");
      sessionStorage.setItem("admin_password", password);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      if (isSupabaseDemoMode) {
        setSubmissions(mockSubmissions);
        return;
      }

      try {
        const correctPassword = password || sessionStorage.getItem("admin_password") || "";
        const res = await fetch("/api/admin/submissions", {
          headers: {
            "Authorization": `Bearer ${correctPassword}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setSubmissions(data);
        } else {
          console.error("Failed to fetch submissions:", res.statusText);
        }
      } catch (err) {
        console.error("Error fetching submissions:", err);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, password]);

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

    const added: ProjectItem = {
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

    const added: TestimonialItem = {
      id: Date.now().toString(),
      ...newTestimonial
    };

    setTestimonials([...testimonials, added]);
    setNewTestimonial({ author: "", quote: "", title: "", company: "" });
    triggerSaveNotification("Testimonial Added!");
  };

  const handleDeleteItem = async (id: string, type: "project" | "testimonial" | "submission") => {
    if (type === "project") {
      setProjects(projects.filter(p => p.id !== id));
      triggerSaveNotification("Project Deleted");
    } else if (type === "testimonial") {
      setTestimonials(testimonials.filter(t => t.id !== id));
      triggerSaveNotification("Testimonial Deleted");
    } else {
      if (isSupabaseDemoMode) {
        setSubmissions(submissions.filter(s => s.id !== id));
        triggerSaveNotification("Submission Removed (Demo)");
        return;
      }

      try {
        const correctPassword = password || sessionStorage.getItem("admin_password") || "";
        const res = await fetch(`/api/admin/submissions?id=${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${correctPassword}`
          }
        });
        if (res.ok) {
          setSubmissions(submissions.filter(s => s.id !== id));
          triggerSaveNotification("Submission Deleted");
        } else {
          console.error("Failed to delete submission");
        }
      } catch (err) {
        console.error("Error deleting submission:", err);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <AdminLogin
        password={password}
        setPassword={setPassword}
        authError={authError}
        setAuthError={setAuthError}
        handleLogin={handleLogin}
      />
    );
  }

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
            {activeTab === "inbox" && (
              <AdminInbox submissions={submissions} onDelete={handleDeleteItem} />
            )}

            {activeTab === "config" && (
              <AdminConfig config={config} setConfig={setConfig} onSave={handleSaveConfig} />
            )}

            {activeTab === "projects" && (
              <AdminProjects
                projects={projects}
                newProject={newProject}
                setNewProject={setNewProject}
                isUploading={isUploading}
                onAddProject={handleAddProject}
                onDelete={handleDeleteItem}
              />
            )}

            {activeTab === "testimonials" && (
              <AdminTestimonials
                testimonials={testimonials}
                newTestimonial={newTestimonial}
                setNewTestimonial={setNewTestimonial}
                onAddTestimonial={handleAddTestimonial}
                onDelete={handleDeleteItem}
              />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
