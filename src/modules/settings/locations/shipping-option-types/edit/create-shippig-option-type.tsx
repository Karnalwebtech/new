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
import FormSkeleton from "@/components/skeletons/form-skeleton";
import { useAddShippingOptionTypeMutation, useGetShippingOptionTypeDetailsQuery, useUpdateShippingOptionTypeMutation } from "@/state/shipping-option-type-api";
import { ShippingOptionTypeSchema } from "@/zod-schema/shipping-profile-schema";

type FormData = z.infer<typeof ShippingOptionTypeSchema>;
interface CreateShippingOptionTypeProps {
  ItemId?: string;
}
const CreateShippingOptionType = ({ ItemId }: CreateShippingOptionTypeProps) => {
  const router = useRouter();
  const [step, setStep] = React.useState<number>(0);
  const [addShippingOptionType, { isLoading, error, isSuccess }] =
    useAddShippingOptionTypeMutation();
  const [
    updateShippingOptionType,
    { isLoading: updateLoading, error: updateError, isSuccess: updateSuccess },
  ] = useUpdateShippingOptionTypeMutation();

  const {
    data,
    isLoading: dataLoader,
    error: dataLoadError,
  } = useGetShippingOptionTypeDetailsQuery(
    { id: ItemId as string },
    { skip: !ItemId }
  );
  useHandleNotifications({
    error: error || updateError || dataLoadError,
    isSuccess: isSuccess || updateSuccess,
    successMessage: updateSuccess
      ? "Shipping option type updated successfully!"
      : "Shipping option type added successfully!",
    redirectPath: "/settings/locations/shipping-option-types",
  });
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {},
    resolver: zodResolver(ShippingOptionTypeSchema),
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
        await updateShippingOptionType({ ...data, id: ItemId });
        return;
      }
      await addShippingOptionType(data);
    },
    [addShippingOptionType, updateShippingOptionType, ItemId]
  );

  useEffect(() => {
    if (result) {
      setValue("name", result?.name || "");
      setValue("code", result?.code || "");
      setValue("description", result?.description || "");
    }
  }, [result, setValue]);

  return (
    <DialogPopUp title="" description="" isOpen={true} handleClose={() => {}}>
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
                title={`${ItemId ? "Update" : "Create "} Shipping Profile`}
                description={`${
                  ItemId ? "Update" : "Create a new"
                } shipping profile to group products with similar shipping requirements.`}
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

export default CreateShippingOptionType;
