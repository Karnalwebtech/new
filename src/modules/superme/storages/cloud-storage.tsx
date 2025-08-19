"use client"
import { useGetCloudStorageQuery } from '@/state/cloud-storage-api'
import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, HardDrive } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { calculatePercentage, convertToGB } from '@/services/helpers'
import StorageSkeleton from '@/components/skeletons/storage-skeleton'


const CloudStorage = () => {
    const { data, isLoading } = useGetCloudStorageQuery();
    const result = data?.result[0];

    const usedGB = convertToGB(result?.used || "0");
    const totalGB = convertToGB(result?.total || "0");
    const usagePercentage = calculatePercentage(usedGB, totalGB);

    return (
        <div className='p-4'>
            {
                isLoading ? <StorageSkeleton /> :
                    <Card className="w-full max-w-md">
                        <CardHeader className="pb-2">
                            <div className="flex items-center space-x-2">
                                <Cloud className="h-5 w-5 text-primary" />
                                <CardTitle>Google Drive Storage</CardTitle>
                            </div>
                            <CardDescription>Monitor your cloud storage usage</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Storage Used</span>
                                    <span className="text-sm font-medium">
                                        {result?.free} / {result?.total}
                                    </span>
                                </div>
                                <Progress value={usagePercentage} className="h-2" />

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="flex flex-col space-y-1">
                                        <span className="text-xs text-muted-foreground">Drive Usage</span>
                                        <span className="text-sm font-medium">{result?.used}</span>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <span className="text-xs text-muted-foreground">Trash Usage</span>
                                        <span className="text-sm font-medium">{result?.trash}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t pt-4">
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <HardDrive className="h-4 w-4" />
                                <span>{usagePercentage.toFixed(1)}% of storage used</span>
                            </div>
                        </CardFooter>
                    </Card>
            }
        </div>
    )
}

export default CloudStorage