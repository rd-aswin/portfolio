"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trash2, Plus, Calendar } from "lucide-react";
import { TimelineItem } from "@/types";

interface AdminTimelineProps {
  timelineItems: TimelineItem[];
  newTimelineItem: {
    year: string;
    title: string;
    company: string;
    description: string;
    skills: string;
    type: "work" | "education" | "award";
  };
  setNewTimelineItem: React.Dispatch<React.SetStateAction<{
    year: string;
    title: string;
    company: string;
    description: string;
    skills: string;
    type: "work" | "education" | "award";
  }>>;
  onAddTimelineItem: (e: React.FormEvent) => void;
  onDelete: (id: string, type: "timeline") => void;
}

export default function AdminTimeline({
  timelineItems,
  newTimelineItem,
  setNewTimelineItem,
  onAddTimelineItem,
  onDelete,
}: AdminTimelineProps) {
  return (
    <motion.div
      key="timeline"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Timeline Experience & Journey</h2>
        <div className="space-y-4">
          {timelineItems.length === 0 ? (
            <p className="text-xs text-muted">No timeline items found. Default items will be shown on the homepage.</p>
          ) : (
            timelineItems.map((item) => (
              <div key={item.id} className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold text-indigo-400">
                    <Calendar size={10} /> {item.year}
                  </span>
                  <h4 className="text-xs font-bold text-white leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-muted font-semibold">
                    {item.company} &bull; <span className="capitalize">{item.type}</span>
                  </p>
                  <p className="text-[11px] text-white/70 leading-relaxed max-w-xl">
                    {item.description}
                  </p>
                  {item.skills && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.skills.split(",").map((s) => s.trim()).filter(Boolean).map((s) => (
                        <span key={s} className="px-1.5 py-0.5 text-[8px] bg-white/5 rounded text-white/60">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => onDelete(item.id, "timeline")}
                  className="p-2 text-muted hover:text-red-400 transition-colors rounded-lg bg-white/5 hover:bg-red-500/10"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="border-t border-white/5 pt-8">
        <h3 className="text-sm font-semibold text-white mb-4">Add Timeline Item</h3>
        <form onSubmit={onAddTimelineItem} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-white/80">Year / Range</label>
              <input
                type="text"
                required
                placeholder="e.g. 2024 - Present"
                value={newTimelineItem.year}
                onChange={(e) => setNewTimelineItem({ ...newTimelineItem, year: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-white/80">Role Title / Degree</label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Frontend Engineer"
                value={newTimelineItem.title}
                onChange={(e) => setNewTimelineItem({ ...newTimelineItem, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-white/80">Company / Institution</label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Tech Solutions"
                value={newTimelineItem.company}
                onChange={(e) => setNewTimelineItem({ ...newTimelineItem, company: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-white/80">Entry Type</label>
              <select
                value={newTimelineItem.type}
                onChange={(e) => setNewTimelineItem({ ...newTimelineItem, type: e.target.value as "work" | "education" | "award" })}
                className="w-full px-4 py-2.5 bg-[#0d0d0d] border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
              >
                <option value="work">Work (Professional)</option>
                <option value="education">Education (Academic)</option>
                <option value="award">Award (Achievement)</option>
              </select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[10px] font-semibold text-white/80">Technologies / Skills Used (comma-separated)</label>
              <input
                type="text"
                placeholder="e.g. React, Next.js, TypeScript"
                value={newTimelineItem.skills}
                onChange={(e) => setNewTimelineItem({ ...newTimelineItem, skills: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-white/80">Description</label>
            <textarea
              rows={3}
              required
              placeholder="Detail your responsibilities, course of study, or recognition..."
              value={newTimelineItem.description}
              onChange={(e) => setNewTimelineItem({ ...newTimelineItem, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-1.5"
          >
            <Plus size={14} /> Add Timeline Entry
          </button>
        </form>
      </div>
    </motion.div>
  );
}
