"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Inbox, Settings, FolderPlus, MessageSquare, ArrowLeft, CheckCircle2, Calendar } from "lucide-react";

import { isSupabaseDemoMode } from "@/lib/supabase";
import FluidMesh from "@/components/background/fluid-mesh";
import Grain from "@/components/background/grain";

// Subcomponents
import AdminLogin from "@/components/admin/AdminLogin";
import AdminInbox from "@/components/admin/AdminInbox";
import AdminConfig from "@/components/admin/AdminConfig";
import AdminProjects from "@/components/admin/AdminProjects";
import AdminTestimonials from "@/components/admin/AdminTestimonials";
import AdminTimeline from "@/components/admin/AdminTimeline";

// Types
import { ContactSubmission, SiteConfig, ProjectItem, TestimonialItem, TimelineItem } from "@/types";

// Mock initial data for Demo mode
const mockSubmissions: ContactSubmission[] = [
  { id: "1", name: "David Kim", email: "david@cyber.security", message: "Hey Aswin, we're looking to consult on a distributed key-value database config syncing system next month. Let us know if you're open.", created_at: "2026-06-14T10:15:00Z" },
  { id: "2", name: "Alice Vance", email: "alice@vance.design", message: "Stunning WebGL shader refraction work on your website! Let's collaborate on an agency project.", created_at: "2026-06-14T09:20:00Z" }
];

const mockTimelineItems: TimelineItem[] = [
  {
    id: "exp-1",
    year: "2024 - Present",
    title: "Senior Frontend Engineer",
    company: "Apex Tech Solutions",
    description: "Architecting accessible design systems and leading migration of enterprise dashboards to Next.js App Router, increasing page speeds by 35%.",
    skills: "Next.js, React, TypeScript, Tailwind CSS, Framer Motion",
    type: "work",
  },
  {
    id: "exp-2",
    year: "2022 - 2024",
    title: "Software Engineer II",
    company: "Vector Systems",
    description: "Developed and maintained full-stack internal tooling. Optimized REST/GraphQL API gateway responses, reducing network payload sizes by 20%.",
    skills: "Node.js, GraphQL, PostgreSQL, Docker, AWS",
    type: "work",
  },
  {
    id: "exp-3",
    year: "2018 - 2022",
    title: "B.Tech in Computer Science",
    company: "State University of Technology",
    description: "Graduated with Honors. Focused coursework in Distributed Systems, Object Oriented Programming, and Web Engineering.",
    skills: "Data Structures, Algorithms, C++, JavaScript, SQL",
    type: "education",
  },
];

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  
  const [activeTab, setActiveTab] = useState<"inbox" | "config" | "projects" | "testimonials" | "timeline">("inbox");
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [config, setConfig] = useState<SiteConfig>({
    owner_name: "Aswin",
    tagline: "Software Engineer Specialized in Resilient Systems",
    about_text: "A software engineer specialized in designing exceptional, interactive, and high-performance web applications using modern web ecosystems.",
    availability_status: "available",
    phone_number: "+918075483385",
    email_address: "aswin@example.com",
    tech_stack: "Next.js, React, TypeScript, Tailwind CSS, GSAP, Framer Motion",
    github_url: "https://github.com/rd-aswin",
    linkedin_url: "https://linkedin.com",
    telegram_bot_token: "",
    telegram_chat_id: ""
  });

  const [projects, setProjects] = useState<ProjectItem[]>([
    { id: "aetherdb", title: "AetherDB", subtitle: "Distributed Raft Consensus Engine", tags: "Go, Raft, gRPC", image_public_id: "cld-sample-5" },
    { id: "prism-webgl", title: "Prism WebGL", subtitle: "Glass Refraction Simulator", tags: "WebGL, Three.js, GLSL", image_public_id: "cld-sample-5" }
  ]);
  const [newProject, setNewProject] = useState({
    title: "",
    subtitle: "",
    tags: "",
    file: null as File | null,
    description: "",
    detailed_description: "",
    role: "",
    metrics: "",
    github_url: "",
    demo_url: "",
    color: "from-indigo-600 to-violet-500"
  });

  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([
    { id: "1", author: "Sarah Jenkins", quote: "Aswin designed and implemented our core synchronization engine.", title: "CTO", company: "FinSphere Inc." }
  ]);
  const [newTestimonial, setNewTestimonial] = useState({ author: "", quote: "", title: "", company: "" });

  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [newTimelineItem, setNewTimelineItem] = useState({
    year: "",
    title: "",
    company: "",
    description: "",
    skills: "",
    type: "work" as "work" | "education" | "award"
  });

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSupabaseDemoMode) {
      // Allow demo bypass using default password
      if (password === "aswinadmin") {
        setIsAuthenticated(true);
        sessionStorage.setItem("admin_authenticated", "true");
        sessionStorage.setItem("admin_password", password);
        setAuthError(false);
      } else {
        setAuthError(true);
      }
      return;
    }

    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${password}`
        }
      });

      if (res.ok) {
        setIsAuthenticated(true);
        sessionStorage.setItem("admin_authenticated", "true");
        sessionStorage.setItem("admin_password", password);
        setAuthError(false);
      } else {
        setAuthError(true);
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setAuthError(true);
    }
  };

  const handleAuthFailure = () => {
    sessionStorage.removeItem("admin_authenticated");
    sessionStorage.removeItem("admin_password");
    setIsAuthenticated(false);
    setAuthError(true);
    console.warn("Session expired or password invalid. Resetting authentication.");
  };

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      if (isSupabaseDemoMode) {
        setSubmissions(mockSubmissions);
        setTimelineItems(mockTimelineItems);
        return;
      }

      try {
        const correctPassword = password || sessionStorage.getItem("admin_password") || "";
        const headers = { "Authorization": `Bearer ${correctPassword}` };

        // 1. Fetch submissions
        const resSubs = await fetch("/api/admin/submissions", { headers });
        if (resSubs.ok) {
          const data = await resSubs.json();
          setSubmissions(data);
        } else if (resSubs.status === 401) {
          handleAuthFailure();
          return;
        }

        // 2. Fetch config
        const resConfig = await fetch("/api/admin/config");
        if (resConfig.ok) {
          const data = await resConfig.json();
          if (data) setConfig(data);
        }

        // 3. Fetch projects
        const resProj = await fetch("/api/admin/projects");
        if (resProj.ok) {
          const data = await resProj.json();
          if (data) setProjects(data);
        }

        // 4. Fetch testimonials
        const resTest = await fetch("/api/admin/testimonials");
        if (resTest.ok) {
          const data = await resTest.json();
          if (data) setTestimonials(data);
        }

        // 5. Fetch timeline
        const resTimeline = await fetch("/api/admin/timeline");
        if (resTimeline.ok) {
          const data = await resTimeline.json();
          if (data) setTimelineItems(data);
        }

      } catch (err) {
        console.error("Error fetching admin dashboard data:", err);
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
    if (isSupabaseDemoMode) {
      triggerSaveNotification("Site Configuration Updated (Demo)!");
      return;
    }

    try {
      const correctPassword = password || sessionStorage.getItem("admin_password") || "";
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${correctPassword}`
        },
        body: JSON.stringify(config)
      });

      if (res.ok) {
        triggerSaveNotification("Site Configuration Updated!");
      } else if (res.status === 401) {
        handleAuthFailure();
      } else {
        console.error("Failed to update config");
      }
    } catch (err) {
      console.error("Error saving config:", err);
    }
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
      image_public_id: publicId,
      description: newProject.description,
      detailed_description: newProject.detailed_description,
      role: newProject.role,
      metrics: newProject.metrics,
      github_url: newProject.github_url,
      demo_url: newProject.demo_url,
      color: newProject.color
    };

    if (isSupabaseDemoMode) {
      setProjects([...projects, added]);
      setNewProject({
        title: "",
        subtitle: "",
        tags: "",
        file: null,
        description: "",
        detailed_description: "",
        role: "",
        metrics: "",
        github_url: "",
        demo_url: "",
        color: "from-indigo-600 to-violet-500"
      });
      triggerSaveNotification("Project Added (Demo)!");
      return;
    }

    try {
      const correctPassword = password || sessionStorage.getItem("admin_password") || "";
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${correctPassword}`
        },
        body: JSON.stringify(added)
      });

      if (res.ok) {
        const savedProject = await res.json();
        setProjects([...projects, savedProject]);
        setNewProject({
          title: "",
          subtitle: "",
          tags: "",
          file: null,
          description: "",
          detailed_description: "",
          role: "",
          metrics: "",
          github_url: "",
          demo_url: "",
          color: "from-indigo-600 to-violet-500"
        });
        triggerSaveNotification("Project Added!");
      } else if (res.status === 401) {
        handleAuthFailure();
      } else {
        console.error("Failed to add project");
      }
    } catch (err) {
      console.error("Error adding project:", err);
    }
  };

  const handleEditProject = async (updatedProject: ProjectItem) => {
    if (isSupabaseDemoMode) {
      setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
      triggerSaveNotification("Project Updated (Demo)!");
      return true;
    }

    try {
      const correctPassword = password || sessionStorage.getItem("admin_password") || "";
      const res = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${correctPassword}`
        },
        body: JSON.stringify(updatedProject)
      });

      if (res.ok) {
        const savedProject = await res.json();
        setProjects(projects.map(p => p.id === savedProject.id ? savedProject : p));
        triggerSaveNotification("Project Updated!");
        return true;
      } else if (res.status === 401) {
        handleAuthFailure();
        return false;
      } else {
        console.error("Failed to update project");
        return false;
      }
    } catch (err) {
      console.error("Error updating project:", err);
      return false;
    }
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonial.author || !newTestimonial.quote) return;

    const added: TestimonialItem = {
      id: Date.now().toString(),
      ...newTestimonial
    };

    if (isSupabaseDemoMode) {
      setTestimonials([...testimonials, added]);
      setNewTestimonial({ author: "", quote: "", title: "", company: "" });
      triggerSaveNotification("Testimonial Added (Demo)!");
      return;
    }

    try {
      const correctPassword = password || sessionStorage.getItem("admin_password") || "";
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${correctPassword}`
        },
        body: JSON.stringify(added)
      });

      if (res.ok) {
        const savedTestimonial = await res.json();
        setTestimonials([...testimonials, savedTestimonial]);
        setNewTestimonial({ author: "", quote: "", title: "", company: "" });
        triggerSaveNotification("Testimonial Added!");
      } else if (res.status === 401) {
        handleAuthFailure();
      } else {
        console.error("Failed to add testimonial");
      }
    } catch (err) {
      console.error("Error adding testimonial:", err);
    }
  };

  const handleAddTimelineItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTimelineItem.year || !newTimelineItem.title || !newTimelineItem.company) return;

    const added: TimelineItem = {
      id: Date.now().toString(),
      ...newTimelineItem
    };

    if (isSupabaseDemoMode) {
      setTimelineItems([...timelineItems, added]);
      setNewTimelineItem({ year: "", title: "", company: "", description: "", skills: "", type: "work" });
      triggerSaveNotification("Timeline Item Added (Demo)!");
      return;
    }

    try {
      const correctPassword = password || sessionStorage.getItem("admin_password") || "";
      const res = await fetch("/api/admin/timeline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${correctPassword}`
        },
        body: JSON.stringify(added)
      });

      if (res.ok) {
        const savedItem = await res.json();
        setTimelineItems([...timelineItems, savedItem]);
        setNewTimelineItem({ year: "", title: "", company: "", description: "", skills: "", type: "work" });
        triggerSaveNotification("Timeline Item Added!");
      } else if (res.status === 401) {
        handleAuthFailure();
      } else {
        console.error("Failed to add timeline item");
      }
    } catch (err) {
      console.error("Error adding timeline item:", err);
    }
  };

  const handleEditTimelineItem = async (updatedItem: TimelineItem) => {
    if (isSupabaseDemoMode) {
      setTimelineItems(timelineItems.map(t => t.id === updatedItem.id ? updatedItem : t));
      triggerSaveNotification("Timeline Item Updated (Demo)!");
      return true;
    }

    try {
      const correctPassword = password || sessionStorage.getItem("admin_password") || "";
      const res = await fetch("/api/admin/timeline", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${correctPassword}`
        },
        body: JSON.stringify(updatedItem)
      });

      if (res.ok) {
        const savedItem = await res.json();
        setTimelineItems(timelineItems.map(t => t.id === savedItem.id ? savedItem : t));
        triggerSaveNotification("Timeline Item Updated!");
        return true;
      } else if (res.status === 401) {
        handleAuthFailure();
        return false;
      } else {
        console.error("Failed to update timeline item");
        return false;
      }
    } catch (err) {
      console.error("Error updating timeline item:", err);
      return false;
    }
  };

  const handleDeleteItem = async (id: string, type: "project" | "testimonial" | "submission" | "timeline") => {
    if (isSupabaseDemoMode) {
      if (type === "project") {
        setProjects(projects.filter(p => p.id !== id));
        triggerSaveNotification("Project Deleted (Demo)");
      } else if (type === "testimonial") {
        setTestimonials(testimonials.filter(t => t.id !== id));
        triggerSaveNotification("Testimonial Deleted (Demo)");
      } else if (type === "timeline") {
        setTimelineItems(timelineItems.filter(t => t.id !== id));
        triggerSaveNotification("Timeline Item Deleted (Demo)");
      } else {
        setSubmissions(submissions.filter(s => s.id !== id));
        triggerSaveNotification("Submission Removed (Demo)");
      }
      return;
    }

    try {
      const correctPassword = password || sessionStorage.getItem("admin_password") || "";
      const headers = { "Authorization": `Bearer ${correctPassword}` };
      let endpoint = "";

      if (type === "project") {
        endpoint = `/api/admin/projects?id=${id}`;
      } else if (type === "testimonial") {
        endpoint = `/api/admin/testimonials?id=${id}`;
      } else if (type === "timeline") {
        endpoint = `/api/admin/timeline?id=${id}`;
      } else {
        endpoint = `/api/admin/submissions?id=${id}`;
      }

      const res = await fetch(endpoint, {
        method: "DELETE",
        headers
      });

      if (res.ok) {
        if (type === "project") {
          setProjects(projects.filter(p => p.id !== id));
          triggerSaveNotification("Project Deleted");
        } else if (type === "testimonial") {
          setTestimonials(testimonials.filter(t => t.id !== id));
          triggerSaveNotification("Testimonial Deleted");
        } else if (type === "timeline") {
          setTimelineItems(timelineItems.filter(t => t.id !== id));
          triggerSaveNotification("Timeline Item Deleted");
        } else {
          setSubmissions(submissions.filter(s => s.id !== id));
          triggerSaveNotification("Submission Deleted");
        }
      } else if (res.status === 401) {
        handleAuthFailure();
      } else {
        console.error(`Failed to delete ${type}`);
      }
    } catch (err) {
      console.error(`Error deleting ${type}:`, err);
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
              { id: "testimonials", label: "Feedback", icon: MessageSquare },
              { id: "timeline", label: "Journey", icon: Calendar }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "inbox" | "config" | "projects" | "testimonials" | "timeline")}
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
                onEditProject={handleEditProject}
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

            {activeTab === "timeline" && (
              <AdminTimeline
                timelineItems={timelineItems}
                newTimelineItem={newTimelineItem}
                setNewTimelineItem={setNewTimelineItem}
                onAddTimelineItem={handleAddTimelineItem}
                onEditTimelineItem={handleEditTimelineItem}
                onDelete={handleDeleteItem}
              />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
