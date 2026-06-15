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
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/80">Email Address</label>
            <input
              type="email"
              value={config.email_address}
              onChange={(e) => setConfig({ ...config, email_address: e.target.value })}
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

        <div className="space-y-1.5 col-span-1 md:col-span-2">
          <label className="text-xs font-semibold text-white/80">Core Tech Stack (comma-separated)</label>
          <input
            type="text"
            value={config.tech_stack || ""}
            onChange={(e) => setConfig({ ...config, tech_stack: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
            placeholder="e.g. Next.js, React, TypeScript, Tailwind CSS, GSAP, Framer Motion"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-white/80">GitHub Profile URL</label>
          <input
            type="text"
            value={config.github_url || ""}
            onChange={(e) => setConfig({ ...config, github_url: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
            placeholder="https://github.com/your-username"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-white/80">LinkedIn Profile URL</label>
          <input
            type="text"
            value={config.linkedin_url || ""}
            onChange={(e) => setConfig({ ...config, linkedin_url: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
            placeholder="https://linkedin.com/in/your-username"
          />
        </div>

        <div className="md:col-span-2 border-t border-white/5 pt-6 mt-4">
          <h3 className="text-sm font-semibold text-white mb-2">Telegram Integration (Contact Alerts)</h3>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-white/80">Telegram Bot Token</label>
          <input
            type="text"
            value={config.telegram_bot_token || ""}
            onChange={(e) => setConfig({ ...config, telegram_bot_token: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
            placeholder="e.g. 123456789:ABCdef..."
          />
          <p className="text-[10px] text-muted leading-tight">Get a token by messaging <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300">@BotFather</a> on Telegram.</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-white/80">Telegram Chat ID</label>
          <input
            type="text"
            value={config.telegram_chat_id || ""}
            onChange={(e) => setConfig({ ...config, telegram_chat_id: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
            placeholder="e.g. 987654321"
          />
          <p className="text-[10px] text-muted leading-tight">Get your ID by messaging <a href="https://t.me/userinfobot" target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300">@userinfobot</a>.</p>
        </div>

        <div className="md:col-span-2 border-t border-white/5 pt-6 mt-4">
          <h3 className="text-sm font-semibold text-white mb-2">Focus Dashboard (Now Tab)</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/80">🚀 Working On</label>
            <input
              type="text"
              value={config.focus_working_on || ""}
              onChange={(e) => setConfig({ ...config, focus_working_on: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/80">📚 Currently Learning</label>
            <input
              type="text"
              value={config.focus_learning || ""}
              onChange={(e) => setConfig({ ...config, focus_learning: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/80">🎯 Long-Term Goal</label>
            <input
              type="text"
              value={config.focus_goal || ""}
              onChange={(e) => setConfig({ ...config, focus_goal: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/80">🎵 Currently Jamming To</label>
            <input
              type="text"
              value={config.jamming_to || ""}
              onChange={(e) => setConfig({ ...config, jamming_to: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5 col-span-1 md:col-span-2 border-t border-white/5 pt-6 mt-4 pb-2">
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
