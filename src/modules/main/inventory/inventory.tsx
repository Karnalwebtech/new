"use client";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TableCell, TableRow } from "@/components/ui/table";
import { useTableFilters } from "@/hooks/useTableFilters";
import Shadcn_table from "@/components/table/table";
import useWindowWidth from "@/hooks/useWindowWidth";
import { TruncateText } from "@/components/truncate-text";
import ShadcnPagination from "@/components/pagination";
import { containerVariants } from "@/lib/variants";
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
import { TimeAgo } from "@/lib/timeAgo";
import {
  useDeleteProductTagMutation,
  useGetAllProductTagDataQuery,
} from "@/state/product-tag-api";
import { ProductTagType } from "@/types/product-type";
import PageHeander2 from "@/modules/layout/header/page-heander2";
import { TableEmptyState } from "@/components/table/table-empty-state";

const Row = memo(
  ({
    item,
    removeHandler,
    router,
    deletedId,
  }: {
    item: ProductTagType;
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
                  router.push(`/settings/product-tags/${item?.id}/edit`)
                }
              >
                <Pencil className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  router.push(`/settings/product-tags/${item?.id}`)
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

const Inventory = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deletedId, setDeletedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("20");
  const [
    deleteProductTag,
    { isLoading: delteLoading, error: deleteError, isSuccess: deleteSuccess },
  ] = useDeleteProductTagMutation();
  const { data, isLoading, error } = useGetAllProductTagDataQuery({
    rowsPerPage: Number(rowsPerPage),
    page: currentPage,
  });

  useHandleNotifications({
    error: error || deleteError,
    isSuccess: deleteSuccess,
    successMessage: `Product tag delete successfully!`,
  });
  const width = useWindowWidth();
  const result = useMemo(() => data?.result || [], [data?.result]);

  const { filteredItems, searchTerm, setSearchTerm } = useTableFilters(result, [
    "name",
  ]);

  const DeleteHandler = useCallback(async () => {
    if (deletedId) await deleteProductTag({ id: deletedId });
  }, [deleteProductTag, deletedId]);

  const removeHandler = useCallback((id: string) => {
    setIsOpen(true);
    setDeletedId(id);
  }, []);

  const tableBody = useMemo(() => {
    if (!filteredItems.length) {
      return <TableEmptyState colSpan={6} />;
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
      className="min-h-screen bg-background border rounded-xl bg-white my-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto py-2">
        <PageHeander2
          headerTitle={"Inventory"}
          headerDescription={"Manage your inventory items"}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          setCurrentPage={setCurrentPage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          subHeader={true}
          navLink={`/dashboard/inventory/create`}
        />

        <div
          style={{ width: width < 749 ? `${width}px` : "100%" }}
          className="min-h-[400px] px-2"
        >
          <div className="overflow-hidden relative">
            <Shadcn_table
              table_header={[
                "Name",
                "Description",
                "Created",
                "Updated",
                "Action",
              ]}
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

export default memo(Inventory);
