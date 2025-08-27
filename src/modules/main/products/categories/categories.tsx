"use client";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NavigateBtn from "@/components/buttons/navigate-btn";
import {
  useDeleteProductCategoryMutation,
  useGetProductCategoryQuery,
} from "@/state/product-category-api";
import { TableCell, TableRow } from "@/components/ui/table";
import { useTableFilters } from "@/hooks/useTableFilters";
import SubHeader from "@/modules/layout/header/sub-header";
import Shadcn_table from "@/components/table/table";
import ShadcnPagination from "@/components/pagination";
import useWindowWidth from "@/hooks/useWindowWidth";
import LazyImage from "../../../../components/LazyImage";
import { siteName } from "@/config";
import { motion } from "framer-motion";
import { AlertDialogComponenet } from "@/components/alert-dialog";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
const Categories = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deletedId, setDeletedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<string>("10");
  const [
    deleteProductCategory,
    {
      isLoading: isDeleteLoading,
      isSuccess: isDeleteSuccess,
      error: isDeleteError,
    },
  ] = useDeleteProductCategoryMutation();
  const { data, isLoading, error } = useGetProductCategoryQuery({
    rowsPerPage: Number(rowsPerPage),
    page: currentPage,
  });

  useHandleNotifications({
    error: isDeleteError || error,
  });

  const width = useWindowWidth();
  const result = data?.result || [];
  const { searchTerm, setSearchTerm, filteredItems } = useTableFilters(result, [
    "name",
  ]);
  const removeHandler = useCallback(
    async (remove_id: string) => {
      setIsOpen(true);
      setDeletedId(remove_id);
      // setRemoveId(remove_id);
      // await deletePost({ id: remove_id });
    },
    [
      // deletePost
    ]
  );
  const DeleteHandler = useCallback(async () => {
    await deleteProductCategory({ id: deletedId! });
  }, [deleteProductCategory, deletedId]);

  useEffect(() => {
    if (isDeleteSuccess) {
      setIsOpen(false);
      setDeletedId(null);
    }
  }, [isDeleteSuccess]);
  const tableBody = useMemo(() => {
    if (!filteredItems || filteredItems.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="text-center">
            No records found
          </TableCell>
        </TableRow>
      );
    }
    return filteredItems.map((item, index) => (
      <TableRow key={index}>
        <TableCell className="font-medium">
          <LazyImage
            src={item?.thumbnail?.public_id || ""}
            alt={item?.thumbnail?.altText ?? siteName ?? ""}
            style="rounded-full w-[40px] h-[40px]"
          />
        </TableCell>
        <TableCell className="font-medium">{item.name}</TableCell>
        <TableCell>{item?.handle}</TableCell>
        {/* <TableCell>{<TimeAgo time={item.updatedAt} />}</TableCell> */}
        <TableCell>
          <div className="flex items-center gap-2">
            {item?.status === "inactive" ? (
              <div className="w-2 h-2 bg-black rounded-full"></div>
            ) : (
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            )}
            <span className="text-sm text-foreground">{item?.status}</span>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {item?.visibility === "draft" ? (
              <div className="w-2 h-2 bg-black rounded-full"></div>
            ) : (
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            )}
            <span className="text-sm text-foreground">{item?.visibility}</span>
          </div>
        </TableCell>
        <TableCell className="text-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem
                disabled={deletedId === item?._id}
                className="text-destructive"
                onClick={() => {
                  const id = item?._id; // prefer typing properly instead of any
                  if (!id) return; // or disable the button if no id
                  removeHandler(id);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  }, [filteredItems, removeHandler, deletedId]);
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="flex px-4 items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Categories
            </h1>
            <p className="text-muted-foreground">
              Organize products into categories, and manage those
              categories&apos; ranking and hierarchy.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.div whileTap={{ scale: 0.97 }}>
              <NavigateBtn
                path="/dashboard/products/categories/organize"
                title="Edit ranking"
                style="text-sm bg-black cursor-pointer text-white"
              />
            </motion.div>
            <motion.div whileTap={{ scale: 0.97 }}>
              <NavigateBtn
                path="/dashboard/products/categories/create"
                title="Create"
                style="text-sm bg-black cursor-pointer text-white"
              />
            </motion.div>
          </div>
        </div>

        <SubHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setRowsPerPage={setRowsPerPage}
          dataCounter={data?.dataCounter}
        />
        {/* Header Section */}
        <div
          style={{ width: width < 749 ? `${width}px` : "100%" }}
          className={`min-h-[400px] px-2 lg:px-6 overflow-hidden`}
        >
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Shadcn_table
                table_header={[
                  "Thumbnail",
                  "Title",
                  "Handle",
                  "Status",
                  "Visibility",
                  "Action",
                ]}
                tabel_body={() => tableBody}
                isLoading={isLoading}
              />
            </div>
          </div>
          <div className="flex-1 text-sm text-muted-foreground">
            {data && data?.dataCounter > Number(rowsPerPage) && (
              <ShadcnPagination
                currentPage={currentPage}
                totalPages={Number(rowsPerPage)}
                setCurrentPage={setCurrentPage}
                data_length={data?.dataCounter || 10}
              />
            )}
          </div>
        </div>
      </div>
      {isOpen && (
        <AlertDialogComponenet
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          title="Are you absolutely sure?"
          description="This action cannot be undone. This will permanently delete form Database."
          action={DeleteHandler}
          type="danger"
          setDeletedId={setDeletedId}
          isLoading={isDeleteLoading}
        />
      )}
    </div>
  );
};
export default memo(Categories);
