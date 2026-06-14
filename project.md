# Project: Premium Developer Portfolio

A high-performance, single-page developer portfolio website designed with immersive 3D/2D animations, fluid backgrounds, and structured layouts.

## Description
This project is a personal portfolio showcasing technical skills, projects, work timeline, and testimonials. Built using Next.js (App Router, TypeScript), Tailwind CSS, Framer Motion, and GSAP, it replaces a traditional multi-page website with a unified, clean, navbar-less dashboard/Bento Grid experience.

## Features
* **Bento Grid Hero:** Responsive grid cards that slide and lock into place on load/scroll using GSAP.
* **Ambient Fluid Gradient & Grain:** Organic, slow-moving blurred background spheres overlaid with an SVG film grain filter.
* **3D Tilt Hover Effects:** Framer Motion-driven perspective transforms on interactive cards.
* **Card Expansion (Shared Layout):** Smooth morphing detail view modals on project selection.
* **Drag-to-Reveal Testimonials:** Swipeable stacked deck of client feedback.
* **Elastic Micro-Interactions:** Custom spring-physics animations for inputs, buttons, and icons.

## Goals
1. Create a memorable visual first impression using rich styling and micro-animations.
2. Deliver a fluid, 60fps interactive experience across mobile and desktop viewports.
3. Optimize performance, accessibility, and SEO (clean hierarchy and descriptive meta tags).
4. Maintain a lightweight package foot-print.

## What Success Looks Like
* **Visually Stunning:** Harmonious, dark-mode color scheme with glowing highlights and frosted glass.
* **Perfect Responsiveness:** Smooth bento grid collapse into a single column on mobile without clipping content.
* **Flawless Transitions:** Instantly responsive hover tilt and zero stutter during shared layout modal expansions.
* **Zero Production Errors:** Clean build from `npm run build` and `npm run lint`.

## Do's and Don'ts

### Do's
* **DO** use custom spring configs (`stiffness: 150`, `damping: 20`) for natural, physical movement.
* **DO** use TypeScript type safety for data models (e.g., Projects, Timeline items).
* **DO** keep components focused and separated (UI utilities vs. page sections).
* **DO** prioritize text readability over heavy background glow.

### Don'ts
* **DON'T** use a navigation bar; layout interactions must feel self-contained.
* **DON'T** use generic raw colors (e.g., standard `#ff0000`). Use cohesive Tailwind hues or custom HSL variables.
* **DON'T** import massive 3D models that delay page loads. Keep Spline/Three.js assets optimized.
