"use client";
import { useMemo, useState } from "react";

/** Extract values from an object by a dot-path (safe, no `any`) */
function getByPath<T extends object>(obj: T, path: string): string[] {
  if (!obj || !path) return [];
  const parts = path.split(".");

  let queue: unknown[] = [obj];

  for (const key of parts) {
    const next: unknown[] = [];
    for (const cur of queue) {
      if (Array.isArray(cur)) {
        for (const el of cur) {
          if (typeof el === "object" && el !== null && key in el) {
            next.push((el as Record<string, unknown>)[key]);
          }
        }
      } else if (typeof cur === "object" && cur !== null && key in cur) {
        next.push((cur as Record<string, unknown>)[key]);
      }
    }
    queue = next;
    if (queue.length === 0) break;
  }

  const out: string[] = [];
  for (const v of queue.flat()) {
    if (v == null) continue;
    if (typeof v === "string") out.push(v);
    else if (typeof v === "number" || typeof v === "boolean") out.push(String(v));
    else if (typeof v === "object") out.push(JSON.stringify(v));
  }
  return out;
}

interface UseTableFiltersReturn<T> {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  statusFilter: string[];
  setStatusFilter: React.Dispatch<React.SetStateAction<string[]>>;
  filteredItems: T[];
}

/**
 * Client-side table filtering with nested key support.
 */
export function useTableFilters<T extends object>(
  items: T[],
  searchKeys: string[]
): UseTableFiltersReturn<T> {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const normalized = searchTerm.trim().toLowerCase();

  const filteredItems = useMemo(() => {
    if (!items.length) return [];
    if (!normalized && statusFilter.length === 0) return items;

    return items.filter((item) => {
      // text search across dot-path keys
      const matchesSearch =
        !normalized ||
        searchKeys.some((path) => {
          const values = getByPath(item, path);
          return values.some((val) => val.toLowerCase().includes(normalized));
        });

      if (!matchesSearch) return false;

      // Example: you can add custom status filtering here
      return true;
    });
  }, [items, searchKeys, normalized, statusFilter]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredItems,
  };
}




// "use client"
// import { useState, useMemo } from "react";


// export function useTableFilters<T>(
//     items: T[],
//     searchKeys: (keyof T)[],
// ) {
//     const [searchTerm, setSearchTerm] = useState("");
//     const [statusFilter, setStatusFilter] = useState<string[]>([]);

//     const filteredItems = useMemo(() => {
//         return items?.filter((item) => {
//             // Check if the item matches the search term
//             const matchesSearch = searchKeys.some((key) => {
//                 const value = item[key];

//                 // Ensure value is string or number before calling .toString()
//                 if (typeof value === "string" || typeof value === "number") {
//                     return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
//                 }

//                 return false;
//             });


//             // Check if the item's status matches the selected statuses
//             //   const matchesStatus =
//             //     statusFilter.length === 0 || // No filter applied
//             //     statusFilter.toString().toLowerCase().includes(item.status.toLowerCase()); // Filter by 'status' field

//             //   // Return true only if both conditions are met
//             //   return matchesSearch && matchesStatus;
//             return matchesSearch;
//         });
//     }, [
//         items, searchKeys, searchTerm, 
//         // statusFilter
//     ]);

//     return {
//         searchTerm,
//         setSearchTerm,
//         statusFilter,
//         setStatusFilter,
//         filteredItems,
//     };
// }