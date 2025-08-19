"use client";

import { PlatformShareCount } from "@/types/post-event-tracking-type";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface PlatformShareData {
  name: string;
  value: number;
  color: string;
}

interface PlatformDistributionProps {
  sharesByPlatform: PlatformShareCount[];
}

// 🎨 Attractive, vibrant color palette (can be expanded)
const ATTRACTIVE_COLORS = [
"#d72631" , "#a2d5c6", "#077b8a" ,"#5c3c92",  "#e2d810", "#d9138a","#12a4d9", "#322e2f",
"#e75874","#be1558","#fbcbc9","#322514","#ecc19c","#e5e5dc","#d9a5b3","#1868ae","#c6d7eb"
];
export function PlatformDistribution({
  sharesByPlatform,
}: PlatformDistributionProps) {
  const formattedData: PlatformShareData[] = sharesByPlatform.map((entry, index) => ({
    name: entry._id,
    value: entry.count,
    color: ATTRACTIVE_COLORS[index % ATTRACTIVE_COLORS.length], // cycle colors
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={formattedData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          dataKey="value"
          nameKey="name"
        >
          {formattedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
