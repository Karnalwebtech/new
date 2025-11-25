"use client";

import { motion } from "framer-motion";

type RemainingCountProps = {
  result: { id: string; name: string }[];
  maxVisible?: number;
  length?: number;
};
const RemainingCount = ({
  result,
  maxVisible = 3,
  length = 0,
}: RemainingCountProps) => {
  if (!result || length === 0) return null;

  const visibleRemainingCount = result.slice(0, maxVisible);
  const remainingCount = length - visibleRemainingCount.length;
  const name = visibleRemainingCount.map((ch) => ch.name).join(", ");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-4 text-sm"
    >
      <span className="truncate text-slate-700">{name}</span>

      {remainingCount > 0 && (
        <span className="ml-2 shrink-0 text-slate-500">
          + {remainingCount} more
        </span>
      )}
    </motion.div>
  );
};

export default RemainingCount;
