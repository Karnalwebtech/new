"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Download,
  Share,
  TrendingUp,
  Users,
  MapPinPlusInside,
} from "lucide-react";
import React, { memo } from "react";
import { Overview } from "./overview";
import { PlatformDistribution } from "./platform-distribution";
import { TopPosts } from "./top-posts";
import { RecentActivity } from "./recent-activity";
import {
  usePostEventTrackingQuery,
  usePostEventTrackingDetailsQuery,
} from "@/state/post-event-tracking-api";
import MetricCard from "@/components/cards/metric-card";
import { calculatePercentageChange } from "@/services/helpers";
import { PostShareDetails } from "./post-share-details";
import Link from "next/link";

const EnventIndex = () => {
  const { data } = usePostEventTrackingDetailsQuery({
    rowsPerPage: 10,
    page: 1,
  });
  const { data: eventData } = usePostEventTrackingQuery({
    rowsPerPage: 10,
    page: 1,
  });
  const sharesByPlatform = data?.currentMonthStats?.sharesByPlatform;
  const monthlyStats = data?.monthlyStats;
  // downloads
  const currentDownloads =
    eventData?.currentMonthStats?.totals?.totalDownloads || 0;
  const previousDownloads =
    eventData?.previousMonthStats?.totals?.totalDownloads || 0;
  const downloadChangePercent = calculatePercentageChange(
    currentDownloads,
    previousDownloads
  );
  //   shares
  const currentShares = eventData?.currentMonthStats.totals.totalShares || 0;
  const previousShares = eventData?.previousMonthStats.totals.totalShares || 0;
  const shareChangePercent = calculatePercentageChange(
    currentShares,
    previousShares
  );
  // // posts
  const currentposts = eventData?.currentMonthStats.activePosts || 0;
  const previousposts = eventData?.previousMonthStats.activePosts || 0;
  const postsChangePercent = calculatePercentageChange(
    currentposts,
    previousposts
  );
  // // unique users
  const currentUniqeUsers =
    data?.currentMonthStats.uniqueVisitors.uniqueUserCount || 0;
  const previousUniqeUsers =
    data?.previousMonthStats.uniqueVisitors.uniqueUserCount || 0;
  const UniqeUsersChangePercent = calculatePercentageChange(
    currentUniqeUsers,
    previousUniqeUsers
  );

  // // unique users by IP
  const currentuniqueIP =
    data?.currentMonthStats.uniqueVisitors.uniqueIPCount || 0;
  const previousuniqueIP =
    data?.previousMonthStats.uniqueVisitors.uniqueIPCount || 0;
  const uniqueIPChangePercent = calculatePercentageChange(
    currentuniqueIP,
    previousuniqueIP
  );
  const result = data?.result || [];
  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label={"Total Downloads"}
            changePercent={downloadChangePercent}
            value={eventData?.totals?.totalDownloads || 0}
            Icon={Download}
          />
          <MetricCard
            label={"Total Shares"}
            changePercent={shareChangePercent}
            value={eventData?.totals.totalShares || 0}
            Icon={Share}
          />

          <MetricCard
            label={"Active Posts"}
            changePercent={postsChangePercent}
            value={eventData?.dataCounter || 0}
            Icon={TrendingUp}
          />
          <MetricCard
            label={"Unique Users"}
            changePercent={UniqeUsersChangePercent}
            value={currentUniqeUsers}
            Icon={Users}
          />
          <MetricCard
            label={"Unique Users by IP"}
            changePercent={uniqueIPChangePercent}
            value={currentuniqueIP}
            Icon={MapPinPlusInside}
          />
        </div>


        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>
                  Download and share activity over time
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview monthlyStats={monthlyStats || []} />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
                <CardDescription>Share activity by platform</CardDescription>
              </CardHeader>
              <CardContent>
                <PlatformDistribution
                  sharesByPlatform={sharesByPlatform || []}
                />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle> <div className="flex justify-between items-center">
                  <span>Top Posts</span>
                  <Link href="/dashboard/tracking-events/post-events" className="text-blue-600 hover:text-blue-900">View more</Link>
                </div></CardTitle>
                <CardDescription>
                  Posts with highest engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TopPosts result={eventData?.result || []} />{" "}
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity by IP</CardTitle>
                <CardDescription>Latest tracking events</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivity result={result} />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="border-y-2 py-4">
          <div className="flex justify-between items-center">
            <h2>Share Details</h2>
            <Link href="/dashboard/tracking-events/share" className="text-blue-600 hover:text-blue-900">View more</Link>
          </div>
          <PostShareDetails type={"share"} />
        </div>
        <div className="border-y-2 py-4">
          <div className="flex justify-between items-center">
            <h2>Download Details</h2>
            <Link href="/dashboard/tracking-events/download" className="text-blue-600 hover:text-blue-900">View more</Link>
          </div>
          <PostShareDetails type={"download"} />
        </div>
      </div>
    </div>
  );
};

export default memo(EnventIndex);
