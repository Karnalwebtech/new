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
import { TaxRegionSchema } from "@/zod-shema/tax-region-schema";
import { useAddTaxRegionMutation, useGetTaxRegionDetailsQuery, useUpdateTaxRegionMutation } from "@/state/tax-region-api";

type FormData = z.infer<typeof TaxRegionSchema>;
interface CreateTaxRegionProps {
  ItemId?: string;
}
const CreateTaxRegion = ({ ItemId }: CreateTaxRegionProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [step, setStep] = React.useState<number>(0);
  const [addTaxRegion, { isLoading, error, isSuccess }] =
    useAddTaxRegionMutation();
  const [
    updateTaxRegion,
    { isLoading: updateLoading, error: updateError, isSuccess: updateSuccess },
  ] = useUpdateTaxRegionMutation();

  const {
    data,
    isLoading: dataLoader,
    error: dataLoadError,
  } = useGetTaxRegionDetailsQuery(
    { id: ItemId as string },
    { skip: !ItemId }
  );
  useHandleNotifications({
    error: error || updateError || dataLoadError,
    isSuccess: isSuccess || updateSuccess,
    successMessage: updateSuccess
      ? "Sales channels updated successfully!"
      : "Add Return Reason!",
    // redirectPath: "/settings/return-reasons",
  });
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      tax_provider:"system"
    },
    resolver: zodResolver(TaxRegionSchema),
  });
  const result = data?.result;
  const values = watch();
  const canAccessStep = useMemo(() => {
    return [
      true,
      !!values.country?.trim(),
      values.country?.trim().length > 0 && values.country?.trim().length <= 60,
    ];
  }, [values]);

  const onSubmit = useCallback(
    async (data: FormData) => {
      console.log(data)
      if (ItemId) {
        await updateTaxRegion({ ...data, id: ItemId });
        return;
      }
      await addTaxRegion(data);
    },
    [
      addTaxRegion, 
      updateTaxRegion, ItemId
      ]
  );

  useEffect(() => {
    if (result) {
      setValue("country", result?.country_code?._id || "");
      setValue("tax_provider", result?.tax_provider || "");
      setValue("name", result?.default_rate?.name || "");
      setValue("tax_rate", result?.default_rate?.rate || "0");
      setValue("tax_code", result?.default_rate?.code || "");
    }
  }, [result, setValue, dispatch]);
  return (
    <DialogPopUp
      title=""
      description=""
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
                title={`${ItemId ? "Update" : "Add"} Tax Region`}
                description={`${
                  ItemId ? "Update" : "Add a new"
                } to define tax rates for a specific country.`}
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

export default CreateTaxRegion;
