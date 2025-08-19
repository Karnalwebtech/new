'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import TableLoaderSkeleton from "../skeletons/table-loader-skeleton";
import { Checkbox } from "../ui/checkbox";
import { memo } from "react";
interface Shadcn_table_props {
    table_header: string[];
    tabel_body: () => React.ReactNode;
    isLoading: boolean;
    isAllSelected?: boolean;
    handleSelectAll?: (value: boolean) => void;
    isCheckbox?: boolean;
}
const Shadcn_table = ({
    table_header,
    tabel_body,
    isLoading,
    handleSelectAll, isAllSelected, isCheckbox = false
}: Shadcn_table_props) => {
    return (
        <div className="space-y-4">
            <Table
            >
                <TableHeader>
                    <TableRow>
                        {table_header.map((header) =>
                            header === "checkbox" && isCheckbox ? (
                                <TableHead key="checkbox">
                                    <Checkbox
                                        checked={isAllSelected}
                                        onCheckedChange={(checked) => {
                                            if (typeof checked === "boolean") {
                                                handleSelectAll?.(checked);
                                            }
                                        }}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                </TableHead>
                            ) : (
                                <TableHead key={header} className={header === "Action" ? "text-end" : ""}>
                                    {header}
                                </TableHead>
                            )
                        )}

                    </TableRow>
                </TableHeader>

                <TableBody className="relative">
                    {isLoading ? (
                        <TableLoaderSkeleton length={40} content={table_header} Parenttag={TableRow} Subtag={TableCell} />
                    ) :
                        (
                            tabel_body()
                        )
                    }
                </TableBody>
            </Table>
        </div>
    )
}
export default memo(Shadcn_table)