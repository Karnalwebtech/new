"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { memo, useCallback } from "react";
import StatusIndicator from "@/components/status-indicator";

import { motion } from "framer-motion";
import {
  Plus,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import {
  containerVariants,
  itemVariants,
} from "@/lib/variants";
import { LocationFulFillmentSetType } from "@/types/fulfillment-set-type";
import { useRouter } from "next/navigation";
import {
  useAddFulfillmentSetMutation,
  useRemoveFulFillmentSetMutation,
} from "@/state/fullfillment-set-api";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import ServiseZoneCard from "./edit/servise-zone-card";

interface FulfillmentCardDetailsProps {
  title: string;
  fulfillment_name: string;
  existingData?: LocationFulFillmentSetType;
  ItemId: string;
  isExpand: boolean;
}
const FulfillmentCardDetails = ({
  title,
  fulfillment_name,
  existingData,
  ItemId,
  isExpand = false
}: FulfillmentCardDetailsProps) => {

  const [
    removeFulFillmentSet,
    { error: removeError, isSuccess: removeSuccess },
  ] = useRemoveFulFillmentSetMutation();


  const [addFulfillmentSet, { error: addError, isSuccess: addSuccess }] =
    useAddFulfillmentSetMutation();

  const router = useRouter();
  useHandleNotifications({
    error: removeError || addError,
    isSuccess: removeSuccess || addSuccess,
    successMessage: addSuccess
      ? "Added successfully!"
      : "Deleted successfully!",
    // redirectPath: "/settings/locations",
  });
  const DeleteLocationfulfillmentHandler = useCallback(
    async (deletedId: string) => {
      if (deletedId) await removeFulFillmentSet({ id: deletedId });
    },
    [removeFulFillmentSet]
  );

  const addFulfillmentSetHandler = useCallback(
    async (type: string, name: string, location_id: string) => {
      const payload = {
        name,
        type,
        location_id,
      };
      await addFulfillmentSet(payload);
    },
    [addFulfillmentSet]
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full"
    >
      {/* Main Card */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
      >
        {/* Header */}
        <motion.div
          className="flex items-center justify-between p-4 border-b border-slate-100"
          whileHover={{ backgroundColor: "#f9fafb" }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          <div className="flex items-center gap-3">
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50"
              whileHover={{ scale: 1.05 }}
            >
              <StatusIndicator enabled={isExpand!} size={7} />
            </motion.div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isExpand ? (
                  <>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/settings/locations/${existingData?.stock_location_id?.id}/fulfillment-set/${existingData?.fulfillment_set_id?.id}`
                        )
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" /> Create service zone
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() =>
                        DeleteLocationfulfillmentHandler(
                          existingData?.fulfillment_set_id?.id || ""
                        )
                      }
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Disable
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() =>
                      addFulfillmentSetHandler(
                        title.toLocaleLowerCase(),
                        `${fulfillment_name || ""
                        } ${title.toLocaleLowerCase()}`,
                        ItemId
                      )
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" /> Enable
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        {isExpand &&
          (
            <ServiseZoneCard
              fulfillmentSetId={existingData?.fulfillment_set_id?.id!}
              url={`/settings/locations/${existingData?.stock_location_id?.id}/fulfillment-set/${existingData?.fulfillment_set_id?.id}`}
            />
          )}
      </motion.div>
    </motion.div>
  );
};

export default memo(FulfillmentCardDetails);
