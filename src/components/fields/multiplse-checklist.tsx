"use client"

import { useState, useMemo, useRef, useEffect, memo } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search } from "lucide-react"
import ShadcnPagination from "../pagination"
import { toast } from "sonner"
import CheckListSkeleton from "../skeletons/list-skeleton"
import { ContactLists } from "../../types/contacts-type"
const maxNum = 999

interface MultipleChecklistprops {
    result: ContactLists[]
    dataCounter: number
    isloading?: boolean;
    currentPage: number;
    rowsPerPage: string;
    setRowsPerPage: (value: string) => void;
    setCurrentPage: (value: number) => void;
    selected: string[];
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
}
const MultipleChecklist = ({ selected, setSelected, rowsPerPage, dataCounter, setRowsPerPage, setCurrentPage, currentPage, result, isloading=false, }: MultipleChecklistprops) => {
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [rowsPerPageInput, setRowsPerPageInput] = useState<string>(rowsPerPage)

const filteredContacts = useMemo(() => {
  if (!searchQuery) return result;

  const lowerSearch = searchQuery.toLowerCase();

  return result.filter((contact) =>
    contact.name?.toLowerCase().includes(lowerSearch) ||
    contact.email?.toLowerCase().includes(lowerSearch)
  );
}, [result, searchQuery]);


    const allSelected = filteredContacts.length > 0 && filteredContacts.every((item) => selected.includes(item._id))
    const someSelected = selected.length > 0 && !allSelected

    const selectAllRef = useRef<HTMLButtonElement>(null)

    // Debounce rowsPerPage change by 2 seconds
    useEffect(() => {
        if (Number(rowsPerPageInput) > maxNum) {
            setRowsPerPageInput("999")
            toast.error("Number should be below 999")
            return
        }

        const timer = setTimeout(() => {
            setRowsPerPage(rowsPerPageInput)
            setCurrentPage(1)
        }, 2000)

        return () => clearTimeout(timer)
    }, [rowsPerPageInput, setCurrentPage, setRowsPerPage])


    useEffect(() => {
        if (selectAllRef.current) {
            const input = selectAllRef.current.querySelector("input") as HTMLInputElement | null
            if (input) {
                input.indeterminate = someSelected
            }
        }
    }, [someSelected, currentPage, searchQuery])

    // Handle select all for the current page
    const handleSelectAll = () => {
        const idsOnPage = filteredContacts.map((item) => item._id)

        if (allSelected) {
            // Unselect all from current page
            setSelected((prev) => prev.filter((id) => !idsOnPage.includes(id)))
        } else {
            // Select all from current page
            setSelected((prev) => Array.from(new Set([...prev, ...idsOnPage])))
        }
    }

    // Handle select one contact
    const handleSelectOne = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        )
    }

    // Handle unselecting all
    const handleUnselectAll = () => {
        setSelected([])
    }

    return (
        <div className="space-y-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Select subscribers</h3>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        ref={selectAllRef}
                        id="select-all"
                        checked={allSelected}
                        onCheckedChange={handleSelectAll}
                    />
                    <Label htmlFor="select-all" className="text-sm font-medium">
                        Select All
                    </Label>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search subscribers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                />
                <p className="pt-2 text-sm text-muted-foreground">In a row Total {rowsPerPage} subscribers</p>{ }
            </div>

    
                <ScrollArea className="h-[300px]">
                    <div className="space-y-2 p-1">
                        {/* Render filtered contacts */}
                        {
                            isloading ?
                                <CheckListSkeleton isShadow={true} /> :
                                filteredContacts.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex items-center space-x-2 rounded-md p-2 hover:bg-muted"
                                    >
                                        <Checkbox
                                            id={item._id}
                                            checked={selected.includes(item._id)}
                                            onCheckedChange={() => handleSelectOne(item._id)}
                                        />
                                        <Label htmlFor={item._id} className="flex-1 cursor-pointer text-sm">
                                            <span className="block">{item.name}</span>
                                            <span className="block">{item.email}</span>
                                            
                                        </Label>
                                    </div>
                                ))}
                    </div>
                </ScrollArea>
        

            {/* Selected Info */}
            {selected.length > 0 && (
                <div className="flex gap-4">
                    <div className="w-70%] pt-2 text-sm text-muted-foreground">
                        {/* If global selection is active, show the total number of selected contacts across pages */}
                        {selected.length}{" "}
                        {selected.length === 1 || dataCounter === 1 ? "subscriber" : "subscribers"} selected
                        <p>
                            Total {dataCounter} subscribers
                        </p>
                        {/* Unselect all button */}
                        <button
                            onClick={handleUnselectAll}
                            className="ml-2 text-red-600 hover:underline"
                        >
                            Unselect all
                        </button>
                    </div>
                    <div className="w-[30%]">
                        <Input
                            value={rowsPerPageInput}
                            type="number"
                            onChange={(e) => setRowsPerPageInput(e.target.value)}
                            className="px-2"
                        />
                    </div>
                </div>

            )}

            {/* Pagination */}
            <ShadcnPagination
                currentPage={currentPage}
                totalPages={Number(rowsPerPage)}
                setCurrentPage={setCurrentPage}
                data_length={dataCounter}
                leftRightBtn={false}
            />
        </div>
    )
}

export default memo(MultipleChecklist)
