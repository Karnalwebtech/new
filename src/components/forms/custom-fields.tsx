import React from 'react'
import FormPreview from '../custom-fiels/form-preview';
import { customFields } from '@/types/custom-field-types';

interface CustomFieldsProps {
    field: customFields;
    index: number;
    handleInputChange: (type: string, label: string, value: string) => void;
}

const CustomFields = ({ field, index, handleInputChange }: CustomFieldsProps) => {
    return (
        <div
        >
            <FormPreview index={index} field={field} handleInputChange={handleInputChange} />
        </div>
    )
}

export default CustomFields