"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ActionBarProps {
  selectedCount: number;
  onRemove: () => void;
}

const ActionBarBtn=({ selectedCount, onRemove }: ActionBarProps)=> {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 
                     flex items-center gap-4 bg-black text-white
                     px-4 py-2 rounded-full shadow-lg"
        >
          <span className="text-sm border-r-gray-100">{selectedCount} selected</span>

          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-black hover:text-gray-50"
            onClick={onRemove}
          >
            Remove{" "}
            <kbd className="ml-2 text-xs bg-white/20 px-1 rounded">R</kbd>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ActionBarBtn;