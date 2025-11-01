"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import NoRecordsCard from "@/components/cards/no-records-card";
import NavigateBtn from "@/components/buttons/navigate-btn";
import { StockLocationTypeDetails } from "@/types/stock-location-type";
import { memo } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil } from "lucide-react";

interface FulfillmentCardProps {
  result: StockLocationTypeDetails;
}
const FulfillmentCard = ({ result }: FulfillmentCardProps) => {
  const router = useRouter();
  return (
    <Card className="p-6">
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
                  `/settings/locations/${result?.id}/fulfillment-providers`
                )
              }
            >
              <Pencil className="h-4 w-4 mr-2" /> Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="text-center py-8">
        <NoRecordsCard
          style={"p-0 border-0 shadow-none"}
          description="This Stock Location is not connected to any fulfillment providers."
        />
        <div className="mt-4">
          <NavigateBtn
            path={`/settings/locations/${result?.id}/fulfillment-providers`}
            title="Connect Providers"
            variant="outline"
          />
        </div>
      </div>
    </Card>
  );
};
export default memo(FulfillmentCard);
