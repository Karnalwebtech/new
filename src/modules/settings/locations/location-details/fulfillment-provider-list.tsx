"use client";
import DialogPopUp from "@/components/drawer/dialog-component";
import { ScrollArea } from "@/components/ui/scroll-area";
import PageHeander from "@/modules/layout/header/page-heander";
import { useRouter } from "next/navigation";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { toast } from "sonner";
import { NormalPageFooter } from "@/modules/layout/footer/normal-page-footer";
import {
  useGetAllLocationFulfillmentProviderQuery,
  useUpdateLocationFulfillmentProviderMutation,
} from "@/state/stock-location-api";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import { bulkToggleCodes, clearSelected } from "@/reducers/healper-slice";
import FulfillmentProvider from "../../fulfillment-provider/fulfillment-provider";

interface FulfillmentProviderListProps {
  itemId?: string;
  stockid?: string;
}
const FulfillmentProviderList = ({ itemId, stockid }: FulfillmentProviderListProps) => {
  const [step, setStep] = useState<number>(0);
  const dispatch = useDispatch();
  const { selected } = useSelector((state: RootState) => state.helper);
  const {
    data,
    isLoading: fettchLocader,
    error: fetchError,
  } = useGetAllLocationFulfillmentProviderQuery({
    rowsPerPage: 500,
    page: 1,
    stock_location_id: stockid,
  });
  const [updateLocationFulfillmentProvider, { isLoading, isSuccess, error }] =
    useUpdateLocationFulfillmentProviderMutation();
  const router = useRouter();
  useHandleNotifications({
    error: fetchError || error,
    isSuccess,
    successMessage: "Location fulfillment provider successfully!",
    redirectPath: `/settings/locations/${itemId}`,
  });
  const result = useMemo(() => data?.result || [], [data?.result]);

  const onSubmit = useCallback(async () => {
    if (selected.length === 0) {
      toast.warning("Please select one");
      return;
    }
    await updateLocationFulfillmentProvider({
      id: selected!,
      stock_location_id: itemId!,
    });
  }, [updateLocationFulfillmentProvider, selected, itemId]);
  useEffect(() => {
    dispatch(clearSelected());
  }, [dispatch]);
  useEffect(() => {
    if (isSuccess) {
      dispatch(clearSelected());
    }
  }, [dispatch, isSuccess]);

  useEffect(() => {
    if (result) {
      dispatch(
        bulkToggleCodes({
          codes: result.map((c) => c.fulfillment_provider_id!),
          checked: true,
        })
      );
    }
  }, [result, dispatch]);

  return (
    <DialogPopUp
      title=""
      description=""
      isOpen={true}
      handleClose={() => {}}
    >
      <ScrollArea className="h-[96vh] w-full p-0 rounded-lg overflow-hidden">
        {/* {dataFetchLoading ? (
          <FormSkeleton />
        ) : ( */}
        <div className="w-full mx-auto bg-white min-h-screen">
          <PageHeander
            tabs={[]}
            step={step}
            setStep={setStep}
            canAccessStep={[true]}
            onCancel={() => router.back()}
          />
          <FulfillmentProvider isChild={true} />
          <NormalPageFooter
            isLoading={isLoading || fettchLocader}
            onCancel={() => router.back()}
            onSubmit={() => onSubmit()}
          />
        </div>
      </ScrollArea>
    </DialogPopUp>
  );
};

export default memo(FulfillmentProviderList);
