"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trash2, Plus } from "lucide-react";
import { TestimonialItem } from "@/types";

interface AdminTestimonialsProps {
  testimonials: TestimonialItem[];
  newTestimonial: { author: string; quote: string; title: string; company: string };
  setNewTestimonial: React.Dispatch<React.SetStateAction<{ author: string; quote: string; title: string; company: string }>>;
  onAddTestimonial: (e: React.FormEvent) => void;
  onDelete: (id: string, type: "testimonial") => void;
}

export default function AdminTestimonials({
  testimonials,
  newTestimonial,
  setNewTestimonial,
  onAddTestimonial,
  onDelete,
}: AdminTestimonialsProps) {
  return (
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
                onClick={() => onDelete(t.id, "testimonial")}
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
        <form onSubmit={onAddTestimonial} className="space-y-4">
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
  );
}
