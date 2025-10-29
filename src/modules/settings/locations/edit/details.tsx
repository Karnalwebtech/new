"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import InputField from "@/components/fields/input-field";
import SelectFields from "@/components/fields/select-field";
import { useCSCData } from "@/hooks/useCSCData";
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
  const { countries, states, cities, loading, cscCode, setCscCode } =
    useCSCData();

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
              <div className=" mb-4">
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
                  inputStyle={
                    "placeholder-gray-200 bg-transparent border-zinc-300"
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6">
              <div className="">
                <Label
                  htmlFor="address_1"
                  className="text-sm font-medium text-gray-700"
                >
                  Address
                </Label>
                <InputField
                  control={control}
                  errors={errors}
                  name={"address_1" as Path<T>}
                  placeholder=""
                  inputStyle={
                    "placeholder-gray-200 bg-transparent border-zinc-300"
                  }
                />
              </div>
              <div className="">
                <Label
                  htmlFor="address_2"
                  className="text-sm font-medium text-gray-700"
                >
                  Apartment, suite, etc.{" "}
                  <span className="text-sm text-gray-400">(Optional)</span>
                </Label>
                <InputField
                  control={control}
                  errors={errors}
                  name={"address_2" as Path<T>}
                  placeholder=""
                  inputStyle={
                    "placeholder-gray-200 bg-transparent border-zinc-300"
                  }
                />
              </div>
              <div className="">
                <Label
                  htmlFor="postal_code"
                  className="text-sm font-medium text-gray-700"
                >
                  Postal Code
                  <span className="text-sm text-gray-400">(Optional)</span>
                </Label>
                <InputField
                  control={control}
                  errors={errors}
                  name={"postal_code" as Path<T>}
                  placeholder=""
                  inputStyle={
                    "placeholder-gray-200 bg-transparent border-zinc-300"
                  }
                />
              </div>
              <div className="">
                <Label
                  htmlFor="country"
                  className="text-sm font-medium text-gray-700"
                >
                  Country
                </Label>
                <SelectFields
                  control={control}
                  errors={errors}
                  name={"country" as Path<T>}
                  placeholder="Select Country"
                  drop_down_selector={countries}
                  is_loading={loading.countries}
                  setCscCode={setCscCode}
                />
              </div>
              <div className="">
                <Label
                  htmlFor="state"
                  className="text-sm font-medium text-gray-700"
                >
                  State
                </Label>

                <SelectFields
                  control={control}
                  errors={errors}
                  name={"state" as Path<T>}
                  placeholder="Select State"
                  drop_down_selector={states}
                  is_loading={loading.states}
                  is_disabled={!cscCode?.countryCode && !cscCode?.stateCode}
                  setCscCode={setCscCode}
                />
              </div>
              <div className="">
                <Label
                  htmlFor="city"
                  className="text-sm font-medium text-gray-700"
                >
                  City
                </Label>

                <SelectFields
                  control={control}
                  errors={errors}
                  name={"city" as Path<T>}
                  placeholder="Select City"
                  drop_down_selector={cities}
                  is_loading={loading.cities}
                  is_disabled={!cscCode?.stateCode}
                  setCscCode={setCscCode}
                />
              </div>
              <div className="">
                <Label
                  htmlFor="company"
                  className="text-sm font-medium text-gray-700"
                >
                  Company
                  <span className="text-sm text-gray-400">(Optional)</span>
                </Label>
                <InputField
                  control={control}
                  errors={errors}
                  name={"company" as Path<T>}
                  placeholder=""
                  inputStyle={
                    "placeholder-gray-200 bg-transparent border-zinc-300"
                  }
                />
              </div>
              <div className="">
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-700"
                >
                  Phone
                  <span className="text-sm text-gray-400">(Optional)</span>
                </Label>
                <InputField
                  control={control}
                  errors={errors}
                  name={"phone" as Path<T>}
                  placeholder=""
                  inputStyle={
                    "placeholder-gray-200 bg-transparent border-zinc-300"
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
