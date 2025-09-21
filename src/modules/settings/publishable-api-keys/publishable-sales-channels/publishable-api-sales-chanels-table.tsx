"use client";
import { memo, useCallback, useMemo, useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { useTableFilters } from "@/hooks/useTableFilters";
import Shadcn_table from "@/components/table/table";
import useWindowWidth from "@/hooks/useWindowWidth";
import { TruncateText } from "@/components/truncate-text";
import ShadcnPagination from "@/components/pagination";
import { Checkbox } from "@/components/ui/checkbox";
import { useDebounced } from "@/hooks/useDebounced";
import { bulkToggleCodes, toggleCode } from "@/reducers/healper-slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useGetAllSalesChannelsDataQuery } from "@/state/sales-channels-api";
import { SalesChannelsType } from "@/types/sales-channels-type";
import StatusIndicator from "@/components/status-indicator";
import { TimeAgo } from "@/lib/timeAgo";
import PageHeander2 from "@/modules/layout/header/page-heander2";
import { TableEmptyState } from "@/components/table/table-empty-state";
import { useGetAllPublisgableApiKeysQuery } from "@/state/publishable-api-key-api";
import { useGetApiKeyDetailsQuery } from "@/state/api-key-api";
import { useHandleNotifications } from "@/hooks/use-notification-handler";

const Row = memo(
  ({
    item,
    onCheckChange,
    isDisabled,
    isChecked,
  }: {
    item: SalesChannelsType;
    isDisabled: boolean;
    isChecked: boolean;
    onCheckChange: (next: boolean) => void;
  }) => {
    return (
      <TableRow className="group hover:bg-muted/40 transition-colors duration-200">
        <TableCell>
          
          <Checkbox
          disabled={isDisabled}
            checked={isChecked || isDisabled}
            onCheckedChange={(v) => onCheckChange(!!v)}
            aria-label={`Select ${item?._id}`}
            className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
          />
        </TableCell>
        <TableCell>
          <span className="text-muted-foreground">
            <TruncateText text={item?.name || ""} maxLength={25} />
          </span>
        </TableCell>
        <TableCell>
          <span className="text-muted-foreground">
            <TruncateText text={item?.description || ""} maxLength={25} />
          </span>
        </TableCell>
        <TableCell className="text-right pr-6 text-gray-700">
          <StatusIndicator enabled={item.is_disabled!} size={40} />
        </TableCell>
        <TableCell>
          <TimeAgo time={item.createdAt!} />
        </TableCell>
        <TableCell>
          <TimeAgo time={item.updatedAt!} />
        </TableCell>
      </TableRow>
    );
  }
);
Row.displayName = "Row";
interface PublishableApiSalesChanelsTableProps {
  pageId?: string;
}
const PublishableApiSalesChanelsTable = ({
  pageId,
}: PublishableApiSalesChanelsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("20");
  const [search, setSearch] = useState<string>("");
  const dispatch = useDispatch();
  const { selected } = useSelector((state: RootState) => state.helper);
  const { data, isLoading, error } = useGetAllSalesChannelsDataQuery({
    rowsPerPage: Number(rowsPerPage),
    page: currentPage,
    keywords: useDebounced(search, 500),
  });
  const { data: apiKeyFetch, isLoading:apiKeyFetchLoading,error:apiKeyError} = useGetApiKeyDetailsQuery(
    { id: pageId as string },
    { skip: !pageId }
  );
  const { data: selectedFetchData,isLoading:selectedFetchDataLoading,error:selectedFetachError } = useGetAllPublisgableApiKeysQuery({
    rowsPerPage: Number(rowsPerPage),
    page: currentPage,
    publishable_api_key_id: apiKeyFetch?.result?._id,
  });
   useHandleNotifications({
      error: error || selectedFetachError || apiKeyError,
    });
  const width = useWindowWidth();
  const result = useMemo(() => data?.result || [], [data?.result]);
  const selectedIds = useMemo(
    () => selectedFetchData?.result?.map(
    ({ sales_channel_id }) => sales_channel_id?._id
  ) ?? [],
    [selectedFetchData?.result]
  );

  const { filteredItems } = useTableFilters(result, ["name"]);

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
        isDisabled={Array.isArray(selectedIds) && selectedIds.includes(item._id!)}
        onCheckChange={(next) => handleToggleCode(item._id!, next)}

      />
    ));
  }, [filteredItems, selected, handleToggleCode,selectedIds]);

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

  return (
    <div className="min-h-screen bg-background mb-14">
      <div className="container mx-auto py-4 border rounded-xl mt-4">
        <PageHeander2
          headerTitle=""
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          setCurrentPage={setCurrentPage}
          searchTerm={search}
          setSearchTerm={setSearch}
          is_btn={false}
          navLink={`/settings/publishable-api-keys/${pageId}/sales-channels`}
        />

        <div
          style={{ width: width < 749 ? `${width}px` : "100%" }}
          className="min-h-[400px] px-2 py-4"
        >
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm relative">
            {isLoading || apiKeyFetchLoading || selectedFetchDataLoading&& (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}

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
              isLoading={isLoading || apiKeyFetchLoading || selectedFetchDataLoading}
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
    </div>
  );
};

export default memo(PublishableApiSalesChanelsTable);
