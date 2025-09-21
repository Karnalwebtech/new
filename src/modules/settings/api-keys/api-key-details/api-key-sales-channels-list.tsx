"use client";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { useTableFilters } from "@/hooks/useTableFilters";
import Shadcn_table from "@/components/table/table";
import useWindowWidth from "@/hooks/useWindowWidth";
import { TruncateText } from "@/components/truncate-text";
import ShadcnPagination from "@/components/pagination";
import { Checkbox } from "@/components/ui/checkbox";
import {
  bulkToggleCodes,
  clearSelected,
  toggleCode,
} from "@/reducers/healper-slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import StatusIndicator from "@/components/status-indicator";
import { TimeAgo } from "@/lib/timeAgo";
import PageHeander2 from "@/modules/layout/header/page-heander2";
import { TableEmptyState } from "@/components/table/table-empty-state";
import {
  useDeletePublishableApiKeyMutation,
  useGetAllPublisgableApiKeysQuery,
} from "@/state/publishable-api-key-api";
import { PublishableApiKeyType } from "@/types/publishable-api-key-sales-channel-type";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import ActionBarBtn from "@/components/buttons/action-bar-btn";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";
import { AlertDialogComponenet } from "@/components/alert-dialog";

const Row = memo(
  ({
    item,
    onCheckChange,
    isChecked,
  }: {
    item: PublishableApiKeyType;
    isChecked: boolean;
    onCheckChange: (next: boolean) => void;
  }) => {
    return (
      <TableRow className="group hover:bg-muted/40 transition-colors duration-200">
        <TableCell>
          <Checkbox
            checked={isChecked}
            onCheckedChange={(v) => onCheckChange(!!v)}
            aria-label={`Select ${item?._id}`}
            className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
          />
        </TableCell>
        <TableCell>
          <span className="text-muted-foreground">
            <TruncateText
              text={item?.sales_channel_id?.name || ""}
              maxLength={25}
            />
          </span>
        </TableCell>
        <TableCell>
          <span className="text-muted-foreground">
            <TruncateText
              text={item?.sales_channel_id?.description || ""}
              maxLength={25}
            />
          </span>
        </TableCell>
        <TableCell className="text-right pr-6 text-gray-700">
          <StatusIndicator
            enabled={item?.sales_channel_id?.is_disabled ?? false}
            size={40}
          />
        </TableCell>
        <TableCell>
          <TimeAgo time={item?.sales_channel_id?.createdAt || ""} />
        </TableCell>
        <TableCell>
          <TimeAgo time={item?.sales_channel_id?.updatedAt || ""} />
        </TableCell>
      </TableRow>
    );
  }
);
Row.displayName = "Row";
interface ApiSalesChanelsListProps {
  pageId?: string;
  id?: string;
  type?:string;
}
const ApiSalesChanelsList = ({ pageId, id,type }: ApiSalesChanelsListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("20");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { selected } = useSelector((state: RootState) => state.helper);
  const [
    deletePublishableApiKey,
    { isLoading: deleteLoading, isSuccess: deleteSuccess, error: deleteError },
  ] = useDeletePublishableApiKeyMutation();
  const { data, isLoading, error } = useGetAllPublisgableApiKeysQuery({
    rowsPerPage: Number(rowsPerPage),
    page: currentPage,
    publishable_api_key_id: id,
  });
  useHandleNotifications({
    error: error || deleteError,
    isSuccess: deleteSuccess,
    successMessage: "Sales channels deleted successfully!",
  });
  const width = useWindowWidth();
  const result = useMemo(() => data?.result || [], [data?.result]);

  const { filteredItems, searchTerm, setSearchTerm } = useTableFilters(result, [
    "name",
    "sales_channel_id.name",
  ]);
  const selectedOnPageCount = useMemo(() => {
    if (!selected) return 0;
    return result.filter((c) => selected.includes(c._id!)).length;
  }, [result, selected]);

  const headerCheckedState: boolean | "indeterminate" = useMemo(() => {
    if (filteredItems.length === 0) return false;
    if (selectedOnPageCount === 0) return false;
    if (selectedOnPageCount === filteredItems.length) return true;
    return "indeterminate";
  }, [filteredItems.length, selectedOnPageCount]);

  const handleToggleCode = useCallback(
    (code: string, checked: boolean) => {
      dispatch(toggleCode({ code, checked }));
    },
    [dispatch]
  );

  const tableBody = useMemo(() => {
    if (!filteredItems.length) {
      return (
        <TableEmptyState
          title="No sales channels found"
          description="Once a sales channel has been created, it will appear here."
          colSpan={10}
        />
      );
    }

    return filteredItems.map((item, i) => (
      <Row
        key={`${item._id}-${i}`}
        item={item}
        isChecked={Array.isArray(selected) && selected.includes(item._id!)}
        onCheckChange={(next) => handleToggleCode(item._id!, next)}
      />
    ));
  }, [filteredItems, selected, handleToggleCode]);

  const toggleSelectAllOnPage = useCallback(
    (nextChecked: boolean) => {
      dispatch(
        bulkToggleCodes({
          codes: result.map((c) => c._id!),
          checked: nextChecked,
        })
      );
    },
    [dispatch, result]
  );

  const removeHandler = useCallback(() => {
    if (selected.length === 0) {
      return toast.error("You should select at least one");
    }
    setIsOpen(true);
  }, [selected]);

  const DeleteHandler = useCallback(async () => {
    await deletePublishableApiKey({ ids: selected });
  }, [selected, deletePublishableApiKey]);
  useEffect(() => {
    if (deleteSuccess) {
      dispatch(clearSelected());
      setIsOpen(false);
    }
  }, [dispatch, deleteSuccess]);
  return (
    <div className="min-h-screen bg-background mb-14">
      <div className="container mx-auto py-4 border rounded-xl mt-4">
        <PageHeander2
          headerTitle="Sales Channels"
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          setCurrentPage={setCurrentPage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          btnTitle="Add"
          navLink={`/settings/${type}-api-keys/${pageId}/sales-channels`}
        />

        <div
          style={{ width: width < 749 ? `${width}px` : "100%" }}
          className="min-h-[400px] px-2 py-4"
        >
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm relative">
            <Shadcn_table
              table_header={[
                "checkbox",
                "Name",
                "Description",
                "Status",
                "Created",
                "Updated",
              ]}
              isAllSelected={headerCheckedState}
              isCheckbox={true}
              handleSelectAll={(e) => toggleSelectAllOnPage(e)}
              tabel_body={() => tableBody}
              isLoading={isLoading || deleteLoading}
            />
          </div>
          <ActionBarBtn
            selectedCount={selected.length}
            onRemove={removeHandler}
          />
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
      <AnimatePresence>
        {isOpen && (
          <AlertDialogComponenet
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Are you sure?"
            description={`You are about to remove ${selected.length} sales channel from the API key. This action cannot be undone.`}
            action={DeleteHandler}
            type="danger"
            setDeletedId={() => {}}
            isLoading={deleteLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(ApiSalesChanelsList);
