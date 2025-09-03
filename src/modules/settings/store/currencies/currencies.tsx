"use client";
import DialogPopUp from "@/components/drawer/dialog-component";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageFooter } from "@/modules/layout/footer/page-footer";
import PageHeander from "@/modules/layout/header/page-heander";
import { useRouter } from "next/navigation";
import React, { memo, useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import CurrenciesTable from "./currencies-table";

const Currencies = () => {
  const [step, setStep] = useState<number>(0);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    // resolver: zodResolver(schema),
  });
  //   const result = data?.result;
  // Step validation logic
  const values = watch();
  const canAccessStep = useMemo(() => {
    return [
      true,
      //   !!values.title?.trim(),
      //   values.meta_title?.trim().length > 0 &&
      //     values.meta_title?.trim().length <= 60 &&
      //     values.meta_canonical_url?.trim().length > 0 &&
      //     values.meta_description?.trim().length > 50 &&
      //     values.meta_description?.trim().length <= 160,
    ];
  }, [values]);

  const onSubmit = useCallback(async (data: FormData) => {}, []);
  return (
    <DialogPopUp
      title="Add Currencies"
      description="Add Currencies for your store"
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
            canAccessStep={canAccessStep}
            onCancel={() => router.back()}
          />
          <CurrenciesTable />
          <PageFooter<FormData>
            step={step}
            lastStep={0} // or whatever your last step index is
            canAccessStep={canAccessStep} // example: at least 2 steps
            handleNext={() => setStep(step + 1)}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            isLoading={false}
            onCancel={() => router.back()}
          />
        </div>
      </ScrollArea>
    </DialogPopUp>
  );
};

export default memo(Currencies);
