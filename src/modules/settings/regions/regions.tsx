"use client";
import { memo, useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TableCell, TableRow } from "@/components/ui/table";
import { useTableFilters } from "@/hooks/useTableFilters";
import Shadcn_table from "@/components/table/table";
import useWindowWidth from "@/hooks/useWindowWidth";
import { TruncateText } from "@/components/truncate-text";
import ShadcnPagination from "@/components/pagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { containerVariants, controls, itemVariants } from "@/lib/variants";
import NavigateBtn from "@/components/buttons/navigate-btn";
import { useGetAllRegionseDataQuery } from "../../../state/regions-api";
import { RegionCountryData } from "@/types/regions-type";
import { Copy, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AlertDialogComponenet } from "@/components/alert-dialog";

const Row = memo(
  ({
    item,
    router,
  }: {
    router: ReturnType<typeof useRouter>;
    item: RegionCountryData;
  }) => {
    return (
      <TableRow className="group hover:bg-muted/40 transition-colors duration-200">
        <TableCell>
          <span className="text-muted-foreground">
            <TruncateText text={item?.region_id?.name || ""} maxLength={25} />
          </span>
        </TableCell>
        <TableCell>
          <span className="text-muted-foreground">
            <TruncateText text={item?.country_id?.name || ""} maxLength={25} />
          </span>
        </TableCell>
        <TableCell className="text-right pr-6">
          <span className="text-muted-foreground">
            <TruncateText text={"test"} maxLength={25} />
          </span>
        </TableCell>
        <TableCell className="text-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="animate-in fade-in">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  router.push(`/dashboard/regions/${item?.id}/edit`)
                }
              >
                <Pencil className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push(`/dashboard/regions/${item?.id}`)}
              >
                <Eye className="h-4 w-4 mr-2" /> Preview
              </DropdownMenuItem>

              <DropdownMenuItem
                // disabled={deletedId === item?._id}
                className="text-destructive cursor-pointer"
                // onClick={() => item?._id && removeHandler(item._id)}
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

const Region = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [deletedId, setDeletedId] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState("20");
  const { data, isLoading } = useGetAllRegionseDataQuery({
    rowsPerPage: Number(rowsPerPage),
    page: currentPage,
  });

  const width = useWindowWidth();
  const result = useMemo(() => data?.result || [], [data?.result]);
  const { filteredItems, searchTerm, setSearchTerm } = useTableFilters(result, [
    "name",
    "country_id.name",
    "region_id.name",
    "country.name",
    "region.name",
  ]);

  const removeHandler = useCallback((id: string) => {
    setIsOpen(true);
    setDeletedId(id);
  }, []);

  const DeleteHandler = useCallback(async () => {
    // if (deletedId) await deleteProductCategory({ id: deletedId });
  }, []);

  const tableBody = useMemo(() => {
    if (!filteredItems.length) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="text-center py-8">
            <div className="text-muted-foreground text-lg mb-2">
              No currencies found
            </div>
            <div className="text-sm text-muted-foreground/70">
              Try adjusting your search criteria
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return filteredItems.map((item, i) => (
      <Row key={`${item._id!}-${i}`} item={item} router={router} />
    ));
  }, [filteredItems, router]);

  return (
    <motion.div
      className="min-h-screen bg-background"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto py-8">
        <motion.div
          className="flex px-4 items-center justify-between mb-8"
          variants={itemVariants}
        >
          <motion.div>
            <motion.h1 className="text-2xl font-semibold text-foreground mb-2">
              Regions
            </motion.h1>
            <motion.p className="text-muted-foreground">
              A region is an area that you sell products in. It can cover multiple countries, and has different tax rates, providers, and currency.
            </motion.p>
          </motion.div>
          
          <NavigateBtn path={"/settings/regions/create"} title={"Create"} />
        </motion.div>

        <div className="flex px-4 items-center justify-between mb-8">
          <div>
            {/* <h1 className="text-2xl font-semibold text-foreground mb-2">
              Currencies
            </h1>
            <p className="text-muted-foreground">
              Manage and organize product currencies.
            </p> */}
          </div>
          <motion.div
            className="flex flex-wrap items-center gap-3"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          >
            {/* Search */}
            <motion.div
              variants={controls}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="max-w-lg  flex-1"
            >
              <Input
                type="text"
                value={searchTerm}
                placeholder="Search currencies..."
                onChange={(e) => setSearchTerm(e.target.value)}
                className="transition-all focus-visible:shadow-[0_0_0_2px_rgba(59,130,246,.25)]"
              />
            </motion.div>

            {/* Per page Select */}
            <motion.div
              variants={controls}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Select
                value={rowsPerPage}
                onValueChange={(val) => {
                  setRowsPerPage(val); // val is a string
                  setCurrentPage(1); // optional: reset page
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Per page" />
                </SelectTrigger>

                {/* Animate dropdown content on mount/unmount */}
                <SelectContent>
                  <AnimatePresence>
                    <motion.div
                      key="select-content"
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.98 }}
                      transition={{ duration: 0.16 }}
                    >
                      <SelectGroup>
                        <SelectLabel>Per page</SelectLabel>
                        {["10", "20", "50", "100"].map((val) => (
                          <motion.div
                            key={val}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                          >
                            <SelectItem value={val}>{val} / page</SelectItem>
                          </motion.div>
                        ))}
                      </SelectGroup>
                    </motion.div>
                  </AnimatePresence>
                </SelectContent>
              </Select>
            </motion.div>
          </motion.div>
        </div>

        <div
          style={{ width: width < 749 ? `${width}px` : "100%" }}
          className="min-h-[400px] px-2"
        >
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm relative">
            {/* Loader Overlay */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Shadcn_table
              table_header={[
                "Name",
                "Countries",
                "Payment Providers",
                "Action",
              ]}
              tabel_body={() => tableBody}
              isLoading={isLoading}
              textend="Payment Providers"
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
            isLoading={false}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default memo(Region);
