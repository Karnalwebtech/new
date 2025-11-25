"use client";
import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
const TableLoader = () => {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm relative h-96">
      {/* Loader Overlay */}
      <AnimatePresence>
       <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                    />
                  </motion.div>
      </AnimatePresence>
      {/* <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div> */}
    </div>
  );
};

export default memo(TableLoader);
