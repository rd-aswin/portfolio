export const springTransition = {
  type: "spring",
  stiffness: 150,
  damping: 20
};

export const stiffSpringTransition = {
  type: "spring",
  stiffness: 300,
  damping: 20
};

export const bouncySpringTransition = {
  type: "spring",
  stiffness: 200,
  damping: 15
};

export const smoothTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.35
};

export const fadeInUpVariant = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
  transition: { duration: 0.25, ease: "easeOut" }
};
