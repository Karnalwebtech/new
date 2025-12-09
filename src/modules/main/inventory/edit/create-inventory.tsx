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
import Details from "./details";
import FormSkeleton from "@/components/skeletons/form-skeleton";
import InventoryAvailability from "./inventory-availability";
import { InventorySchema } from "@/zod-schema/inventory-schema";
import {
  useAddInventoryMutation,
  useGetInventoryDetailsQuery,
  useUpdateInventoryMutation,
} from "@/state/inventory-api";
import { useHandleNotifications } from "@/hooks/use-notification-handler";

type FormData = z.infer<typeof InventorySchema>;
interface CreateInventoryProps {
  ItemId?: string;
}
const CreateInventory = ({ ItemId }: CreateInventoryProps) => {
  const router = useRouter();
  const [step, setStep] = React.useState<number>(0);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addInventory, { isLoading, isSuccess, error }] =
    useAddInventoryMutation();
  const [
    updateInventory,
    { isLoading: updateLoading, isSuccess: updateSuccess, error: UpdateError },
  ] = useUpdateInventoryMutation();

  const { data } = useGetInventoryDetailsQuery(
    { id: ItemId!, rowsPerPage: 100, page: 1 },
    { skip: !ItemId }
  );
  useHandleNotifications({
    error: error || UpdateError,
    isSuccess: isSuccess || updateSuccess,
    successMessage: updateSuccess
      ? "Inventory updated successfully!"
      : "Inventory added successfully!",
    redirectPath: `/dashboard/inventory`,
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {},
    resolver: zodResolver(InventorySchema),
  });
  const result = useMemo(() => {
    if (data && data.success) {
      return data.result;
    }
    return null;
  }, [data]);

  const values = watch();
  const canAccessStep = useMemo(() => {
    const title = (values?.title || "").trim();

    const isTitleValid = title.length > 5 && title.length <= 60;

    return [true, isTitleValid];
  }, [values]);

  const onSubmit = useCallback(
    async (data: FormData) => {
      console.log("Form Data:", data);
      console.log("Quantities:", quantities);
      const payload = {
        ...data,
        quantities,
      };
      if (ItemId) {
        await updateInventory({ id: ItemId, ...payload });
        return;
      }
      await addInventory(payload);
    },
    [quantities, updateInventory, ItemId, addInventory]
  );

  useEffect(() => {
    if (result) {
      // Populate form fields with fetched data
      setValue("title", result.title || "");
      setValue("sku", result.sku || "");
      setValue("description", result.description || "");
      setValue("requires_shipping", result.requires_shipping || false);
      setValue("height", result.height || 0);
      setValue("hs_code", result.hs_code || "");
      setValue("length", result.length || 0);
      setValue("material", result.material || "");
      setValue("mid_code", result.mid_code || "");
      setValue("country", result.origin_country || "");
      setValue("weight", result.weight || 0);
      setValue("width", result.width || 0);
      setQuantities(
        Object.fromEntries(
          result?.inventory_levels_preview?.map(
            ({ location_id, stocked_quantity }) => [
              location_id,
              stocked_quantity,
            ]
          ) || []
        )
      );
    }
  }, [result, setValue]);
  return (
    <DialogPopUp title="" description="" isOpen={true} handleClose={() => {}}>
      <ScrollArea className="h-[96vh] w-full p-0 rounded-lg overflow-hidden">
        <div className="w-full mx-auto bg-white min-h-screen">
          <PageHeander
            tabs={["Details", "Availability"]}
            step={step}
            setStep={setStep}
            canAccessStep={[true]}
            onCancel={() => router.back()}
          />
          <div className="mb-20">
            {isLoading || updateLoading ? (
              <FormSkeleton />
            ) : (
              <div>
                {step === 0 ? (
                  <Details
                    control={control}
                    errors={errors}
                    title={`${ItemId ? "Update" : "Create"} Inventory Item`}
                    description={``}
                  />
                ) : (
                  <InventoryAvailability
                    quantities={quantities}
                    setQuantities={setQuantities}
                  />
                )}
              </div>
            )}
          </div>
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

export default memo(CreateInventory);
