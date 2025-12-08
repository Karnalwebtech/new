"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import InputField from "@/components/fields/input-field";
import TextTextareaField from "@/components/fields/textarea-field";
import SwitchField from "@/components/fields/switch-field";
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
  const { countries, loading, setCscCode } =
    useCSCData();
  return (
    <>
      {/* Form Content */}
      <div className="p-8 pb-22 max-w-[800px] m-auto">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-90">{title}</h2>
          <p>{description}</p>
        </div>

        <div className="space-y-8">
          {/* Title, Subtitle, Handle Row */}
          <div className="">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 mb-4">
                <Label
                  htmlFor="title"
                  className="text-sm font-medium text-gray-700"
                >
                  Title
                </Label>
                <InputField
                  control={control}
                  errors={errors}
                  name={"title" as Path<T>}
                  placeholder="Title"
                  inputStyle={
                    "placeholder-gray-200 bg-transparent border-zinc-300"
                  }
                />
              </div>
              <div className="space-y-2 mb-4">
                <Label
                  htmlFor="sku"
                  className="text-sm font-medium text-gray-700"
                >
                  SKU <span className="text-gray-300">Optional</span>
                </Label>
                <InputField
                  control={control}
                  errors={errors}
                  name={"sku" as Path<T>}
                  placeholder="SKU-1234"
                  inputStyle={
                    "placeholder-gray-200 bg-transparent border-zinc-300"
                  }
                />
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <Label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                Description <span className="text-gray-300">Optional</span>
              </Label>
              <TextTextareaField
                control={control}
                errors={errors}
                name={"description" as Path<T>}
                placeholder="description"
                inputStyle={
                  "placeholder-gray-200 bg-transparent border-zinc-300"
                }
              />
            </div>
            <div className="shadow-md bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <SwitchField
                  control={control}
                  errors={errors}
                  name={"requires_shipping" as Path<T>}
                />
                <div className="space-y-1">
                  <Label
                    htmlFor="has-variants"
                    className="text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    Requires shipping
                  </Label>
                  <p className="text-sm text-gray-600">
                    Does the inventory item require shipping?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="my-8">
          <h3 className="text-lg font-semibold text-gray-90">Attributes</h3>
          <div className="space-y-8">
            {/* Title, Subtitle, Handle Row */}
            <div className="">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="title"
                    className="text-sm font-medium text-gray-700"
                  >
                    Width <span className="text-gray-300">Optional</span>
                  </Label>
                  <InputField
                    control={control}
                    errors={errors}
                    name={"width" as Path<T>}
                    placeholder="100"
                    type="number"
                    inputStyle={
                      "placeholder-gray-200 bg-transparent border-zinc-300"
                    }
                  />
                </div>
                <div>
                  <Label
                    htmlFor="length"
                    className="text-sm font-medium text-gray-700"
                  >
                    Length <span className="text-gray-300">Optional</span>
                  </Label>
                  <InputField
                    control={control}
                    errors={errors}
                    type="number"
                    name={"length" as Path<T>}
                    placeholder="100"
                    inputStyle={
                      "placeholder-gray-200 bg-transparent border-zinc-300"
                    }
                  />
                </div>
                <div>
                  <Label
                    htmlFor="height"
                    className="text-sm font-medium text-gray-700"
                  >
                    Height <span className="text-gray-300">Optional</span>
                  </Label>
                  <InputField
                    control={control}
                    errors={errors}
                    type="number"
                    name={"height" as Path<T>}
                    placeholder="100"
                    inputStyle={
                      "placeholder-gray-200 bg-transparent border-zinc-300"
                    }
                  />
                </div>
                <div>
                  <Label
                    htmlFor="weight"
                    className="text-sm font-medium text-gray-700"
                  >
                    Weight <span className="text-gray-300">Optional</span>
                  </Label>
                  <InputField
                    control={control}
                    errors={errors}
                    type="number"
                    name={"weight" as Path<T>}
                    placeholder="100"
                    inputStyle={
                      "placeholder-gray-200 bg-transparent border-zinc-300"
                    }
                  />
                </div>
                <div>
                  <Label
                    htmlFor="mid_code"
                    className="text-sm font-medium text-gray-700"
                  >
                    Mid code <span className="text-gray-300">Optional</span>
                  </Label>
                  <InputField
                    control={control}
                    errors={errors}
                    name={"mid_code" as Path<T>}
                    placeholder="100"
                    inputStyle={
                      "placeholder-gray-200 bg-transparent border-zinc-300"
                    }
                  />
                </div>
                <div>
                  <Label
                    htmlFor="hs_code"
                    className="text-sm font-medium text-gray-700"
                  >
                    HS code <span className="text-gray-300">Optional</span>
                  </Label>
                  <InputField
                    control={control}
                    errors={errors}
                    name={"hs_code" as Path<T>}
                    placeholder="100"
                    inputStyle={
                      "placeholder-gray-200 bg-transparent border-zinc-300"
                    }
                  />
                </div>
                <div>
                  <Label
                    htmlFor="country"
                    className="text-sm font-medium text-gray-700"
                  >
                    Country <span className="text-gray-300">Optional</span>
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
                    htmlFor="material"
                    className="text-sm font-medium text-gray-700"
                  >
                    Material <span className="text-gray-300">Optional</span>
                  </Label>
                  <InputField
                    control={control}
                    errors={errors}
                    name={"material" as Path<T>}
                    placeholder="100"
                    inputStyle={
                      "placeholder-gray-200 bg-transparent border-zinc-300"
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;
