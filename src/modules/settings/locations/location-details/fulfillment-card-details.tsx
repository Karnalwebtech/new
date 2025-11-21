"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { memo, useCallback, useState } from "react";
import StatusIndicator from "@/components/status-indicator";

import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  MapPin,
  Plus,
  CheckCircle,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import NoRecordsCard from "@/components/cards/no-records-card";
import NavigateBtn from "@/components/buttons/navigate-btn";
import {
  containerVariants,
  expandVariants,
  itemVariants,
} from "@/lib/variants";
import { LocationFulFillmentSetType } from "@/types/fulfillment-set-type";
import { useRouter } from "next/navigation";
import {
  useAddFulfillmentSetMutation,
  useRemoveFulFillmentSetMutation,
} from "@/state/fullfillment-set-api";
import { useHandleNotifications } from "@/hooks/use-notification-handler";

interface FulfillmentCardDetailsProps {
  title: string;
  fulfillment_name: string;
  existingData?: LocationFulFillmentSetType[];
  ItemId: string;
}
const FulfillmentCardDetails = ({
  title,
  fulfillment_name,
  existingData = [],
  ItemId,
}: FulfillmentCardDetailsProps) => {
  const [
    removeFulFillmentSet,
    { error: removeError, isSuccess: removeSuccess },
  ] = useRemoveFulFillmentSetMutation();
  const [addFulfillmentSet, { error: addError, isSuccess: addSuccess }] =
    useAddFulfillmentSetMutation();
  const [expandedPickup, setExpandedPickup] = useState(true);
  const [expandedReturn, setExpandedReturn] = useState(true);
  const isExpand = existingData?.length > 0 ? true : false;
  const test: boolean = false;
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
                          `/settings/locations/${existingData[0]?.stock_location_id?.id}/fulfillment-set/${existingData[0]?.fulfillment_set_id?.id}`
                        )
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" /> Create service zone
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() =>
                        DeleteLocationfulfillmentHandler(
                          existingData[0]?.fulfillment_set_id?.id || ""
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
                        `${
                          fulfillment_name || ""
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
          (test ? (
            <>
              <motion.div
                variants={itemVariants}
                className="px-6 py-4 border-b border-slate-100 bg-slate-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <motion.div
                      className="p-2 bg-slate-200 rounded-lg mt-1"
                      whileHover={{ backgroundColor: "#cbd5e1" }}
                    >
                      <MapPin size={20} className="text-slate-700" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-slate-900">hhhh</h3>
                      <p className="text-sm text-slate-600 mt-1">
                        Afghanistan • 1 pickup option • 1 return option
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <ChevronDown
                      size={18}
                      className="text-slate-400 rotate-180"
                    />
                  </motion.button>
                </div>
              </motion.div>
              {/* Pickup Options Section */}
              <motion.div
                variants={itemVariants}
                className="border-b border-slate-100"
              >
                <motion.button
                  onClick={() => setExpandedPickup(!expandedPickup)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  whileHover={{ backgroundColor: "#f9fafb" }}
                >
                  <h4 className="font-medium text-slate-900">Pickup options</h4>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Create option
                    </motion.button>
                    <motion.div
                      animate={{ rotate: expandedPickup ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={18} className="text-slate-400" />
                    </motion.div>
                  </div>
                </motion.button>

                <AnimatePresence>
                  {expandedPickup && (
                    <motion.div
                      variants={expandVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                    >
                      <motion.div
                        className="px-6 pb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <motion.div
                          className="bg-slate-50 rounded-lg p-4 flex items-center justify-between hover:bg-slate-100 transition-colors group"
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-center gap-3">
                            <CheckCircle
                              size={20}
                              className="text-emerald-500"
                            />
                            <div>
                              <p className="font-medium text-slate-900">
                                www - India (Manual)
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                Zone Configuration
                              </p>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-white rounded-md transition-colors"
                          >
                            Store
                          </motion.button>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              {/* Return Options Section */}
              <motion.div variants={itemVariants}>
                <motion.button
                  onClick={() => setExpandedReturn(!expandedReturn)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  whileHover={{ backgroundColor: "#f9fafb" }}
                >
                  <h4 className="font-medium text-slate-900">Return options</h4>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Create option
                    </motion.button>
                    <motion.div
                      animate={{ rotate: expandedReturn ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={18} className="text-slate-400" />
                    </motion.div>
                  </div>
                </motion.button>

                <AnimatePresence>
                  {expandedReturn && (
                    <motion.div
                      variants={expandVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                    >
                      <motion.div
                        className="px-6 pb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <motion.div
                          className="bg-slate-50 rounded-lg p-4 flex items-center justify-between hover:bg-slate-100 transition-colors group"
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-center gap-3">
                            <CheckCircle
                              size={20}
                              className="text-emerald-500"
                            />
                            <div>
                              <p className="font-medium text-slate-900">
                                mkesh - Default Shipping Profile (Manual)
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                Default Configuration
                              </p>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-white rounded-md transition-colors"
                          >
                            Store
                          </motion.button>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </>
          ) : (
            <div className="text-center py-8">
              <NoRecordsCard
                style={"p-0 border-0 shadow-none"}
                description="There are no service zones to add shipping options to."
              />
              <div className="mt-4">
                <NavigateBtn
                  path={`/settings/locations/${existingData[0]?.stock_location_id?.id}/fulfillment-set/${existingData[0]?.fulfillment_set_id?.id}`}
                  title="Create service zone"
                  variant="outline"
                />
              </div>
            </div>
          ))}
      </motion.div>
    </motion.div>
  );
};

export default memo(FulfillmentCardDetails);
