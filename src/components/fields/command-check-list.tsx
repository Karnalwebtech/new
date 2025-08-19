//     "use client"

// import { useState, useMemo } from "react"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Label } from "@/components/ui/label"
// import { useGetAllContactsQuery } from "@/state/contactsApi"
// import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"

// interface Contact {
//   _id: string
//   name: string
//   // Add other contact properties as needed
// }

// const CommandChecklist = () => {
//   const [currentPage] = useState<number>(1)
//   const [rowsPerPage] = useState<string>("10")
//   const [selected, setSelected] = useState<string[]>([])
//   const [searchQuery, setSearchQuery] = useState<string>("")

//   const { data, isLoading } = useGetAllContactsQuery({
//     rowsPerPage: Number(rowsPerPage),
//     page: currentPage,
//   })

//   const result = useMemo(() => data?.result || [], [data])


//   // Filter contacts based on search query
//   const filteredContacts = useMemo(() => {
//     if (!searchQuery) return result
//     return result.filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))
//   }, [result, searchQuery])

//   const allSelected = result.length > 0 && selected.length === result.length
//   const someSelected = selected.length > 0 && !allSelected

//   const handleSelectAll = () => {
//     if (allSelected) {
//       setSelected([])
//     } else {
//       const allIds = result.map((item) => item._id)
//       setSelected(allIds)
//     }
//   }

//   const handleSelectOne = (id: string) => {
//     setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
//   }

//   return (
//     <div className="space-y-4 rounded-lg border p-4">
//       <div className="flex items-center justify-between">
//         <h3 className="text-lg font-medium">Select subscribers</h3>
//         <div className="flex items-center space-x-2">
//           <Checkbox
//             id="select-all"
//             checked={allSelected}
//             // indeterminate={someSelected}
//             onCheckedChange={handleSelectAll}
//           />
//           <Label htmlFor="select-all" className="text-sm font-medium">
//             Select All
//           </Label>
//         </div>
//       </div>

//       <Command className="rounded-lg border shadow-md">
//         <CommandInput placeholder="Search subscribers..." value={searchQuery} onValueChange={setSearchQuery} />
//         <CommandList>
//           <CommandEmpty>No subscribers found.</CommandEmpty>
//           <CommandGroup>
//             {isLoading ? (
//               <div className="flex justify-center py-4">
//                 <p>Loading contacts...</p>
//               </div>
//             ) : (
//               filteredContacts.map((item) => (
//                 <CommandItem
//                   key={item._id}
//                   className="flex items-center space-x-2"
//                   onSelect={() => handleSelectOne(item._id)}
//                 >
//                   <Checkbox
//                     id={item._id}
//                     checked={selected.includes(item._id)}
//                     onCheckedChange={() => handleSelectOne(item._id)}
//                     className="mr-2"
//                   />
//                   <span>{item.name}</span>
//                 </CommandItem>
//               ))
//             )}
//           </CommandGroup>
//         </CommandList>
//       </Command>

//       {selected.length > 0 && (
//         <div className="pt-2 text-sm text-muted-foreground">
//           {selected.length} {selected.length === 1 ? "subscriber" : "subscribers"} selected
//         </div>
//       )}
//     </div>
//   )
// }

// export default CommandChecklist
