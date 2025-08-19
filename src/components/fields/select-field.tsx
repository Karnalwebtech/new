"use client";
import {
  type Control,
  Controller,
  type FieldErrors,
  type FieldValues,
  type Path,
  type PathValue,
} from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { capitalizeFirstLetter } from "@/services/helpers";

type DropdownOption = { key: string; value: string };

interface SelectFieldProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  drop_down_selector: DropdownOption[];
  class_style?: string;
  defaultValue?: PathValue<T, Path<T>>;
}

const SelectFields = <T extends FieldValues>({
  control,
  errors,
  name,
  label,
  placeholder = "Select one",
  drop_down_selector,
  class_style,
  defaultValue,
}: SelectFieldProps<T>) => {
  let errorMessage: string | undefined;

  // Check for nested errors
  if (name.includes(".")) {
    const nameParts = name.split(".");
    const parentKey = nameParts[0];
    const childKey = nameParts[1];
    const parentErrors = errors[parentKey] as FieldErrors<T>;
    if (parentErrors && parentErrors[childKey]) {
      errorMessage = (parentErrors[childKey] as { message?: string }).message;
    }
  } else {
    errorMessage = (errors[name] as { message?: string })?.message;
  }

  return (
    <div className="w-full mt-[3px]">
      {label && (
        <label className="block text-sm font-medium">{label}</label>
      )}
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue as PathValue<T, Path<T>>}
        render={({ field }) => {
          const value =
            field.value === undefined || field.value === null
              ? ""
              : field.value;

          return (
            <Select
              value={value}
              onValueChange={(newValue) => {
                // Prevent empty string resets by not calling onChange when value is empty
                // unless the current value is already defined (intentional clearing)
                if (newValue !== "" || field.value) {
                  field.onChange(newValue);
                }
                // Always trigger onBlur to mark the field as touched
                field.onBlur();
              }}
            >
              <SelectTrigger className={`w-full ${class_style || ""}`}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {drop_down_selector.map((option) => (
                  <SelectItem key={option.key} value={option.value}>
                    {capitalizeFirstLetter(option.value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }}
      />
      {errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
    </div>
  );
};

export default SelectFields;
