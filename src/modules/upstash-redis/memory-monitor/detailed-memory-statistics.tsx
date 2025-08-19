import React, { memo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UpstashRedisDatabaseDetails } from '@/types/upstash-redis-type';
import { formatsampleFileSize } from '@/services/helpers';
interface DetailedMemoryStatisticsProps {
    result: UpstashRedisDatabaseDetails
}
const DetailedMemoryStatistics = ({ result }: DetailedMemoryStatisticsProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Detailed Memory Statistics</CardTitle>
                <CardDescription>Advanced memory metrics and configuration</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <h3 className="font-semibold">Memory Metrics</h3>
                        <div className="space-y-2 rounded-md border p-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Allocated:</span>
                                <span className="font-medium">{
                                    formatsampleFileSize(result?.total_allocated_memory)
                                }</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Used Memory:</span>
                                <span className="font-medium">{formatsampleFileSize(result?.used_memory)} </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Peak Memory:</span>
                                <span className="font-medium">{formatsampleFileSize(result?.peak_memory)} </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Free Memory:</span>
                                <span className="font-medium">{formatsampleFileSize(result?.free_memory)} </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Fragmentation Ratio:</span>
                                <span className="font-medium">{result?.fragmentation_ratio}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold">Server Configuration</h3>
                        <div className="space-y-2 rounded-md border p-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Eviction Policy:</span>
                                <span className="font-medium">{result?.eviction_policy}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Connected Clients:</span>
                                <span className="font-medium">{result?.connected_clients}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Commands Processed:</span>
                                <span className="font-medium">{result?.total_commands_processed}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Operations Per Second:</span>
                                <span className="font-medium">{result?.total_commands_processed}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Cache Hit Ratio:</span>
                                <span className="font-medium">{(result?.hit_ratio).toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="mb-4 font-semibold">Memory Usage Recommendations</h3>
                    <div className="rounded-md border bg-muted p-4">
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-start">
                                <span className="mr-2 text-green-500">•</span>
                                <span>
                                    Your memory usage is at {result?.memory_usage_percentage.toFixed(2)}%, which is
                                    {result?.memory_usage_percentage < 70 ? " healthy" : result?.memory_usage_percentage < 90 ? " moderate" : " high"}.
                                    {result?.memory_usage_percentage >= 90 && " Consider increasing your memory allocation."}
                                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-green-500">•</span>
                                <span>
                                    Your fragmentation ratio is {result?.fragmentation_ratio}, which is
                                    {result?.fragmentation_ratio < 1.5 ? " good" : " high"}.
                                    {result?.fragmentation_ratio >= 1.5 && " Consider running OPTIMIZE to reduce fragmentation."}
                                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-green-500">•</span>
                                <span>
                                    Your hit ratio is {(result?.hit_ratio).toFixed(1)}%, which is
                                    {result?.hit_ratio > 0.8 ? " excellent" : " could be improved"}.
                                    {result?.hit_ratio <= 0.8 && " Consider optimizing your caching strategy."}
                                </span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-green-500">•</span>
                                <span>
                                    You&apos;re using {result?.eviction_policy} as your eviction policy, which is appropriate for
                                    {result?.eviction_policy.includes("lru")
                                        ? " most use cases that prioritize recently used data"
                                        : result?.eviction_policy.includes("ttl")
                                            ? " cases where you want to prioritize expiring keys"
                                            : " your specific use case"}
                                    .
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default memo(DetailedMemoryStatistics)