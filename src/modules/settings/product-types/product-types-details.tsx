"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/modules/layout/header/header";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import { ProductsSkeleton } from "@/components/skeletons/single-page-skeleton";
import { Products } from "@/modules/main/products/products";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { AlertDialogComponenet } from "@/components/alert-dialog";
import { useDeleteProductTypesMutation, useGetProductTypesDetailsQuery } from "@/state/product-types-api";

interface ProductTypesDetailsProps {
  ItemId: string;
}

const ProductTypesDetails = ({ ItemId }: ProductTypesDetailsProps) => {
  const [deletedId, setDeletedId] = useState<string | null>(null);
  const router = useRouter();

  const [
    deleteProductTypes,
    { isLoading: deleteLoading, isSuccess: deleteSuccess, error },
  ] = useDeleteProductTypesMutation();

  const {
    data,
    isLoading: dataLoader,
    error: dataLoadError,
  } = useGetProductTypesDetailsQuery(
    { id: ItemId as string },
    { skip: !ItemId || ItemId === deletedId }
  );

  const result = data?.result;

  // Notifications
  useHandleNotifications({
    error: dataLoadError || error,
    isSuccess: deleteSuccess,
    successMessage: "Product types deleted successfully!",
    redirectPath: "/settings/product-types",
  });

  // Breadcrumbs memoized
  const breadcrumbData = useMemo(
    () => [
      { label: "Settings", path: "/settings" },
      { label: "Product Types", path: "/settings/product-types" },
      {
        label: result?.name || "Preview",
        path: `/settings/product-types/${result?.id}`,
      },
    ],
    [result?.name, result?.id]
  );

  // Handlers
  const deleteHandler = useCallback(async () => {
    if (deletedId) {
      await deleteProductTypes({ id: deletedId });
      setDeletedId(null);
    }
  }, [deleteProductTypes, deletedId]);

  const removeHandler = useCallback((id: string) => {
    setDeletedId(id);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header with breadcrumb */}
      <Header breadcrumbData={breadcrumbData} />

      {dataLoader ? (
        <ProductsSkeleton />
      ) : (
        <div className="mt-4 p-2">
          <div className="p-2 rounded-xl border">
            <div className="flex flex-row items-center justify-between">
              <div className="text-xl font-semibold">{result?.name}</div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Table actions"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(`/settings/product-types/${result?.id}/edit`)
                    }
                  >
                    <Pencil className="h-4 w-4 mr-2" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive cursor-pointer"
                    onClick={() => removeHandler(result?._id || "")}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      )}

      <Products />

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deletedId && (
          <AlertDialogComponenet
            isOpen={!!deletedId}
            setIsOpen={() => setDeletedId(null)}
            title="Are you sure?"
            description="This action cannot be undone. This will permanently delete the category."
            action={deleteHandler}
            type="danger"
            setDeletedId={setDeletedId}
            isLoading={deleteLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(ProductTypesDetails);
