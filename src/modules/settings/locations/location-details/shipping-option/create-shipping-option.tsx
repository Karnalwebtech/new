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
import Details from "./details";
import ButtonEvent from "@/components/buttons/btn-event";
import TipContent from "@/components/tip-content";
import CountryStateCity from "@/modules/settings/country-state-city/country-state-city";
import {
  useAddServiceZoneMutation,
  useGetServiseZoneDetailsQuery,
  useUpdateServiceZoneMutation,
} from "../../../../../state/service-zone-api";
import { useAppSelector } from "@/store";
import { RootState } from "@/store";
import { bulkToggleCodes, clearSelected } from "@/reducers/healper-slice";
import SelectedItemsBadgeList from "@/components/selected-items-badge-list";
import { serviceZoneSchema } from "@/zod-shema/service-zone-schema";
import LocationPrices from "./price-editor-dialog";

type FormData = z.infer<typeof serviceZoneSchema>;
interface CreateShippingOptionProps {
  itemId: string;
  fullfillment_set_id: string;
  servise_zone_id?: string;
}
const CreateShippingOption = ({
  itemId,
  fullfillment_set_id,
  servise_zone_id,
}: CreateShippingOptionProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { selected } = useAppSelector((state: RootState) => state.helper);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [step, setStep] = React.useState<number>(0);
  const {
    data,
    isLoading: dataLoader,
    error: dataLoadError,
  } = useGetServiseZoneDetailsQuery(
    { id: servise_zone_id as string },
    { skip: !servise_zone_id }
  );
  const [addServiceZone, { isLoading, error, isSuccess }] =
    useAddServiceZoneMutation();
  const [
    updateServiceZone,
    { isLoading: updateLoading, error: updateError, isSuccess: updateSuccess },
  ] = useUpdateServiceZoneMutation();
  useEffect(() => {
    // Clear whenever page loads
    dispatch(clearSelected());
  }, [dispatch]);
  useHandleNotifications({
    error: error || updateError || dataLoadError,
    isSuccess: isSuccess || updateSuccess,
    successMessage: updateSuccess
      ? "Zone updates successfully!"
      : "Zone Added successfully!",
    redirectPath: `/settings/locations/${itemId}`,
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
        type: "country",
        fulfillment_set_id: fullfillment_set_id,
      };
      if (servise_zone_id) {
        await updateServiceZone({ ...payload, id: servise_zone_id });
        return;
      }
      await addServiceZone(payload);
    },
    [
      addServiceZone,
      updateServiceZone,
      selected,
      fullfillment_set_id,
      servise_zone_id,
    ]
  );

  useEffect(() => {
    if (result) {
      const countries = result?.geozone?.map(
        ({ country_id }) => country_id?.name
      );
      setValue("name", result?.serviceZones?.name);
      dispatch(
        bulkToggleCodes({
          codes: countries,
          checked: true,
        })
      );
    }
  }, [result, setValue, dispatch]);

  return (
    <DialogPopUp title="" description="" isOpen={true} handleClose={() => {}}>
      <ScrollArea className="h-[96vh] w-full p-0 rounded-lg overflow-hidden pb-12">
        <div className="w-full mx-auto bg-white min-h-screen">
          <PageHeander
            tabs={["Details", "Prices"]}
            step={step}
            setStep={setStep}
            canAccessStep={[true]}
            onCancel={() => router.back()}
          />
          {dataLoader ? (
            <FormSkeleton />
          ) : (
            <div>
              {step !==0 ? (
                <Details
                  control={control}
                  errors={errors}
                  title={`${
                    servise_zone_id ? "Update" : "Create"
                  } Service Zone for Pickup from demo demo`}
                  description={""}
                />
              ) : (
                <LocationPrices/>
              )}
            </div>
          )}

          <PageFooter<FormData>
            step={step}
            lastStep={1} // or whatever your last step index is
            canAccessStep={canAccessStep} // example: at least 2 steps
            handleNext={() => setStep(step + 1)}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            isLoading={isLoading || updateLoading}
            onCancel={() => router.back()}
          />
        </div>
      </ScrollArea>
    </DialogPopUp>
  );
};

export default memo(CreateShippingOption);
