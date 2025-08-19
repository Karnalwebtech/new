import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutGrid, Rows3 } from "lucide-react";
import React, { memo } from "react";

// Interface defining the props for the SubHeader component
interface SubHeaderProps {
  searchTerm: string; // Search term input value
  setSearchTerm: (vlaue: string) => void; // Function to update search term
  setRowsPerPage: (value: string) => void; // Function to update rows per page
  dataCounter: number | undefined; // Total number of files
  placeHolder?: string; // Placeholder text for search input
  type?: boolean; // Toggle for displaying grid or list view
  isGrid?: boolean; // Current view mode (grid or list)
  setIsGrid?: (value: boolean) => void; // Function to update view mode
}

const SubHeader = ({
  searchTerm,
  setSearchTerm,
  setRowsPerPage,
  dataCounter,
  placeHolder = "Search by title",
  type = false,
  isGrid = true,
  setIsGrid,
}: SubHeaderProps) => {
  return (
    <div className="py-2 px-2 lg:px-6 mb-4 gap-2 flex justify-between bg-white sticky top-0 shadow-md relative z-10">
      <div className="w-[65%]">
        {/* Search input field */}
        <Input
          type="search"
          placeholder={placeHolder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        {/* Display total file count */}
        <p className="text-xs pt-[2px] px-2">Total files: {dataCounter}</p>
      </div>
      <div className="flex gap-2 w-[150px]">
        {/* Dropdown for selecting rows per page */}
        <Select onValueChange={(value) => setRowsPerPage(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Per page" />
          </SelectTrigger>
          <SelectContent>
            {[
              { key: "10", value: "10" },
              { key: "25", value: "25" },
              { key: "50", value: "50" },
              { key: "100", value: "100" },
              { key: "500", value: "500" },
              { key: "1000", value: "1000" },
            ].map((item, i) => (
              <SelectItem key={i} value={item.key}>
                {item.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Toggle between grid and list view */}
        {type && (
          <div className="p-2">
            {isGrid ? (
              <LayoutGrid
                className="cursor-pointer"
                onClick={() => setIsGrid?.(false)}
              />
            ) : (
              <Rows3
                className="cursor-pointer"
                onClick={() => setIsGrid?.(true)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Export the component wrapped in React.memo for performance optimization
export default memo(SubHeader);
