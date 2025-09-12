"use client";
import DialogPopUp from "@/components/drawer/dialog-component";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageFooter } from "@/modules/layout/footer/page-footer";
import PageHeander from "@/modules/layout/header/page-heander";
import { storeSchema } from "@/zod-shema/store-schema";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditStoreMutation, useGetStoreDataQuery } from "@/state/store-api";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import Details from "./details";
import { Label } from "@/components/ui/label";
import ButtonEvent from "@/components/buttons/btn-event";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import CountryStateCity from "../../country-state-city/country-state-city";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { clearSelected, toggleCode } from "@/reducers/healper-slice";

type FormData = z.infer<typeof storeSchema>;
const CreateRegion = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { selected } = useSelector((state: RootState) => state.helper);
  const [isOpen, setIsOpen] = useState<boolean>(false);
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
  const handleRemove = useCallback(
    (id: string) => {
      dispatch(
        toggleCode({
          code: id, // ✅ single string
          checked: false,
        })
      );
    },
    [dispatch]
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
          <div className="p-8 pb-32 max-w-[800px] m-auto">
            <div className="flex flex-col">
              <Label
                htmlFor="currency"
                className="text-sm font-medium text-gray-700"
              >
                Countries
              </Label>
              <p className="text-sm font-medium text-gray-700">
                Add the countries included in this region.
              </p>
            </div>
            <div className="flex items-center justify-between gap-4 mt-4">
              {/* Selected countries badges */}
              <div className="flex flex-wrap gap-2">
                {selected?.map((item) => (
                  <Badge
                    key={item}
                    variant="secondary"
                    className="flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition"
                  >
                    <span className="truncate max-w-[100px]">{item}</span>
                    <Button
                      onClick={() => handleRemove(item)} // ✅ add remove logic
                      className="p-0 h-6 w-6 rounded-full text-gray-700 bg-gray-100 hover:bg-gray-300 hover:text-gray-900 transition"
                    >
                      <X size={14} />
                    </Button>
                  </Badge>
                ))}
                {selected?.length > 0 && (
                  <ButtonEvent
                    title="Clear all"
                    event={() => dispatch(clearSelected())}
                    // style="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow px-4 py-2 transition"
                  />
                )}
              </div>

              {/* Add countries button */}
              <div className="flex justify-end">
                <ButtonEvent
                  title="Add Countries"
                  event={() => setIsOpen(true)}
                  // style="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow px-4 py-2 transition"
                />
              </div>
            </div>
            <hr className="border-gray-500 mt-2 dark:border-white"></hr>
          </div>
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
        <CountryStateCity
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isChild={true}
          isTaxPrice={false}
        />
      </ScrollArea>
    </DialogPopUp>
  );
};

export default CreateRegion;
