"use client"

import { Copy } from "lucide-react"
import { useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Referral } from "@/types/referral-type"
import { formatCurrency } from "@/services/currency"
import { ParaSkeleton } from "@/components/skeletons/para-skeleton"
import { memo } from "react"

interface ReferralOverviewProps {
  data: Referral | undefined
  isLoading: boolean
  setShare: (value: number) => void
}

function ReferralOverview({ data, isLoading, setShare }: ReferralOverviewProps) {
  // Use useMemo to calculate these values only when data changes
  const { conversionRate, goalProgress, referralCode } = useMemo(() => {
    const conversionRate = data
      ? Math.round((Number(data.successfulConversions) / Number(data.totalReferrals)) * 100)
      : 0

    const goalProgress = data
      ? Math.round((Number(data.successfulConversions) / Number(data.referralGoal || 100)) * 100)
      : 0

    return {
      conversionRate: isNaN(conversionRate) ? 0 : conversionRate,
      goalProgress: isNaN(goalProgress) ? 0 : goalProgress,
      referralCode: data?.referralCode,
    }
  }, [data])

  // Use useCallback to memoize event handlers
  const handleCopyLink = useCallback(() => {
    if (referralCode) {
      navigator.clipboard.writeText(`check/${referralCode}`)
    }
  }, [referralCode])

  const handleShare = useCallback(() => {
    setShare(1)
  }, [setShare])

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <CardTitle>Referral Overview</CardTitle>
            <CardDescription>Track your referral performance and rewards</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative rounded-md border bg-muted px-3 py-2 text-sm font-medium">{referralCode}</div>
            <Button variant="outline" size="sm" className="h-9 gap-1" onClick={handleCopyLink}>
              <Copy className="h-4 w-4" />
              <span className="hidden sm:inline">Copy Link</span>
            </Button>
            <Button size="sm" className="h-9" onClick={handleShare}>
              Share
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <ParaSkeleton style="w-full h-[100px]" />
        ) : (
          <StatsContent data={data} conversionRate={conversionRate} goalProgress={goalProgress} />
        )}
      </CardContent>
    </Card>
  )
}

// Extract the stats content into a separate memoized component
// This prevents re-rendering when only isLoading changes
const StatsContent = memo(
  ({
    data,
    conversionRate,
    goalProgress,
  }: {
    data: Referral | undefined
    conversionRate: number
    goalProgress: number
  }) => {
    return (
      <>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <h3 className="text-sm font-medium text-muted-foreground">Total Referrals</h3>
            <p className="text-2xl font-bold">{data?.totalReferrals}</p>
          </div>
          <div className="space-y-1.5">
            <h3 className="text-sm font-medium text-muted-foreground">Successful Conversions</h3>
            <p className="text-2xl font-bold">{data?.successfulConversions}</p>
          </div>
          <div className="space-y-1.5">
            <h3 className="text-sm font-medium text-muted-foreground">Conversion Rate</h3>
            <p className="text-2xl font-bold">{conversionRate}%</p>
          </div>
          <div className="space-y-1.5">
            <h3 className="text-sm font-medium text-muted-foreground">Rewards Earned</h3>
            <p className="text-2xl font-bold">{formatCurrency(data?.rewardsEarned || 0)}</p>
          </div>
        </div>
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Referral Goal Progress</h3>
            <p className="text-sm text-muted-foreground">
              {data?.successfulConversions} / {data?.referralGoal || 100}
            </p>
          </div>
          <Progress value={goalProgress} className="h-2" />
        </div>
      </>
    )
  },
)

StatsContent.displayName = "StatsContent"
ReferralOverview.displayName = "ReferralOverview"

export default memo(ReferralOverview)

