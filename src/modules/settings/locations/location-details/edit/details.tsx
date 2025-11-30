"use client";
import React, { useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import InputField from "@/components/fields/input-field";
import CheckboxLabel from "@/components/fields/checkbox-label";
import SelectFields from "@/components/fields/select-field";
import { useGetAllShippingProfileDataQuery } from "@/state/shipping-profile-api";
import { useGetAllFulFillmentProviderQuery } from "@/state/fullfillment-provider-api";

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
  const { data } = useGetAllShippingProfileDataQuery({
    rowsPerPage: 100,
    page: 1,
  });
  const { data: fulfillmentData } = useGetAllFulFillmentProviderQuery({
    rowsPerPage: 100,
    page: 1,
  });
  const shippingProfileResult = useMemo(() => data?.result || [], [data]);
  const fulfillmentProviderResult = useMemo(() => fulfillmentData?.result || [], [fulfillmentData]);
  return (
    <>
      {/* Form Content */}
      <div className="p-8 pb-0 max-w-[800px] m-auto">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-90">{title}</h2>
          <p className="text-sm text-gray-600">{description}</p>
        </div>

        <div className="space-y-8">
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="my-2 mb-6">
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
                  placeholder=""
                  inputStyle="placeholder-gray-200 bg-transparent border-zinc-300"
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
