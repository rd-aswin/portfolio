"use client";

import React from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { SiteConfig } from "@/types";

interface AdminConfigProps {
  config: SiteConfig;
  setConfig: React.Dispatch<React.SetStateAction<SiteConfig>>;
  onSave: (e: React.FormEvent) => void;
}

export default function AdminConfig({ config, setConfig, onSave }: AdminConfigProps) {
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
