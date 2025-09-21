"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type React from "react";

import TableLoaderSkeleton from "../skeletons/table-loader-skeleton";
import { Checkbox } from "../ui/checkbox";
import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Shadcn_table_props {
  table_header: string[];
  tabel_body: () => React.ReactNode;
  isLoading: boolean;
  isAllSelected?: boolean | "indeterminate";
  handleSelectAll?: (value: boolean) => void;
  isCheckbox?: boolean;
  textend?: string;
}

const Shadcn_table = ({
  table_header,
  tabel_body,
  isLoading,
  handleSelectAll,
  isAllSelected,
  isCheckbox = false,
  textend = "action",
}: Shadcn_table_props) => {
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/50 bg-gray-100 transition-colors duration-200">
              {table_header.map((header, index) =>
                header === "checkbox" && isCheckbox ? (
                  <TableHead key="checkbox">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={(checked) => {
                          if (typeof checked === "boolean") {
                            handleSelectAll?.(checked);
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300 transition-all duration-200 hover:border-primary"
                      />
                    </motion.div>
                  </TableHead>
                ) : (
                  <TableHead
                    key={header}
                    className={`${
                      header === "Action" ||
                      header === "Tax inclusive pricing" ||
                      header === textend
                        ? "text-end"
                        : ""
                    } font-semibold text-muted-foreground`}
                  >
                    <motion.span
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      className="inline-block"
                    >
                      {header}
                    </motion.span>
                  </TableHead>
                )
              )}
            </TableRow>
          </TableHeader>

          <TableBody className="relative">
            <AnimatePresence>
              {isLoading ? (
                <TableLoaderSkeleton
                  length={40}
                  content={table_header}
                  Parenttag={TableRow}
                  Subtag={TableCell}
                />
              ) : (
                tabel_body()
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default memo(Shadcn_table);
