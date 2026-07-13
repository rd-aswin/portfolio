"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { MessageSquare, RotateCcw, HelpCircle } from "lucide-react";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  title: string;
  company: string;
}

export default function Testimonials() {
  const [loadedData, setLoadedData] = useState<Testimonial[] | null>(null);
  const [cards, setCards] = useState<Testimonial[] | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("/api/admin/testimonials");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setLoadedData(data);
            setCards(data);
          } else {
            setLoadedData([]);
            setCards([]);
          }
        } else {
          setLoadedData([]);
          setCards([]);
        }
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        setLoadedData([]);
        setCards([]);
      }
    };
    fetchTestimonials();
  }, []);

  // Function to remove top card when swiped
  const removeCard = (id: string) => {
    if (cards) {
      setCards((prev) => prev ? prev.filter((card) => card.id !== id) : []);
    }
  };

  const resetDeck = () => {
    if (loadedData) {
      setCards(loadedData);
    }
  };

  return (
    <section id="testimonials" className="w-full max-w-4xl mx-auto px-4 py-20 flex flex-col items-center select-none">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
          Client Feedback
        </h2>
        <p className="text-muted text-sm max-w-sm mx-auto">
          Drag cards left or right to swipe through feedback from colleagues and clients.
        </p>
      </div>

      <div className="relative w-full max-w-md h-[280px] flex items-center justify-center">
        <AnimatePresence>
          {cards === null ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              className="w-full max-w-sm p-6 md:p-8 rounded-3xl border border-white/5 bg-[#0c0c0e]/80 animate-pulse flex flex-col justify-between h-[280px] opacity-40"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-8 h-8 rounded-full bg-white/10" />
                </div>
                <div className="space-y-2.5">
                  <div className="h-4 bg-white/10 rounded w-full" />
                  <div className="h-4 bg-white/10 rounded w-[95%]" />
                  <div className="h-4 bg-white/10 rounded w-[70%]" />
                </div>
              </div>
              <div className="mt-8 border-t border-white/5 pt-4 space-y-2">
                <div className="h-4 bg-white/10 rounded w-24" />
                <div className="h-3 bg-white/5 rounded w-32" />
              </div>
            </motion.div>
          ) : loadedData && loadedData.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center glass-panel rounded-3xl border border-white/5 bg-white/[0.01] max-w-sm w-full h-[200px]">
              <div className="p-3 bg-white/5 text-muted rounded-2xl mb-3">
                <MessageSquare size={20} />
              </div>
              <p className="text-xs text-muted leading-relaxed">
                No client feedback shared yet. Please check back later or add feedback in the admin panel.
              </p>
            </div>
          ) : cards.length > 0 ? (
            cards.map((testimonial, idx) => {
              const isTop = idx === cards.length - 1;
              return (
                <Card
                  key={testimonial.id}
                  testimonial={testimonial}
                  isTop={isTop}
                  index={cards.length - 1 - idx}
                  onSwipe={() => removeCard(testimonial.id)}
                />
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel rounded-3xl p-8 flex flex-col items-center justify-center text-center max-w-sm w-full"
            >
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl mb-4">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">
                You&apos;ve read them all!
              </h3>
              <p className="text-xs text-muted mb-6 max-w-xs">
                Feel free to reload the stack to read the reviews again.
              </p>
              <button
                onClick={resetDeck}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all active:scale-95"
              >
                <RotateCcw size={14} /> Reload Deck
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

interface CardProps {
  testimonial: Testimonial;
  isTop: boolean;
  index: number;
  onSwipe: () => void;
}

function Card({ testimonial, isTop, index, onSwipe }: CardProps) {
  // Motion values to track drag distance and map rotation
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-180, 180], [-18, 18]);
  const opacity = useTransform(x, [-180, -150, 0, 150, 180], [0.5, 1, 1, 1, 0.5]);

  // Adjust card depth styling (lower cards scale down & shift down slightly)
  const scale = 1 - index * 0.04;
  const yOffset = index * 12;

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // If dragged beyond threshold, swipe away
    if (Math.abs(info.offset.x) > 130) {
      onSwipe();
    }
  };

  return (
    <motion.div
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      style={{
        x,
        rotate,
        opacity,
        scale: isTop ? undefined : scale,
        y: isTop ? 0 : yOffset,
        zIndex: 100 - index,
        cursor: isTop ? "grab" : "default",
      }}
      whileDrag={isTop ? { cursor: "grabbing" } : undefined}
      exit={{
        x: x.get() > 0 ? 300 : -300,
        opacity: 0,
        scale: 0.85,
        transition: { duration: 0.25 },
      }}
      transition={isTop ? { type: "spring", stiffness: 300, damping: 20 } : { duration: 0.35 }}
      className={`absolute w-full max-w-sm p-6 md:p-8 rounded-3xl border border-white/5 bg-[#0c0c0e] origin-bottom flex flex-col justify-between select-none ${
        isTop ? "shadow-[0_12px_40px_rgba(0,0,0,0.5)]" : "pointer-events-none"
      }`}
    >
      {index === 0 ? (
        <>
          <div>
            <div className="flex justify-between items-start mb-6">
              <MessageSquare className="text-indigo-400" size={24} />
              {isTop && (
                <span className="text-[9px] font-bold text-indigo-400/80 bg-indigo-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse flex items-center gap-1">
                  <HelpCircle size={10} /> Swipe Me
                </span>
              )}
            </div>
            <p className="text-sm md:text-base text-white/90 leading-relaxed italic">
              &quot;{testimonial.quote}&quot;
            </p>
          </div>

          <div className="mt-8 border-t border-white/5 pt-4">
            <h4 className="text-sm font-semibold text-white">{testimonial.author}</h4>
            <p className="text-xs text-muted">
              {testimonial.title}, <span className="text-indigo-400/80">{testimonial.company}</span>
            </p>
          </div>
        </>
      ) : (
        <div className="h-full" />
      )}
    </motion.div>
  );
}
