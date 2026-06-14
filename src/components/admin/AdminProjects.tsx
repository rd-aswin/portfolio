"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trash2, UploadCloud, CheckCircle2, RefreshCw, Plus } from "lucide-react";
import { ProjectItem } from "@/types";

interface AdminProjectsProps {
  projects: ProjectItem[];
  newProject: { title: string; subtitle: string; tags: string; file: File | null };
  setNewProject: React.Dispatch<React.SetStateAction<{ title: string; subtitle: string; tags: string; file: File | null }>>;
  isUploading: boolean;
  onAddProject: (e: React.FormEvent) => void;
  onDelete: (id: string, type: "project") => void;
}

export default function AdminProjects({
  projects,
  newProject,
  setNewProject,
  isUploading,
  onAddProject,
  onDelete,
}: AdminProjectsProps) {
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
              <button
                onClick={() => onDelete(project.id, "project")}
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
        <form onSubmit={onAddProject} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
  );
}
