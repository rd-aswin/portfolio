"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

export default function Tilt({ children, className = "", maxTilt = 8 }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Normalized mouse position (0 to 1)
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Map mouse position to rotation values with elastic spring physics
  const rotateX = useSpring(useTransform(y, [0, 1], [maxTilt, -maxTilt]), {
    damping: 25,
    stiffness: 175,
  });
  const rotateY = useSpring(useTransform(x, [0, 1], [-maxTilt, maxTilt]), {
    damping: 25,
    stiffness: 175,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    // Return to center
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`${className} transition-all duration-300 ease-out`}
    >
      {children}
    </motion.div>
  );
}
