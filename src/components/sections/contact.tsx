"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Loader2, Mail, MapPin, Phone } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function Contact() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setStatus("loading");
    
    // Save to Supabase (or trigger mock demo action)
    const { error } = await supabase
      .from("contact_submissions")
      .insert([
        {
          name: formState.name,
          email: formState.email,
          message: formState.message,
        }
      ]);
    
    if (error) {
      console.error("Failed to insert message into database:", error);
      setStatus("error");
      setTimeout(() => {
        setStatus("idle");
      }, 5000);
      return;
    }
    
    setStatus("success");
    setFormState({ name: "", email: "", message: "" });

    // Reset status after a few seconds
    setTimeout(() => {
      setStatus("idle");
    }, 4000);
  };

  return (
    <section id="contact" className="w-full max-w-5xl mx-auto px-4 py-20 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Info Column */}
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-3">
              Let&apos;s Collaborate
            </h2>
            <p className="text-muted text-sm leading-relaxed max-w-md">
              Whether you want to build a high-performance web app, discuss system design challenges, or just say hello, my inbox is always open.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <Mail size={20} />
              </div>
              <div>
                <h4 className="text-xs text-muted font-bold uppercase tracking-wider">Email Me</h4>
                <a href="mailto:aswin@example.com" className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors">
                  aswin@example.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="text-xs text-muted font-bold uppercase tracking-wider">Location</h4>
                <p className="text-sm font-semibold text-white">Kerala, India</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <Phone size={20} />
              </div>
              <div>
                <h4 className="text-xs text-muted font-bold uppercase tracking-wider">Call Me</h4>
                <a href="tel:+918075483385" className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors">
                  +91 80754 83385
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="glass-panel rounded-3xl p-6 md:p-8">
          <AnimatePresence mode="wait">
            {status !== "success" ? (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-semibold text-white/80">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    disabled={status === "loading"}
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all disabled:opacity-50"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-white/80">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    disabled={status === "loading"}
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all disabled:opacity-50"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-semibold text-white/80">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    required
                    disabled={status === "loading"}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none disabled:opacity-50"
                    placeholder="Describe your project ideas..."
                  />
                </div>

                {status === "error" && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-400 font-semibold bg-red-500/10 border border-red-500/20 rounded-xl p-3"
                  >
                    Failed to send message. Please check your network or try calling/emailing directly.
                  </motion.p>
                )}

                {/* Submit button */}
                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Sending Message...
                    </>
                  ) : (
                    <>
                      Send Message <Send size={14} />
                    </>
                  )}
                </motion.button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="py-12 flex flex-col items-center justify-center text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="p-3 bg-emerald-500/10 text-emerald-400 rounded-full mb-4"
                >
                  <CheckCircle2 size={40} />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">Message Received!</h3>
                <p className="text-xs text-muted max-w-xs leading-relaxed">
                  Thank you for reaching out. I&apos;ve received your email and will get back to you as soon as possible.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
