"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CircleX, MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { Header } from "@/modules/layout/header/header";
import {
  useDeleteApiKeyMutation,
  useGetApiKeyDetailsQuery,
  useUpdateApiKeyMutation,
} from "@/state/api-key-api";
import { TimeAgo } from "@/lib/timeAgo";
import StatusIndicator from "@/components/status-indicator";
import { containerVariants } from "@/lib/variants";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import { AlertDialogComponenet } from "@/components/alert-dialog";
import { ApiKeyType } from "@/types/api-key-type";
import { Badge } from "@/components/ui/badge";
import { capitalizeFirstLetter, copyToClipboard } from "@/services/helpers";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { clearSelected } from "@/reducers/healper-slice";
import ApiKeySalesChannelsList from "./api-key-sales-channels-list";

interface ApiKeysDetailsProps {
  ItemId?: string;
  type?: string;
}

const rowMotion = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: (idx: number) => ({ delay: 0.1 * idx, duration: 0.3 }),
};

const ApiKeysDetails = ({
  ItemId,
  type = "publishable",
}: ApiKeysDetailsProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deletedId, setDeletedId] = useState<string | null>(null);
  useEffect(() => {
    dispatch(clearSelected());
  }, [dispatch]);
  const [
    deleteApiKey,
    { isLoading: delteLoading, error: deleteError, isSuccess: deleteSuccess },
  ] = useDeleteApiKeyMutation();
  const [
    updateApiKey,
    { isLoading: updateLoading, error: updateError, isSuccess: updateSuccess },
  ] = useUpdateApiKeyMutation();

  const { data, isLoading, error } = useGetApiKeyDetailsQuery(
    { id: ItemId as string },
    { skip: !ItemId || ItemId === deletedId }
  );

  useHandleNotifications({
    error: error || deleteError || updateError,
    isSuccess: deleteSuccess || updateSuccess,
    successMessage: deleteSuccess
      ? `Api key delete successfully!`
      : `Api key revoked successfully!`,
    redirectPath: deletedId ? `/settings/${type}-api-keys` : "",
  });

  const result = data?.result;

  const rows = useMemo(
    () => [
      { label: "Key", value: result?.redactedToken },
      { label: "Type", value: result?.type },
      {
        label: "Last used at",
        value:
          result?.last_used_at !== null ? (
            <TimeAgo time={result?.last_used_at || ""} />
          ) : (
            "-"
          ),
      },
      { label: "Created by", value: result?.created_by?.email },
      {
        label: "Revoked at",
        value: result?.revoked_at ? <TimeAgo time={result.revoked_at} /> : "-",
      },
      { label: "Revoked by", value: result?.revoked_by?.email },
    ],
    [result]
  );

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
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Settings", path: "/settings" },
          { label: "Api key", path: `/settings/${type}-api-keys` },
          {
            label: result?.name || "",
            path: `/settings/${type}-api-keys/${result?.id}`,
          },
        ]}
      />

      <motion.div
        className="min-h-screen"
        initial={{ opacity: 0, y: 20 }}
        variants={containerVariants}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="bg-background border rounded-xl bg-white my-2">
          <div className="p-4">
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-xl">
                {capitalizeFirstLetter(result?.name || "")}
              </h1>

              <div className="flex items-center justify-between gap-2">
                <StatusIndicator
                  trueLabel="Active"
                  falseLabel="Revoked"
                  enabled={!result?.revoked_at}
                  size={40}
                />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Table actions"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(
                          `/settings/${type}-api-keys/${result?.id}/edit`
                        )
                      }
                      className="cursor-pointer p-1"
                    >
                      <SquarePen className="h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={!!result?.revoked_at}
                      className="cursor-pointer"
                      onClick={() => result?._id && revokeHandler(result)}
                    >
                      <CircleX className="h-4 w-4 mr-2" /> Revoke Api Key
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={!result?.revoked_at}
                      className="text-destructive cursor-pointer"
                      onClick={() => result?.id && removeHandler(result?.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <div className="p-0">
            <div role="table">
              {rows.map((row, idx) => (
                <motion.div
                  key={row.label}
                  className="grid grid-cols-12 items-center border-t"
                  {...rowMotion}
                  transition={rowMotion.transition(idx)}
                >
                  <div className="col-span-12 px-6 py-2 text-sm text-muted-foreground md:col-span-3">
                    {row.label}
                  </div>
                  <div className="col-span-12 px-6 py-2 md:col-span-9 text-gray-600 text-sm">
                    {isLoading || updateLoading ? (
                      <Skeleton className="h-5 w-32 rounded-md" />
                    ) : row.label === "Key" ? (
                      <Badge
                        variant={"outline"}
                        className="cursor-pointer text-gray-600"
                        onClick={async () => {
                          if (!result?.token) {
                            toast.error("No API key found to copy");
                            return;
                          }

                          try {
                            await copyToClipboard(result?.token); // wait for the clipboard write
                            toast.success("API key copied to clipboard!");
                          } catch (err) {
                            toast.error("Failed to copy API key");
                            console.error("Clipboard copy failed:", err);
                          }
                        }}
                      >
                        {row.value}
                      </Badge>
                    ) : (
                      row.value || "-"
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        {type === "publishable" && (
          <ApiKeySalesChannelsList
            type={type}
            pageId={result?.id}
            id={result?._id}
          />
        )}
        <AnimatePresence>
          {isOpen && (
            <AlertDialogComponenet
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              title="Are you sure?"
              description="This action cannot be undone. This will permanently delete the Api key."
              action={DeleteHandler}
              type="danger"
              setDeletedId={setDeletedId}
              isLoading={delteLoading}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default memo(ApiKeysDetails);
