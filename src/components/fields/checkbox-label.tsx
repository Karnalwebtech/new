import React from 'react'
import CheckboxField from './checkbox-Field'
import { Label } from '../ui/label'
import { Control, FieldErrors, FieldValues, Path } from 'react-hook-form';
import SwitchField from './switch-field';
interface CheckboxLabelProps<T extends FieldValues> {
    control: Control<T>;
    errors: FieldErrors<T>;
    title: string;
    description: string;
    name: string;
}

const CheckboxLabel = <T extends FieldValues>({
    control,
    errors,
    title, name,
    description }: CheckboxLabelProps<T>) => {
    return (
        <div className="shadow-md bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
                <SwitchField
                    control={control}
                    errors={errors}
                    name={name as Path<T>}
                />

                <div className="space-y-1">
                    <Label
                        htmlFor="has-variants"
                        className="text-sm font-medium text-gray-900 cursor-pointer"
                    >
                        {title}
                    </Label>
                    <p className="text-sm text-gray-600">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CheckboxLabel