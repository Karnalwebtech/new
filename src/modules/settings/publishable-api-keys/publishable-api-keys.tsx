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
import {
  CircleX,
  Copy,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertDialogComponenet } from "@/components/alert-dialog";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import StatusIndicator from "@/components/status-indicator";
import { TimeAgo } from "@/lib/timeAgo";
import PageHeander2 from "@/modules/layout/header/page-heander2";
import {
  useDeleteApiKeyMutation,
  useGetAllApiKeysQuery,
  useUpdateApiKeyMutation,
} from "@/state/api-key-api";
import { ApiKeyType } from "@/types/api-key-type";
import { copyToClipboard } from "@/services/helpers";
import { toast } from "sonner";
import { TableEmptyState } from "@/components/table/table-empty-state";

const Row = memo(
  ({
    item,
    removeHandler,
    router,
    revokeHandler,
  }: {
    item: ApiKeyType;
    removeHandler: (id: string) => void;
    revokeHandler: (item: ApiKeyType) => void;
    router: ReturnType<typeof useRouter>;
  }) => {
    return (
      <TableRow className="group hover:bg-muted/40 transition-colors duration-200">
        <TableCell className="p-0">
          <span className="text-muted-foreground">
            <TruncateText text={item.name || ""} maxLength={25} />
          </span>
        </TableCell>
        <TableCell className="p-0">
          <span className="text-muted-foreground">
            <TruncateText text={item.redactedToken || ""} maxLength={25} />
          </span>
        </TableCell>
        <TableCell className="p-0">
          <span className="text-muted-foreground">
            <TruncateText text={item.type || ""} maxLength={25} />
          </span>
        </TableCell>
        <TableCell className="text-right pr-6 text-gray-700">
          <StatusIndicator
            trueLabel="Active"
            falseLabel="Revoked"
            enabled={!item.revoked_at}
            size={40}
          />
        </TableCell>

        <TableCell className="p-0">
          <TimeAgo time={item.createdAt!} />
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
                  router.push(`/settings/publishable-api-keys/${item?.id}/edit`)
                }
              >
                <Pencil className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={async () => {
                  if (!item.token) {
                    toast.error("No API key found to copy");
                    return;
                  }

                  try {
                    await copyToClipboard(item.token); // wait for the clipboard write
                    toast.success("API key copied to clipboard!");
                  } catch (err) {
                    toast.error("Failed to copy API key");
                    console.error("Clipboard copy failed:", err);
                  }
                }}
              >
                <Copy className="h-4 w-4 mr-2" /> Copy Api Key
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  router.push(`/settings/publishable-api-keys/${item?.id}`)
                }
              >
                <Eye className="h-4 w-4 mr-2" /> Preview
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!!item.revoked_at}
                className="cursor-pointer"
                onClick={() => item?._id && revokeHandler(item)}
              >
                <CircleX className="h-4 w-4 mr-2" /> Revoke Api Key
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!item.revoked_at}
                className="text-destructive cursor-pointer"
                onClick={() => item?.id && removeHandler(item?.id)}
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

const Publishable_API_Keys = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deletedId, setDeletedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("20");
  const [
    deleteApiKey,
    { isLoading: delteLoading, error: deleteError, isSuccess: deleteSuccess },
  ] = useDeleteApiKeyMutation();
  const [
    updateApiKey,
    { isLoading: updateLoading, error: updateError, isSuccess: updateSuccess },
  ] = useUpdateApiKeyMutation();

  const { data, isLoading, error } = useGetAllApiKeysQuery({
    rowsPerPage: Number(rowsPerPage),
    page: currentPage,
  });

  useHandleNotifications({
    error: error || deleteError || updateError,
    isSuccess: deleteSuccess || updateSuccess,
    successMessage: deleteSuccess
      ? `Api key delete successfully!`
      : `Api key revoked successfully!`,
  });
  const width = useWindowWidth();
  const result = useMemo(() => data?.result || [], [data?.result]);

  const { filteredItems, searchTerm, setSearchTerm } = useTableFilters(result, [
    "name",
  ]);

  const DeleteHandler = useCallback(async () => {
    if (deletedId) await deleteApiKey({ id: deletedId });
  }, [deleteApiKey, deletedId]);

  const removeHandler = useCallback((id: string) => {
    setIsOpen(true);
    setDeletedId(id);
  }, []);
  const revokeHandler = useCallback(
    async (data: ApiKeyType) => {
      await updateApiKey({ ...data, revoked: true });
    },
    [updateApiKey]
  );

  const tableBody = useMemo(() => {
    if (!filteredItems.length) {
      return <TableEmptyState colSpan={6} />;
    }

    return filteredItems.map((item, i) => (
      <Row
        key={i}
        item={item}
        removeHandler={removeHandler}
        router={router}
        revokeHandler={revokeHandler}
      />
    ));
  }, [filteredItems, removeHandler, router, revokeHandler]);

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
          headerTitle="Publishable API Keys"
          headerDescription="Manage API keys used in the storefront to limit the scope of requests to specific sales channels."
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          setCurrentPage={setCurrentPage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          subHeader={true}
          navLink={"/settings/publishable-api-keys/create"}
        />

        <div
          style={{ width: width < 749 ? `${width}px` : "100%" }}
          className="min-h-[400px] px-2"
        >
          <div className="overflow-hidden relative">
            {(isLoading || delteLoading || updateLoading) && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            <Shadcn_table
              table_header={[
                "Name",
                "Token",
                "Type",
                "Status",
                "Created",
                "Action",
              ]}
              tabel_body={() => tableBody}
              isLoading={isLoading || delteLoading || updateLoading}
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

export default memo(Publishable_API_Keys);
