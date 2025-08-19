import { ArrowUpRight, Users, DollarSign, Award, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Referral } from "@/types/referral-type";
import { ParaSkeleton } from "@/components/skeletons/para-skeleton";
import { memo } from "react";
interface ReferralStatsProps {
  data: Referral | undefined;
  prevData: number;
  isLoading: boolean;
  totalReward:number;
  activeTab:string;
}
function ReferralStats({ totalReward,data, prevData, isLoading,activeTab }: ReferralStatsProps) {
  // This would come from your API in a real application
  
  const stats = [
    {
      title: "Total Referrals",
      value: data?.totalReferrals,
      change: `+${prevData}`,
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Rewards Earned",
      value: data?.rewardsEarned,
      change: `+${totalReward}`,
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Referral Clicks",
      value: data?.referralClicks,
      change: "+0",
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Reward Claims",
      value: "0",
      change: "+0",
      icon: <Award className="h-4 w-4 text-muted-foreground" />,
    },
  ]

  return (
    <>
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            {isLoading ? <ParaSkeleton style="w-full h-[100px]" /> :
              <>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="flex items-center text-green-500">
                    {stat.change}
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </span>
                  <span className="ml-1">from last {activeTab}</span>
                </p>
              </>
            }
          </CardContent>
        </Card>
      ))}
    </>
  )
}

ReferralStats.displayName = "ReferralStats";

export default memo(ReferralStats);