import React, { memo } from "react";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
type PageHeaderProps = {
  tabs: string[];
  step: number;
  setStep: (value: number) => void;
  canAccessStep: Readonly<boolean[]>;
  onCancel?: () => void;
};
const PageHeader = ({
  tabs,
  step,
  setStep,
  onCancel,
  canAccessStep,
}: PageHeaderProps) => {
  const headerVariants: Variants = {
    initial: { y: -20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 500, damping: 35, mass: 0.7 },
    },
  };

  return (
    <motion.div
      className="flex items-center justify-between border-b border-gray-200 bg-white sticky top-0 z-10"
      variants={headerVariants}
      initial="initial"
      animate="animate"
    >
      <div className="flex items-center">
        {/* Left controls */}
        <div className="pr-6 p-2 flex items-center gap-2">
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}>
            <Button variant="secondary" size="sm" className="text-gray-500">
              esc
            </Button>
          </motion.div>
        </div>

        {/* Tabs with animated underline */}
        <div className="flex relative">
          {tabs.map((tab, index) => {
            const active = step === index;
            const disabled = !canAccessStep[index];

            return (
              <motion.button
                key={tab}
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setStep(index)}
                className={[
                  "flex items-center justify-center text-sm font-medium w-[180px] py-4 rounded-none border-0 relative transition-colors",
                  "focus:outline-none", // better focus states
                  disabled ? "cursor-not-allowed opacity-40" : "",
                ].join(" ")}
                animate={{
                  backgroundColor: active
                    ? "#f3f4f6" // Tailwind gray-100
                    : "#ffffff", // white
                  color: disabled
                    ? "#9ca3af" // Tailwind gray-400
                    : active
                    ? "#111827" // Tailwind gray-900
                    : "#1f2937", // Tailwind gray-800
                }}
                whileHover={
                  disabled
                    ? undefined
                    : {
                        backgroundColor: "#f9fafb", // Tailwind gray-50
                        color: "#111827", // darker text on hover
                      }
                }
                whileTap={disabled ? undefined : { scale: 0.97 }}
                transition={{
                  type: "tween",
                  duration: 0.2,
                }}
              >
                {tab}

                {/* Active underline (ink) */}
                {active && (
                  <motion.span
                    layoutId="tab-ink"
                    className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-black"
                    transition={{
                      duration: 0.18,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Right slot if you add actions later (kept for symmetry) */}
      <div className="px-4 py-2" />
    </motion.div>
  );
};

export default memo(PageHeader);
