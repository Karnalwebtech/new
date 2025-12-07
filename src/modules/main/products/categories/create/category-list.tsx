"use client";

import React, { useCallback, useMemo } from "react";
import { useGetProductCategoryQuery } from "@/state/product-category-api";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ProductCategoryFormData } from "@/types/product-type";

interface CategoryListProps {
  selected: string[];
  catId?: string;
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

const CategoryNode = ({
  item,
  depth,
  catId,
  selectedSet,
  onSelect,
}: {
  item: ProductCategoryFormData;
  catId?: string;
  depth: number;
  selectedSet: Set<string>;
  onSelect: (id: string) => void;
}) => {
  const { _id: id, name, children = [] } = item;
  const hasChildren = children.length > 0;

  return (
    <motion.li key={id} variants={itemVariants}>
      <div
        className={`flex items-center space-x-2 rounded-md hover:bg-muted border ${depth % 2 === 0 ? "bg-gray-50 p-2 " : "bg-white p-2 ml-4"
          }`}
      // style={{ paddingLeft: 8 + depth * 16 }}
      >
        <Checkbox
          id={id}
          checked={selectedSet.has(id!)}
          onCheckedChange={() => onSelect(id!)}
        />
        <Label htmlFor={id} className="flex-1 cursor-pointer text-sm">
          {name}
        </Label>
      </div>

      {hasChildren && (
        <AnimatePresence initial={false}>
          {/* {isOpen && ( */}
          <motion.ul
            key={`${id}-children`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-1"
          >
            {children
              .filter((item) => item?.id !== catId)
              .map((child) => (
                <CategoryNode
                  key={child._id!}
                  item={child}
                  catId={catId}
                  depth={depth + 1}
                  selectedSet={selectedSet}
                  onSelect={onSelect}
                />
              ))}
          </motion.ul>
        </AnimatePresence>
      )}
    </motion.li>
  );
};

const CategoryList = ({
  selected,
  catId,
  setSelected,
}: CategoryListProps) => {
  const { data, isLoading, error } = useGetProductCategoryQuery({
    rowsPerPage: 100,
    page: 1,
  });
  const result = useMemo(() => data?.result ?? [], [data?.result]);

  // const allIds = useMemo(
  //   () => result.map((r) => r._id).filter(Boolean),
  //   [result]
  // );
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  // const allChecked = allIds.length > 0 && selected.length === allIds.length;
  // const someChecked = selected.length > 0 && selected.length < allIds.length;
  // const selectAllState: boolean | "indeterminate" = allChecked
  //   ? true
  //   : someChecked
  //   ? "indeterminate"
  //   : false;

  const handleSelectOne = useCallback(
    (id: string) => {
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
      );
    },
    [setSelected]
  );

  // const removeHandler = useCallback(() => {
  //   setSelected([]); // clear on false or "indeterminate" toggled off
  // }, [setSelected]);

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
      {/* <div className="flex items-center space-x-2 rounded-md p-2 hover:bg-muted">
        <Checkbox
          id="none"
          checked={selected.length > 0 ? false : true}
          onCheckedChange={removeHandler}
        />
        <Label htmlFor="none" className="flex-1 cursor-pointer text-sm">
          <span className="block">None</span>
        </Label>
      </div> */}

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
            {
              result.length === 0 ?
                <motion.li >
                  <p>No categories found</p>
                </motion.li>
                :
                result
                  .filter((item) => item?.id !== catId)
                  .map((item) => (
                    <CategoryNode
                      key={item._id}
                      item={item}
                      depth={0}
                      catId={catId}
                      selectedSet={selectedSet}
                      onSelect={handleSelectOne}
                    />
                  ))}
          </motion.ul>
        </AnimatePresence>
      )}
    </div>
  );
};

export default React.memo(CategoryList);
