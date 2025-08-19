"use client";
import FileOptions from "@/components/files/file-more-options/FileOptions";
import Server_File_Card from "@/components/files/server-file-card";
import ShadcnPagination from "@/components/pagination";
import { ImageCardSkeleton } from "@/components/skeletons/image-card-skeleton";
import { useTableFilters } from "@/hooks/useTableFilters";
import SubHeader from "@/modules/layout/header/sub-header";
import { open } from "@/reducers/healper-slice";
import { useFilesQuery } from "@/state/file-api";
import React, { memo, useCallback, useState } from "react";
import { useDispatch } from "react-redux";

const AllFiles = ({ pageid }: { pageid?: string }) => {
  const [imageDetailsId, setImageDetailsId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<string>("10");
  const { data, isLoading } = useFilesQuery({
    rowsPerPage: Number(rowsPerPage),
    page: currentPage,
    category: pageid,
  });

  const { searchTerm, setSearchTerm, filteredItems } = useTableFilters(
    data?.result || [],
    ["title"]
  );

  const handleOpen = useCallback((id: string) => {
    setImageDetailsId(id)
    setIsOpen(true)
    dispatch(open());
  }, [dispatch]);
  return (
    <>
      <SubHeader
        searchTerm={searchTerm}
        placeHolder={"Search by title"}
        setSearchTerm={setSearchTerm}
        setRowsPerPage={setRowsPerPage}
        dataCounter={data?.dataCounter}
      />

      <div className="px-2 lg:px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 12 }).map((_, i) => (
              <ImageCardSkeleton key={i} /> // ✅ Fixed: Added `key`
            ))
            : filteredItems.map((item, i) => (
              <Server_File_Card key={i} item={item} isOpenImageOptions={() => handleOpen(item?._id)} />
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
        {isOpen &&
          <FileOptions id={imageDetailsId || ""} setIsOpen={setIsOpen} />
        }
      </div>
    </>
  );
};

export default memo(AllFiles);
