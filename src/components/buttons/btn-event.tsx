"use client";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
interface ButtonEventProps {
  event: () => void;
  title: string;
  style?: string;
  isLoading?: boolean;
  variant?:
    | "link"
    | "default"
    | "outline"
    | "destructive"
    | "secondary"
    | "ghost"
    | null
    | undefined;
}

const ButtonEvent = ({
  event,
  title,
  isLoading = false,
  variant = "default",
  style = "rounded-2xl",
}: ButtonEventProps) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }}>
        <Button
          disabled={isLoading}
          variant={variant} // Change variant if active
          className={`shadow-md hover:scale-105 transition-transform ${style}`}
          onClick={event}
        >
          {isLoading && <Loader2 className="animate-spin w-5 h-5 mr-2" />}
          {title}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ButtonEvent;
