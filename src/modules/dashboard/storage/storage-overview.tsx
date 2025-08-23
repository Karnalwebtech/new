"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, Cloud, Database, HardDrive, Lock, Shield } from "lucide-react"
import { useGetStorageQuery } from "@/state/drive-api"
import Loader from "@/components/loader"
import { formatFileSize } from "@/services/helpers"


export function StorageOverview() {

  const { data, isLoading, error } = useGetStorageQuery();
  const result = data?.result;
  const usedStorage = Number(result?.usedStorage) || 0;
  const totalStorage = Number(result?.totalStorage) || 1; // Avoid division by zero
  const progressValue = (usedStorage / totalStorage) * 100;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[350px]">
        <Loader />
      </div>
    )
  }
  if (error) {
    return <p className="text-sm text-red-500">Failed to load storage data.</p>;
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Storage Usage</CardTitle>
          <CardDescription>Your current storage consumption</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {formatFileSize((result?.usedStorage || 0) * 1024 * 1024)} of {formatFileSize(totalStorage * 1024 * 1024)} used
              </span>
              <Badge variant={progressValue > 90 ? "destructive" : "outline"}>{progressValue.toFixed(2)}%</Badge>
            </div>
            <Progress value={progressValue} className="h-2" />
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Used</p>
                <p className="text-lg font-bold">{formatFileSize((result?.usedStorage || 0)* 1024 * 1024)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Available</p>
                <p className="text-lg font-bold">{formatFileSize((result?.availableStorage ||0)* 1024 * 1024)}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Upgrade Plan
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Plan Details</CardTitle>
          <CardDescription>Your current subscription</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Badge className="capitalize bg-primary">{result?.planType}</Badge>
              </div>
              <Button variant="ghost" size="sm">
                Change Plan
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{formatFileSize(totalStorage* 1024 * 1024)} Total Storage</span>
              </div>
              <div className="flex items-center gap-2">
                <Cloud className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm capitalize">
                  {result?.cloudProvider?.toUpperCase()} Integration
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Advanced Security Features</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Manage Subscription</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Storage Configuration</CardTitle>
          <CardDescription>Your storage settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {result?.storageType === "cloud" ? (
                  <Cloud className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm capitalize">{result?.storageType} Storage</span>
              </div>
              <Badge variant="outline" className="capitalize">
                {result?.cloudProvider?.toUpperCase()}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Encryption</span>
                </div>
                <Badge variant={result?.encryption?.enabled ? "default" : "outline"}>
                  {result?.encryption?.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              {/* {result?.encryption?.enabled && (
                <p className="text-xs text-muted-foreground pl-6">Using {result?.encryption?.algorithm}</p>
              )} */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M7 3v18" />
                    <path d="M3 7.5h4" />
                    <path d="M3 12h4" />
                    <path d="M3 16.5h4" />
                  </svg>
                  <span className="text-sm">Backup</span>
                </div>
                <Badge variant={result?.backup?.enabled ? "default" : "outline"}>
                  {result?.backup?.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              {result?.backup?.enabled && (
                <p className="text-xs text-muted-foreground pl-6">
                  {result?.backup?.frequency?.charAt(0).toUpperCase() + result?.backup?.frequency?.slice(1)} backups
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Configure Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

