"use client";

import { MoreHorizontal, Pencil, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import NoRecordsCard from "@/components/cards/no-records-card";
import NavigateBtn from "@/components/buttons/navigate-btn";
import { StockLocationTypeDetails } from "@/types/stock-location-type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useGetAllStockLocationSaleChannelQuery } from "@/state/stock-location-api";
import { ParaSkeleton } from "@/components/skeletons/para-skeleton";
import { motion } from "framer-motion";
import { useMemo } from "react";
import RemainingCount from "@/components/remaining-count";
import { useGetAllSalesChannelsDataQuery } from "@/state/sales-channels-api";
interface SalesChannelsCardProps {
  result: StockLocationTypeDetails;
}
export default function SalesChannelsCard({ result }: SalesChannelsCardProps) {
  const router = useRouter();

  const {
    data,
    isLoading: fettchLocader,
  } = useGetAllStockLocationSaleChannelQuery({
    rowsPerPage: 500,
    page: 1,
    stock_location_id: result?._id || "",
  });
  const { data: dataLength } = useGetAllSalesChannelsDataQuery({
    rowsPerPage: 500,
    page: 1,
  });
  const fetchData = useMemo(() => data?.result || [], [data?.result]);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-foreground">
          Sales Channels
        </h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Table actions">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() =>
                router.push(
                  `/settings/locations/${result?.id}/sales-channels/${result?._id}`
                )
              }
            >
              <Pencil className="h-4 w-4 mr-2" /> Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {fettchLocader ? (
        <ParaSkeleton style="h-10 w-full" />
      ) : fetchData.length>0 ? (
        <div>
          <div className="flex items-center space-x-4">
            <motion.div
              className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Share2 />
            </motion.div>
            <RemainingCount
              result={fetchData?.map((ch) => ({
                id: ch?.sales_channel_id?._id || "1",
                name: ch?.sales_channel_id?.name || "",
              }))}
              length={data?.dataCounter || 0}
            />
          </div>
          <div>
            <p className="mt-4 text-sm text-slate-600">
              Connected to {fetchData?.length || 0} of{" "}
              {dataLength?.dataCounter || 0} sales channels{" "}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <NoRecordsCard
            style={"p-0 border-0 shadow-none"}
            description="The location is not connected to any sales channels."
          />
          <div className="mt-4">
            <NavigateBtn
              path={`/settings/locations/${result?.id}/sales-channels/${result?._id}`}
              title="Connect sales channels"
              variant="outline"
            />
          </div>
        </div>
      )}
    </Card>
  );
}
