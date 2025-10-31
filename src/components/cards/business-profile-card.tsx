"use client";

import { StockLocationType } from "@/types/stock-location-type";
import { motion } from "framer-motion";
import {
  MapPin,
  Store,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { memo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
interface BusinessProfileCardProps {
  item: StockLocationType;
  removeHandler: (value: string) => void;
  deletedId: string;
}
const BusinessProfileCard=({
  item,
  removeHandler,
  deletedId,
}: BusinessProfileCardProps) =>{
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const router = useRouter();
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
      className="w-full my-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Main Card */}
      <motion.div
        className="bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
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
                <Store size={20} />
              </motion.div>

              <div className="flex-1">
                <motion.h2
                  className="text-base font-bold text-slate-600 dark:text-white"
                  variants={itemVariants}
                >
                  {item?.name}
                </motion.h2>
                <motion.div
                  className="mt-2 flex items-start gap-2"
                  variants={itemVariants}
                >
                  <MapPin className="w-3 h-3 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {item?.address_id?.company && (
                      <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                        {item?.address_id?.company}
                      </p>
                    )}

                    <p>
                      {item?.address_id?.address_1},
                      {item?.address_id?.address_2}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Table actions"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(`/settings/locations/${item?.id}/edit`)
                    }
                  >
                    <Pencil className="h-4 w-4 mr-2" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={deletedId === item?.id}
                    className="text-destructive cursor-pointer"
                    onClick={() => item?.id && removeHandler(item?.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div>
                <Link
                  className="flex gap-2 items-center text-blue-400 taxt-xs cursor-pointer"
                  href={`/settings/locations/${item?.id}`}
                >
                  <Eye className="w-3 h-3" />
                  View details
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sections */}
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {/* Connected Sales Channels */}
          <motion.div
            className="px-6 py-4"
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
              <h3 className="text-sm font-semibold m-0 text-slate-700 dark:text-slate-300">
                Connected sales channels
              </h3>
              <div>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: expandedSection === "channels" ? 1 : 0,
                    height: expandedSection === "channels" ? "auto" : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    No sales channels connected yet
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Pickup */}
          <motion.div
            className="px-6 py-4"
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
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: expandedSection === "pickup" ? 1 : 0,
                  height: expandedSection === "pickup" ? "auto" : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Pickup service is currently disabled
                </p>
              </motion.div>
              <motion.div
                className="flex items-center gap-2"
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
            </div>
          </motion.div>

          {/* Shipping */}

          <motion.div
            className="px-6 py-4"
            variants={itemVariants}
            onClick={() =>
              setExpandedSection(expandedSection === "pickup" ? null : "pickup")
            }
            whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between cursor-pointer">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Shipping
              </h3>

              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: expandedSection === "pickup" ? 1 : 0,
                  height: expandedSection === "pickup" ? "auto" : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Shipping service is currently disabled
                </p>
              </motion.div>
              <motion.div
                className="flex items-center gap-2"
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
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
export default memo(BusinessProfileCard)