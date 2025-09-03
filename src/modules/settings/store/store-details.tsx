"use client";
import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { StoreResult } from "@/types/store-type";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface StoreDetailsProps {
  store: StoreResult;
  isLoading: boolean;
}

export function StoreDetails({ store, isLoading }: StoreDetailsProps) {
  const router = useRouter();

  const rows = [
    { label: "Name", value: store?.name },
    { label: "Default currency", value: store?.default_currency_id ? "test" : "-" },
    { label: "Default region", value: store?.default_region_id ? "test" : "-" },
    { label: "Default sales channel", value: store?.default_sales_channel_id ? "test" : "-" },
    { label: "Default location", value: store?.default_location_id ? "test" : "-" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 justify-between ">
            <div>
              <CardTitle>Store</CardTitle>
              <CardDescription>
                Manage your store&apos;s details
              </CardDescription>
            </div>

            {!isLoading && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Table actions">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => router.push("/settings/store/edit")}
                    className="cursor-pointer p-[4px]"
                  >
                    <SquarePen className="h-4 w-4" /> Edit
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div role="table" className="border-t">
            {rows.map((row, idx) => (
              <motion.div
                key={row.label}
                className="grid grid-cols-12 items-center border-b"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx, duration: 0.3 }}
              >
                <div className="col-span-12 md:col-span-3 px-6 py-2 text-sm text-muted-foreground">
                  {row.label}
                </div>
                <div className="col-span-12 md:col-span-9 px-6 py-2">
                  {isLoading ? (
                    <Skeleton className="h-5 w-32 rounded-md" />
                  ) : (
                    row.value
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
