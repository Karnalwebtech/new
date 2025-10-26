"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import InputField from "@/components/fields/input-field";
import TextTextareaField from "@/components/fields/textarea-field";
import HoverTooltip from "@/components/tooltip/hover-tooltip";
import { Info } from "lucide-react";
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
                  placeholder=""
                  inputStyle={
                    "placeholder-gray-200 bg-transparent border-zinc-300"
                  }
                />
              </div>
              <div className="space-y-2 mb-4">
                <Label
                  htmlFor="type"
                  className="text-sm font-medium text-gray-700 flex gap-2 items-center"
                >
                  Type
                  <HoverTooltip
                    is_icon
                    Icon={Info}
                    description="Enter shipping profile type, for example: Heavy, Oversized, Freight-only, etc."
                    className="bg-gray-300 rounded-full text-base cursor-pointer opacity-50"
                  />
                </Label>
                <InputField
                  control={control}
                  errors={errors}
                  name={"type" as Path<T>}
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
