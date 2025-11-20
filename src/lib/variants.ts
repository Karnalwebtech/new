"use client"

import { Variants } from "framer-motion";

export const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.3 },
  },
};

export const buttonVariants: Variants = {
  hover: {
    scale: 1.02,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

export const statusVariants:Variants  = {
  inactive: { backgroundColor: "#374151" },
  active: { backgroundColor: "#10b981" },
  draft: { backgroundColor: "#374151" },
  published: { backgroundColor: "#10b981" },
};
export const controls = {
  hidden: { opacity: 0, y: 8 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export const expandVariants:Variants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };