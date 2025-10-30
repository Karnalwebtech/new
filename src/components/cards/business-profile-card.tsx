"use client";

import { motion } from "framer-motion";
import { MoreVertical, MapPin, Eye } from "lucide-react";
import { useState } from "react";

export function BusinessProfileCard() {
  const [isHovered, setIsHovered] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      className="w-full max-w-2xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Main Card */}
      <motion.div
        className="bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
        transition={{ duration: 0.3 }}
      >
        {/* Header Section */}
        <motion.div
          className="p-6 border-b border-slate-200 dark:border-slate-700"
          variants={itemVariants}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              {/* Building Icon */}
              <motion.div
                className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                </svg>
              </motion.div>

              <div className="flex-1">
                <motion.h2
                  className="text-xl font-bold text-slate-900 dark:text-white"
                  variants={itemVariants}
                >
                  Pawan Kumar
                </motion.h2>
                <motion.div
                  className="mt-2 flex items-start gap-2"
                  variants={itemVariants}
                >
                  <MapPin className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      GARIBDHAN ENTERPRISES
                    </p>
                    <p>Shop no 3, Gali no 3 Vikas Nagar,</p>
                    <p>Karnal Haryana 132001, India</p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <motion.button
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <MoreVertical className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </motion.button>
              <motion.button
                className="px-4 py-2 text-blue-600 dark:text-blue-400 font-medium text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye className="w-4 h-4" />
                View details
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Sections */}
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {/* Connected Sales Channels */}
          <motion.div
            className="p-6"
            variants={itemVariants}
            onClick={() =>
              setExpandedSection(
                expandedSection === "channels" ? null : "channels"
              )
            }
            whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between cursor-pointer">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Connected sales channels
              </h3>
              <motion.div
                animate={{ rotate: expandedSection === "channels" ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  className="w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: expandedSection === "channels" ? 1 : 0,
                height: expandedSection === "channels" ? "auto" : 0,
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm">
                No sales channels connected yet
              </p>
            </motion.div>
            <motion.p
              className="text-slate-400 dark:text-slate-500 text-sm font-medium mt-2"
              animate={{
                opacity: expandedSection === "channels" ? 0 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              -
            </motion.p>
          </motion.div>

          {/* Pickup */}
          <motion.div
            className="p-6"
            variants={itemVariants}
            onClick={() =>
              setExpandedSection(expandedSection === "pickup" ? null : "pickup")
            }
            whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between cursor-pointer">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Pickup
              </h3>
              <motion.div
                animate={{ rotate: expandedSection === "pickup" ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  className="w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: expandedSection === "pickup" ? 1 : 0,
                height: expandedSection === "pickup" ? "auto" : 0,
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm">
                Pickup service is currently disabled
              </p>
            </motion.div>
            <motion.div
              className="flex items-center gap-2 mt-2"
              animate={{
                opacity: expandedSection === "pickup" ? 0 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
              <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Disabled
              </span>
            </motion.div>
          </motion.div>

          {/* Shipping */}
          <motion.div
            className="p-6"
            variants={itemVariants}
            onClick={() =>
              setExpandedSection(
                expandedSection === "shipping" ? null : "shipping"
              )
            }
            whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between cursor-pointer">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Shipping
              </h3>
              <motion.div
                animate={{ rotate: expandedSection === "shipping" ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  className="w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: expandedSection === "shipping" ? 1 : 0,
                height: expandedSection === "shipping" ? "auto" : 0,
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm">
                Shipping service is currently disabled
              </p>
            </motion.div>
            <motion.div
              className="flex items-center gap-2 mt-2"
              animate={{
                opacity: expandedSection === "shipping" ? 0 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
              <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Disabled
              </span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
