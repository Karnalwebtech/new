"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutGrid, Rows3, Search } from "lucide-react";
import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Interface defining the props for the SubHeader component
interface SubHeaderProps {
  searchTerm: string; // Search term input value
  setSearchTerm: (vlaue: string) => void; // Function to update search term
  setRowsPerPage: (value: string) => void; // Function to update rows per page
  dataCounter: number | undefined; // Total number of files
  placeHolder?: string; // Placeholder text for search input
  type?: boolean; // Toggle for displaying grid or list view
  isGrid?: boolean; // Current view mode (grid or list)
  setIsGrid?: (value: boolean) => void; // Function to update view mode
}

const SubHeader = ({
  searchTerm,
  setSearchTerm,
  setRowsPerPage,
  dataCounter,
  placeHolder = "Search",
  type = false,
  isGrid = true,
  setIsGrid,
}: SubHeaderProps) => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="py-2 px-2 lg:px-6 mb-4 gap-2 flex justify-between bg-white sticky top-0 shadow-md relative z-10"
    >
      <div className="w-[65%]">
        {/* Search input field */}
        <motion.div
          className="relative w-80"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <motion.div
            whileFocus={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Input
              type="search"
              placeholder={placeHolder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-border"
            />
          </motion.div>
        </motion.div>
        {/* Display total file count */}
        <motion.p
          key={dataCounter}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-xs pt-[2px] px-2"
        >
          Total files: {dataCounter}
        </motion.p>
      </div>
      <div className="flex gap-2 w-[150px]">
        {/* Dropdown for selecting rows per page */}
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Select onValueChange={(value) => setRowsPerPage(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Per page" />
            </SelectTrigger>
            <SelectContent>
              {[
                { key: "10", value: "10" },
                { key: "25", value: "25" },
                { key: "50", value: "50" },
                { key: "100", value: "100" },
                { key: "500", value: "500" },
                { key: "1000", value: "1000" },
              ].map((item, i) => (
                <SelectItem key={i} value={item.key}>
                  {item.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
        {/* Toggle between grid and list view */}
        {type && (
          <motion.div
            className="p-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {isGrid ? (
                <motion.div
                  key="grid"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <LayoutGrid
                    className="cursor-pointer"
                    onClick={() => setIsGrid?.(false)}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="rows"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Rows3
                    className="cursor-pointer"
                    onClick={() => setIsGrid?.(true)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Export the component wrapped in React.memo for performance optimization
export default memo(SubHeader);
