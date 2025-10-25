"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/modules/layout/header/header";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import { ProductsSkeleton } from "@/components/skeletons/single-page-skeleton";
import {
  useDeleteTaxRegionMutation,
  useGetTaxRegionDetailsQuery,
} from "@/state/tax-region-api";
import ReactCountryFlag from "react-country-flag";
import { capitalizeFirstLetter } from "@/services/helpers";
import NoRecordsCard from "@/components/cards/no-records-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { AlertDialogComponenet } from "@/components/alert-dialog";
import TaxRegions from "./tax-regions";
interface TaxRegionDetailsProps {
  ItemId: string;
}
const TaxRegionDetails = ({ ItemId }: TaxRegionDetailsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deletedId, setDeletedId] = useState<string | null>(null);
  const router = useRouter();
  const {
    data,
    isLoading: dataLoader,
    error: dataLoadError,
  } = useGetTaxRegionDetailsQuery({ id: ItemId as string }, { skip: !ItemId });
  const [
    deleteTaxRegion,
    { isLoading: deleteLoading, isSuccess: deleteSuccess, error: deleteError },
  ] = useDeleteTaxRegionMutation();

  useHandleNotifications({
    error: deleteError || dataLoadError,
    redirectPath: "/settings/tax-regions",
    isSuccess: deleteSuccess,
    successMessage: deleteSuccess ? "Tax-regions deleted successfully!" : "",
  });
  const result = data?.result;

  // const filteredCountries = result?.countries.filter(
  //   (country) => country?.name.toLowerCase().includes(searchQuery.toLowerCase())
  //   //   country?.isoCode.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const removeHandler = useCallback((id: string) => {
    setIsOpen(true);
    setDeletedId(id);
  }, []);

  const DeleteHandler = useCallback(async () => {
    if (deletedId) await deleteTaxRegion({ id: deletedId });
  }, [deleteTaxRegion, deletedId]);

  useEffect(() => {
    if (deleteSuccess) {
      setIsOpen(false);
      setDeletedId(null);
    }
  }, [deleteSuccess]);
  return (
    <div className="min-h-screen">
      {/* Header with breadcrumb */}
      <Header
        breadcrumbData={[
          { label: "Settings", path: "/settings" },
          { label: "Tax regions", path: "/settings/tax-regions" },
          {
            label: result?.country_code?.name || "Preview",
            path: "/settings/regions/preview",
          },
        ]}
      />
      {dataLoader ? (
        <ProductsSkeleton />
      ) : (
        <div className="min-h-screen">
          {/* Header */}
          <div className="pr-[2px]">
            <header className="border-b group border-border bg-card mx-auto max-w-7xl shadow-sm border bg-gray-50 border-gray-200 rounded-md">
              <div className="px-6 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 item-center ">
                    <ReactCountryFlag
                      countryCode={result?.country_code?.isoCode || ""}
                      svg
                      style={{ width: "1.7rem", height: "1.7rem" }}
                      title={result?.country_code?.isoCode}
                    />
                    <h1 className="text-xl font-bold text-foreground">
                      {capitalizeFirstLetter(result?.country_code?.name || "")}
                    </h1>
                  </div>
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
                    <DropdownMenuContent
                      align="end"
                      className="animate-in fade-in"
                    >
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/settings/tax-regions/${result?.id}/edit`
                          )
                        }
                      >
                        <Pencil className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={deletedId === result?.id}
                        className="text-destructive cursor-pointer"
                        onClick={() => result?.id && removeHandler(result.id!)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="flex items-center justify-between border-t-[1px] px-6 py-2">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Tax Administrator
                  </p>
                  <p className="text-lg font-semibold text-gray-800">
                    {result?.default_rate?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    Default Tax Rate
                  </p>
                  <p className="text-lg font-semibold text-gray-800">
                    {result?.default_rate?.rate || 0} %
                  </p>
                </div>
              </div>
            </header>
          </div>

          {/* Main Content */}
          <div className="mx-auto max-w-7xl px-6 py-8">
            <TaxRegions provinces={ItemId} isoCode={result?.country_code?.isoCode}/>

            {/* Overrides Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Overrides
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Set custom tax rates for specific scenarios
                  </p>
                </div>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Override
                </Button>
              </div>
              <NoRecordsCard />
            </div>

            {/* Tax Provider Section */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">
                Tax Provider
              </h2>
              {/* <Card className="border border-border p-6"> */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">System</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Using default system tax provider
                  </p>
                </div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              {/* </Card> */}
            </div>
          </div>
        </div>
      )}
      <AnimatePresence>
        {isOpen && (
          <AlertDialogComponenet
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Are you sure?"
            description="This action cannot be undone. This will permanently delete the tax region."
            action={DeleteHandler}
            type="danger"
            setDeletedId={setDeletedId}
            isLoading={deleteLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
export default memo(TaxRegionDetails);
