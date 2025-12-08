"use client";
import DialogPopUp from "@/components/drawer/dialog-component";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageFooter } from "@/modules/layout/footer/page-footer";
import PageHeander from "@/modules/layout/header/page-heander";
import { useRouter } from "next/navigation";
import React, { memo, useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Details from "./details";
import FormSkeleton from "@/components/skeletons/form-skeleton";
import InventoryAvailability from "./inventory-availability";
import { InventorySchema } from "@/zod-schema/inventory-schema";
import { useAddInventoryMutation } from "@/state/inventory-api";

type FormData = z.infer<typeof InventorySchema>;
interface CreateInventoryProps {
  ItemId?: string;
}
const CreateInventory = ({ ItemId }: CreateInventoryProps) => {
  const router = useRouter();
  const [step, setStep] = React.useState<number>(0);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addInventory] = useAddInventoryMutation();
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
      await addInventory(payload);
    },
    [quantities, addInventory]
  );

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
            {false ? (
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
            isLoading={false}
            onCancel={() => router.back()}
          />
        </div>
      </ScrollArea>
    </DialogPopUp>
  );
};

export default memo(CreateInventory);
