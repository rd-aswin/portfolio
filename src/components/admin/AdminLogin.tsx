"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FluidMesh from "@/components/background/fluid-mesh";
import Grain from "@/components/background/grain";

interface AdminLoginProps {
  password: string;
  setPassword: (val: string) => void;
  authError: boolean;
  setAuthError: (val: boolean) => void;
  handleLogin: (e: React.FormEvent) => void;
}

export default function AdminLogin({
  password,
  setPassword,
  authError,
  setAuthError,
  handleLogin,
}: AdminLoginProps) {
  return (
    <div className="relative min-h-screen text-white overflow-hidden flex items-center justify-center selection:bg-indigo-500/30 selection:text-white">
      <FluidMesh />
      <Grain />

      <main className="relative z-10 w-full max-w-md mx-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-3xl p-8 border border-white/10"
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2 flex items-center justify-center gap-2">
              Control Center
            </h1>
            <p className="text-xs text-muted">
              Authentication required to access admin settings
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/80">Admin Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setAuthError(false);
                }}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/5 border border-white/5 focus:border-indigo-500/40 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>

            {authError && (
              <p className="text-xs text-red-400 font-semibold">
                Incorrect password. Please try again.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/20"
            >
              Unlock Dashboard
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-muted hover:text-white transition-colors inline-flex items-center gap-1">
              <ArrowLeft size={12} /> Back to website
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
