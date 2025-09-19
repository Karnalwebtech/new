"use client";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TableCell, TableRow } from "@/components/ui/table";
import { useTableFilters } from "@/hooks/useTableFilters";
import Shadcn_table from "@/components/table/table";
import useWindowWidth from "@/hooks/useWindowWidth";
import { TruncateText } from "@/components/truncate-text";
import ShadcnPagination from "@/components/pagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { containerVariants, controls } from "@/lib/variants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertDialogComponenet } from "@/components/alert-dialog";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import NavigateBtn from "@/components/buttons/navigate-btn";
import { TimeAgo } from "@/lib/timeAgo";
import {
  useDeleteProductTypesMutation,
  useGetAllProductTypeDataQuery,
} from "@/state/product-types-api";
import { ProductTypes } from "@/types/product-type";

const Row = memo(
  ({
    item,
    removeHandler,
    router,
    deletedId,
  }: {
    item: ProductTypes;
    removeHandler: (id: string) => void;
    deletedId: string | null;
    router: ReturnType<typeof useRouter>;
  }) => {
    return (
      <TableRow className="group hover:bg-muted/40 transition-colors duration-200">
        <TableCell>
          <span className="text-muted-foreground">
            <TruncateText text={item.name || ""} maxLength={25} />
          </span>
        </TableCell>
        <TableCell>
          <span className="text-muted-foreground">
            <TruncateText text={item.description || ""} maxLength={25} />
          </span>
        </TableCell>
        <TableCell>
          <TimeAgo time={item.createdAt!} />
        </TableCell>
        <TableCell>
          <TimeAgo time={item.updatedAt!} />
        </TableCell>
        <TableCell className="text-right pr-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Table actions">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  router.push(`/settings/product-types/${item?.id}/edit`)
                }
              >
                <Pencil className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  router.push(`/settings/product-types/${item?.id}`)
                }
              >
                <Eye className="h-4 w-4 mr-2" /> Preview
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={deletedId === item?._id}
                className="text-destructive cursor-pointer"
                onClick={() => item?._id && removeHandler(item?._id)}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    );
  }
);
Row.displayName = "Row";

const ProductType = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deletedId, setDeletedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("20");
  const [
    deleteProductTypes,
    { isLoading: delteLoading, error: deleteError, isSuccess: deleteSuccess },
  ] = useDeleteProductTypesMutation();
  const { data, isLoading, error } = useGetAllProductTypeDataQuery({
    rowsPerPage: Number(rowsPerPage),
    page: currentPage,
  });

  useHandleNotifications({
    error: error || deleteError,
    isSuccess: deleteSuccess,
    successMessage: `Product type delete successfully!`,
  });
  const width = useWindowWidth();
  const result = useMemo(() => data?.result || [], [data?.result]);

  const { filteredItems, searchTerm, setSearchTerm } = useTableFilters(result, [
    "name",
  ]);

  const DeleteHandler = useCallback(async () => {
    if (deletedId) await deleteProductTypes({ id: deletedId });
  }, [deleteProductTypes, deletedId]);

  const removeHandler = useCallback((id: string) => {
    setIsOpen(true);
    setDeletedId(id);
  }, []);

  const tableBody = useMemo(() => {
    if (!filteredItems.length) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="text-center py-8">
            <div className="text-muted-foreground text-lg mb-2">
              No currencies found
            </div>
            <div className="text-sm text-muted-foreground/70">
              Try adjusting your search criteria
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return filteredItems.map((item, i) => (
      <Row
        key={i}
        item={item}
        removeHandler={removeHandler}
        deletedId={deletedId}
        router={router}
      />
    ));
  }, [filteredItems, deletedId, removeHandler, router]);

  useEffect(() => {
    if (deleteSuccess) {
      setIsOpen(false);
      setDeletedId(null);
    }
  }, [deleteSuccess]);
  return (
    <motion.div
      className="min-h-screen bg-background"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto py-8">
        <div className="flex px-4 items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Product Tags
            </h1>
          </div>
          <motion.div
            className="flex flex-wrap items-center gap-3"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          >
            {/* Search */}
            <motion.div
              variants={controls}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="max-w-lg  flex-1"
            >
              <Input
                type="text"
                value={searchTerm}
                placeholder="Search currencies..."
                onChange={(e) => setSearchTerm(e.target.value)}
                className="transition-all focus-visible:shadow-[0_0_0_2px_rgba(59,130,246,.25)]"
              />
            </motion.div>

            {/* Per page Select */}
            <motion.div
              variants={controls}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Select
                value={rowsPerPage}
                onValueChange={(val) => {
                  setRowsPerPage(val); // val is a string
                  setCurrentPage(1); // optional: reset page
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Per page" />
                </SelectTrigger>

                {/* Animate dropdown content on mount/unmount */}
                <SelectContent>
                  <AnimatePresence>
                    <motion.div
                      key="select-content"
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.98 }}
                      transition={{ duration: 0.16 }}
                    >
                      <SelectGroup>
                        <SelectLabel>Per page</SelectLabel>
                        {["10", "20", "50", "100"].map((val) => (
                          <motion.div
                            key={val}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                          >
                            <SelectItem value={val}>{val} / page</SelectItem>
                          </motion.div>
                        ))}
                      </SelectGroup>
                    </motion.div>
                  </AnimatePresence>
                </SelectContent>
              </Select>
            </motion.div>
            <NavigateBtn
              path={"/settings/product-types/create"}
              title="Create"
            />
          </motion.div>
        </div>

        <div
          style={{ width: width < 749 ? `${width}px` : "100%" }}
          className="min-h-[400px] px-2"
        >
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm relative">
            {(isLoading || delteLoading) && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            <Shadcn_table
              table_header={["Name","Description", "Created", "Updated", "Action"]}
              tabel_body={() => tableBody}
              isLoading={isLoading || delteLoading}
            />
          </div>

          {/* Pagination */}
          {data && data.dataCounter > Number(rowsPerPage) && (
            <ShadcnPagination
              leftRightBtn={true}
              currentPage={currentPage}
              totalPages={Number(rowsPerPage)}
              setCurrentPage={setCurrentPage}
              data_length={data.dataCounter || 10}
            />
          )}
        </div>
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
            isLoading={delteLoading}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default memo(ProductType);
