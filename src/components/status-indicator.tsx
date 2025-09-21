// components/status-indicator.tsx
"use client";

import * as React from "react";
import { Dot } from "lucide-react";

type StatusIndicatorProps = {
  /** True → Enabled, False → Disabled */
  enabled: boolean;
  /** Optional custom labels */
  trueLabel?: string;
  falseLabel?: string;
  /** Optional Tailwind color classes */
  activeColorClass?: string;   // default: "text-green-400"
  inactiveColorClass?: string; // default: "text-red-500"
  /** Icon size in px */
  size?: number;               // default: 14
  /** Hide the text label if you only want the dot */
  showLabel?: boolean;         // default: true
  /** Extra classes on the wrapper */
  className?: string;
  /** Align the content */
  align?: "start" | "center" | "end"; // default: "start"
};

export default function StatusIndicator({
  enabled,
  trueLabel = "Enabled",
  falseLabel = "Disabled",
  activeColorClass = "text-green-400",
  inactiveColorClass = "text-red-500",
  size = 14,
  showLabel = true,
  className = "",
  align = "start",
}: StatusIndicatorProps) {
  const color = enabled ? activeColorClass : inactiveColorClass;
  const label = enabled ? trueLabel : falseLabel;

  const justify =
    align === "end" ? "justify-end" : align === "center" ? "justify-center" : "justify-start";

  return (
    <div className={`flex items-center ${justify} ${className}`}>
      <Dot aria-hidden size={size} className={color} />
      {showLabel && <span className="text-sm text-gray-600">{label}</span>}
    </div>
  );
}
