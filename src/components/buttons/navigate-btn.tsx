"use client";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "../ui/button";

interface NavigateBtnProps {
  path: string;
  Icon?: React.ElementType;
  title: string;
  style?: string;
  disabled?: boolean;
}

const NavigateBtn = ({
  path,
  Icon,
  title,
  disabled = false,
  style = "w-full justify-start w-full justify-start",
}: NavigateBtnProps) => {
  const router = useRouter();
  const pathname = usePathname(); // Get current route

  const isActive = pathname === path;

  const handleNavigation = () => {
    router.push(path);
  };

  return (
    <Button
      disabled={disabled}
      variant={isActive ? "secondary" : "ghost"} // Change variant if active
      className={style}
      onClick={handleNavigation}
    >
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      <span className="hidden md:block">  {title}</span>
    </Button>
  );
};

export default NavigateBtn;
