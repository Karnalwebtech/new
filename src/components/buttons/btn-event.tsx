"use client";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

interface ButtonEventProps {
  event: () => void;
  title: string;
  style?: string;
  isLoading?: boolean;
}

const ButtonEvent = ({
  event,
  title,
  isLoading = false,
  style = "w-full justify-start w-full justify-start",
}: ButtonEventProps) => {
  return (
    <Button
      disabled={isLoading}
      variant={"default"} // Change variant if active
      className={style}
      onClick={event}
    >
      {isLoading && <Loader2 className="animate-spin w-5 h-5 mr-2" />}
      {title}
    </Button>
  );
};

export default ButtonEvent;
