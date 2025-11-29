"use client";
import DialogPopUp from "@/components/drawer/dialog-component";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageFooter } from "@/modules/layout/footer/page-footer";
import PageHeander from "@/modules/layout/header/page-heander";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import Details from "./details";
import { useDispatch } from "react-redux";
import FormSkeleton from "@/components/skeletons/form-skeleton";
import { salesChannelsSchema } from "@/zod-schema/sales-channels-schema";
import {
  useAddSalesChannelsMutation,
  useGetSalesChannelsDetailsQuery,
  useUpdateSalesChannelsMutation,
} from "@/state/sales-channels-api";

type FormData = z.infer<typeof salesChannelsSchema>;
interface CreateSalesChannelsProps {
  ItemId?: string;
}
const CreateSalesChannels = ({ ItemId }: CreateSalesChannelsProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [step, setStep] = React.useState<number>(0);
  const [addSalesChannels, { isLoading, error, isSuccess }] =
    useAddSalesChannelsMutation();
  const [
    updateSalesChannels,
    { isLoading: updateLoading, error: updateError, isSuccess: updateSuccess },
  ] = useUpdateSalesChannelsMutation();

  const {
    data,
    isLoading: dataLoader,
    error: dataLoadError,
  } = useGetSalesChannelsDetailsQuery(
    { id: ItemId as string },
    { skip: !ItemId }
  );
  useHandleNotifications({
    error: error || updateError || dataLoadError,
    isSuccess: isSuccess || updateSuccess,
    successMessage: updateSuccess
      ? "Sales channels updated successfully!"
      : "Sales channels created successfully!",
    redirectPath: "/settings/sales-channels",
  });
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {},
    resolver: zodResolver(salesChannelsSchema),
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
      if (ItemId) {
        await updateSalesChannels({ ...data, id: ItemId });
        return;
      }
      await addSalesChannels(data);
    },
    [addSalesChannels, updateSalesChannels, ItemId]
  );

  useEffect(() => {
    if (result) {
      setValue("name", result?.name);
      setValue("description", result?.description);
      setValue("enabled", result.is_disabled!);
    }
  }, [result, setValue, dispatch]);

  return (
    <DialogPopUp
      title="Add Currencies"
      description="Add Currencies for your store"
      isOpen={true}
      handleClose={() => {}}
    >
      <ScrollArea className="h-[96vh] w-full p-0 rounded-lg overflow-hidden">
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
                title={`${ItemId ? "Update" : "Create"} Sales Channel`}
                description="Create a new sales channel to sell your products on."
              />
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
      </ScrollArea>
    </DialogPopUp>
  );
};

export default CreateSalesChannels;
