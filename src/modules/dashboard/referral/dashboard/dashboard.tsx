"use client";
import React, { memo, useState, useMemo, useCallback } from "react";
import ReferralOverview from "../referral-overview";
import ReferralStats from "../referral-stats";
import ReferralCharts from "../referral-charts";
import ReferredUsersTable from "../referred-users-table";
import RewardClaimsTable from "../reward-claims-table";
import { useReferraldetailsQuery } from "@/state/referral-api";
import { useGetAllRewardsQuery } from "@/state/reward-api";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("weekly");
  const [share, setShare] = useState<number>(0);
  
  const { data: rewardsData, isLoading: rewardsIsLoading } =
    useGetAllRewardsQuery({
      rowsPerPage: 10,
      page: 1,
    });
  const { data, isLoading, refetch } = useReferraldetailsQuery({
    click: share,
    timePeriod: activeTab,
  });

  const totalReward = useMemo(
    () =>
      data?.prevData?.reduce(
        (acc, item) =>
          acc +
          (item?.referralStatus === "active"
            ? Number(item?.rewardAmount) || 0
            : 0),
        0
      ) || 0,
    [data?.prevData]
  );

  const handleSetShare = useCallback(
    (value: number) => {
      setShare(value);

      refetch();
    },
    [refetch]
  );
  const handlertabs = useCallback(
    (value: string) => {
      setShare(0);
      setActiveTab(value);
      refetch();
    },
    [refetch]
  );

  return (
    <div className="flex-1 space-y-6 p-2 md:p-8">
      <ReferralOverview
        data={data?.result}
        isLoading={isLoading}
        setShare={handleSetShare}
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <ReferralStats
          data={data?.result}
          totalReward={totalReward}
          prevData={data?.prevData?.length || 0}
          isLoading={isLoading}
          activeTab={activeTab}
        />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <ReferralCharts
          activeTab={activeTab}
          prevData={data?.prevData}
          setActiveTab={handlertabs}
        />
      </div>
      <div
        className="grid gap-6 md:grid-cols-2 relative"
      >
        <ReferredUsersTable data={data?.result} isLoading={isLoading} />
        <RewardClaimsTable
          data={rewardsData?.result}
          isLoading={rewardsIsLoading}
        />
      </div>
    </div>
  );
};

Dashboard.displayName = "Dashboard";

export default memo(Dashboard);
