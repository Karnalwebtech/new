"use client";

import React, { useCallback, useMemo } from "react";
import { useGetProductCategoryQuery } from "@/state/product-category-api";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence, type Variants } from "framer-motion";

interface CategoryListProps {
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.02, when: "beforeChildren" },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.18, ease: "easeOut" } },
};

const CategoryList = ({ selected, setSelected }: CategoryListProps) => {
  const { data, isLoading, error } = useGetProductCategoryQuery({
    rowsPerPage: 100,
    page: 1,
  });
  const result = useMemo(() => data?.result ?? [], [data?.result]);

  const allIds = useMemo(
    () => result.map((r) => r._id).filter(Boolean),
    [result]
  );
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const allChecked = allIds.length > 0 && selected.length === allIds.length;
  const someChecked = selected.length > 0 && selected.length < allIds.length;
  const selectAllState: boolean | "indeterminate" = allChecked
    ? true
    : someChecked
    ? "indeterminate"
    : false;

  const handleSelectOne = useCallback(
    (id: string) => {
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
      );
    },
    [setSelected]
  );

  const removeHandler = useCallback(() => {
    setSelected([]); // clear on false or "indeterminate" toggled off
  }, [setSelected]);

  if (error) {
    return (
      <div className="text-sm text-red-500">
        Failed to load categories. Please try again.
      </div>
    );
  }

  return (
    <div>
      {/* Select All row */}
      <div className="flex items-center space-x-2 rounded-md p-2 hover:bg-muted">
        <Checkbox
          id="none"
          checked={selected.length > 0 ? false : true}
          onCheckedChange={removeHandler}
        />
        <Label htmlFor="none" className="flex-1 cursor-pointer text-sm">
          <span className="block">None</span>
        </Label>
      </div>

      {/* Loading skeleton */}
      {isLoading ? (
        <div className="space-y-2 mt-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-9 rounded-md bg-muted/60 animate-pulse" />
          ))}
        </div>
      ) : (
        <AnimatePresence initial={true}>
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="mt-2"
          >
            {result.map((item) => (
              <motion.li
                key={item._id}
                variants={itemVariants}
                layout
                className="flex items-center space-x-2 rounded-md p-2 hover:bg-muted"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.995 }}
              >
                <Checkbox
                  id={item._id}
                  checked={selectedSet.has(item._id!)}
                  onCheckedChange={() => handleSelectOne(item._id!)}
                />
                <Label
                  htmlFor={item._id}
                  className="flex-1 cursor-pointer text-sm"
                >
                  <span className="block">{item.name}</span>
                </Label>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      )}
    </div>
  );
};

export default React.memo(CategoryList);
