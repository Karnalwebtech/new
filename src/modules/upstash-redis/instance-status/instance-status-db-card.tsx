import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UpstashRedisDatabaseConfig } from '@/types/upstash-redis-type'
import React, { memo } from 'react'
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
interface InstanceStatusDbCardProps {
    result: UpstashRedisDatabaseConfig[];
}
const InstanceStatusDbCard = ({ result }: InstanceStatusDbCardProps) => {
    const getMemoryColor = (percentage: number) => {
        if (percentage < 70) return "bg-green-500"
        if (percentage < 90) return "bg-yellow-500"
        return "bg-red-500"
    }
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return <Badge className="bg-green-500">Active</Badge>
            case "warning":
                return (
                    <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                        Warning
                    </Badge>
                )
            case "maintenance":
                return (
                    <Badge variant="outline" className="border-blue-500 text-blue-500">
                        Maintenance
                    </Badge>
                )
            case "inactive":
                return (
                    <Badge variant="outline" className="border-gray-500 text-gray-500">
                        Inactive
                    </Badge>
                )
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }
    return (

        result.map((instance) => (
            <Card
                key={instance.database_id}
                className={`cursor-pointer transition-all hover:border-primary ${instance.database_id === instance.database_id ? "border-primary" : ""}`}
            // onClick={() => handleInstanceSelect(instance.id)}
            >
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">{instance.database_name}</CardTitle>
                        {getStatusBadge(instance.state)}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Memory:</span>
                            <span className="font-medium">{(instance.db_memory_threshold / instance.db_disk_threshold) * 100}%</span>
                        </div>
                        <Progress
                            value={(instance.db_memory_threshold / instance.db_disk_threshold) * 100
                            }
                            className={`h-1 ${getMemoryColor((instance.db_memory_threshold / instance.db_disk_threshold) * 100
                            )}`}
                        />
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Region:</span>
                            <span className="font-medium">{instance.primary_region}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Operations:</span>
                            <span className="font-medium">{instance.db_max_commands_per_second}</span>
                        </div>
                        {/* {instance.alerts.length > 0 && (
                            <div className="mt-2 text-xs text-yellow-500">
                                <AlertTriangle className="mr-1 inline-block h-3 w-3" />
                                {instance.alerts.length} alert{instance.alerts.length > 1 ? "s" : ""}
                            </div>
                        )} */}
                    </div>
                </CardContent>
            </Card>
        ))

    )
}

export default memo(InstanceStatusDbCard)