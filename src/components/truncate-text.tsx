import { motion, type MotionProps } from "framer-motion";
import React from "react";

interface TruncateTextProps extends MotionProps {
  text: string;
  maxLength?: number; // max characters
  ellipsis?: string;  // default "…"
  className?: string;
  tooltip?: boolean;  // show full text on hover (title attr)
}

/**
 * A reusable truncating text component with optional motion props
 */
export const TruncateText: React.FC<TruncateTextProps> = ({
  text,
  maxLength = 20,
  ellipsis = "…",
  className = "",
  tooltip = true,
  ...motionProps
}) => {
  const display =
    text.length > maxLength ? text.slice(0, maxLength) + ellipsis : text;

  return (
    <motion.span
      {...motionProps}
      className={`transition-colors duration-200 ${className}`}
      title={tooltip ? text : undefined}
    >
      {display}
    </motion.span>
  );
};
