"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import Media from "./media";
import HoverTooltip from "@/components/tooltip/hover-tooltip";
import { Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import InputField from "@/components/fields/input-field";
import TextareaField from "@/components/fields/textarea-field";
import CategoryList from "./category-list";
import { ScrollArea } from "@/components/ui/scroll-area";
import SwitchField from "../../../../../components/fields/switch-field";
interface DetailsProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  categoryId: string[];
  setCategoryId: React.Dispatch<React.SetStateAction<string[]>>;
  catId?: string;
  watchedValues_has_parent: boolean;
}
const Details = <T extends FieldValues>({
  control,
  errors,
  categoryId,
  catId,
  setCategoryId,
  watchedValues_has_parent,
}: DetailsProps<T>) => {
  return (
    <>
      {/* Form Content */}
      <div className="p-8 pb-32 max-w-[900px] m-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-8">General</h2>

        <div className="space-y-8">
          {/* Title, Subtitle, Handle Row */}
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="mt-4 border p-4 rounded-lg">
                    <SwitchField
                      control={control}
                      paragraph={"Make category publicly visible"}
                      errors={errors}
                      name={"is_active" as Path<T>}
                      label={"Active Status"}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="mt-4 border p-4 rounded-lg">
                    <SwitchField
                      control={control}
                      paragraph={"Hide from customers"}
                      errors={errors}
                      name={"is_internal" as Path<T>}
                      label={"Internal Use"}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="mt-4 border p-4 rounded-lg">
                    <SwitchField
                      control={control}
                      paragraph={"Belongs to another category"}
                      errors={errors}
                      name={"has_parent" as Path<T>}
                      label={"Parent Category"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            {watchedValues_has_parent && (
              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <Label
                  htmlFor="categories"
                  className="text-sm font-medium text-gray-500"
                >
                  Categories
                </Label>
                <div className="my-[10px] border rounded-lg">
                  <ScrollArea className="h-[210px] w-full p-4 rounded-lg overflow-hidden">
                    <CategoryList
                      selected={categoryId}
                      catId={catId}
                      setSelected={setCategoryId}
                    />
                  </ScrollArea>
                </div>
              </div>
            )}
            <div
              className={`col-span-12 md:col-span-${
                watchedValues_has_parent ? 8 : 12
              } lg:col-span-${watchedValues_has_parent ? 8 : 12} mb-4`}
            >
              <Media />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;
