"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "../ui/skeleton";

// tiny helper to reuse the shimmer everywhere
const ShimmerSkeleton = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`relative overflow-hidden rounded-md ${className}`}>
      {/* base skeleton */}
      <Skeleton className="h-full w-full" />
      {/* shimmer sweep */}
      <motion.span
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

const FormSkeleton = () => {
  return (
    <motion.div
      className="w-full mx-auto bg-white min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      {/* Header skeleton */}
      <div className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShimmerSkeleton className="h-6 w-28" />
              <ShimmerSkeleton className="h-6 w-16" />
              <ShimmerSkeleton className="h-6 w-20" />
            </div>
            <div className="flex items-center gap-2">
              <ShimmerSkeleton className="h-9 w-20" />
              <ShimmerSkeleton className="h-9 w-28" />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <ShimmerSkeleton className="h-9 w-24" />
            <ShimmerSkeleton className="h-9 w-20" />
          </div>
        </div>
      </div>

      {/* Body skeleton */}
      <div className="max-w-6xl mx-auto px-4 py-6 grid gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <ShimmerSkeleton className="h-8 w-44" />
            <ShimmerSkeleton className="h-10 w-full" />
            <ShimmerSkeleton className="h-24 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <ShimmerSkeleton className="h-10 w-full" />
              <ShimmerSkeleton className="h-10 w-full" />
            </div>
            <ShimmerSkeleton className="h-10 w-1/3" />
          </div>
          <div className="space-y-4">
            <ShimmerSkeleton className="h-8 w-32" />
            <ShimmerSkeleton className="h-10 w-full" />
            <ShimmerSkeleton className="h-10 w-full" />
            <ShimmerSkeleton className="h-20 w-full" />
          </div>
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <ShimmerSkeleton className="h-9 w-24" />
          <div className="flex gap-2">
            <ShimmerSkeleton className="h-9 w-24" />
            <ShimmerSkeleton className="h-9 w-28" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(FormSkeleton);
