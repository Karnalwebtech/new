"use client";
import React, { memo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
interface EventTooltipProps {
  Icon: React.ElementType;
  title?: string;
  action?: () => void;
  description?: string | number;
  style?: string;
  isLoading: boolean;
  disabled?: boolean | undefined;
}

const EventTooltip = ({
  Icon,
  disabled=false,
  title,
  action,
  description,
  style,
  isLoading = false,
}: EventTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            disabled={isLoading || disabled}
            className={`w-0 ${style}`}
            variant="outline"
            onClick={() => action?.()}
          >
            {" "}
            {Icon ? (
              isLoading ? (
                <Loader2 className=" h-4 w-4 animate-spin" />
              ) : (
                <Icon />
              )
            ) : (
              title
            )}
          </Button>
        </TooltipTrigger>
        {description && <TooltipContent>{description}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};

export default memo(EventTooltip);
