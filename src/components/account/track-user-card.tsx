"use client"

import { memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ParaSkeleton } from "@/components/skeletons/para-skeleton"
import { useTrackUsersQuery } from "@/state/track-user-api"
import { Globe2, MapPin, Monitor, Chrome, Clock, Shield, Navigation } from "lucide-react"
import { TimeAgo } from "@/lib/timeAgo"

const TrackUserCard = memo(() => {
  const { data, isLoading } = useTrackUsersQuery({
    rowsPerPage: 1,
    page: 1,
  })

  const result = data?.result?.[0]
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>Security & System Details</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-6">
          {/* Location Section */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-primary" />
              Location Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
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
                  <div className="text-sm text-muted-foreground">City/Region</div>
                  <div className="font-medium">
                    {isLoading ? (
                      <ParaSkeleton />
                    ) : (
                      `${result?.geoLocation.city ?? "N/A"}, ${result?.geoLocation.region ?? "N/A"}`
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* System Section */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Monitor className="h-4 w-4 text-primary" />
              System Details
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Chrome className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <div className="text-sm text-muted-foreground">Browser</div>
                  <div className="font-medium">{isLoading ? <ParaSkeleton /> : (result?.browser ?? "N/A")}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Monitor className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <div className="text-sm text-muted-foreground">Operating System</div>
                  <div className="font-medium">{isLoading ? <ParaSkeleton /> : (result?.os ?? "N/A")}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Time Section */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Time Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <div className="text-sm text-muted-foreground">First Used</div>
                  <div className="font-medium">{isLoading ? <ParaSkeleton /> :  <TimeAgo time={result?.createdAt ?? new Date()} />}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <div className="text-sm text-muted-foreground">Last Used</div>
                  <div className="font-medium">{isLoading ? <ParaSkeleton /> : <TimeAgo time={result?.updatedAt ?? new Date()} />}</div>
                </div>
              </div>
            </div>
          </div>

          {/* IP Section */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Network Details
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Globe2 className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <div className="text-sm text-muted-foreground">IP Address</div>
                  <div className="font-medium">{isLoading ? <ParaSkeleton /> : (result?.ip ?? "N/A")}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <div className="text-sm text-muted-foreground">Type</div>
                  <div className="font-medium">{isLoading ? <ParaSkeleton /> : (result?.type ?? "N/A")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

TrackUserCard.displayName = "TrackUserCard"

export default TrackUserCard

