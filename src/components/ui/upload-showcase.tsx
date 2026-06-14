"use client";

import React, { useState, useRef } from "react";
import { CldImage } from "next-cloudinary";
import { Image as ImageIcon, UploadCloud, RefreshCw, AlertTriangle, ArrowRight } from "lucide-react";

export default function UploadShowcase() {
  const [imagePublicId, setImagePublicId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
  // Check if Cloud Name has been entered (we don't check API Secret here since it is private to server)
  const isConfigured = cloudName && cloudName !== "your_cloudinary_cloud_name";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", files[0]);

      // Secure server-side uploading (No private keys exposed to browser)
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.public_id) {
        setImagePublicId(data.public_id);
      } else {
        console.error("Server upload response error:", data.error);
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerDemoUpload = () => {
    setImagePublicId("cld-sample-5"); // Use standard Cloudinary sample public ID
  };

  const handleReset = () => {
    setImagePublicId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <section id="media-showcase" className="w-full max-w-5xl mx-auto px-4 py-20 relative">
      <div className="glass-panel rounded-3xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-white/5">
          <div>
            <span className="text-xs text-indigo-300 font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <UploadCloud size={14} /> Cloudinary Integration
            </span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
              Secure Server-Side Image Optimizations
            </h2>
            <p className="text-muted text-xs md:text-sm max-w-lg">
              Test dynamic format conversion and auto-quality. Files are uploaded via Next.js API endpoints, keeping Cloudinary credentials safe.
            </p>
          </div>

          {!isConfigured && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-[10px] md:text-xs max-w-xs">
              <AlertTriangle size={14} className="shrink-0" />
              <span>
                <strong>Demo Mode:</strong> Configure `.env.local` to enable live uploads.
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Upload Widget Control */}
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-white">How it works:</h3>
            <div className="space-y-4 text-xs text-muted leading-relaxed">
              <p>
                1. File selection triggers a POST request carrying the raw binary block to our server API (`/api/admin/upload`).
              </p>
              <p>
                2. The server endpoint receives the file and uploads it securely to Cloudinary using private backend environment keys.
              </p>
              <p>
                3. The optimized asset is rendered using Next-Cloudinary&apos;s component which auto-serves modern codecs (WebP/AVIF) dynamically.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <UploadCloud size={16} /> Upload via Server API
                  </>
                )}
              </button>

              {!isConfigured && !imagePublicId && (
                <button
                  onClick={triggerDemoUpload}
                  className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/5 font-semibold text-xs rounded-xl transition-all flex items-center gap-2"
                >
                  Trigger Mock Preview
                </button>
              )}

              {imagePublicId && (
                <button
                  onClick={handleReset}
                  className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/5 font-semibold text-xs rounded-xl transition-all flex items-center gap-2"
                >
                  <RefreshCw size={14} /> Clear Preview
                </button>
              )}
            </div>
          </div>

          {/* Rendering Box */}
          <div className="w-full aspect-video md:aspect-square max-h-[300px] md:max-h-full rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.01] flex flex-col items-center justify-center relative overflow-hidden group">
            {imagePublicId ? (
              <div className="w-full h-full relative flex items-center justify-center p-4">
                <CldImage
                  width="400"
                  height="400"
                  src={imagePublicId}
                  sizes="100vw"
                  alt="Cloudinary Optimized Image"
                  className="rounded-xl object-contain max-w-full max-h-full transition-transform duration-300 group-hover:scale-[1.03]"
                />
                
                {/* Floating optimization metadata tag */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md border border-white/5 p-2 rounded-xl text-[10px] text-indigo-300 font-mono flex justify-between items-center">
                  <span>Format: auto-webp</span>
                  <ArrowRight size={10} />
                  <span>Quality: lossless-auto</span>
                </div>
              </div>
            ) : (
              <div className="text-center p-6 space-y-3">
                <div className="p-3 bg-white/5 rounded-full text-muted w-fit mx-auto">
                  <ImageIcon size={28} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Preview Window</p>
                  <p className="text-[10px] text-muted max-w-xs mt-1">
                    No image uploaded yet. Click the upload button to preview your optimized asset.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
