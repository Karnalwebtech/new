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
  is_icon?: boolean;
  Icon?: React.ElementType; // ✅ Dynamic icon type
}

const HoverTooltip = ({
  title,
  description,
  className,
  is_icon = false,
  Icon,
}: HoverTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {is_icon && Icon ? (
            <span className={className}>
              <Icon className="w-4 h-4 text-gray-500 hover:text-gray-700 transition-colors" />
            </span>
          ) : (
            <span className={className}>{title}</span>
          )}
        </TooltipTrigger>

        {description && (
          <TooltipContent className="w-[200px] text-sm text-gray-200">
            {description}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default memo(HoverTooltip);
