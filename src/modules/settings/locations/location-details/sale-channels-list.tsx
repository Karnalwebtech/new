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
import SalesChannels from "../../sales-channels/sales-channels";
import {
  useGetAllStockLocationSaleChannelQuery,
  useUpdateStockLocationSaleChannelMutation,
} from "@/state/stock-location-api";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import { bulkToggleCodes, clearSelected } from "@/reducers/healper-slice";

interface SaleChannelsListProps {
  itemId?: string;
  stockid?: string;
}
const SaleChannelsList = ({ itemId, stockid }: SaleChannelsListProps) => {
  const [step, setStep] = useState<number>(0);
  const dispatch = useDispatch();
  const { selected } = useSelector((state: RootState) => state.helper);
  const {
    data,
    isLoading: fettchLocader,
    error: fetchError,
  } = useGetAllStockLocationSaleChannelQuery({
    rowsPerPage: 500,
    page: 1,
    stock_location_id: stockid,
  });
  const [updateStockLocationSaleChannel, { isLoading, isSuccess, error }] =
    useUpdateStockLocationSaleChannelMutation();
  const router = useRouter();
  useHandleNotifications({
    error: fetchError || error,
    isSuccess,
    successMessage: "Stock location sale channel successfully!",
    redirectPath: `/settings/locations/${itemId}`,
  });
  const result = useMemo(() => data?.result || [], [data?.result]);

  const onSubmit = useCallback(async () => {
    if (selected.length === 0) {
      toast.warning("Please select one");
      return;
    }
    await updateStockLocationSaleChannel({
      id: selected!,
      stock_location_id: itemId!,
    });
  }, [updateStockLocationSaleChannel, selected, itemId]);
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
          codes: result.map((c) => c.sales_channel_id!),
          checked: true,
        })
      );
    }
  }, [result, dispatch]);

  return (
    <DialogPopUp
      title="Add CountryStateCity"
      description="Add CountryStateCity for your store"
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
          <SalesChannels isChild={true} />
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

export default memo(SaleChannelsList);
