"use client";
import DialogPopUp from "@/components/drawer/dialog-component";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageFooter } from "@/modules/layout/footer/page-footer";
import PageHeander from "@/modules/layout/header/page-heander";
import { storeSchema } from "@/zod-shema/store-schema";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Details from "./details";
import { zodResolver } from "@hookform/resolvers/zod";

type FormData = z.infer<typeof storeSchema>;
const StoreEdit = () => {
  const router = useRouter();
  const [step, setStep] = React.useState<number>(0);

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
      // const payload: ProductCategoryFormData = {
      //   ...data,
      //   keywords,
      //   categoryId,
      //   FileData: fileData.map(({ fileType, _id }) => ({ [fileType]: _id })),
      // };
      // if (catId) {
      //   await UpdateProductCategory({ ...payload, id: catId });
      //   return;
      // }
      // await AddProductCategory(payload);
      // send API request or dispatch action here
    },
    [
      // AddProductCategory,
      // categoryId,
      // UpdateProductCategory,
      // fileData,
      // keywords,
      // catId,
    ]
  );

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
            isLoading={false}
            onCancel={() => router.back()}
          />
        </div>
      </ScrollArea>
    </DialogPopUp>
  );
};

export default StoreEdit;
