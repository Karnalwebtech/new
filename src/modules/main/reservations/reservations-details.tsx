"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetreservationsDetailsQuery } from "@/state/reservations-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ReservationsDetailsProps {
  ItemId?: string;
}

const ReservationsDetails = ({ ItemId }: ReservationsDetailsProps) => {
  const router = useRouter();
  const { data, isLoading } = useGetreservationsDetailsQuery(
    { id: ItemId!, rowsPerPage: 5, page: 1 },
    { skip: !ItemId }
  );

  const result = useMemo(() => {
    if (data && data.success) {
      return data.result;
    }
    return null;
  }, [data]);
  //  const locationDetails =
  //     reserveDetails?.inventory_levels_preview?.find(
  //       (item) => item?.location_id === location
  //     ) ?? null;

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex justify-between py-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="shadow-sm h-fit">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between py-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-36" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No reservation details found.
      </div>
    );
  }

  return (
    <div className="min-h-[800px]">
      <div className="grid gap-6 md:grid-cols-2 ">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">
              Reservation of {result?.inventory_item?.title || ""}
            </CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    router.push(`/dashboard/reservations/${result?.id}/edit`)
                  }
                >
                  Edit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="space-y-0">
            <DetailRow
              label="Line Item ID"
              value={result?.line_item_id || "-"}
            />
            <DetailRow label="Description" value={result?.description || "-"} />
            <DetailRow label="Location" value={result?.location?.name || "-"} />
            <DetailRow
              label="In stock at this location"
              value={result?.locationLevel?.stocked_quantity || 0}
            />
            <DetailRow
              label="Available at this location"
              value={
                (result?.locationLevel?.stocked_quantity || 0) -
                (result?.locationLevel?.reserved_quantity || 0)
              }
            />
            <DetailRow
              label="Reserved at this location"
              value={result?.quantity || 0}
              isLast
            />
          </CardContent>
        </Card>
        <Card className="shadow-sm h-fit">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">
              {result?.inventory_item?.title || ""} Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            <DetailRow
              label="Line Item ID"
              value={result?.inventory_item?.sku || "-"}
            />
            <DetailRow
              label="In stock"
              value={
                `${result?.total_stocked_quantity} across ${
                  data?.total || 0
                } locations` || "-"
              }
            />
            <DetailRow
              label="Reserved"
              value={
                `${result?.total_reserved_quantity} across ${
                  data?.total || 0
                } locations` || "-"
              }
            />
            <DetailRow
              label="Available"
              value={
                `${
                  (result?.total_stocked_quantity || 0) -
                  (result?.total_reserved_quantity || 0)
                } across ${data?.total || 0} locations` || "-"
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

function DetailRow({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: string | number;
  isLast?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-3 ${
        !isLast ? "border-b border-border" : ""
      }`}
    >
      <span className="text-sm text-muted-foreground">{label}</span>

      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

export default ReservationsDetails;
