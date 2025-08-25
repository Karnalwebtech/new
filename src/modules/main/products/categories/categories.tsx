"use client";
import React, { memo, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Pencil, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NavigateBtn from "@/components/buttons/navigate-btn";
import { useGetProductCategoryQuery } from "@/state/product-category-api";
import { TableCell, TableRow } from "@/components/ui/table";
import { TimeAgo } from "@/lib/timeAgo";
import LinkTooltip from "@/components/tooltip/link-tooltip";
import { Badge } from "@/components/ui/badge";
import EventTooltip from "@/components/tooltip/event-tooltip";
import { useTableFilters } from "@/hooks/useTableFilters";
import SubHeader from "@/modules/layout/header/sub-header";
import Shadcn_table from "@/components/table/table";
import ShadcnPagination from "@/components/pagination";
import useWindowWidth from "@/hooks/useWindowWidth";
const categories = [
  {
    name: "Laptops",
    handle: "/laptops",
    status: "Active",
    visibility: "Public",
  },
  {
    name: "Accessories",
    handle: "/accessories",
    status: "Active",
    visibility: "Public",
  },
  {
    name: "Phones",
    handle: "/phones",
    status: "Active",
    visibility: "Public",
  },
  {
    name: "Monitors",
    handle: "/monitors",
    status: "Active",
    visibility: "Public",
  },
];

const Categories = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<string>("10");
  const { data, error, isLoading } = useGetProductCategoryQuery({
    rowsPerPage: Number(rowsPerPage),
    page: currentPage,
  });
  console.log(data);
  const width = useWindowWidth();
  const result = data?.result || [];
  const { searchTerm, setSearchTerm, filteredItems } = useTableFilters(result, [
    "name",
  ]);

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
      <TableRow key={index}>
        <TableCell className="font-medium">{item.name}</TableCell>
        <TableCell>{item?.handle}</TableCell>
        {/* <TableCell>{<TimeAgo time={item.updatedAt} />}</TableCell> */}
        <TableCell>
          <div className="flex items-center gap-2">
             {item?.status === "inactive" ? (
              <div className="w-2 h-2 bg-black rounded-full"></div>
            ) : (
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            )}
            <span className="text-sm text-foreground">{item?.status}</span>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {item?.visibility === "draft" ? (
              <div className="w-2 h-2 bg-black rounded-full"></div>
            ) : (
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            )}
            <span className="text-sm text-foreground">{item?.visibility}</span>
          </div>
        </TableCell>
        <TableCell className="text-end">
          <LinkTooltip
            Icon={Pencil}
            description={"Edit"}
            path={`/dashboard/post/`}
            style={"text-green-800 hover:text-white hover:bg-green-800"}
          />
          {/* <EventTooltip
              Icon={Trash2}
              description={"Delete"}
              isLoading={removeId === item._id}
              action={() => removeHandler(item._id)}
              style={"text-red-800 hover:text-white hover:bg-red-800"}
            /> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  }, [
    filteredItems,
    //removeHandler,
    // removeId
  ]);
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="flex px-4 items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Categories
            </h1>
            <p className="text-muted-foreground">
              Organize products into categories, and manage those
              categories&apos; ranking and hierarchy.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="text-sm bg-transparent">
              Edit ranking
            </Button>
            <NavigateBtn
              path="/dashboard/products/categories/create"
              title="Create"
              style="text-sm bg-black text-white"
            />
          </div>
        </div>

        <SubHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setRowsPerPage={setRowsPerPage}
          dataCounter={data?.dataCounter}
        />
        {/* Header Section */}
        <div
          style={{ width: width < 749 ? `${width}px` : "100%" }}
          className={`min-h-[400px] px-2 lg:px-6 overflow-hidden`}
        >
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Shadcn_table
                table_header={[
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
          </div>
          <div className="flex-1 text-sm text-muted-foreground">
            {data && data?.dataCounter > Number(rowsPerPage) && (
              <ShadcnPagination
                currentPage={currentPage}
                totalPages={Number(rowsPerPage)}
                setCurrentPage={setCurrentPage}
                data_length={data?.dataCounter || 10}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default memo(Categories);
