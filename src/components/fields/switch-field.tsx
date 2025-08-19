import React from "react";
import { Controller, Control, FieldErrors, Path, FieldValues } from "react-hook-form";
import { Label } from "@/components/ui/label"; // Adjust based on your project
import { Switch } from "@/components/ui/switch"; // Assumes you have a Switch component

interface SwitchFieldProps<T extends FieldValues> {
    control: Control<T>;
    errors: FieldErrors<T>;
    name: Path<T>;
    label: string;
    paragraph?: string;
}

const SwitchField = <T extends FieldValues>({ control, paragraph="", errors, name, label }: SwitchFieldProps<T>) => {
    let errorMessage: string | undefined;

    // Error message handler
    if (name.includes(".")) {
        const nameParts = name.split(".");
        const parentKey = nameParts[0];
        const childKey = nameParts[1];
        const parentErrors = errors[parentKey as keyof typeof errors] as FieldErrors<T>;
        if (parentErrors && typeof parentErrors === "object" && parentErrors[childKey as keyof typeof parentErrors]) {
            errorMessage = (parentErrors[childKey as keyof typeof parentErrors] as { message?: string })?.message;
        }
    } else {
        errorMessage = (errors[name as keyof typeof errors] as { message?: string })?.message;
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">

                    <Label htmlFor={name} className="capitalize">
                        {label}
                    </Label>
                    {paragraph &&
                        <p className="text-sm text-slate-500">{paragraph}</p>
                    }
                </div>
                <Controller
                    control={control}
                    name={name}
                    render={({ field }) => (
                        <Switch
                            id={name}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    )}
                />
            </div>
            {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
        </div>
    );
};

export default SwitchField;
