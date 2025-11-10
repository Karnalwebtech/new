"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import NoRecordsCard from "@/components/cards/no-records-card";
import NavigateBtn from "@/components/buttons/navigate-btn";
import { StockLocationTypeDetails } from "@/types/stock-location-type";
import { memo, useMemo } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Truck } from "lucide-react";
import { useGetAllLocationFulfillmentProviderQuery } from "@/state/stock-location-api";
import { ParaSkeleton } from "@/components/skeletons/para-skeleton";
import { motion } from "framer-motion";

interface FulfillmentCardProps {
  result: StockLocationTypeDetails;
}
const FulfillmentCard = ({ result }: FulfillmentCardProps) => {
  const router = useRouter();
  const {
    data,
    isLoading: fettchLocader,
  } = useGetAllLocationFulfillmentProviderQuery({
    rowsPerPage: 500,
    page: 1,
    stock_location_id: result?._id || "",
  });
  const fetchData = useMemo(() => data?.result || [], [data?.result]);

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-foreground">
          Fulfillment Providers
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
                  `/settings/locations/${result?.id}/fulfillment-providers/${result?._id}`
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
      ) : fetchData ? (
        fetchData?.map((item) => (
          <div
            key={item._id}
            className="p-4 rounded-md mb-2 flex items-center gap-4"
          >
            <motion.div
              className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Truck />
            </motion.div>
            <p className="text-lg text-black">
              {item.fulfillment_provider_id?.name}
            </p>
          
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <NoRecordsCard
            style={"p-0 border-0 shadow-none"}
            description="This Stock Location is not connected to any fulfillment providers."
          />
          <div className="mt-4">
            <NavigateBtn
              path={`/settings/locations/${result?.id}/fulfillment-providers/${result?._id}`}
              title="Connect Providers"
              variant="outline"
            />
          </div>
        </div>
      )}
    </Card>
  );
};
export default memo(FulfillmentCard);
