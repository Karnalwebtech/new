"use client";

import { TableCell, TableRow } from "@/components/ui/table";

interface TableEmptyStateProps {
  colSpan: number;
  title?: string;
  description?: string;
}

export const TableEmptyState = ({
  colSpan,
  title = "No records",
  description = "Try adjusting your search criteria",
}: TableEmptyStateProps) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center py-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-muted-foreground text-lg font-medium mb-2">
            {title}
          </div>
          <div className="text-sm text-muted-foreground/70">{description}</div>
        </div>
      </TableCell>
    </TableRow>
  );
};
