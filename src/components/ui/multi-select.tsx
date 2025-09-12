"use client"

import * as React from "react"
import { Check, ChevronDown, X, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface Option {
  value: string
  label: string
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  maxDisplay?: number
  className?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  maxDisplay = 3,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [open])

  const handleSelect = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value]
    )
  }

  const handleRemove = (value: string, e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    onChange(selected.filter((item) => item !== value))
  }

  const selectedOptions = options.filter((o) => selected.includes(o.value))
  const displayedOptions = selectedOptions.slice(0, maxDisplay)
  const remainingCount = selectedOptions.length - maxDisplay
  const filteredOptions = options.filter((o) =>
    o.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "relative w-full min-h-[44px] px-4 py-2 text-left bg-white border-2 border-gray-200 rounded-xl",
          "hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100",
          "transition-all duration-200 ease-in-out shadow-sm hover:shadow-md",
          open && "border-blue-500 ring-4 ring-blue-100 shadow-md",
          className,
        )}
      >
        <div className="flex items-center justify-around w-full">
          <div className="flex flex-wrap gap-2 flex-1 min-h-[20px]">
            {selectedOptions.length === 0 ? (
              <span className="text-gray-500 font-medium">{placeholder}</span>
            ) : (
              <>
                {displayedOptions.map((option, index) => (
                  <div
                    key={option.value}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-[4px] bg-gradient-to-r from-blue-50 to-indigo-50",
                      "border border-blue-200 rounded-lg text-sm font-medium text-blue-800",
                      "animate-in fade-in-0 slide-in-from-left-2 duration-200",
                      "hover:from-blue-100 hover:to-indigo-100 transition-colors",
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span>{option.label}</span>
                    {/* ✅ FIX: span instead of button to avoid nested button issue */}
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => handleRemove(option.value, e)}
                      onKeyDown={(e) => e.key === "Enter" && handleRemove(option.value)}
                      className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200 transition-colors cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </span>
                  </div>
                ))}
                {remainingCount > 0 && (
                  <div className="inline-flex items-center px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-600">
                    +{remainingCount} more
                  </div>
                )}
              </>
            )}
          </div>
          <ChevronDown
            className={cn(
              "h-5 w-5 text-gray-400 transition-transform duration-200 ml-2",
              open && "rotate-180"
            )}
          />
        </div>
      </Button>

      {open && (
        <div
          className={cn(
            "absolute z-50 w-full mt-2 bg-white border-2 pb-28 border-gray-200 rounded-xl shadow-xl",
            "animate-in fade-in-0 slide-in-from-top-2 duration-200",
          )}
        >
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-auto p-2">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                No options found
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg transition-all duration-150",
                    "hover:bg-gray-50 focus:bg-gray-50 focus:outline-none",
                    selected.includes(option.value) && "bg-blue-50 hover:bg-blue-100",
                    "animate-in fade-in-0 slide-in-from-left-1 duration-200",
                  )}
                  style={{ animationDelay: `${index * 25}ms` }}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-5 h-5 rounded border-2 transition-colors",
                      selected.includes(option.value)
                        ? "bg-blue-500 border-blue-500"
                        : "border-gray-300 hover:border-gray-400",
                    )}
                  >
                    {selected.includes(option.value) && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "font-medium transition-colors",
                      selected.includes(option.value) ? "text-blue-800" : "text-gray-700",
                    )}
                  >
                    {option.label}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
