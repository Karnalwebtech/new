"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  MapPin,
  MoreHorizontal,
  Trash2,
  Pencil,
} from "lucide-react";
import NoRecordsCard from "@/components/cards/no-records-card";
import NavigateBtn from "@/components/buttons/navigate-btn";
import { itemVariants } from "@/lib/variants";
import { useRouter } from "next/navigation";
import {
  useDeleteServiceZoneMutation,
  useGetAllServiseZoneByFulfillmentidQuery,
} from "@/state/service-zone-api";
import { GeoDataType } from "@/types/service-zone-type";
import { ParaSkeleton } from "@/components/skeletons/para-skeleton";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import { AlertDialogComponenet } from "@/components/alert-dialog";
import ShippingOption from "../shipping-option/shipping-option";
interface ServiseZoneCardProps {
  fulfillmentSetId: string;
  url: string;
  title: string;
}
const ServiseZoneCard = ({
  title,
  fulfillmentSetId,
  url,
}: ServiseZoneCardProps) => {
  const router = useRouter();
  // const [expandedPickup, setExpandedPickup] = useState(true);
  // const [expandedReturn, setExpandedReturn] = useState(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deletedId, setDeletedId] = useState<string | null>(null);
  const { data, isLoading } = useGetAllServiseZoneByFulfillmentidQuery(
    {
      id: fulfillmentSetId,
      page: 1,
      rowsPerPage: 500,
    },
    {
      skip: !fulfillmentSetId,
    }
  );
  const [
    deleteServiceZone,
    { isLoading: deleteLoading, error: deleteError, isSuccess: deleteSuccess },
  ] = useDeleteServiceZoneMutation();
  useHandleNotifications({
    error: deleteError,
    isSuccess: deleteSuccess,
    successMessage: deleteSuccess ? "Servise zone deleted successfully!" : "",
  });
  const result = useMemo(() => data?.result || [], [data]);
  const geoMap = useMemo<Record<string, GeoDataType>>(() => {
    const map: Record<string, GeoDataType> = {};
    data?.geoData?.forEach((geo: GeoDataType) => {
      map[geo.service_zone_id] = geo;
    });
    return map;
  }, [data]);

  const DeleteHandler = useCallback(async () => {
    if (deletedId) await deleteServiceZone({ id: deletedId });
  }, [deleteServiceZone, deletedId]);

  const removeHandler = useCallback((id: string) => {
    setIsOpen(true);
    setDeletedId(id);
  }, []);

  useEffect(() => {
    if (deleteSuccess) {
      setIsOpen(false);
      setDeletedId(null);
    }
  }, [deleteSuccess]);

  return (
    <>
      {isLoading || deleteLoading ? (
        <div className="flex px-4 flex-col gap-2">
          <ParaSkeleton style={"h-12 w-full"} />
          <ParaSkeleton style={"h-12 w-full"} />
          <ParaSkeleton style={"h-12 w-full"} />
        </div>
      ) : result.length > 0 ? (
        result?.map((item) => (
          <div key={item?.id} className="border-b border-t border-slate-200">
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
                    <h3 className="font-semibold text-slate-900">
                      {item?.name}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      <span>
                        {geoMap[item._id ?? ""]?.country_names?.[0] ||
                          "No Countries"}
                        {geoMap[item._id ?? ""]?.more > 0
                          ? ` + ${geoMap[item._id ?? ""].more} more`
                          : ""}
                      </span>
                      • 0 pickup option • 0 return option
                    </p>
                  </div>
                </div>
                <div>
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
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() =>
                          router.push(`${url}/service-zone/${item?.id}`)
                        }
                      >
                        <Pencil className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={deletedId === item?._id}
                        className="text-destructive cursor-pointer"
                        onClick={() => item?.id && removeHandler(item?.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </motion.div>
            {/* Pickup Options Section */}
            <motion.div
              variants={itemVariants}
              className="border-b border-slate-100"
            >
              <motion.div
                // onClick={() => setExpandedPickup(!expandedPickup)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                whileHover={{ backgroundColor: "#f9fafb" }}
              >
                <h4 className="font-medium text-slate-900">{title} options</h4>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() =>
                      router.push(
                        `${url}/service-zone/${item?.id}/shipping-option/create`
                      )
                    }
                    whileTap={{ scale: 0.95 }}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Create option
                  </motion.button>
                  <motion.div
                    animate={{ rotate: false ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={18} className="text-slate-400" />
                  </motion.div>
                </div>
              </motion.div>
              <ShippingOption
                serviseZone_id={item?._id}
                url={`${url}/service-zone/${item?.id}/shipping-option`}
              />
            </motion.div>
            {/* Return Options Section */}
            <motion.div variants={itemVariants}>
              <motion.div
                // onClick={() => setExpandedReturn(!expandedReturn)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                whileHover={{ backgroundColor: "#f9fafb" }}
              >
                <h4 className="font-medium text-slate-900">Return options</h4>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      router.push(
                        `${url}/service-zone/${item?.id}/shipping-option/create?is_return`
                      )
                    }
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Create option
                  </motion.button>
                  <motion.div
                    animate={{ rotate: false ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={18} className="text-slate-400" />
                  </motion.div>
                </div>
              </motion.div>
              <ShippingOption
                serviseZone_id={item?._id}
                is_return={true}
                url={`${url}/service-zone/${item?.id}/shipping-option`}
              />
            </motion.div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <NoRecordsCard
            style={"p-0 border-0 shadow-none"}
            description="There are no service zones to add shipping options to."
          />
          <div className="mt-4">
            <NavigateBtn
              path={url}
              title="Create service zone"
              variant="outline"
            />
          </div>
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <AlertDialogComponenet
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Are you sure?"
            description="You are about to delete the service zone. This action cannot be undone."
            action={DeleteHandler}
            type="danger"
            setDeletedId={setDeletedId}
            isLoading={deleteLoading}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default memo(ServiseZoneCard);
