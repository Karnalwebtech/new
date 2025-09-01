"use client";

import type React from "react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
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
import NavigateBtn from "@/components/buttons/navigate-btn";
import {
  useDeleteProductCategoryMutation,
  useDupicateProductCategoryMutation,
  useGetProductCategoryQuery,
} from "@/state/product-category-api";
import { TableCell, TableRow } from "@/components/ui/table";
import { useTableFilters } from "@/hooks/useTableFilters";
import SubHeader from "@/modules/layout/header/sub-header";
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
import { ProductCategoryFormData } from "@/types/product-type";
import { useGetProductCollectionsQuery } from "@/state/product-collections-api";

const statusVariants = {
  inactive: { backgroundColor: "#374151" },
  active: { backgroundColor: "#10b981" },
  draft: { backgroundColor: "#374151" },
  published: { backgroundColor: "#10b981" },
};

// 🔹 Optimized reusable Row component
const Row = memo(
  ({
    item,
    depth,
    expandedIds,
    toggleExpand,
    removeHandler,
    DuplicateHandler,
    deletedId,
    router,
  }: {
    item: ProductCategoryFormData;
    depth: number;
    expandedIds: Set<string>;
    toggleExpand: (id: string) => void;
    removeHandler: (id: string) => void;
    DuplicateHandler: (id: string) => void;
    deletedId: string | null;
    router: ReturnType<typeof useRouter>;
  }) => {
    const rowId = `${item._id || item.id}-${depth}`;

    const hasChildren =
      Array.isArray(item?.children) && item.children.length > 0;
    const isExpanded = expandedIds.has(rowId);

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
              {hasChildren ? (
                <button
                  type="button"
                  aria-label={isExpanded ? "Collapse" : "Expand"}
                  className="h-6 w-6 inline-flex items-center justify-center rounded hover:bg-muted"
                  onClick={() => toggleExpand(rowId)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              ) : (
                <span className="h-6 w-6 inline-block" />
              )}
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

          {/* Status */}
          <TableCell>
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full"
                animate={
                  item?.status === "inactive"
                    ? statusVariants.inactive
                    : statusVariants.active
                }
                transition={{ duration: 0.3 }}
              />
              <span
                className={`text-sm capitalize ${
                  item?.status === "inactive"
                    ? "text-gray-400"
                    : "text-emerald-500"
                }`}
              >
                {item?.status}
              </span>
            </div>
          </TableCell>

          {/* Visibility */}
          <TableCell>
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full"
                animate={
                  item?.visibility === "draft"
                    ? statusVariants.draft
                    : statusVariants.published
                }
                transition={{ duration: 0.3 }}
              />
              <span
                className={`text-sm capitalize ${
                  item?.visibility === "draft"
                    ? "text-gray-400"
                    : "text-emerald-500"
                }`}
              >
                {item?.visibility}
              </span>
            </div>
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
                    router.push(
                      `/dashboard/products/Collection/${item?.id}/edit`
                    )
                  }
                >
                  <Pencil className="h-4 w-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/dashboard/products/Collection/${item?.id}`)
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
                  disabled={deletedId === item?._id}
                  className="text-destructive cursor-pointer"
                  onClick={() => item?._id && removeHandler(item._id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </motion.tr>

        {/* Children */}
        <AnimatePresence>
          {hasChildren &&
            isExpanded &&
            item.children!.map((child, i) => (
              <Row
                key={`${child._id}-${depth + 1}-${i}`}
                item={child}
                depth={depth + 1}
                expandedIds={expandedIds}
                toggleExpand={toggleExpand}
                removeHandler={removeHandler}
                DuplicateHandler={DuplicateHandler}
                deletedId={deletedId}
                router={router}
              />
            ))}
        </AnimatePresence>
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
  ] = useDupicateProductCategoryMutation();
  const [
    deleteProductCategory,
    {
      isLoading: isDeleteLoading,
      isSuccess: isDeleteSuccess,
      error: isDeleteError,
    },
  ] = useDeleteProductCategoryMutation();

  const { data, isLoading, error } = useGetProductCollectionsQuery({
    rowsPerPage: Number(rowsPerPage),
    page: currentPage,
  });

  useHandleNotifications({
    error: isDeleteError || error || duplicateError,
    isSuccess: duplicateSuccess || isDeleteSuccess,
    successMessage: duplicateSuccess
      ? "Category duplicated successfully!"
      : isDeleteSuccess
      ? "Category deleted successfully!"
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

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Memoized Table Body
  const tableBody = useMemo(() => {
    if (!filteredItems.length) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8"
            >
              <div className="text-muted-foreground text-lg mb-2">
                No Collection found
              </div>
              <div className="text-sm text-muted-foreground/70">
                Try adjusting your search criteria
              </div>
            </motion.div>
          </TableCell>
        </TableRow>
      );
    }
    return (
      <AnimatePresence>
        {filteredItems.map((item, i) => (
          <Row
            key={`${item._id}-0-${i}`}
            item={item}
            depth={0}
            expandedIds={expandedIds}
            toggleExpand={toggleExpand}
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
    toggleExpand,
  ]);

  return (
    <motion.div
      className="min-h-screen bg-background"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto py-8">
        {/* Header */}
        <motion.div
          className="flex px-4 items-center justify-between mb-8"
          variants={itemVariants}
        >
          <motion.div>
            <motion.h1 className="text-2xl font-semibold text-foreground mb-2">
              Collection
            </motion.h1>
            <motion.p className="text-muted-foreground">
              Organize products into collections.
            </motion.p>
          </motion.div>
          <motion.div className="flex items-center gap-3">
            <NavigateBtn
              path="/dashboard/collections/create"
              title="Create"
              style="btn-primary"
            />
          </motion.div>
        </motion.div>

        {/* SubHeader */}
        <SubHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setRowsPerPage={setRowsPerPage}
          dataCounter={data?.dataCounter}
        />

        {/* Table */}
        <motion.div
          style={{ width: width < 749 ? `${width}px` : "100%" }}
          className="min-h-[400px] px-2"
        >
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm relative">
            {/* Loader Overlay */}
            <AnimatePresence>
              {(isLoading || isDeleteLoading || duplicateLoading) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                  />
                </motion.div>
              )}
            </AnimatePresence>

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
