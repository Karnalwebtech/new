import React from "react";
import {
    Control,
    Controller,
    FieldErrors,
    FieldValues,
    Path,
    PathValue,
    UseFormSetValue,
} from "react-hook-form";
import { Jodit_text_editor } from "../editor/jodit-text-editor";

// Updated SelectFieldProps with generics
interface Text_Editor_field_props<T extends FieldValues> {
    control: Control<T>;
    errors: FieldErrors<T>;
    setValue: UseFormSetValue<T>;
    name: Path<T>; // Ensure name is a valid path in T
}

const Text_Editor_field = <T extends FieldValues>({
    control,
    errors,
    name,
    setValue,
}: Text_Editor_field_props<T>) => {
    let errorMessage: string | undefined;

    // Check if name contains a dot for nested errors
    if (name.includes(".")) {
        const nameParts = name.split(".");
        const parentKey = nameParts[0]; // e.g., 'shipping_address'
        const childKey = nameParts[1]; // e.g., 'city'

        // Check if the parent key exists in errors
        const parentErrors = errors[parentKey] as FieldErrors<T>;
        if (parentErrors && parentErrors[childKey]) {
            errorMessage = (parentErrors[childKey] as { message?: string }).message;
        }
    } else {
        // Accessing direct errors
        errorMessage = (errors[name] as { message?: string })?.message;
    }

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <div>
                    {errorMessage && (
                        <p className="text-red-600 text-s pb-[1px] mt-[-5px]">{errorMessage}</p>
                    )}
                    <Jodit_text_editor
                        value={field?.value ?? ""}
                        onChange={(value: string) =>
                            setValue(name, value as PathValue<T, Path<T>>) // Type assertion applied
                        }
                    />
                </div>
            )}
        />
    );
};

export default Text_Editor_field;