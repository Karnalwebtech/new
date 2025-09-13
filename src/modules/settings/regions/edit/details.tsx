"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import SelectFields from "@/components/fields/select-field";
import InputField from "@/components/fields/input-field";
import { useGetAllStoreCurrenciesQuery } from "@/state/store-currency-api";
import SwitchField from "@/components/fields/switch-field";
interface DetailsProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
}
const Details = <T extends FieldValues>({
  control,
  errors,
}: DetailsProps<T>) => {
  const { data, isLoading, error } = useGetAllStoreCurrenciesQuery({
    rowsPerPage: 300,
    page: 1,
  });
  return (
    <>
      {/* Form Content */}
      <div className="p-8 pb-0 max-w-[800px] m-auto">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-90">Create Region</h2>
          <p>Manage tax rates and providers for a set of countries.</p>
        </div>

        <div className="space-y-8">
          {/* Title, Subtitle, Handle Row */}
          <div className="">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 mb-4">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Name
                </Label>
                <InputField
                  control={control}
                  errors={errors}
                  name={"name" as Path<T>}
                  placeholder="Name"
                  inputStyle={
                    "placeholder-gray-200 bg-transparent border-zinc-300"
                  }
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="currency"
                  className="text-sm font-medium text-gray-700"
                >
                  Currency
                </Label>
                <SelectFields
                  control={control}
                  errors={errors}
                  name={"currency" as Path<T>}
                  placeholder="Select currency" // Default placeholder
                  drop_down_selector={
                    data?.result?.length
                      ? data.result.map((item) => ({
                          key: item?._id,
                          value: item?.currency_id?.name,
                        }))
                      : []
                  }
                  class_style={"text-gray-500"}
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 mt-4">
              <div className="flex flex-col">
                <Label
                  htmlFor="currency"
                  className="text-sm font-medium text-gray-700"
                >
                  Automatic Taxes
                </Label>
                <p className="text-sm font-medium text-gray-700">
                  When enabled, taxes will only be calculated at checkout based
                  on the shipping address.
                </p>
              </div>

              <div className="flex justify-end">
                <SwitchField
                  control={control}
                  errors={errors}
                  name={"automatic_taxes" as Path<T>}
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 mt-6">
              <div className="flex flex-col">
                <Label
                  htmlFor="currency"
                  className="text-sm font-medium text-gray-700"
                >
                  Tax inclusive pricing
                </Label>
                <p className="text-sm font-medium text-gray-700">
                  When enabled, prices in the region will be tax inclusive.
                </p>
              </div>

              <div className="flex justify-end">
                <SwitchField
                  control={control}
                  errors={errors}
                  name={"tax_inclusive_pricing" as Path<T>}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;
