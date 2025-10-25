"use client";
import React, { useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import InputField from "@/components/fields/input-field";
import HoverTooltip from "@/components/tooltip/hover-tooltip";
import { Info } from "lucide-react";
import SelectFields from "@/components/fields/select-field";
import { useGetAllCountoriesQuery } from "@/state/counrtries-states-cities-api";
interface DetailsProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  title: string;
  description: string;
}
const Details = <T extends FieldValues>({
  control,
  errors,
  title,
  description,
}: DetailsProps<T>) => {
  const { data, isLoading } = useGetAllCountoriesQuery({
    rowsPerPage: 500,
    page: 1,
  });
  const result = useMemo(
    () =>
      data?.result?.map(({ _id, name }) => ({ key: _id!, value: name! })) || [],
    [data?.result]
  );

  return (
    <>
      {/* Form Content */}
      <div className="p-8 pb-0 max-w-[800px] m-auto">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-90">{title}</h2>
          <p className="text-sm text-gray-600">{description}</p>
        </div>

        <div className="space-y-8">
          {/* Title, Subtitle, Handle Row */}
          <div className="">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="country"
                  className="text-sm font-medium text-gray-700"
                >
                  Country
                </Label>
                <SelectFields
                  is_loading={isLoading}
                  control={control}
                  errors={errors}
                  name={"country" as Path<T>}
                  placeholder="Select country" // Default placeholder
                  drop_down_selector={result}
                  class_style={"text-gray-500"}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="tax_provider"
                  className="text-sm font-medium text-gray-700"
                >
                  Tax provider
                </Label>
                <SelectFields
                  is_loading={isLoading}
                  control={control}
                  errors={errors}
                  name={"tax_provider" as Path<T>}
                  placeholder="Select tax provider" // Default placeholder
                  drop_down_selector={[{ key: "system", value: "system" }]}
                  class_style={"text-gray-500"}
                />
              </div>
            </div>
            <div className="py-8">
              <p className="text-sm flex items-center gap-[4px]">
                <b>Default tax rate</b>
                <span className="text-sm text-gray-600">(Optional)</span>
                <HoverTooltip
                  is_icon
                  Icon={Info}
                  description="The default tax rate for this region. An example is the standard VAT rate for a country or region."
                  className="bg-gray-300 rounded-full text-base cursor-pointer opacity-50"
                />
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
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
                  placeholder="Tax name"
                  inputStyle={
                    "placeholder-gray-200 bg-transparent border-zinc-300 text-gray-500"
                  }
                />
              </div>
              <div className="space-y-2 relative">
                <Label
                  htmlFor="tax_rate"
                  className="text-sm font-medium text-gray-700"
                >
                  Tax rate
                </Label>
                <InputField
                  control={control}
                  errors={errors}
                  name={"tax_rate" as Path<T>}
                  placeholder="18"
                  inputStyle={
                    "placeholder-gray-200 bg-transparent border-zinc-300 text-gray-500"
                  }
                />
                <span className="text-gray-400 absolute top-[30px] right-[10px]">
                  %
                </span>
              </div>{" "}
              <div className="space-y-2 relative">
                <Label
                  htmlFor="tax_code"
                  className="text-sm font-medium text-gray-700"
                >
                  Tax code
                </Label>
                <InputField
                  control={control}
                  errors={errors}
                  name={"tax_code" as Path<T>}
                  placeholder="Tax code"
                  inputStyle={
                    "placeholder-gray-200 bg-transparent border-zinc-300 text-gray-500"
                  }
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
