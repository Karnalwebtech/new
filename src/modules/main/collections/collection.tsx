"use client";

import type React from "react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Copy,
  Trash2,
  Pencil,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell } from "@/components/ui/table";
import { useTableFilters } from "@/hooks/useTableFilters";
import Shadcn_table from "@/components/table/table";
import ShadcnPagination from "@/components/pagination";
import useWindowWidth from "@/hooks/useWindowWidth";
import LazyImage from "@/components/LazyImage";
import { siteName } from "@/config";
import { motion, AnimatePresence } from "framer-motion";
import { AlertDialogComponenet } from "@/components/alert-dialog";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import { TruncateText } from "@/components/truncate-text";
import { containerVariants, itemVariants } from "@/lib/variants";
import { useRouter } from "next/navigation";
import { ProductCollectionsFormData } from "@/types/product-type";
import {
  useDeleteProductCollctionMutation,
  useDupicateProductCollectionMutation,
  useGetProductCollectionsQuery,
} from "@/state/product-collections-api";
import PageHeander2 from "@/modules/layout/header/page-heander2";
import { TableEmptyState } from "@/components/table/table-empty-state";

// 🔹 Optimized reusable Row component
const Row = memo(
  ({
    item,
    depth,
    removeHandler,
    DuplicateHandler,
    deletedId,
    router,
  }: {
    item: ProductCollectionsFormData;
    depth: number;
    removeHandler: (id: string) => void;
    DuplicateHandler: (id: string) => void;
    deletedId: string | null;
    router: ReturnType<typeof useRouter>;
  }) => {
    const rowId = `${item._id || item.id}-${depth}`;

    return (
      <>
        <motion.tr
          key={rowId}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          layout
          className="group hover:bg-muted/40 transition-colors duration-200"
        >
          {/* Thumbnail */}
          <TableCell>
            <motion.div className="relative">
              <LazyImage
                src={item?.thumbnail?.public_id || ""}
                alt={item?.thumbnail?.altText ?? siteName ?? ""}
                style="rounded-full w-[40px] h-[40px] shadow-sm"
              />
            </motion.div>
          </TableCell>

          {/* Title + Expand */}
          <TableCell>
            <div
              className="flex items-center gap-2"
              style={{ paddingLeft: depth * 16 }}
            >

              <TruncateText
                text={item.name! || ""}
                maxLength={25}
                className="group-hover:text-primary transition-colors duration-200"
              />
            </div>
          </TableCell>

          {/* Handle */}
          <TableCell>
            <span className="text-muted-foreground">
              /<TruncateText text={item.handle! || ""} maxLength={25} />
            </span>
          </TableCell>

          {/* Actions */}
          <TableCell className="text-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="animate-in fade-in">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/dashboard/collections/${item?.id}/edit`)
                  }
                >
                  <Pencil className="h-4 w-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/dashboard/collections/${item?.id}`)
                  }
                >
                  <Eye className="h-4 w-4 mr-2" /> Preview
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => item?.id && DuplicateHandler(item.id)}
                >
                  <Copy className="h-4 w-4 mr-2" /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={deletedId === item?.id}
                  className="text-destructive cursor-pointer"
                  onClick={() => item?.id && removeHandler(item.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </motion.tr>
      </>
    );
  }
);
Row.displayName = "Row";

// 🔹 Main Component
const Collection = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [deletedId, setDeletedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const [
    dupicateProductCategory,
    {
      isLoading: duplicateLoading,
      isSuccess: duplicateSuccess,
      error: duplicateError,
    },
  ] = useDupicateProductCollectionMutation();
  const [
    deleteProductCategory,
    {
      isLoading: isDeleteLoading,
      isSuccess: isDeleteSuccess,
      error: isDeleteError,
    },
  ] = useDeleteProductCollctionMutation();

  const { data, isLoading, error } = useGetProductCollectionsQuery({
    rowsPerPage: Number(rowsPerPage),
    page: currentPage,
  });

  useHandleNotifications({
    error: isDeleteError || error || duplicateError,
    isSuccess: duplicateSuccess || isDeleteSuccess,
    successMessage: duplicateSuccess
      ? "Collection duplicated successfully!"
      : isDeleteSuccess
        ? "Collection deleted successfully!"
        : "",
  });

  const width = useWindowWidth();
  const result = data?.result || [];
  const { searchTerm, setSearchTerm, filteredItems } = useTableFilters(result, [
    "name",
  ]);

  const removeHandler = useCallback((id: string) => {
    setIsOpen(true);
    setDeletedId(id);
  }, []);

  const DeleteHandler = useCallback(async () => {
    if (deletedId) await deleteProductCategory({ id: deletedId });
  }, [deleteProductCategory, deletedId]);

  const DuplicateHandler = useCallback(
    async (id: string) => {
      await dupicateProductCategory({ id });
    },
    [dupicateProductCategory]
  );

  useEffect(() => {
    if (isDeleteSuccess) {
      setIsOpen(false);
      setDeletedId(null);
    }
  }, [isDeleteSuccess]);

  // Memoized Table Body
  const tableBody = useMemo(() => {
    if (!filteredItems.length) {
      return (
        <TableEmptyState
          title="No Collection found"
          description="Try adjusting your search criteria"
          colSpan={6}
        />
      );
    }
    return (
      <AnimatePresence>
        {filteredItems.map((item, i) => (
          <Row
            key={`${item._id}-0-${i}`}
            item={item}
            depth={0}
            removeHandler={removeHandler}
            DuplicateHandler={DuplicateHandler}
            deletedId={deletedId}
            router={router}
          />
        ))}
      </AnimatePresence>
    );
  }, [
    filteredItems,
    expandedIds,
    deletedId,
    router,
    DuplicateHandler,
    removeHandler,
  ]);

  return (
    <motion.div
      className="min-h-screen bg-background"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto py-8">

        <PageHeander2
          headerTitle={"Collection"}
          headerDescription="Organize products into collections."
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          setCurrentPage={setCurrentPage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          subHeader={true}
          navLink={`/dashboard/collections/create`}
        />
        {/* Table */}
        <motion.div
          style={{ width: width < 749 ? `${width}px` : "100%" }}
          className="min-h-[400px] px-2"
        >
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm relative">
            <Shadcn_table
              table_header={["Thumbnail", "Title", "Handle", "Action"]}
              tabel_body={() => tableBody}
              isLoading={isLoading || isDeleteLoading || duplicateLoading}
            />
          </div>

          {/* Pagination */}
          {data && data?.dataCounter > Number(rowsPerPage) && (
            <ShadcnPagination
              currentPage={currentPage}
              totalPages={Number(rowsPerPage)}
              setCurrentPage={setCurrentPage}
              data_length={data?.dataCounter || 10}
            />
          )}
        </motion.div>
      </div>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {isOpen && (
          <AlertDialogComponenet
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Are you sure?"
            description="This action cannot be undone. This will permanently delete the category."
            action={DeleteHandler}
            type="danger"
            setDeletedId={setDeletedId}
            isLoading={isDeleteLoading}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default memo(Collection);
