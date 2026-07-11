"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, UploadCloud, CheckCircle2, RefreshCw, Plus, Pencil, X, Check } from "lucide-react";
import { ProjectItem } from "@/types";

interface AdminProjectsProps {
  projects: ProjectItem[];
  newProject: {
    title: string;
    subtitle: string;
    tags: string;
    file: File | null;
    description: string;
    detailed_description: string;
    role: string;
    metrics: string;
    github_url: string;
    demo_url: string;
    color: string;
  };
  setNewProject: React.Dispatch<React.SetStateAction<{
    title: string;
    subtitle: string;
    tags: string;
    file: File | null;
    description: string;
    detailed_description: string;
    role: string;
    metrics: string;
    github_url: string;
    demo_url: string;
    color: string;
  }>>;
  isUploading: boolean;
  onAddProject: (e: React.FormEvent) => void;
  onEditProject: (project: ProjectItem) => Promise<boolean>;
  onDelete: (id: string, type: "project") => void;
}

const colorOptions = [
  { name: "Indigo Blue", value: "from-indigo-600 to-blue-500" },
  { name: "Fuchsia Pink", value: "from-fuchsia-600 to-pink-500" },
  { name: "Emerald Teal", value: "from-emerald-600 to-teal-500" },
  { name: "Violet Purple", value: "from-violet-600 to-purple-500" },
  { name: "Orange Red", value: "from-orange-600 to-red-500" }
];

export default function AdminProjects({
  projects,
  newProject,
  setNewProject,
  isUploading,
  onAddProject,
  onEditProject,
  onDelete,
}: AdminProjectsProps) {
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const isEditing = editingProject !== null;
  const [localUploading, setLocalUploading] = useState(false);

  const handleChange = (field: string, value: string) => {
    if (isEditing && editingProject) {
      setEditingProject({ ...editingProject, [field]: value });
    } else {
      setNewProject({ ...newProject, [field]: value });
    }
  };

  const handleFileUpload = async (file: File) => {
    setLocalUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.public_id) {
        if (isEditing && editingProject) {
          setEditingProject({ ...editingProject, image_public_id: data.public_id });
        } else {
          setNewProject({ ...newProject, file, ...{ image_public_id: data.public_id } }); // Note: handled during submission in parent
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setLocalUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editingProject) {
      const success = await onEditProject(editingProject);
      if (success) {
        setEditingProject(null);
      }
    } else {
      onAddProject(e);
    }
  };

  return (
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
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingProject(project);
                    // Scroll smoothly to form
                    setTimeout(() => {
                      const formElement = document.getElementById("project-form");
                      if (formElement) {
                        formElement.scrollIntoView({ behavior: "smooth", block: "center" });
                      }
                    }, 100);
                  }}
                  className="p-2 text-muted hover:text-indigo-400 transition-colors rounded-lg bg-white/5 hover:bg-indigo-500/10"
                  title="Edit Project"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => {
                    if (editingProject?.id === project.id) {
                      setEditingProject(null);
                    }
                    onDelete(project.id, "project");
                  }}
                  className="p-2 text-muted hover:text-red-400 transition-colors rounded-lg bg-white/5 hover:bg-red-500/10"
                  title="Delete Project"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Form */}
      <div id="project-form" className="border-t border-white/5 pt-8">
        <h3 className="text-sm font-semibold text-white mb-4">
          {isEditing ? `Edit Project: ${editingProject.title}` : "Add New Project"}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/80">Project Title</label>
                <input
                  type="text"
                  required
                  value={isEditing && editingProject ? editingProject.title : newProject.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
                  placeholder="e.g. AetherDB"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/80">Subtitle / Tagline</label>
                <input
                  type="text"
                  required
                  value={isEditing && editingProject ? editingProject.subtitle : newProject.subtitle}
                  onChange={(e) => handleChange("subtitle", e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
                  placeholder="e.g. Distributed consensus engine"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/80">Role in Project</label>
                <input
                  type="text"
                  required
                  value={isEditing && editingProject ? editingProject.role || "" : newProject.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
                  placeholder="e.g. Lead Developer"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/80">Performance Metrics</label>
                <input
                  type="text"
                  required
                  value={isEditing && editingProject ? editingProject.metrics || "" : newProject.metrics}
                  onChange={(e) => handleChange("metrics", e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
                  placeholder="e.g. 15k+ writes/sec"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/80">Repository URL</label>
                <input
                  type="text"
                  value={isEditing && editingProject ? editingProject.github_url || "" : newProject.github_url}
                  onChange={(e) => handleChange("github_url", e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
                  placeholder="e.g. https://github.com/..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/80">Live Demo URL</label>
                <input
                  type="text"
                  value={isEditing && editingProject ? editingProject.demo_url || "" : newProject.demo_url}
                  onChange={(e) => handleChange("demo_url", e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
                  placeholder="e.g. https://demo.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/80">Color Theme Gradient</label>
                <select
                  value={isEditing && editingProject ? editingProject.color || "" : newProject.color}
                  onChange={(e) => handleChange("color", e.target.value)}
                  className="w-full px-4 py-3 bg-[#0d0d0d] border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
                >
                  {colorOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/80">Technologies (Comma separated)</label>
                <input
                  type="text"
                  required
                  value={isEditing && editingProject ? editingProject.tags : newProject.tags}
                  onChange={(e) => handleChange("tags", e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
                  placeholder="e.g. Go, gRPC, React"
                />
              </div>
            </div>
          </div>

          {/* Screenshot & Descriptions Column */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/80">Overview description</label>
              <input
                type="text"
                required
                value={isEditing && editingProject ? editingProject.description || "" : newProject.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
                placeholder="A brief overview card summary..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/80">Detailed Technical Description (Modal view)</label>
              <textarea
                rows={3}
                required
                value={isEditing && editingProject ? editingProject.detailed_description || "" : newProject.detailed_description}
                onChange={(e) => handleChange("detailed_description", e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none resize-none"
                placeholder="Detailed technical specifications, Raft consensus setup, benchmarks, etc..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/80">Project Screenshot (Cloudinary)</label>
              <div className="w-full h-32 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-2 bg-white/[0.01] hover:bg-white/[0.02] cursor-pointer transition-colors relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      if (!isEditing) {
                        setNewProject({ ...newProject, file: files[0] });
                      }
                      handleFileUpload(files[0]);
                    }
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {localUploading || isUploading ? (
                  <div className="text-center">
                    <RefreshCw size={20} className="animate-spin text-indigo-400 mx-auto mb-1" />
                    <p className="text-[9px] text-muted">Uploading to cloud...</p>
                  </div>
                ) : (isEditing && editingProject?.image_public_id) || (!isEditing && newProject.file) ? (
                  <div className="text-center">
                    <CheckCircle2 size={20} className="text-indigo-400 mx-auto mb-1" />
                    <p className="text-[9px] text-white font-medium">
                      {isEditing ? `Linked Image: ${editingProject.image_public_id}` : newProject.file?.name}
                    </p>
                    <p className="text-[8px] text-muted">Click or drag to replace image</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <UploadCloud size={20} className="text-muted mx-auto mb-1" />
                    <p className="text-[9px] text-white font-medium">Click or drag to upload screenshot</p>
                    <p className="text-[7px] text-muted">Uploaded directly to Cloudinary</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isUploading || localUploading}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                {isUploading || localUploading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> Saving...
                  </>
                ) : isEditing ? (
                  <>
                    <Check size={14} /> Save Changes
                  </>
                ) : (
                  <>
                    <Plus size={14} /> Add Project
                  </>
                )}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="py-3 px-5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <X size={14} /> Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
