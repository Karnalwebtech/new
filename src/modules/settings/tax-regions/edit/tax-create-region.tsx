"use client";
import DialogPopUp from "@/components/drawer/dialog-component";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageFooter } from "@/modules/layout/footer/page-footer";
import PageHeander from "@/modules/layout/header/page-heander";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  bulkToggleCodes,
  clearSelected,
  toggleCode,
} from "@/reducers/healper-slice";
import { MultiSelect } from "@/components/ui/multi-select";
import { regionSchema } from "@/zod-shema/region-schema";
import {
  useAddRegionMutation,
  useUpdateRegionMutation,
} from "@/state/regions-api";
import { useGetRegionDetailsQuery } from "../../../../state/regions-api";
import FormSkeleton from "@/components/skeletons/form-skeleton";

type FormData = z.infer<typeof regionSchema>;
interface CreateTaxRegionProps {
  ItemId?: string;
}
const CreateTaxRegion = ({ ItemId }: CreateTaxRegionProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    // Clear whenever page loads
    dispatch(clearSelected());
  }, [dispatch]);
  const { selected } = useSelector((state: RootState) => state.helper);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [step, setStep] = React.useState<number>(0);
  const [addRegion, { isLoading, error, isSuccess }] = useAddRegionMutation();
  const [
    updateRegion,
    { isLoading: updateLoading, error: updateError, isSuccess: updateSuccess },
  ] = useUpdateRegionMutation();

  const {
    data,
    isLoading: dataLoader,
    error: dataLoadError,
  } = useGetRegionDetailsQuery({ id: ItemId as string }, { skip: !ItemId });
  useHandleNotifications({
    error: error || updateError || dataLoadError,
    isSuccess: isSuccess || updateSuccess,
    successMessage: updateSuccess
      ? "Store updated successfully!"
      : "Store created successfully!",
    redirectPath: "/settings/regions",
  });
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {},
    resolver: zodResolver(regionSchema),
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
      const payload = {
        ...data,
        countries: selected,
        providers: ["selected", "B"],
      };

      if (ItemId) {
        await updateRegion({ ...payload, id: ItemId });
        return;
      }
      await addRegion(payload);
    },
    [addRegion, selected, updateRegion, ItemId]
  );

  useEffect(() => {
    if (result) {
      setValue("name", result.name || "");
      setValue("currency", result?.storeCurrency?._id);
      setValue("automatic_taxes", result?.automatic_taxes || false);
      setValue("tax_inclusive_pricing", result?.includes_tax || false);
      // setValue("name", result?.countries?.);
      dispatch(
        bulkToggleCodes({
          codes: result?.countries.map((c) => c.name) || [], // array of strings
          checked: true,
        })
      );
    }
  }, [result, setValue, dispatch]);

  useEffect(() => {
    if (isSuccess || updateSuccess) {
      dispatch(clearSelected());
    }
  }, [isSuccess, dispatch, updateSuccess]);
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

  const countries = [
    { value: "stripe", label: "Stripe (STRIPE)" },
    { value: "stripe-bancontact", label: "Stripe Bancontact (STRIPE)" },
    { value: "stripe-blik", label: "Stripe Blik (STRIPE)" },
    { value: "stripe-giropay", label: "Stripe Giropay (STRIPE)" },
    { value: "stripe-ideal", label: "Stripe Ideal (STRIPE)" },
    { value: "stripe-przelewy24", label: "Stripe Przelewy24 (STRIPE)" },
    { value: "system-default", label: "System (DEFAULT)" },
  ];
  const [selectedCountries, setSelectedCountries] = useState<string[]>([
    "stripe-przelewy24",
  ]);
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
          {dataLoader ? (
            <FormSkeleton />
          ) : (
            <div>
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
                <div className="mt-6 ">
                  <div className="mb-4">
                    <Label
                      htmlFor="Providers"
                      className="text-sm font-medium text-gray-700"
                    >
                      Providers
                    </Label>
                    <p className="text-sm font-medium text-gray-700">
                      Add which payment providers are available in this region.
                    </p>
                  </div>
                  <MultiSelect
                    options={countries}
                    selected={selectedCountries}
                    onChange={setSelectedCountries}
                    placeholder="Select countries..."
                    maxDisplay={3}
                  />
                </div>
              </div>
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

export default CreateTaxRegion;
