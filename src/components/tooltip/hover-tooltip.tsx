"use client";
import React, { memo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
interface HoverTooltipProps {
  title?: string;
  description?: string | number;
  className?: string;
}

const HoverTooltip = ({ title, description, className }: HoverTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={className}>{title}</span>
        </TooltipTrigger>
        {description && <TooltipContent className="w-[200px]">{description}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};

export default memo(HoverTooltip);
