"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import StockLocationDetails from "./stock-location-details";
import SalesChannelsCard from "./sales-channels-card";
import FulfillmentCard from "./fulfillment-card";
import {
  useDeleteStockLocationMutation,
  useGetStockLocationDetailsQuery,
} from "@/state/stock-location-api";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import { AnimatePresence } from "framer-motion";
import { AlertDialogComponenet } from "@/components/alert-dialog";
import FulfillmentCardDetails from "./fulfillment-card-details";
interface LocationDetailsProps {
  ItemId: string;
}
const LocationDetails = ({ ItemId }: LocationDetailsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deletedId, setDeletedId] = useState<string | null>(null);
  const {
    data,
    isLoading: dataLoader,
    error: dataLoadError,
  } = useGetStockLocationDetailsQuery({ id: ItemId });
  const [
    deleteStockLocation,
    { isLoading: delteLoading, error: deleteError, isSuccess: deleteSuccess },
  ] = useDeleteStockLocationMutation();

  useHandleNotifications({
    error: dataLoadError || deleteError,
    isSuccess: deleteSuccess,
    successMessage: `Stock location delete successfully!`,
    redirectPath: "/settings/locations",
  });

  const result = useMemo(() => data?.result, [data?.result]);

  const DeleteHandler = useCallback(async () => {
    if (deletedId) await deleteStockLocation({ id: deletedId });
  }, [deleteStockLocation, deletedId]);

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
      <div className="grid grid-cols-12 gap-2">
        {/* Left Column - Main Content */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <StockLocationDetails
            item={result!}
            removeHandler={removeHandler}
            deletedId={deletedId!}
          />
          <FulfillmentCardDetails title="Pickup" />
          <FulfillmentCardDetails title="Shipping" />
        </div>

        {/* Right Column - Side Panels */}
        <div className="space-y-6 col-span-12 lg:col-span-4">
          <SalesChannelsCard result={result!} />
          <FulfillmentCard result={result!} />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <AlertDialogComponenet
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Are you sure?"
            description="This action cannot be undone. This will permanently stock location."
            action={DeleteHandler}
            type="danger"
            setDeletedId={setDeletedId}
            isLoading={delteLoading}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default LocationDetails;
