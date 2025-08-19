import React, { memo } from 'react'
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from "recharts"
import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTypeDistribution, UpstashRedisDatabaseDetails } from '@/types/upstash-redis-type'

interface MemoryDistributionByDataTypeProps {
    result: UpstashRedisDatabaseDetails
}
const MemoryDistributionByDataType = ({ result }: MemoryDistributionByDataTypeProps) => {
    const { theme } = useTheme()
    const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#a4de6c"]

    const convertToChartData = (obj: DataTypeDistribution) => {
        return Object.entries(obj).map(([key, value], index) => ({
            name: key,
            value,
            color: COLORS[index % COLORS.length],
        }))
    }
    const chartData = convertToChartData(result?.data_type_distribution)
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Memory Distribution by Data Type</CardTitle>
                <CardDescription>How memory is distributed across different Redis data types</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value) => [`${value} MB`, "Memory Usage"]}
                                contentStyle={{
                                    backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
                                    borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                                }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
export default memo(MemoryDistributionByDataType)