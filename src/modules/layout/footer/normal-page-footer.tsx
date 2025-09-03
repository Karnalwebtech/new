import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ButtonEvent from "@/components/buttons/btn-event";

interface NormalPageFooterProps {
  isLoading: boolean;
  onCancel?: () => void;
  onSubmit?: () => void;
}

export function NormalPageFooter({
  isLoading = false,
  onCancel,
  onSubmit,
}: NormalPageFooterProps) {
  return (
    <div className="fixed z-50 bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-end gap-3">
        <motion.div whileTap={{ scale: 0.97 }}>
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
        </motion.div>
        <motion.div whileTap={{ scale: 0.97 }}>
          <ButtonEvent
            event={() => onSubmit && onSubmit()}
            title="Save"
            isLoading={isLoading}
            style="ml-2"
          />
        </motion.div>
      </div>
    </div>
  );
}
