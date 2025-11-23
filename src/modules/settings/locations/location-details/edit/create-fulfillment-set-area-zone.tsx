"use client";
import DialogPopUp from "@/components/drawer/dialog-component";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageFooter } from "@/modules/layout/footer/page-footer";
import PageHeander from "@/modules/layout/header/page-heander";
import { useRouter } from "next/navigation";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import { useDispatch } from "react-redux";
import FormSkeleton from "@/components/skeletons/form-skeleton";
import { stockLocationSchema } from "@/zod-shema/stock-location-schema";
import {
  useGetStockLocationDetailsQuery,
  useUpdateStockLocationMutation,
} from "@/state/stock-location-api";
import Details from "./details";
import ButtonEvent from "@/components/buttons/btn-event";
import TipContent from "@/components/tip-content";
import CountryStateCity from "@/modules/settings/country-state-city/country-state-city";
import { useAddServiceZoneMutation } from "../../../../../state/service-zone-api";
import { useAppSelector } from "@/store";
import { RootState } from "@/store";
import { clearSelected, toggleCode } from "@/reducers/healper-slice";
import SelectedItemsBadgeList from "@/components/selected-items-badge-list";
import { serviceZoneSchema } from "@/zod-shema/service-zone-schema";

type FormData = z.infer<typeof serviceZoneSchema>;
interface CreateFulfillmentSetAreaZoneProps {
  itemId: string;
  fullfillment_set_id: string;
}
const CreateFulfillmentSetAreaZone = ({
  itemId,
  fullfillment_set_id,
}: CreateFulfillmentSetAreaZoneProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { selected } = useAppSelector((state: RootState) => state.helper);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [step, setStep] = React.useState<number>(0);
  const [addServiceZone, { isLoading, error, isSuccess }] =
    useAddServiceZoneMutation();
  const [
    updateStockLocation,
    { isLoading: updateLoading, error: updateError, isSuccess: updateSuccess },
  ] = useUpdateStockLocationMutation();
  useEffect(() => {
    // Clear whenever page loads
    dispatch(clearSelected());
  }, [dispatch]);
  const {
    data,
    isLoading: dataLoader,
    error: dataLoadError,
  } = useGetStockLocationDetailsQuery(
    { id: itemId as string },
    { skip: !itemId }
  );
  useHandleNotifications({
    error: error || updateError || dataLoadError,
    isSuccess: isSuccess || updateSuccess,
    successMessage: updateSuccess
      ? "Stock Location updated successfully!"
      : "Zone Added successfully!",
    redirectPath:`/settings/locations/${itemId}`,
  });
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {},
    resolver: zodResolver(serviceZoneSchema),
  });
  const result = data?.result;
  const values = watch();
  const canAccessStep = useMemo(() => {
    return [
      true,
      !!values.name?.trim(),
      values.name?.trim().length > 0 && values.name?.trim().length <= 60,
    ];
  }, [values]);

  const onSubmit = useCallback(
    async (data: FormData) => {
      const payload = {
        ...data,
        areas: selected,
        type:"country",
        fulfillment_set_id: fullfillment_set_id,
      };
      // if (itemId) {
      //   await updateStockLocation({ ...data, id: itemId });
      //   return;
      // }
      await addServiceZone(payload);
    },
    [addServiceZone,selected]
  );

  useEffect(() => {
    if (result) {
      // setValue("name", result?.name);
    }
  }, [result, setValue, dispatch]);
  // const value = watch("value", "");
  // useEffect(() => {
  //   if (value) {
  //     // ✅ Replace spaces live but don't break typing
  //     const formatted = value.replace(/\s+/g, "_");

  //     // only update if changed (prevents infinite re-renders)
  //     if (formatted !== value) {
  //       setValue("value", formatted);
  //     }
  //   }
  // }, [value, setValue]);

  return (
    <DialogPopUp title="" description="" isOpen={true} handleClose={() => {}}>
      <ScrollArea className="h-[96vh] w-full p-0 rounded-lg overflow-hidden pb-12">
        <div className="w-full mx-auto bg-white min-h-screen">
          <PageHeander
            tabs={[]}
            step={step}
            setStep={setStep}
            canAccessStep={[true]}
            onCancel={() => router.back()}
          />
          {dataLoader ? (
            <FormSkeleton />
          ) : (
            <div>
              <Details
                control={control}
                errors={errors}
                title={`${
                  itemId ? "Update" : "Create"
                } Service Zone for Pickup from demo demo`}
                description={""}
              />
              <div className="px-8 pb-0 max-w-[800px] m-auto">
                <TipContent content="A service zone is a collection of geographical zones or areas. It's used to restrict available shipping options to a defined set of locations." />

                {/* Areas label and manage areas button */}
                <div className="mt-4 flex items-center justify-between gap-6">
                  <div>
                    <h2 className="text-sm font-medium text-gray-700">Areas</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Select the geographical areas that the service zone
                      covers.
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <ButtonEvent
                      title="Manage areas"
                      event={() => setIsOpen(true)}
                      variant="outline"
                    />
                  </div>
                </div>
                <SelectedItemsBadgeList />
              </div>
            </div>
          )}

          <PageFooter<FormData>
            step={step}
            lastStep={0} // or whatever your last step index is
            canAccessStep={canAccessStep} // example: at least 2 steps
            handleNext={() => setStep(step + 1)}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            isLoading={isLoading || updateLoading}
            onCancel={() => router.back()}
          />
        </div>

        <CountryStateCity
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isChild={true}
          isTaxPrice={false}
        />
      </ScrollArea>
    </DialogPopUp>
  );
};

export default memo(CreateFulfillmentSetAreaZone);
