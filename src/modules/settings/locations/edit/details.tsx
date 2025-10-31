"use client";
import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import { useWatch } from "react-hook-form";
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

  // Read currently selected IDs from RHF (works on both Add and Edit)
  const countryId = useWatch({
    control,
    name: "country" as Path<T>,
  }) as string | undefined;

  const stateId = useWatch({
    control,
    name: "state" as Path<T>,
  }) as string | undefined;

  // 🔹 Hydrate cscCode.countryCode (ISO2) from current countryId
  useEffect(() => {
    if (!countryId || !countries?.length) return;
    const hit = countries.find((c) => c.key === countryId);
    if (hit?.isoCode) {
      setCscCode((prev) => ({ ...prev, countryCode: hit.isoCode }));
    }
  }, [countryId, countries, setCscCode]);

  // 🔹 Hydrate cscCode.stateCode (short code) from current stateId
  useEffect(() => {
    if (!stateId || !states?.length) return;
    const hit = states.find((s) => s.key === stateId);
    if (hit?.stateCode) {
      setCscCode((prev) => ({ ...prev, stateCode: hit.stateCode }));
    }
  }, [stateId, states, setCscCode]);

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
              <div className="mb-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6">
              <div>
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
                  inputStyle="placeholder-gray-200 bg-transparent border-zinc-300"
                />
              </div>

              <div>
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
                  inputStyle="placeholder-gray-200 bg-transparent border-zinc-300"
                />
              </div>

              <div>
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
                  inputStyle="placeholder-gray-200 bg-transparent border-zinc-300"
                />
              </div>

              <div>
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
                  // country is always enabled
                  is_disabled={false}
                  setCscCode={setCscCode}
                />
              </div>

              <div>
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
                  // Enable if either ISO is known or a country is selected (edit case)
                  is_disabled={!cscCode?.countryCode && !countryId}
                  setCscCode={setCscCode}
                />
              </div>

              <div>
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
                  // Enable if either stateCode is known or a state is selected (edit case)
                  is_disabled={!cscCode?.stateCode && !stateId}
                  setCscCode={setCscCode}
                />
              </div>

              <div>
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
                  inputStyle="placeholder-gray-200 bg-transparent border-zinc-300"
                />
              </div>

              <div>
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
