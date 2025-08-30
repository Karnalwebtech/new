"use client";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
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
import {
  buttonVariants,
  containerVariants,
  itemVariants,
} from "@/lib/variants";
import { useRouter } from "next/navigation";

const statusVariants = {
  inactive: { backgroundColor: "#374151" },
  active: { backgroundColor: "#10b981" },
  draft: { backgroundColor: "#374151" },
  published: { backgroundColor: "#10b981" },
};

const Categories = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deletedId, setDeletedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<string>("10");
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
  const { data, isLoading, error } = useGetProductCategoryQuery({
    rowsPerPage: Number(rowsPerPage),
    page: currentPage,
    has_parent:false,
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

  const removeHandler = useCallback(async (remove_id: string) => {
    setIsOpen(true);
    setDeletedId(remove_id);
  }, []);

  const DeleteHandler = useCallback(async () => {
    await deleteProductCategory({ id: deletedId! });
  }, [deleteProductCategory, deletedId]);

  const DuplicateHandler = useCallback(
    async (id: string) => {
      await dupicateProductCategory({ id: id! });
    },
    [dupicateProductCategory]
  );

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
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="py-8"
            >
              <div className="text-muted-foreground text-lg mb-2">
                No records found
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
      <AnimatePresence mode="popLayout">
        {filteredItems.map((item, index) => (
          <motion.tr
            key={item._id || index}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
            className="group hover:bg-muted/50 transition-colors duration-200"
            style={{
              animationDelay: `${index * 0.05}s`,
              animationFillMode: "both",
            }}
          >
            <TableCell className="font-medium">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 2 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <LazyImage
                  src={item?.thumbnail?.public_id || ""}
                  alt={item?.thumbnail?.altText ?? siteName ?? ""}
                  style="rounded-full w-[40px] h-[40px] shadow-sm"
                />
                <motion.div
                  className="absolute inset-0 rounded-full bg-black/10 opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
            </TableCell>
            <TableCell className="font-medium">
              <motion.span
                className="group-hover:text-primary transition-colors duration-200"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <TruncateText
                  text={item.name! || ""}
                  maxLength={25}
                  className="group-hover:text-primary"
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.span>
            </TableCell>
            <TableCell>
              <motion.span
                className="text-blue-500 group-hover:text-foreground transition-colors duration-200"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                /
                <TruncateText
                  text={item.handle! || ""}
                  maxLength={25}
                  className="group-hover:text-primary"
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.span>
            </TableCell>
            <TableCell>
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full"
                  animate={
                    item?.status === "inactive"
                      ? statusVariants.inactive
                      : statusVariants.active
                  }
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.2 }}
                />
                <motion.span
                  className="text-sm text-foreground"
                  animate={{
                    color: item?.status === "inactive" ? "#6b7280" : "#10b981",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {item?.status}
                </motion.span>
              </motion.div>
            </TableCell>
            <TableCell>
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full"
                  animate={
                    item?.visibility === "draft"
                      ? statusVariants.draft
                      : statusVariants.published
                  }
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.2 }}
                />
                <motion.span
                  className="text-sm text-foreground"
                  animate={{
                    color: item?.visibility === "draft" ? "#6b7280" : "#10b981",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {item?.visibility}
                </motion.span>
              </motion.div>
            </TableCell>
            <TableCell className="text-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="animate-in slide-in-from-top-2 duration-200"
                >
                  <DropdownMenuItem
                    className="hover:bg-muted transition-colors duration-150 cursor-pointer"
                    onClick={() =>
                      router.push(`/dashboard/products/categories/${item?.id}`)
                    }
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hover:bg-muted cursor-pointer transition-colors duration-150"
                    onClick={() => {
                      const id = item?.id;
                      if (!id) return;
                      DuplicateHandler(id);
                    }}
                  >
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={deletedId === item?._id}
                    className="text-destructive hover:bg-destructive/10 cursor-pointer transition-colors duration-150"
                    onClick={() => {
                      const id = item?._id;
                      if (!id) return;
                      removeHandler(id);
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </motion.tr>
        ))}
      </AnimatePresence>
    );
  }, [filteredItems, removeHandler, deletedId, router, DuplicateHandler]);

  return (
    <motion.div
      className="min-h-screen bg-background"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto py-8">
        <motion.div
          className="flex px-4 items-center justify-between mb-8"
          variants={itemVariants}
        >
          <motion.div variants={itemVariants}>
            <motion.h1
              className="text-2xl font-semibold text-foreground mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Categories
            </motion.h1>
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Organize products into categories, and manage those
              categories&apos; ranking and hierarchy.
            </motion.p>
          </motion.div>

          <motion.div
            className="flex items-center gap-3"
            variants={itemVariants}
          >
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <NavigateBtn
                path="/dashboard/products/categories/organize"
                title="Edit ranking"
                style="text-sm bg-black cursor-pointer text-white hover:bg-gray-200 transition-colors duration-200"
              />
            </motion.div>
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <NavigateBtn
                path="/dashboard/products/categories/create"
                title="Create"
                style="text-sm bg-black cursor-pointer text-white hover:bg-gray-200 transition-colors duration-200"
              />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <SubHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setRowsPerPage={setRowsPerPage}
            dataCounter={data?.dataCounter}
          />
        </motion.div>

        <motion.div
          style={{ width: width < 749 ? `${width}px` : "100%" }}
          className={`min-h-[400px] px-2 lg:px-2 overflow-hidden`}
          variants={itemVariants}
        >
          <motion.div
            className="bg-card border border-border rounded-lg overflow-hidden shadow-sm"
            whileHover={{
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              transition: { duration: 0.2 },
            }}
          >
            <div className="overflow-x-auto">
              <AnimatePresence>
                {isLoading || isDeleteLoading || duplicateLoading&& (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
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
                isLoading={isLoading ||isDeleteLoading || duplicateLoading }
              />
            </div>
          </motion.div>

          <motion.div
            className="flex-1 text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            {data && data?.dataCounter > Number(rowsPerPage) && (
              <ShadcnPagination
                currentPage={currentPage}
                totalPages={Number(rowsPerPage)}
                setCurrentPage={setCurrentPage}
                data_length={data?.dataCounter || 10}
              />
            )}
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AlertDialogComponenet
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              title="Are you absolutely sure?"
              description="This action cannot be undone. This will permanently delete form Database."
              action={DeleteHandler}
              type="danger"
              setDeletedId={setDeletedId}
              isLoading={isLoading || isDeleteLoading || duplicateLoading}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default memo(Categories);
