"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { AlertDialogComponenet } from "@/components/alert-dialog";
import {
  useDeleteProductTypesMutation,
  useGetProductTypesDetailsQuery,
} from "@/state/product-types-api";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  MoreHorizontal,
  ChevronRight,
  Bell,
  Search,
  Filter,
  List,
  MoreVertical,
  ExternalLink,
} from "lucide-react";
import { useGetProductDetailsQuery } from "@/state/product-api";
interface ProductDetailsProps {
  ItemId: string;
}

const ProductDetails = ({ ItemId }: ProductDetailsProps) => {
  const [selectedImage, setSelectedImage] = useState(0);

  const productImages = [
    "/images/screencapture-localhost-9000-app-products-prod-01karga73nr6e02az9s90bvafx-2025-12-14-18-58-32.png",
    "/laptop-angled-view.jpg",
    "/laptop-keyboard-closeup.jpg",
  ];
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
  } = useGetProductDetailsQuery(
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-14 items-center gap-4 px-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Products</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">
              16" Ultra-Slim AI Laptop | 3K OLED | 11cm Thin | 6-Speaker Audio
            </span>
          </div>
          <div className="ml-auto">
            <Bell className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="mx-auto max-w-5xl space-y-6">
            {/* Product Title */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">{result?.title}</h1>
              <div className="flex items-center gap-3">
                <Badge
                  variant="secondary"
                  className="bg-emerald-500/10 text-emerald-600"
                >
                  Published
                </Badge>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Description Section */}
            <Card className="p-0">
              <div className="">
                <div className="p-4 border-b border-border">
                  <Label className="text-sm font-medium">Description</Label>
                  {result?.description}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-b border-border">
                  <div>
                    <span>Subtitle</span>
                  </div>
                  <div>
                    <span>{result?.subtitle ?? "-"}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-b border-border">
                  <div>
                    <span>Handle</span>
                  </div>
                  <div>
                    <span>/{result?.handle ?? "-"}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 m-0">
                  <div>
                    <span>Discountable</span>
                  </div>
                  <div>
                    <span>{result?.Discountable ? "true" : "false"}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Media Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Media</h2>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {productImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg border border-border bg-muted hover:border-primary"
                    onClick={() => setSelectedImage(idx)}
                  >
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`Product ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                    {idx === 0 && (
                      <div className="absolute left-2 top-2 rounded bg-primary px-2 py-1 text-xs text-primary-foreground">
                        1
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Options Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Options</h2>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Color</Label>
                  <div className="flex gap-2">
                    <Badge variant="outline">Blue</Badge>
                    <Badge variant="outline">Red</Badge>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Storage</Label>
                  <div className="flex gap-2">
                    <Badge variant="outline">256 GB</Badge>
                    <Badge variant="outline">512 GB</Badge>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Variants Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Variants</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input className="pl-9 pr-4 w-64" placeholder="Search" />
                  </div>
                  <Button variant="ghost" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <List className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                  <Button>Create</Button>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        SKU
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Color
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Storage
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Inventory
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Created
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Updated
                      </th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/50">
                      <td className="px-4 py-3 text-sm">256 GB / Blue</td>
                      <td className="px-4 py-3 text-sm">256-BLUE</td>
                      <td className="px-4 py-3 text-sm">Blue</td>
                      <td className="px-4 py-3 text-sm">256 GB</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        Not managed
                      </td>
                      <td className="px-4 py-3 text-sm">Nov 23, 2025</td>
                      <td className="px-4 py-3 text-sm">Nov 23, 2025</td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/50">
                      <td className="px-4 py-3 text-sm">512 GB / Red</td>
                      <td className="px-4 py-3 text-sm">512-RED</td>
                      <td className="px-4 py-3 text-sm">Red</td>
                      <td className="px-4 py-3 text-sm">512 GB</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        Not managed
                      </td>
                      <td className="px-4 py-3 text-sm">Nov 23, 2025</td>
                      <td className="px-4 py-3 text-sm">Nov 23, 2025</td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/50">
                      <td className="px-4 py-3 text-sm">test</td>
                      <td className="px-4 py-3 text-sm">SHIRT-S-BLACK</td>
                      <td className="px-4 py-3 text-sm">Blue</td>
                      <td className="px-4 py-3 text-sm">512 GB</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        Not managed
                      </td>
                      <td className="px-4 py-3 text-sm">Dec 11, 2025</td>
                      <td className="px-4 py-3 text-sm">Dec 11, 2025</td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="text-muted-foreground">1 — 3 of 3 results</div>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">1 of 1 pages</span>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" disabled>
                      Prev
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Metadata & JSON */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Metadata</h2>
                  <p className="text-sm text-muted-foreground">0 keys</p>
                </div>
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">JSON</h2>
                  <p className="text-sm text-muted-foreground">31 keys</p>
                </div>
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="w-80 border-l border-border bg-card p-6">
          <div className="space-y-6">
            {/* Sales Channels */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Sales Channels</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Default Sales Channel</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Available in <span className="font-medium">1</span> of{" "}
                  <span className="font-medium">1</span> sales channels
                </p>
              </div>
            </Card>

            {/* Shipping configuration */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Shipping configuration</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            {/* Organize */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Organize</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Tags</Label>
                  <div className="mt-1 text-sm">-</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Type</Label>
                  <div className="mt-1 text-sm">-</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Collection
                  </Label>
                  <div className="mt-1 text-sm">Featured</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Categories
                  </Label>
                  <div className="mt-1 text-sm">Laptops</div>
                </div>
              </div>
            </Card>

            {/* Attributes */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Attributes</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-xs text-muted-foreground">
                    Height
                  </Label>
                  <span className="text-sm">-</span>
                </div>
                <div className="flex justify-between">
                  <Label className="text-xs text-muted-foreground">Width</Label>
                  <span className="text-sm">-</span>
                </div>
                <div className="flex justify-between">
                  <Label className="text-xs text-muted-foreground">
                    Length
                  </Label>
                  <span className="text-sm">-</span>
                </div>
                <div className="flex justify-between">
                  <Label className="text-xs text-muted-foreground">
                    Weight
                  </Label>
                  <span className="text-sm">400</span>
                </div>
                <div className="flex justify-between">
                  <Label className="text-xs text-muted-foreground">
                    MID code
                  </Label>
                  <span className="text-sm">-</span>
                </div>
                <div className="flex justify-between">
                  <Label className="text-xs text-muted-foreground">
                    HS code
                  </Label>
                  <span className="text-sm">-</span>
                </div>
                <div className="flex justify-between">
                  <Label className="text-xs text-muted-foreground">
                    Country of origin
                  </Label>
                  <span className="text-sm">-</span>
                </div>
              </div>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default memo(ProductDetails);
