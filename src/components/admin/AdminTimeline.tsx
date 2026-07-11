"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Plus, Calendar, Pencil, Check, X } from "lucide-react";
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
  onEditTimelineItem: (item: TimelineItem) => Promise<boolean>;
  onDelete: (id: string, type: "timeline") => void;
}

export default function AdminTimeline({
  timelineItems,
  newTimelineItem,
  setNewTimelineItem,
  onAddTimelineItem,
  onEditTimelineItem,
  onDelete,
}: AdminTimelineProps) {
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const isEditing = editingItem !== null;

  const handleChange = (field: string, value: string) => {
    if (isEditing && editingItem) {
      setEditingItem({ ...editingItem, [field]: value });
    } else {
      setNewTimelineItem({ ...newTimelineItem, [field]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editingItem) {
      const success = await onEditTimelineItem(editingItem);
      if (success) {
        setEditingItem(null);
      }
    } else {
      onAddTimelineItem(e);
    }
  };

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
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      // Scroll smoothly to the edit form at the bottom
                      setTimeout(() => {
                        const formElement = document.getElementById("timeline-form");
                        if (formElement) {
                          formElement.scrollIntoView({ behavior: "smooth", block: "center" });
                        }
                      }, 100);
                    }}
                    className="p-2 text-muted hover:text-indigo-400 transition-colors rounded-lg bg-white/5 hover:bg-indigo-500/10"
                    title="Edit Item"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => {
                      if (editingItem?.id === item.id) {
                        setEditingItem(null);
                      }
                      onDelete(item.id, "timeline");
                    }}
                    className="p-2 text-muted hover:text-red-400 transition-colors rounded-lg bg-white/5 hover:bg-red-500/10"
                    title="Delete Item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div id="timeline-form" className="border-t border-white/5 pt-8">
        <h3 className="text-sm font-semibold text-white mb-4">
          {isEditing ? `Edit Journey Entry: ${editingItem.title}` : "Add Timeline Item"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-white/80">Year / Range</label>
              <input
                type="text"
                required
                placeholder="e.g. 2024 - Present"
                value={isEditing && editingItem ? editingItem.year : newTimelineItem.year}
                onChange={(e) => handleChange("year", e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-white/80">Role Title / Degree</label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Frontend Engineer"
                value={isEditing && editingItem ? editingItem.title : newTimelineItem.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-white/80">Company / Institution</label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Tech Solutions"
                value={isEditing && editingItem ? editingItem.company : newTimelineItem.company}
                onChange={(e) => handleChange("company", e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-white/80">Entry Type</label>
              <select
                value={isEditing && editingItem ? editingItem.type : newTimelineItem.type}
                onChange={(e) => handleChange("type", e.target.value)}
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
                value={isEditing && editingItem ? editingItem.skills || "" : newTimelineItem.skills}
                onChange={(e) => handleChange("skills", e.target.value)}
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
              value={isEditing && editingItem ? editingItem.description : newTimelineItem.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-1.5"
            >
              {isEditing ? <Check size={14} /> : <Plus size={14} />} 
              {isEditing ? "Save Changes" : "Add Timeline Entry"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5"
              >
                <X size={14} /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
}
