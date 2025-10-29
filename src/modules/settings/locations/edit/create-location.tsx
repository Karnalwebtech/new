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
import { ReturnReasonSchema } from "@/zod-shema/return-reason-schema";
import {
  useAddReturnReasonMutation,
  useGetReturnReasonDetailsQuery,
  useUpdateReturnReasonMutation,
} from "@/state/return-reason-api";

type FormData = z.infer<typeof ReturnReasonSchema>;
interface CreateLocationProps {
  ItemId?: string;
}
const CreateLocation = ({ ItemId }: CreateLocationProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [step, setStep] = React.useState<number>(0);
  const [addReturnReason, { isLoading, error, isSuccess }] =
    useAddReturnReasonMutation();
  const [
    updateReturnReason,
    { isLoading: updateLoading, error: updateError, isSuccess: updateSuccess },
  ] = useUpdateReturnReasonMutation();

  const {
    data,
    isLoading: dataLoader,
    error: dataLoadError,
  } = useGetReturnReasonDetailsQuery(
    { id: ItemId as string },
    { skip: !ItemId }
  );
  useHandleNotifications({
    error: error || updateError || dataLoadError,
    isSuccess: isSuccess || updateSuccess,
    successMessage: updateSuccess
      ? "Sales channels updated successfully!"
      : "Add Return Reason!",
    redirectPath: "/settings/return-reasons",
  });
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {},
    resolver: zodResolver(ReturnReasonSchema),
  });
  const result = data?.result;
  const values = watch();
  const canAccessStep = useMemo(() => {
    return [
      true,
      !!values.value?.trim(),
      values.value?.trim().length > 0 && values.value?.trim().length <= 60,
    ];
  }, [values]);

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (ItemId) {
        await updateReturnReason({ ...data, id: ItemId });
        return;
      }
      await addReturnReason(data);
    },
    [addReturnReason, updateReturnReason, ItemId]
  );

  useEffect(() => {
    if (result) {
      setValue("value", result?.value);
      setValue("description", result?.description);
      setValue("label", result.label!);
    }
  }, [result, setValue, dispatch]);
  const value = watch("value", "");
  useEffect(() => {
    if (value) {
      // ✅ Replace spaces live but don't break typing
      const formatted = value.replace(/\s+/g, "_");

      // only update if changed (prevents infinite re-renders)
      if (formatted !== value) {
        setValue("value", formatted);
      }
    }
  }, [value, setValue]);
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
                title={`${ItemId ? "Update" : "Add"} Stock Location`}
                description={
                  "A stock location is a physical site where products are stored and shipped from."
                }
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

export default CreateLocation;
