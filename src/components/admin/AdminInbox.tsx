"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { ContactSubmission } from "@/types";

interface AdminInboxProps {
  submissions: ContactSubmission[];
  onDelete: (id: string, type: "submission") => void;
}

export default function AdminInbox({ submissions, onDelete }: AdminInboxProps) {
  return (
    <motion.div
      key="inbox"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="space-y-6"
    >
      <h2 className="text-lg font-bold text-white mb-4">Contact Inbox</h2>
      {submissions.length > 0 ? (
        <div className="space-y-4">
          {submissions.map((sub) => (
            <div key={sub.id} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex justify-between items-start gap-4 hover:border-indigo-500/10 transition-colors">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-sm text-white">{sub.name}</span>
                  <span className="text-xs text-indigo-400 font-mono">{sub.email}</span>
                </div>
                <p className="text-xs text-muted leading-relaxed max-w-xl">{sub.message}</p>
                <span className="text-[10px] text-muted block font-mono">
                  {new Date(sub.created_at).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => onDelete(sub.id, "submission")}
                className="p-2 text-muted hover:text-red-400 transition-colors rounded-lg bg-white/5 hover:bg-red-500/10"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted">No submissions in your inbox yet.</p>
      )}
    </motion.div>
  );
}
