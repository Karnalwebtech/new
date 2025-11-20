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
import {
  useAddFulfillmentSetMutation,
  useGetAllFulFillmentSetQuery,
} from "@/state/fullfillment-set-api";
import DeliverySkeleton from "@/components/skeletons/delivery-skeleton";
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

  const [addFulfillmentSet, { error: addError, isSuccess: addSuccess }] =
    useAddFulfillmentSetMutation();
  const result = useMemo(() => data?.result, [data?.result]);

  const { data: fetchFulfillmentData } = useGetAllFulFillmentSetQuery({
    page: 1,
    rowsPerPage: 2,
    stock_location_id: result?._id,
  });
  useHandleNotifications({
    error: dataLoadError || deleteError || addError,
    isSuccess: deleteSuccess,
    successMessage: addSuccess
      ? `Added successfully!`
      : `Stock location delete successfully!`,
    redirectPath: "/settings/locations",
  });

  const [pickupResult, shippingResult] = useMemo(() => {
    const data = fetchFulfillmentData?.result ?? [];

    const pickup = data.filter(
      (item) => item?.fulfillment_set_id?.type === "pickup"
    );
    const shipping = data.filter(
      (item) => item?.fulfillment_set_id?.type === "shipping"
    );

    return [pickup, shipping];
  }, [fetchFulfillmentData?.result]);

  // console.log("fetchFulfillmentData", fetchFulfillmentData);
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
    <>
      <div className="grid grid-cols-12 gap-2">
        {/* Left Column - Main Content */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {dataLoader ? (
            <DeliverySkeleton />
          ) : (
            <>
              <StockLocationDetails
                item={result!}
                removeHandler={removeHandler}
                deletedId={deletedId!}
              />
              <FulfillmentCardDetails
                title="Pickup"
                addEvent={() =>
                  addFulfillmentSetHandler(
                    "pickup",
                    `${result?.name || ""} pickup`,
                    ItemId
                  )
                }
                existingData={pickupResult}
              />
              <FulfillmentCardDetails
                title="Shipping"
                addEvent={() =>
                  addFulfillmentSetHandler(
                    "shipping",
                    `${result?.name || ""} shipping`,
                    ItemId
                  )
                }
                existingData={shippingResult}
              />
            </>
          )}
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
