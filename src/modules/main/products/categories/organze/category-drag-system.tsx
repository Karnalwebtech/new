"use client";
import { Button } from "@/components/ui/button";
import {
  GripVertical,
  ChevronDown,
  ChevronRight,
  Tag,
  Plus,
} from "lucide-react";
import type { ProductCategoryFormData } from "@/types/product-type";
import { useCategoryDragSystem } from "@/hooks/useCategoryDragSystem";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import NavigateBtn from "@/components/buttons/navigate-btn";

// cubic-bezier for "easeOut"
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const listVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.18, ease: EASE_OUT },
  },
};

const childVariants: Variants = {
  initial: { opacity: 0, y: 6 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.16, ease: EASE_OUT },
  },
  exit: { opacity: 0, y: -6, transition: { duration: 0.12, ease: EASE_OUT } },
};

export default function CategoryDragSystem({
  result,
}: {
  result: ProductCategoryFormData[];
}) {
  const {
    sortedCategories,
    onCategoryMouseDown,
    onChildMouseDown,
    // addCategory,
    addChild,
    toggleCategory,
  } = useCategoryDragSystem(result);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <motion.div
          className="max-w-2xl space-y-1"
          initial="initial"
          animate="animate"
        >
          {sortedCategories.map((category) => (
            <motion.div
              key={category.id}
              layout
              variants={listVariants}
              initial="initial"
              animate="animate"
              className="group"
            >
              <motion.div
                layout
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                  mass: 0.4,
                }}
              >
                {/* Drag handle */}
                <motion.div
                  role="button"
                  className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded"
                  onMouseDown={(e) => onCategoryMouseDown(e, category.id)}
                  whileTap={{ scale: 0.9 }}
                >
                  <GripVertical className="w-4 h-4 text-gray-400" />
                </motion.div>

                {/* Expand/Collapse */}
                <motion.button
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className="p-1 hover:bg-gray-200 rounded"
                  whileTap={{ scale: 0.9 }}
                >
                  {category.isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </motion.button>

                {/* Icon */}
                <div className="w-5 h-5 flex items-center justify-center">
                  <Tag className="w-4 h-4 text-blue-500" />
                </div>

                {/* Name */}
                <motion.span
                  layout
                  className="text-sm text-gray-700 font-medium"
                >
                  {category.name}
                </motion.span>

                {/* Add Child */}
                <motion.div whileTap={{ scale: 0.95 }} className="ml-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addChild(category.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </motion.div>
              </motion.div>

              {/* Children */}
              <AnimatePresence initial={false}>
                {category.isExpanded && (
                  <motion.div
                    key={`${category.id}-children`}
                    layout
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                      transition: { duration: 0.18, ease: EASE_OUT },
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                      transition: { duration: 0.18, ease: EASE_OUT },
                    }}
                    className="ml-8 mt-1 overflow-hidden"
                  >
                    <div className="space-y-1">
                      {category.children
                        .slice()
                        .sort((a, b) => a.order - b.order)
                        .map((child) => (
                          <motion.div
                            key={child.id}
                            layout
                            variants={childVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="flex items-center gap-3 px-3 py-1.5 rounded hover:bg-gray-50"
                          >
                            <motion.div
                              role="button"
                              className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded"
                              onMouseDown={(e) =>
                                onChildMouseDown(e, child.id, category.id)
                              }
                              whileTap={{ scale: 0.9 }}
                            >
                              <GripVertical className="w-3 h-3 text-gray-400" />
                            </motion.div>
                            <span className="text-sm text-gray-600">
                              {child.name}
                            </span>
                          </motion.div>
                        ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          <div className="mt-6">
            <motion.div whileTap={{ scale: 0.97 }}>
              <NavigateBtn
                Icon={Plus}
                path="/dashboard/products/categories/create"
                title="Add Category"
                style="text-gray-500 hover:text-gray-700 text-sm"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
