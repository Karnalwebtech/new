"use client"
import React, { memo, useCallback, useMemo, useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { useTableFilters } from "@/hooks/useTableFilters";
import { Trash2, Pencil } from "lucide-react";
import { useDeleteCateorieMutation, useGetAllcategorieQuery } from "@/state/categorie-api";
import SubHeader from "../../layout/header/sub-header";
import Shadcn_table from "@/components/table/table";
import ShadcnPagination from "@/components/pagination";
import EventTooltip from "@/components/tooltip/event-tooltip";
import LinkTooltip from "@/components/tooltip/link-tooltip";
import { TimeAgo } from "@/lib/timeAgo";
import useWindowWidth from "@/hooks/useWindowWidth";
import { Badge } from "@/components/ui/badge";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
interface CategorieListProps {
    type?: string;
}
const CategorieList = ({ type = "post" }: CategorieListProps) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<string>("10");
    const [removeId, setRemoveId] = useState<string>("");


    const { data, isLoading } = useGetAllcategorieQuery({
        rowsPerPage: Number(rowsPerPage),
        page: currentPage,
        type: type,
    });
    const [
        deleteCateorie,
        { error, isSuccess },
    ] = useDeleteCateorieMutation();
    const width = useWindowWidth();
    useHandleNotifications({
        error: error,
        isSuccess,
        successMessage: "Category deleted successfully!",
    });
    const result = data?.result || [];
    const {
        searchTerm,
        setSearchTerm,
        filteredItems,
    } = useTableFilters(result, ["title"]);

    const removeHandler = useCallback(async (remove_id: string) => {
        setRemoveId(remove_id)
        await deleteCateorie({ id: remove_id });
    }, [deleteCateorie]);
    const tableBody = useMemo(() => {
        if (!filteredItems || filteredItems.length === 0) {
            return <TableRow><TableCell colSpan={5} className="text-center">No records found</TableCell></TableRow>;
        }
        return filteredItems.map((item, index) => (
            <TableRow key={index}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.user?.name}</TableCell>
                <TableCell>{<TimeAgo time={item.updatedAt} />}</TableCell>
                <TableCell>
                    <Badge className="w-full text-center" variant={item?.status === "published" ? "default" : "secondary"}>
                        {item.status === "published" ? "Published" : "Draft"}
                    </Badge>
                </TableCell>
                <TableCell>
                    <LinkTooltip
                        Icon={Pencil}
                        description={"Edit"}
                        path={`/dashboard/${type}/categorie/${item.id}`}
                        style={"text-green-800 hover:text-white hover:bg-green-800"}
                    />
                    <EventTooltip
                        Icon={Trash2}
                        description={"Delete"}
                        isLoading={removeId === item._id}
                        action={() => removeHandler(item._id)}
                        style={"text-red-800 hover:text-white hover:bg-red-800"}
                    />
                </TableCell>
            </TableRow>
        ));
    }, [filteredItems, removeHandler, removeId, type]);
    return (
        <>
            <SubHeader
                searchTerm={searchTerm}
                placeHolder={"Search by Fullname, Phone, email, si"}
                setSearchTerm={setSearchTerm}
                setRowsPerPage={setRowsPerPage}
                dataCounter={data?.dataCounter}
            />
            <div
                style={{ width: width < 749 ? `${width}px` : "100%" }}
                className={`min-h-[400px] px-2 lg:px-6 overflow-hidden`}
            >
                <Shadcn_table
                    table_header={["Title",
                        "Author",
                        "Date",
                        "Status",
                        "Action",]}
                    tabel_body={() => tableBody}
                    isLoading={isLoading}
                />
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
        </>
    );
};

export default memo(CategorieList);