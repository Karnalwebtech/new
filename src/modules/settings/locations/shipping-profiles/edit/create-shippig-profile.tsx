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
import { ShippingProfileSchema } from "@/zod-schema/shipping-profile-schema";
import {
  useAddShippingProfileMutation,
  useGetShippingProfileDetailsQuery,
  useUpdateShippingProfileMutation,
} from "@/state/shipping-profile-api";

type FormData = z.infer<typeof ShippingProfileSchema>;
interface CreateShippingProfileProps {
  ItemId?: string;
}
const CreateShippingProfile = ({ ItemId }: CreateShippingProfileProps) => {
  const router = useRouter();
  const [step, setStep] = React.useState<number>(0);
  const [addShippingProfile, { isLoading, error, isSuccess }] =
    useAddShippingProfileMutation();
  const [
    updateShippingProfile,
    { isLoading: updateLoading, error: updateError, isSuccess: updateSuccess },
  ] = useUpdateShippingProfileMutation();

  const {
    data,
    isLoading: dataLoader,
    error: dataLoadError,
  } = useGetShippingProfileDetailsQuery(
    { id: ItemId as string },
    { skip: !ItemId }
  );
  useHandleNotifications({
    error: error || updateError || dataLoadError,
    isSuccess: isSuccess || updateSuccess,
    successMessage: updateSuccess
      ? "Shipping profile updated successfully!"
      : "Add Shipping profile successfully!",
    redirectPath: "/settings/locations/shipping-profiles",
  });
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {},
    resolver: zodResolver(ShippingProfileSchema),
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
        await updateShippingProfile({ ...data, id: ItemId });
        return;
      }
      await addShippingProfile(data);
    },
    [addShippingProfile, updateShippingProfile, ItemId]
  );

  useEffect(() => {
    if (result) {
      setValue("name", result?.name || "");
      setValue("type", result?.type || "");
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

export default CreateShippingProfile;
