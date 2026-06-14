"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Save, UploadCloud, RefreshCw, ExternalLink } from "lucide-react";
import { SiteConfig } from "@/types";

interface AdminConfigProps {
  config: SiteConfig;
  setConfig: React.Dispatch<React.SetStateAction<SiteConfig>>;
  onSave: (e: React.FormEvent) => void;
}

export default function AdminConfig({ config, setConfig, onSave }: AdminConfigProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", files[0]);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        if (data.secure_url) {
          setConfig(prev => ({
            ...prev,
            resume_url: data.secure_url
          }));
        }
      } else {
        console.error("Failed to upload CV");
      }
    } catch (err) {
      console.error("Error uploading CV:", err);
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <motion.div
      key="config"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
    >
      <h2 className="text-lg font-bold text-white mb-6">Global Customization</h2>
      <form onSubmit={onSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <div className="space-y-1.5 col-span-1 md:col-span-2 pt-2 pb-2">
          <label className="text-xs font-semibold text-white/80">Curriculum Vitae (CV PDF)</label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept=".pdf"
              onChange={handleResumeUpload}
              className="hidden"
              id="resume-upload"
              disabled={isUploading}
            />
            <label
              htmlFor="resume-upload"
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-white font-semibold cursor-pointer flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> Uploading PDF...
                </>
              ) : (
                <>
                  <UploadCloud size={14} /> Choose PDF Resume
                </>
              )}
            </label>
            {config.resume_url && (
              <a
                href={config.resume_url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 font-semibold"
              >
                View Current CV <ExternalLink size={12} />
              </a>
            )}
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
  );
}
