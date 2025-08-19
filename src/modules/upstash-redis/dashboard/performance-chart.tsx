"use client"

import type React from "react"

import { useTheme } from "next-themes"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface PerformanceChartProps extends React.HTMLAttributes<HTMLDivElement> {}

export function PerformanceChart({ className, ...props }: PerformanceChartProps) {
  const { theme } = useTheme()

  // Sample data for the chart
  const data = [
    { name: "00:00", operations: 2400, memory: 40 },
    { name: "04:00", operations: 1398, memory: 43 },
    { name: "08:00", operations: 9800, memory: 45 },
    { name: "12:00", operations: 3908, memory: 60 },
    { name: "16:00", operations: 4800, memory: 65 },
    { name: "20:00", operations: 3800, memory: 62 },
    { name: "24:00", operations: 4300, memory: 58 },
  ]

  return (
    <Card className={cn("col-span-4", className)} {...props}>
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
        <CardDescription>Operations and memory usage over the last 24 hours.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#333" : "#eee"} />
              <XAxis dataKey="name" stroke={theme === "dark" ? "#888" : "#888"} fontSize={12} />
              <YAxis yAxisId="left" orientation="left" stroke={theme === "dark" ? "#888" : "#888"} fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke={theme === "dark" ? "#888" : "#888"} fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
                  borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                  color: theme === "dark" ? "#fff" : "#000",
                }}
              />
              <Bar yAxisId="left" dataKey="operations" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Operations" />
              <Bar yAxisId="right" dataKey="memory" fill="#10b981" radius={[4, 4, 0, 0]} name="Memory (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
