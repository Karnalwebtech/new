"use client"

import { memo, useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TableCell, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Trash2 } from "lucide-react"

import { useClearCacheUsingKeysMutation, useGetUpstashRedisBrowserDataQuery } from "@/state/upstash-redis-api"
import SubHeader from "@/modules/layout/header/sub-header"
import Shadcn_table from "@/components/table/table"
import ShadcnPagination from "@/components/pagination"
import { useHandleNotifications } from "@/hooks/use-notification-handler"
import useWindowWidth from "@/hooks/useWindowWidth"
import { useTableFilters } from "@/hooks/useTableFilters"
import { copyToClipboard, formatTTL } from "@/services/helpers"
import { Checkbox } from "@/components/ui/checkbox"
import EventTooltip from "@/components/tooltip/event-tooltip"
interface DataBrowserProps {
  isHeaderVisiable?: boolean;
  searchKey?: string;
  setSelectedDeleteIds?: (value: string[]) => void;
}
const DataBrowserComponent = ({ isHeaderVisiable = true, searchKey, setSelectedDeleteIds }: DataBrowserProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<string>("10");
  const [commandInput, setCommandInput] = useState("")
  const [commandOutput] = useState("")
  //---------- all hookes
  const { data, error, isLoading } = useGetUpstashRedisBrowserDataQuery({
    rowsPerPage: Number(rowsPerPage),
    page: currentPage,
    search: searchKey
  })
  const [clearCacheUsingKeys, { isLoading: deleteLoading, isSuccess, error: deleteError }] = useClearCacheUsingKeysMutation()
  // Handle command execution
  const executeCommand = () => {
    // // In a real application, this would send the command to the Redis server
    // // For this demo, we'll just simulate a response
    // if (commandInput.trim() === "") {
    //   setCommandOutput("Please enter a command")
    //   return
    // }

    // const command = commandInput.trim().toUpperCase()
    // if (command.startsWith("GET")) {
    //   const key = commandInput.split(" ")[1]
    //   const data = redisData.find((item) => item.key === key)
    //   if (data) {
    //     setCommandOutput(data.value)
    //   } else {
    //     setCommandOutput("(nil)")
    //   }
    // } else if (command.startsWith("KEYS")) {
    //   const pattern = commandInput.split(" ")[1] || "*"
    //   const keys = redisData
    //     .filter((item) => item.key.includes(pattern.replace("*", "")))
    //     .map((item) => item.key)
    //     .join("\n")
    //   setCommandOutput(keys || "(empty list)")
    // } else {
    //   setCommandOutput("Command executed. (Note: This is a simulation, no actual Redis command was executed)")
    // }
  }

  useHandleNotifications({
    error: error || deleteError,
    isSuccess,
    successMessage: "Cache clear successfully"
  });
  const width = useWindowWidth();
  const result = useMemo(() => data?.result || [], [data]);
  const { searchTerm, setSearchTerm, filteredItems } = useTableFilters(result, [
    "key",
  ]);


  // Select one-by-one
  const handleCheckboxChange = useCallback((checked: string | boolean, id: string) => {

    if (checked) {
      setSelectedIds((prev) => {
        const updated = [...prev, id];
        setSelectedDeleteIds?.(updated); // ✅ safe call
        return updated;
      });
    } else {
      setSelectedIds((prev) => {
        const updated = prev.filter((itemId) => itemId !== id);
        setSelectedDeleteIds?.(updated); // ✅ safe call
        return updated;
      });
    }
  }, [setSelectedDeleteIds]);

  const clearCacheHandler = useCallback(
    async (keyValue?: string) => {
      if (keyValue && selectedIds) {
        const updatedIds = Array.from(new Set([...selectedIds, keyValue]));

        setSelectedIds(updatedIds);        // Mark selected keys
        await clearCacheUsingKeys({ keys: updatedIds }); // Your function to remove keys
        return
      };

    },
    [setSelectedIds, clearCacheUsingKeys, selectedIds]
  );

  useEffect(() => {
    if (isSuccess) {
      setSelectedIds([])
      setSelectedDeleteIds?.([])
    }
  }, [isSuccess, setSelectedDeleteIds])

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
      <TableRow key={index}
        className={deleteLoading && selectedIds.includes(item?.key) ? "opacity-50 pointer-events-none select-none" : ""}

        aria-disabled={deleteLoading && selectedIds.includes(item?.key)}
      >

        <TableCell className="font-medium">
          <Checkbox
            className="h-4 w-4 rounded border-gray-300"
            checked={selectedIds.includes(item.key)}
            onCheckedChange={(checked) => handleCheckboxChange(checked, item.key)}
          />
        </TableCell>
        <TableCell className="font-medium">{item.key}</TableCell>
        <TableCell className="font-medium">{item.type}</TableCell>
        <TableCell className="font-medium">{item.size}</TableCell>
        <TableCell className="font-medium">{formatTTL(item.ttl)}</TableCell>
        <TableCell className="text-end">
          <EventTooltip
            Icon={Copy}
            description={"Copy"}
            isLoading={false}
            action={() => copyToClipboard(item?.key)}
            style={"text-black-800 hover:text-white hover:bg-green-800"}
          />
          <EventTooltip
            Icon={Trash2}
            description={"Delete"}
            isLoading={deleteLoading && selectedIds.includes(item?.key)}
            action={() => clearCacheHandler(item?.key)}
            style={"text-red-800 hover:text-white hover:bg-red-800"}
          />
        </TableCell>
      </TableRow>
    ));
  }, [filteredItems, handleCheckboxChange, clearCacheHandler, deleteLoading, selectedIds]);




  return (
    <Tabs defaultValue="browser" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="browser">Key Browser</TabsTrigger>
        <TabsTrigger value="cli">Redis CLI</TabsTrigger>
      </TabsList>
      <TabsContent value="browser" className="mt-4">

        <div className="space-y-4">
          {isHeaderVisiable && <SubHeader
            searchTerm={searchTerm}
            placeHolder={"Search by Type, Key, Status"}
            setSearchTerm={setSearchTerm}
            setRowsPerPage={setRowsPerPage}
            dataCounter={data?.dataCounter}
          />}
          <div
            style={{ width: width < 749 ? `${width}px` : "100%" }}
            className={`min-h-[400px] px-2 lg:px-6 overflow-hidden`}
          >
            <Shadcn_table
              table_header={["checkbox", "Key", "Type", "Size", "TTL", "Action"]}
              tabel_body={() => tableBody}
              isLoading={isLoading}
              isAllSelected={selectedIds.length === result.length && result?.length > 0}
              isCheckbox={true}
              handleSelectAll={(checked) => {
                const keys = checked ? result.map(item => item.key) : [];

                setSelectedIds(keys); // Assuming this is always defined
                setSelectedDeleteIds?.(keys); // Safe optional call in case it's undefined
              }}
            />
            <div className="flex-1 text-sm text-muted-foreground">
              {data && data?.dataCounter > Number(rowsPerPage) && (
                <ShadcnPagination
                  currentPage={currentPage}
                  totalPages={Number(rowsPerPage)}
                  setCurrentPage={setCurrentPage}
                  data_length={data?.dataCounter}
                />
              )}
            </div>
          </div>
        </div>

      </TabsContent>
      <TabsContent value="cli" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Redis CLI</CardTitle>
            <CardDescription>Execute Redis commands directly from the dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Enter Redis command (e.g., GET user:1001)"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={executeCommand}>Execute</Button>
              </div>
              <div className="rounded-md border bg-muted p-4">
                <Textarea
                  placeholder="Command output will appear here..."
                  value={commandOutput}
                  readOnly
                  className="min-h-[200px] resize-none bg-transparent"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            Tip: Use commands like GET, SET, DEL, KEYS, etc. For example, try &ldquo;KEYS *&ldquo; to list all keys.
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

DataBrowserComponent.displayName = "DataBrowser";

// ✅ Named export
export const DataBrowser = memo(DataBrowserComponent);