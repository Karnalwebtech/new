"use client"

import { memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ParaSkeleton } from "@/components/skeletons/para-skeleton"
import { useTrackUsersQuery } from "@/state/track-user-api"
import {
  Laptop,
  Smartphone,
  Tablet,
  Monitor,
  Chrome,
  Globe2,
  Clock,
  Shield,
  Navigation,
  MapPin,
  Info,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { TimeAgo } from "@/lib/timeAgo"
// import { TimeAgo } from "@/lib/timeAgo"

const DeviceDetailsCard = memo(() => {
  const { data, isLoading } = useTrackUsersQuery({
    rowsPerPage: 1,
    page: 1,
  })

  const result = data?.result?.[0]
  console.log(result)
  const getDeviceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pc":
        return <Laptop className="h-5 w-5" />
      case "mobile":
        return <Smartphone className="h-5 w-5" />
      case "tablet":
        return <Tablet className="h-5 w-5" />
      default:
        return <Monitor className="h-5 w-5" />
    }
  }

  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleString()
  // }

  return (
    <Card className="w-full">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-primary" />
            <CardTitle>System & Device Details</CardTitle>
          </div>
          {!isLoading && result?.type && (
            <Badge variant="outline" className="flex items-center gap-1">
              {getDeviceIcon(result.type)}
              <span>{result.type}</span>
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-6">
          {/* Device & System Section */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Monitor className="h-4 w-4 text-primary" />
              Device Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Monitor className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <div className="text-sm text-muted-foreground">Operating System</div>
                  <div className="font-medium">{isLoading ? <ParaSkeleton /> : (result?.os ?? "N/A")}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Chrome className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <div className="text-sm text-muted-foreground">Browser</div>
                  <div className="font-medium">{isLoading ? <ParaSkeleton /> : (result?.browser ?? "N/A")}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-primary" />
              Location Details
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <div className="text-sm text-muted-foreground">Country</div>
                  <div className="font-medium">
                    {isLoading ? <ParaSkeleton /> : (result?.geoLocation.country ?? "N/A")}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Navigation className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <div className="text-sm text-muted-foreground">City</div>
                  <div className="font-medium">
                    {isLoading ? <ParaSkeleton /> : (result?.geoLocation.city ?? "N/A")}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <div className="text-sm text-muted-foreground">Region</div>
                  <div className="font-medium">
                    {isLoading ? <ParaSkeleton /> : (result?.geoLocation.region ?? "N/A")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              Technical Details
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <div className="text-sm text-muted-foreground">IP Address</div>
                  <div className="font-medium">{isLoading ? <ParaSkeleton /> : (result?.ip ?? "N/A")}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <div className="text-sm text-muted-foreground">User Agent</div>
                  <div className="font-medium text-sm break-all">
                    {isLoading ? <ParaSkeleton /> : (result?.userAgent ?? "N/A")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Time Information */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Session Timeline
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <div className="text-sm text-muted-foreground">First Seen</div>
                  <div className="font-medium">{isLoading ? <ParaSkeleton /> : <TimeAgo time={result?.createdAt ?? new Date()} />}</div>


                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <div className="text-sm text-muted-foreground">Last Active</div>
                  <div className="font-medium">{isLoading ? <ParaSkeleton /> : <TimeAgo time={result?.updatedAt ?? new Date()} />}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

DeviceDetailsCard.displayName = "DeviceDetailsCard"

export default DeviceDetailsCard

