"use client";
import { customFields } from "@/types/custom-field-types";
import React, { memo, useMemo } from "react";
import InputField from "../fields/input-field";
import SelectFields from "../fields/select-field";
import { useGetCustomFieldQuery } from "@/state/custom-field-api";
import { Control, FieldErrors, Path, FieldValues } from "react-hook-form";
import { ParaSkeleton } from "../skeletons/para-skeleton";
import AddCustomField from "./add-custom-field";
// Ensure T extends FieldValues, which is the expected type for form data
interface RenderCustomFieldProps<T extends FieldValues> {
  control: Control<T>; // The form control
  errors: FieldErrors<T>; // The form errors
  name: Path<T>; // Ensure name is a valid path in T
  label?: string; // Label for the field
  type?: string; // Optional type for the input (default: "text")
  placeholder?: string; // Optional type for the input (default: "text")
  inputStyle?: string; // Optional additional class for the input
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Optional onChange handler
  maxLength?: number; // Optional maxLength for the input
  disabled_path?: boolean; // Optional disabled state
  required?: boolean; // Optional required state
  storageFieldtype?: string | null;
  pageId?: string;
  search_type?: string | null;
  isNotVisiableBtn?: boolean;
}
const RenderCustomField = <T extends FieldValues>({
  control,
  errors,
  storageFieldtype,
  pageId = "policy-holder",
  search_type = "private",
  isNotVisiableBtn = true,
}: RenderCustomFieldProps<T>) => {
  const { data, isLoading: customFieldLoading } = useGetCustomFieldQuery({
    rowsPerPage: 100,
    page: 1,
    page_id: pageId,
    field_type: storageFieldtype,
    search_type: search_type,
  });

  const customFields = useMemo(() => data?.result || [], [data]);
  // Render custom field based on its type
  const renderCustomField = (field: customFields) => {
    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <InputField
            key={field._id}
            control={control}
            errors={errors}
            label={field.label}
            name={field.label.toLowerCase().replace(/\s+/g, "_") as Path<T>}
            type={field.type}
          />
        );

      case "textarea":
        return (
          <InputField
            key={field._id}
            control={control}
            errors={errors}
            label={field.label}
            name={field.label.toLowerCase().replace(/\s+/g, "_") as Path<T>}
            type="textarea"
          />
        );

      case "dropdown":
        return (
          <SelectFields
            key={field._id}
            control={control}
            errors={errors}
            label={field.label}
            name={field.label.toLowerCase().replace(/\s+/g, "_") as Path<T>}
            drop_down_selector={(field.options ?? []).map((opt: string) => ({
              key: opt,
              value: opt,
            }))}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Custom Fields */}
      {customFieldLoading
        ? Array.from({ length: 5 }).map((_, i) => (
            <ParaSkeleton key={i} style="h-10 w-full mt-6" />
          ))
        : customFields.map(renderCustomField)}
      {isNotVisiableBtn && (
        <AddCustomField
          storageFieldtype={storageFieldtype}
          searchType={search_type}
          pageId={pageId}
        />
      )}
    </>
  );
};
export default memo(RenderCustomField);
