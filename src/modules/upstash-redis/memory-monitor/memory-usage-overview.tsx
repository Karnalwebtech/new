"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatsampleFileSize } from '@/services/helpers';
import { UpstashRedisDatabaseDetails } from '@/types/upstash-redis-type';
interface MemoryUsageOverviewProps{
    result:UpstashRedisDatabaseDetails
}
const MemoryUsageOverview = ({result}:MemoryUsageOverviewProps) => {


    const getMemoryColor = (percentage: number) => {
        if (percentage < 70) return "bg-green-500"
        if (percentage < 90) return "bg-yellow-500"
        return "bg-red-500"
    }

    return (
        <>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{result?.memory_usage_percentage.toFixed(2) || 0}%</div>
                    <Progress value={result?.memory_usage_percentage || 0} className={`mt-2 h-2 ${getMemoryColor(result?.memory_usage_percentage || 0)}`} />
                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                        <span>Used: {formatsampleFileSize(result?.used_memory || 0)}</span>
                        <span>Free: {formatsampleFileSize(result?.free_memory || 0)}</span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Peak Memory</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatsampleFileSize(result?.peak_memory || 0)}</div>
                    {/* <Progress value={usedPeakMemoryPersantage} className="mt-2 h-2 bg-purple-500" />
                    <div className="mt-2 text-xs text-muted-foreground">
                        {usedPeakMemoryPersantage}% of total memory
                    </div> */}
                </CardContent>
            </Card>


            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Hit Ratio</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{(result?.hit_ratio || 0).toFixed(1)}%</div>
                    <Progress value={result?.hit_ratio || 0} className="mt-2 h-2 bg-green-500" />
                    <div className="mt-2 text-xs text-muted-foreground">
                        Miss Ratio: {(result?.hit_ratio || 0).toFixed(1)}%
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Operations</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{result?.operations_per_second}/sec</div>
                    <div className="mt-2 text-xs text-muted-foreground">
                        Total: {result?.total_commands_processed.toLocaleString()} commands
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default MemoryUsageOverview