"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import SelectFields from "@/components/fields/select-field";
import InputField from "@/components/fields/input-field";
interface DetailsProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
}
const Details = <T extends FieldValues>({
  control,
  errors,
}: DetailsProps<T>) => {
  return (
    <>
      {/* Form Content */}
      <div className="p-8 pb-32 max-w-[700px] m-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-8">Edit Store</h2>

        <div className="space-y-8">
          {/* Title, Subtitle, Handle Row */}
          <div className="">
            <div className="space-y-2 mb-4">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Title
              </Label>
              <InputField
                control={control}
                errors={errors}
                name={"name" as Path<T>}
                placeholder="Title"
                inputStyle={
                  "placeholder-gray-200 bg-transparent border-zinc-300"
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="default_currency"
                  className="text-sm font-medium text-gray-700"
                >
                  Default currency
                </Label>
                <SelectFields
                  control={control}
                  errors={errors}
                  name={"default_currency" as Path<T>}
                  placeholder="Select status" // Default placeholder
                  drop_down_selector={[
                    {
                      key: "active",
                      value: "active",
                    },
                    {
                      key: "inactive",
                      value: "inactive",
                    },
                  ]}
                  class_style={"text-gray-500"}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="default_region"
                  className="text-sm font-medium text-gray-700"
                >
                  Default region
                </Label>
                <SelectFields
                  control={control}
                  errors={errors}
                  name={"default_region" as Path<T>}
                  placeholder="Select visibility" // Default placeholder
                  drop_down_selector={[
                    {
                      key: "publish",
                      value: "publish",
                    },
                    {
                      key: "draft",
                      value: "draft",
                    },
                  ]}
                  class_style={"text-gray-500"}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="default_sales_channel"
                  className="text-sm font-medium text-gray-700"
                >
                  Default sales channel
                </Label>
                <SelectFields
                  control={control}
                  errors={errors}
                  name={"default_sales_channel" as Path<T>}
                  placeholder="Select visibility" // Default placeholder
                  drop_down_selector={[
                    {
                      key: "publish",
                      value: "publish",
                    },
                    {
                      key: "draft",
                      value: "draft",
                    },
                  ]}
                  class_style={"text-gray-500"}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="default_location"
                  className="text-sm font-medium text-gray-700"
                >
                  Default location
                </Label>
                <SelectFields
                  control={control}
                  errors={errors}
                  name={"default_location" as Path<T>}
                  placeholder="Select visibility" // Default placeholder
                  drop_down_selector={[
                    {
                      key: "publish",
                      value: "publish",
                    },
                    {
                      key: "draft",
                      value: "draft",
                    },
                  ]}
                  class_style={"text-gray-500"}
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
