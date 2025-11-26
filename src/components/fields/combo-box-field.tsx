// "use client"

// import { useMemo, useState, useEffect, useRef } from "react"
// import {
//   Controller,
//   type Control,
//   type FieldErrors,
//   type Path,
//   type PathValue,
//   type FieldValues,
// } from "react-hook-form"
// import { ChevronDown, Check } from "lucide-react"
// import { cn } from "@/lib/utils"

// type DropdownOption = {
//   key: string
//   value: string
//   isoCode?: string
//   stateCode?: string
// }

// export type CSCCode = {
//   countryCode?: string
//   stateCode?: string
//   cityName?: string
// }

// interface ComboboxFieldProps<T extends FieldValues> {
//   control: Control<T>
//   errors: FieldErrors<T>
//   name: Path<T>
//   label?: string
//   placeholder?: string
//   drop_down_selector: DropdownOption[]
//   class_style?: string
//   defaultValue?: PathValue<T, Path<T>> | null
//   is_loading?: boolean
//   is_disabled?: boolean
//   setCscCode?: (patch: Partial<CSCCode>) => void
//   onChangeCallback?: (opt?: DropdownOption) => void
// }

// export function ComboboxField<T extends FieldValues>({
//   control,
//   errors,
//   name,
//   label,
//   placeholder = "Select...",
//   drop_down_selector,
//   class_style,
//   defaultValue = null,
//   is_loading = false,
//   is_disabled = false,
//   setCscCode,
//   onChangeCallback,
// }: ComboboxFieldProps<T>) {
//   const optionMap = useMemo(() => {
//     const m = new Map<string, DropdownOption>()
//     for (const o of drop_down_selector) m.set(o.key, o)
//     return m
//   }, [drop_down_selector])

//   const getErrorMessage = (errs: FieldErrors<T>, path: string): string | undefined => {
//     const parts = path.split(".")
//     let cur: any = errs
//     for (const p of parts) {
//       if (!cur || !cur[p]) return undefined
//       cur = cur[p]
//     }
//     return cur?.message
//   }

//   const errorMessage = getErrorMessage(errors, String(name))

//   const [open, setOpen] = useState(false)
//   const [query, setQuery] = useState("")
//   const [highlightedIndex, setHighlightedIndex] = useState(-1)
//   const dropdownRef = useRef<HTMLDivElement>(null)
//   const inputRef = useRef<HTMLInputElement>(null)

//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase()
//     if (!q) return drop_down_selector
//     return drop_down_selector.filter((d) => d.value.toLowerCase().includes(q) || d.key.toLowerCase().includes(q))
//   }, [drop_down_selector, query])

//   useEffect(() => {
//     if (!open) {
//       setQuery("")
//       setHighlightedIndex(-1)
//     } else {
//       inputRef.current?.focus()
//     }
//   }, [open])

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (!open) return

//       switch (e.key) {
//         case "ArrowDown":
//           e.preventDefault()
//           setHighlightedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0))
//           break
//         case "ArrowUp":
//           e.preventDefault()
//           setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1))
//           break
//         case "Enter":
//           e.preventDefault()
//           if (highlightedIndex >= 0 && filtered[highlightedIndex]) {
//             handleSelect(filtered[highlightedIndex].key)
//           }
//           break
//         case "Escape":
//           e.preventDefault()
//           setOpen(false)
//           break
//       }
//     }

//     if (open) {
//       document.addEventListener("keydown", handleKeyDown)
//       return () => document.removeEventListener("keydown", handleKeyDown)
//     }
//   }, [open, highlightedIndex, filtered])

//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
//         setOpen(false)
//       }
//     }

//     if (open) {
//       document.addEventListener("mousedown", handleClickOutside)
//       return () => document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [open])

//   const handleSelect = (selectedKey: string) => {
//     const field = { onChange: () => {}, value: "" } // Placeholder field object
//     field.onChange(selectedKey)
//     const opt = optionMap.get(selectedKey)
//     if (opt) {
//       if (setCscCode) {
//         setCscCode({
//           countryCode: opt.isoCode,
//           stateCode: opt.stateCode,
//         })
//       }
//       if (onChangeCallback) onChangeCallback(opt)
//     } else {
//       if (setCscCode) setCscCode({})
//       if (onChangeCallback) onChangeCallback(undefined)
//     }
//     setOpen(false)
//     setQuery("")
//   }

//   return (
//     <Controller
//       control={control}
//       name={name}
//       defaultValue={defaultValue as PathValue<T, Path<T>>}
//       render={({ field }) => {
//         const selected = optionMap.get(field.value as string)
//         const displayLabel = selected?.value ?? ""

//         return (
//           <div className={cn("w-full", class_style ?? "")}>
//             {label && <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>}

//             <div className="relative" ref={dropdownRef}>
//               {/* Trigger Button */}
//               <button
//                 type="button"
//                 onClick={() => setOpen(!open)}
//                 disabled={is_disabled || is_loading}
//                 className={cn(
//                   "w-full px-4 py-2 text-left flex items-center justify-between",
//                   "border border-gray-300 rounded-lg bg-white",
//                   "hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
//                   "transition-colors duration-200",
//                   (is_disabled || is_loading) && "opacity-50 cursor-not-allowed bg-gray-50",
//                 )}
//               >
//                 <span className={displayLabel ? "text-gray-900" : "text-gray-500"}>{displayLabel || placeholder}</span>
//                 <ChevronDown
//                   className={cn(
//                     "h-5 w-5 text-gray-400 transition-transform duration-200",
//                     open && "transform rotate-180",
//                   )}
//                 />
//               </button>

//               {/* Dropdown Menu */}
//               {open && (
//                 <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
//                   {/* Search Input */}
//                   <div className="p-3 border-b border-gray-200">
//                     <input
//                       ref={inputRef}
//                       type="text"
//                       placeholder={`Search ${label ?? "options"}...`}
//                       value={query}
//                       onChange={(e) => {
//                         setQuery(e.target.value)
//                         setHighlightedIndex(-1)
//                       }}
//                       className={cn(
//                         "w-full px-3 py-2 text-sm border border-gray-300 rounded",
//                         "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
//                         "transition-colors duration-200",
//                       )}
//                     />
//                   </div>

//                   {/* Options List */}
//                   <div className="max-h-64 overflow-y-auto">
//                     {filtered.length === 0 ? (
//                       <div className="px-4 py-3 text-sm text-gray-500 text-center">No results found.</div>
//                     ) : (
//                       filtered.map((opt, index) => (
//                         <button
//                           key={opt.key}
//                           type="button"
//                           onClick={() => handleSelect(opt.key)}
//                           onMouseEnter={() => setHighlightedIndex(index)}
//                           className={cn(
//                             "w-full text-left px-4 py-2.5 flex items-center gap-3",
//                             "text-sm transition-colors duration-150",
//                             highlightedIndex === index
//                               ? "bg-blue-50 text-blue-900"
//                               : "bg-white text-gray-900 hover:bg-gray-50",
//                           )}
//                         >
//                           <Check
//                             className={cn(
//                               "h-4 w-4 flex-shrink-0",
//                               field.value === opt.key ? "text-blue-600 opacity-100" : "text-gray-300 opacity-0",
//                             )}
//                           />
//                           <span>{opt.value}</span>
//                         </button>
//                       ))
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Error Message */}
//             {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
//           </div>
//         )
//       }}
//     />
//   )
// }

// export default ComboboxField
