import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GeneralBtn } from "@/components/buttons/general-btn";
import type {
  FieldValues,
  SubmitHandler,
  UseFormHandleSubmit,
} from "react-hook-form";

interface PageFooterProps<TForm extends FieldValues> {
  step: number;
  canAccessStep: ReadonlyArray<boolean>;
  handleNext: () => void;
  handleSubmit: UseFormHandleSubmit<TForm>;
  onSubmit: SubmitHandler<TForm>;
  isLoading: boolean;
  onCancel?: () => void;
  lastStep?: number;
}

export function PageFooter<TForm extends FieldValues>({
  step,
  canAccessStep,
  handleNext,
  handleSubmit,
  onSubmit,
  isLoading,
  onCancel,
  lastStep = 1,
}: PageFooterProps<TForm>) {
  const isFinalStep = step >= lastStep;
  const canGoNext = !!canAccessStep[step + 1];

  return (
    <div className="fixed z-50 bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-end gap-3">
        <motion.div whileTap={{ scale: 0.97 }}>
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
        </motion.div>

        {!isFinalStep ? (
          <motion.div whileTap={{ scale: 0.97 }}>
            <Button
              type="button"
              onClick={handleNext}
              disabled={!canGoNext}
              className="bg-gray-900 hover:bg-gray-800"
            >
              Continue
            </Button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="inline">
            <motion.div whileTap={{ scale: 0.97 }}>
              <GeneralBtn title="Save" loader={isLoading} type="submit" />
            </motion.div>
          </form>
        )}
      </div>
    </div>
  );
}
