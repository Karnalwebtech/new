"use client";

import * as React from "react";

type StatusIndicatorProps = {
  enabled: boolean;
  trueLabel?: string;
  falseLabel?: string;
  activeColorClass?: string;
  inactiveColorClass?: string;
  size?: number;
  showLabel?: boolean;
  className?: string;
  align?: "start" | "center" | "end";
};

export default function StatusIndicator({
  enabled,
  trueLabel = "Enabled",
  falseLabel = "Disabled",
  activeColorClass = "bg-green-400",
  inactiveColorClass = "bg-red-500",
  size = 10,
  showLabel = true,
  className = "",
  align = "start",
}: StatusIndicatorProps) {
  const colorClass = enabled ? activeColorClass : inactiveColorClass;
  const label = enabled ? trueLabel : falseLabel;

  const justify =
    align === "end" ? "justify-end" : align === "center" ? "justify-center" : "justify-start";

  return (
    <div className={`flex items-center gap-2 ${justify} ${className}`}>
      <span
        className={`rounded-full ${colorClass}`}
        style={{
          width: size,
          height: size,
          display: "inline-block",
        }}
      />
      {showLabel && <span className="text-sm text-gray-700">{label}</span>}
    </div>
  );
}
