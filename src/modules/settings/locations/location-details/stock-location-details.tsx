"use client";
import { motion } from "framer-motion";
import {
  ArchiveRestore,
  MapPin,
  MoreHorizontal,
  Pencil,
  Store,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { containerVariants, itemVariants } from "@/lib/variants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { memo } from "react";
import { StockLocationTypeDetails } from "@/types/stock-location-type";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card"

interface StockLocationDetailsProps {
  item: StockLocationTypeDetails;
  removeHandler: (value: string) => void;
  deletedId: string;
}
const StockLocationDetails = ({
  item,
  removeHandler,
  deletedId,
}: StockLocationDetailsProps) => {
  const router = useRouter();
  return (
    <motion.div
      className="w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card>
        {/* Header Section */}
        <motion.div
          className="p-6"
          variants={itemVariants}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              {/* Building Icon */}
              <motion.div
                className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Store size={20} />
              </motion.div>

              <div className="flex-1">
                <motion.h2
                  className="text-base font-bold text-slate-600 dark:text-white"
                  variants={itemVariants}
                >
                  {item?.name}
                </motion.h2>
                <motion.div
                  className="mt-2 flex items-start gap-2"
                  variants={itemVariants}
                >
                  <MapPin className="w-3 h-3 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {item?.address_id?.company && (
                      <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                        {item?.address_id?.company}
                      </p>
                    )}

                    <p>
                      {item?.address_id?.address_1},
                      {item?.address_id?.address_2},
                      {item?.address_id?.city_id?.name},{" "}
                      {item?.address_id?.province_id?.name},{" "}
                      {item?.address_id?.country_id?.name},{" "}
                      {item?.address_id?.postal_code}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Table actions"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(`/settings/locations/${item?.id}/edit`)
                    }
                  >
                    <Pencil className="h-4 w-4 mr-2" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={deletedId === item?.id}
                    className="text-destructive cursor-pointer"
                    onClick={() => item?.id && removeHandler(item?.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      className="flex gap-2 items-center text-blue-400 taxt-xs cursor-pointer"
                      href={`/inventory?location_id=${item?.id}`}
                    >
                      <ArchiveRestore className="w-3 h-3" />
                      View Inventory
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default memo(StockLocationDetails);
