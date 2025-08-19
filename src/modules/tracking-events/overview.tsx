"use client";

import { MonthlyStats } from "@/types/post-event-tracking-type";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface OverviewProps {
  monthlyStats: MonthlyStats[];
}
export function Overview({ monthlyStats }: OverviewProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={monthlyStats}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="downloads"
          name="Downloads"
          fill="#adfa1d"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="shares"
          name="Shares"
          fill="#f97316"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
