"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
interface NavigateBtnProps {
  path: string;
  Icon?: React.ElementType;
  title: string;
  style?: string;
  disabled?: boolean;
  variant?: "link" | "default" | "outline" | "destructive" | "secondary" | "ghost" | null | undefined
}

const NavigateBtn = ({
  path,
  Icon,
  title="Create",
  disabled = false,
  variant="default",
  style = "rounded-2xl shadow-md hover:scale-105 transition-transform",
}: NavigateBtnProps) => {
  const router = useRouter();
  // const pathname = usePathname(); // Get current route

  // const isActive = pathname === path;

  const handleNavigation = () => {
    router.push(path);
  };

  return (
    <motion.div
      // variants={{
      //   hidden: { opacity: 0, y: 20 },
      //   show: { opacity: 1, y: 0 },
      // }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }}>
        <Button
          disabled={disabled}
          variant={variant}// Change variant if active
          className={style}
          onClick={handleNavigation}
        >
          {Icon && <Icon className="mr-2 h-4 w-4" />}
          <span className=""> {title}</span>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default NavigateBtn;
