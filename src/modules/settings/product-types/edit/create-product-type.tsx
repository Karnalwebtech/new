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
import { productTypeSchema } from "@/zod-schema/product-schema";
import {
  useAddProductTypesMutation,
  useGetProductTypesDetailsQuery,
  useUpdateProductTypesMutation,
} from "@/state/product-types-api";

type FormData = z.infer<typeof productTypeSchema>;
interface CreateProductTypeProps {
  ItemId?: string;
}
const CreateProductType = ({ ItemId }: CreateProductTypeProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [step, setStep] = React.useState<number>(0);
  const [addProductTypes, { isLoading, error, isSuccess }] =
    useAddProductTypesMutation();
  const [
    updateProductTypes,
    { isLoading: updateLoading, error: updateError, isSuccess: updateSuccess },
  ] = useUpdateProductTypesMutation();

  const {
    data,
    isLoading: dataLoader,
    error: dataLoadError,
  } = useGetProductTypesDetailsQuery(
    { id: ItemId as string },
    { skip: !ItemId }
  );
  useHandleNotifications({
    error: error || updateError || dataLoadError,
    isSuccess: isSuccess || updateSuccess,
    successMessage: updateSuccess
      ? "product types updated successfully!"
      : "product types created successfully!",
    redirectPath: "/settings/product-types",
  });
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {},
    resolver: zodResolver(productTypeSchema),
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
        await updateProductTypes({ ...data, id: ItemId });
        return;
      }
      await addProductTypes(data);
    },
    [addProductTypes, updateProductTypes, ItemId]
  );

  useEffect(() => {
    if (result) {
      setValue("name", result?.name);
      setValue("description", result?.description);
    }
  }, [result, setValue, dispatch]);

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
                title={`${ItemId ? "Update" : "Create"} Product Type`}
                description={`${
                  ItemId ? "Update" : "Create"
                } a new product type to categorize your products.`}
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

export default CreateProductType;
