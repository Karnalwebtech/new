"use client"

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

interface RowsPerPageSelectProps {
    value: number
    setRowsPerPage: (value: string) => void
    setCurrentPage: (value: number) => void
}

export const RowsPerPageSelect: React.FC<RowsPerPageSelectProps> = ({ value, setCurrentPage, setRowsPerPage }) => {
    const options = ["10", "25", "50", "100", "500", "1000"]

    const handleValueChange = (value: string) => {
        setCurrentPage(1)
        setRowsPerPage(value)
    }

    return (
        <div className="flex gap-2 w-[150px]">
            <Select  value={value.toString()} onValueChange={handleValueChange} defaultValue={value.toString()}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Per page" />
                </SelectTrigger>
                <SelectContent>
                    {options.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                            {opt}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
