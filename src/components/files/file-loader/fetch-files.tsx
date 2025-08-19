"use client";
import ShadcnPagination from "@/components/pagination";
import { ImageCardSkeleton } from "@/components/skeletons/image-card-skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTableFilters } from "@/hooks/useTableFilters";
import { useFilesQuery } from "@/state/file-api";
import React, { memo, useState } from "react";
import FileLoaderCards from "./files-loader-cards";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const FetchFiles = () => {
  const category = useSelector((state: RootState) => state.helper.category);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<string>("10");
  const { data, isLoading } = useFilesQuery({
    rowsPerPage: Number(rowsPerPage),
    page: currentPage,
    category,
  });

  const { searchTerm, setSearchTerm, filteredItems } = useTableFilters(
    data?.result || [],
    ["title"]
  );

  return (
    <>
      <div className="py-2 z-[2] px-6 mb-4 flex justify-between bg-white sticky top-0 shadow-md">
        <div>
          <Input
            type="search"
            placeholder="Search by title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <p className="text-xs px-2">Total files: {data?.dataCounter}</p>
        </div>
        <div>
          <Select onValueChange={(value) => setRowsPerPage(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="500">500</SelectItem>
              <SelectItem value="1000">1000</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 12 }).map((_, i) => (
                <ImageCardSkeleton key={i} /> // ✅ Fixed: Added `key`
              ))
            : filteredItems.map((item, i) => (
                <FileLoaderCards key={i} item={item} />
              ))}
        </div>
        {/* {filteredItems.length >= Number(rowsPerPage) &&
        searchTerm.length > 3 ? ( */}
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            <ShadcnPagination
              currentPage={currentPage}
              totalPages={Number(rowsPerPage)}
              setCurrentPage={setCurrentPage}
              data_length={data?.dataCounter || 10}
            />
          </div>
        </div>
        {/* ) : null} */}
      </div>
    </>
  );
};

export default memo(FetchFiles);
