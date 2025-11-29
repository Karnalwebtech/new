"use client";
import DialogPopUp from "@/components/drawer/dialog-component";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageFooter } from "@/modules/layout/footer/page-footer";
import PageHeander from "@/modules/layout/header/page-heander";
import { storeSchema } from "@/zod-schema/store-schema";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Details from "./details";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditStoreMutation, useGetStoreDataQuery } from "@/state/store-api";
import { useHandleNotifications } from "@/hooks/use-notification-handler";

type FormData = z.infer<typeof storeSchema>;
const StoreEdit = () => {
  const router = useRouter();
  const [step, setStep] = React.useState<number>(0);
  const { data } = useGetStoreDataQuery();
  const result = data?.result;
  const [EditStore, { isLoading, error, isSuccess }] = useEditStoreMutation();
  useHandleNotifications({
    error,
    isSuccess,
    successMessage: "Store updated successfully!",
    redirectPath: "/settings/store",
  });
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "MyStore",
    },
    resolver: zodResolver(storeSchema),
  });

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
      await EditStore(data);
    },
    [EditStore]
  );

  useEffect(() => {
    if (result) {
      setValue("name", result.name);
    }
  }, [result, setValue]);
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
          <Details control={control} errors={errors} />
          <PageFooter<FormData>
            step={step}
            lastStep={0} // or whatever your last step index is
            canAccessStep={canAccessStep} // example: at least 2 steps
            handleNext={() => setStep(step + 1)}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            isLoading={isLoading}
            onCancel={() => router.back()}
          />
        </div>
      </ScrollArea>
    </DialogPopUp>
  );
};

export default StoreEdit;
