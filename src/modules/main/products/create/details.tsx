"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import Media from "./media";
import Variants, { ProductOption } from "./variants/variants";
import { Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import InputField from "@/components/fields/input-field";
import HoverTooltip from "@/components/tooltip/hover-tooltip";
import TextareaField from "@/components/fields/textarea-field";
import SwitchField from "@/components/fields/switch-field";

interface DetailsProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  productOptions: ProductOption[];
  setProductOptions: React.Dispatch<React.SetStateAction<ProductOption[]>>;
  hasVariant?: boolean;
}
const Details = <T extends FieldValues>({
  control,
  errors,
  productOptions,
  setProductOptions,
  hasVariant = false,
}: DetailsProps<T>) => {
  return (
    <>
      {/* Form Content */}
      <div className="p-8 pb-32 max-w-[800px] m-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-8">General</h2>

        <div className="space-y-8">
          {/* Title, Subtitle, Handle Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
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

            <div className="space-y-2">
              <Label
                htmlFor="subtitle"
                className="text-sm font-medium text-gray-500"
              >
                Subtitle <span className="text-gray-400">Optional</span>
              </Label>
              <InputField
                control={control}
                errors={errors}
                name={"subtitle" as Path<T>}
                placeholder="Subtitle"
                inputStyle={
                  "placeholder-gray-200 bg-transparent border-zinc-300"
                }
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="handle"
                className="text-sm font-medium text-gray-500 flex items-center gap-2"
              >
                Handle
                <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                  <HoverTooltip
                    className="text-white text-xs cursor-pointer"
                    title="i"
                    description="The handle is used to reference the collection in your storefront. If not specified, the handle will be generated from the collection title."
                  />
                </div>
                <span className="text-gray-400">Optional</span>
              </Label>
              <div className="flex items-center">
                <span className="text-gray-500 text-sm mr-1">/</span>
                <InputField
                  control={control}
                  errors={errors}
                  name={"meta_canonical_url" as Path<T>}
                  placeholder="Handle"
                  inputStyle={
                    "placeholder-gray-200 bg-transparent border-zinc-300"
                  }
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-500"
            >
              Description <span className="text-gray-400">Optional</span>
            </Label>
            <TextareaField
              control={control}
              errors={errors}
              name={"description" as Path<T>}
              placeholder="Description"
              inputStyle={
                "placeholder-gray-200 bg-transparent border-zinc-300 min-h-[100px]"
              }
            />
          </div>
          <Media />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Variants</h3>
            <div className="shadow-md bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <SwitchField
                  control={control}
                  errors={errors}
                  name={"hasVariants" as Path<T>}
                />
                <div className="space-y-1">
                  <Label
                    htmlFor="has-variants"
                    className="text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    Yes, this is a product with variants
                  </Label>
                  <p className="text-sm text-gray-600">
                    When unchecked, we will create a default variant for you.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Variants
            productOptions={productOptions}
            setProductOptions={setProductOptions}
            hasVariant={hasVariant}
          />
        </div>
      </div>
    </>
  );
};

export default Details;
