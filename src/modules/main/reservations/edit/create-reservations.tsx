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
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import { ReservationsSchema } from "@/zod-schema/reservations-schema";
import {
  useAddreservationsMutation,
  useGetreservationsDetailsQuery,
  useUpdatereservationsMutation,
} from "@/state/reservations-api";
import { toast } from "sonner";

type FormData = z.infer<typeof ReservationsSchema>;
interface CreateReservationsProps {
  ItemId?: string;
}
const CreateReservations = ({ ItemId }: CreateReservationsProps) => {
  const router = useRouter();
  const [step, setStep] = React.useState<number>(0);
  const [quantities, setQuantities] = useState<number | null>(null);
  const [addreservations, { isLoading, isSuccess, error }] =
    useAddreservationsMutation();
  const [
    updatereservations,
    { isLoading: updateLoading, isSuccess: updateSuccess, error: UpdateError },
  ] = useUpdatereservationsMutation();

  const { data } = useGetreservationsDetailsQuery(
    { id: ItemId! },
    { skip: !ItemId }
  );
  useHandleNotifications({
    error: error || UpdateError,
    isSuccess: isSuccess || updateSuccess,
    successMessage: updateSuccess
      ? "Reservations updated successfully!"
      : "Reservations added successfully!",
    redirectPath: `/dashboard/reservations`,
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {},
    resolver: zodResolver(ReservationsSchema),
  });

  const result = useMemo(() => {
    if (data && data.success) {
      return data.result;
    }
    return null;
  }, [data]);

  const values = watch();
  const canAccessStep = useMemo(() => {
    const reserve = (values?.reserve || "").trim();
    const location = (values?.location || "").trim();

    const isReserveValid = reserve.length > 3 && reserve.length <= 60;
    const isLocationValid = location.length > 3 && location.length <= 60;

    return [true, isReserveValid && isLocationValid];
  }, [values]);

  const onSubmit = useCallback(
    async (data: FormData) => {
      if ((data.quantity || 0) > (quantities || 0)) {
        toast.error("Quantity is greater than available quantity");
        return;
      }
      const payload = {
        ...data,
      };
      if (ItemId) {
        await updatereservations({ id: ItemId, ...payload });
        return;
      }
      await addreservations(payload);
    },
    [quantities, updatereservations, ItemId, addreservations]
  );

  useEffect(() => {
    if (result) {
      const reserveId =
        typeof result.inventory_item_id === "string"
          ? result.inventory_item_id
          : result.inventory_item_id?._id ?? "";

      // Populate form fields with fetched data
      setValue("reserve", reserveId || "");
      setValue("location", result?.location_id || "");
      setValue("quantity", result?.quantity || 0);
      setValue("description", result?.description || "");
    }
  }, [result, setValue]);
  return (
    <DialogPopUp title="" description="" isOpen={true} handleClose={() => {}}>
      <ScrollArea className="h-[96vh] w-full p-0 rounded-lg overflow-hidden">
        <div className="w-full mx-auto bg-white min-h-screen">
          <PageHeander
            tabs={["Details"]}
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
                <Details
                  control={control}
                  errors={errors}
                  title={`${ItemId ? "Update" : "Create"} reservation`}
                  description={``}
                  values={values}
                  setQuantities={setQuantities}
                  ItemId={ItemId}
                  resultReservations={result!}
                />
              </div>
            )}
          </div>
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

export default memo(CreateReservations);
