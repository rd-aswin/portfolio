import React from "react";

export default function FluidMesh() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-20 bg-[#030303]" aria-hidden="true">
      {/* Glow Orb 1 */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] md:w-[700px] h-[500px] md:h-[700px] rounded-full bg-indigo-600/15 blur-[120px] md:blur-[160px] animate-blob-1" />

      {/* Glow Orb 2 */}
      <div className="absolute bottom-[10%] right-[-10%] w-[500px] md:w-[600px] h-[500px] md:h-[600px] rounded-full bg-fuchsia-600/10 blur-[120px] md:blur-[160px] animate-blob-2" />

      {/* Glow Orb 3 */}
      <div className="absolute top-[30%] right-[20%] w-[400px] md:w-[500px] h-[400px] md:h-[500px] rounded-full bg-violet-600/10 blur-[120px] md:blur-[140px] animate-blob-3" />
    </div>
  );
}
