"use client"

import { memo } from "react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { customFields } from "@/types/custom-field-types"


interface FormPreviewProps {
    field: customFields
    index: number
    handleInputChange?: (type: string, label: string, value: string) => void;
}

const FormPreview = ({ field, index, handleInputChange }: FormPreviewProps) => {


    return (
        <div className="space-y-2">
            <div id={`${index}_field`}>
                <Label htmlFor={`field_${field.id}`}>
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {["text", "email", "number"].includes(field.type) && (
                    <Input
                        type={field.type}
                        placeholder={field.placeholder}
                        required={field.required}
                        id={`field_${field.id}`}
                        onChange={(e) => handleInputChange?.(field.type, field.label, e.target.value)}
                    />
                )}

                {field.type === "textarea" && (
                    <Textarea
                        id={`field_${field.id}`}
                        placeholder={field.placeholder}
                        required={field.required}
                        onChange={(e) => handleInputChange?.(field.type, field.label, e.target.value)}
                    />
                )}
                {field.type === "dropdown" && (
                    <Select onValueChange={(value) => handleInputChange?.(field.type, field.label, value)}>
                        <SelectTrigger id={`field_${field.id}`}>
                            <SelectValue placeholder={field.placeholder || "Select an option"} />
                        </SelectTrigger>
                        <SelectContent>
                            {field.options?.map((option, optionIndex) => (
                                <SelectItem key={optionIndex} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>
        </div>
    )
}

// Memoizing with custom comparison
export default memo(FormPreview, (prevProps, nextProps) => {
    return prevProps.field === nextProps.field && prevProps.index === nextProps.index
})
