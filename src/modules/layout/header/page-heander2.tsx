import React, { memo } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { controls } from "@/lib/variants";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NavigateBtn from "@/components/buttons/navigate-btn";
import { Input } from "@/components/ui/input";
type PageHeader2Props = {
  rowsPerPage: string;
  searchTerm: string;
  setRowsPerPage: React.Dispatch<React.SetStateAction<string>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  subHeader?:boolean;
};
const PageHeader2 = ({
  rowsPerPage,
  setRowsPerPage,
  setCurrentPage,
  searchTerm = "",
  setSearchTerm,
  subHeader=false
}: PageHeader2Props) => {
  const headerVariants: Variants = {
    initial: { y: -20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 500, damping: 35, mass: 0.7 },
    },
  };

  return (
    <div>
      <motion.div
        className="flex flex-wrap items-center justify-between gap-3 mb-4 p-2"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.06 } } }}
      >
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Publishable API Keys
          </h1>
          <p className="text-muted-foreground">
            Manage API keys used in the storefront to limit the scope of
            requests to specific sales channels.
          </p>
        </div>
        <motion.div
          className="flex flex-wrap items-center gap-3"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
        >
          {/* Search */}
          <motion.div
            variants={controls}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="max-w-lg  flex-1"
          >
            <Input
              type="text"
              value={searchTerm || ""}
              placeholder="Search..."
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              className="transition-all focus-visible:shadow-[0_0_0_2px_rgba(59,130,246,.25)]"
            />
          </motion.div>

          {/* Per page Select */}
          <motion.div
            variants={controls}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Select
              value={rowsPerPage}
              onValueChange={(val) => {
                setRowsPerPage(val); // val is a string
                setCurrentPage(1); // optional: reset page
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Per page" />
              </SelectTrigger>

              {/* Animate dropdown content on mount/unmount */}
              <SelectContent>
                <AnimatePresence>
                  <motion.div
                    key="select-content"
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                  >
                    <SelectGroup>
                      <SelectLabel>Per page</SelectLabel>
                      {["10", "20", "50", "100"].map((val) => (
                        <motion.div
                          key={val}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                        >
                          <SelectItem value={val}>{val} / page</SelectItem>
                        </motion.div>
                      ))}
                    </SelectGroup>
                  </motion.div>
                </AnimatePresence>
              </SelectContent>
            </Select>
          </motion.div>
          <NavigateBtn
            path={"/settings/sales-channels/create"}
            title="Create"
          />
        </motion.div>
      </motion.div>
       <motion.div
      className="flex flex-wrap items-center justify-between gap-3 mb-4 p-2"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
    >
        <div>
          
        </div>
        <motion.div
          className="flex flex-wrap items-center gap-3"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
        >
          {/* Search */}
          <motion.div
            variants={controls}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="max-w-lg  flex-1"
          >
            <Input
              type="text"
              value={searchTerm || ""}
              placeholder="Search..."
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              className="transition-all focus-visible:shadow-[0_0_0_2px_rgba(59,130,246,.25)]"
            />
          </motion.div>

          {/* Per page Select */}
          <motion.div
            variants={controls}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Select
              value={rowsPerPage}
              onValueChange={(val) => {
                setRowsPerPage(val); // val is a string
                setCurrentPage(1); // optional: reset page
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Per page" />
              </SelectTrigger>

              {/* Animate dropdown content on mount/unmount */}
              <SelectContent>
                <AnimatePresence>
                  <motion.div
                    key="select-content"
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                  >
                    <SelectGroup>
                      <SelectLabel>Per page</SelectLabel>
                      {["10", "20", "50", "100"].map((val) => (
                        <motion.div
                          key={val}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                        >
                          <SelectItem value={val}>{val} / page</SelectItem>
                        </motion.div>
                      ))}
                    </SelectGroup>
                  </motion.div>
                </AnimatePresence>
              </SelectContent>
            </Select>
          </motion.div>
          <NavigateBtn
            path={"/settings/sales-channels/create"}
            title="Create"
          />
        </motion.div>
    </motion.div>
    </div>
  );
};

export default memo(PageHeader2);
