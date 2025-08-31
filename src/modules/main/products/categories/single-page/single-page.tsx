"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, Filter, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetSingleQuery } from "@/state/product-category-api";
import { Skeleton } from "@/components/ui/skeleton"; // ⬅️ add this
import { ProductCategoryFormData } from "@/types/product-type";
import LazyImage from "@/components/LazyImage";
import { siteName } from "@/config";
import { useRouter } from "next/navigation";
import {
  HeaderSkeleton,
  ProductsSkeleton,
  SidebarSkeleton,
} from "@/components/skeletons/single-page-skeleton";
import Sidebar from "./sidebar";

interface SingleProductCategoryPageProps {
  catId: string;
}

const SingleProductCategoryPage = ({
  catId,
}: SingleProductCategoryPageProps) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const { data, isLoading } = useGetSingleQuery({ id: catId });
  const router = useRouter();
  const result = (data?.result as ProductCategoryFormData) || undefined;

  const products = [
    {
      id: "1",
      name: '16" Ultra-Slim AI Laptop',
      image: "/modern-laptop-workspace.png",
      collection: "Featured",
      salesChannel: "Default Sales Channel",
      variants: "2 variants",
      status: "Published",
    },
    {
      id: "2",
      name: "testi",
      image: "/test-product.png",
      collection: "Featured",
      salesChannel: "Default Sales Channel",
      variants: "1 variant",
      status: "Published",
    },
  ];

  const toggleProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleAll = () => {
    setSelectedProducts((prev) =>
      prev.length === products.length ? [] : products.map((p) => p.id)
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex gap-6 p-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Category Header */}
          {isLoading ? (
            <HeaderSkeleton />
          ) : (
            <Card className="animate-in fade-in-50 slide-in-from-bottom-4 duration-700 p-0 m-0">
              <CardHeader className="flex flex-row items-center justify-between p-0 ">
                <CardTitle className="text-2xl">
                  <div className="flex gap-4 items-center p-4">
                    <div className="w-[70px]">
                      <LazyImage
                        src={result?.thumbnail?.public_id || ""}
                        alt={result?.thumbnail?.altText ?? siteName ?? ""}
                        style="rounded-full w-[40px] h-[40px] shadow-sm"
                      />
                    </div>
                    <span>{result?.name}</span>
                  </div>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={` ${
                      result?.status === "active"
                        ? "text-white bg-green-500 hover:bg-green-400 "
                        : "text-white bg-black hover:bg-gray-700 "
                    } transition-colors capitalize`}
                  >
                    {result?.status}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={` ${
                      result?.visibility === "publish"
                        ? "text-white bg-green-500 hover:bg-green-400"
                        : "text-white bg-black hover:bg-gray-700 "
                    } transition-colors capitalize`}
                  >
                    {result?.visibility}
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-accent transition-colors"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="animate-in fade-in-0 zoom-in-95 duration-200"
                    >
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(
                            `/dashboard/products/categories/${result?.id}/edit`
                          )
                        }
                      >
                        Edit category
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-0">
                <div className="grid grid-cols-1 gap-4">
                  <div className="border-t-2 p-4 pb-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Description
                    </label>
                    <p className="text-sm">
                      {result?.description ? result?.description : "-"}
                    </p>
                  </div>
                  <div className="border-t-2 p-4">
                    <label className="text-sm font-medium text-muted-foreground">
                      Handle
                    </label>
                    <p className="text-sm text-blue-600 hover:text-blue-800 transition-colors cursor-pointer">
                      /{result?.handle}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Products Section */}
          {isLoading ? (
            <ProductsSkeleton rows={5} />
          ) : (
            <Card className="animate-in fade-in-50 slide-in-from-bottom-4 duration-700 delay-150">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Products</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-accent transition-colors"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="animate-in fade-in-0 zoom-in-95 duration-200"
                  >
                    <DropdownMenuItem>Export products</DropdownMenuItem>
                    <DropdownMenuItem>Import products</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-accent transition-all duration-200 hover:scale-105 bg-transparent"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Add filter
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-muted/50 transition-colors">
                        <TableHead className="w-12">
                          <Checkbox
                            checked={
                              selectedProducts.length === products.length
                            }
                            onCheckedChange={toggleAll}
                            className="transition-all duration-200"
                          />
                        </TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Collection</TableHead>
                        <TableHead>Sales Channels</TableHead>
                        <TableHead>Variants</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product, index) => (
                        <TableRow
                          key={product.id}
                          className="hover:bg-muted/50 transition-all duration-200 animate-in fade-in-0 slide-in-from-left-4"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedProducts.includes(product.id)}
                              onCheckedChange={() => toggleProduct(product.id)}
                              className="transition-all duration-200"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                className="w-10 h-10 rounded border object-cover hover:scale-110 transition-transform duration-200"
                              />
                              <span className="font-medium hover:text-blue-600 transition-colors cursor-pointer">
                                {product.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer">
                              {product.collection}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {product.salesChannel}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {product.variants}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                            >
                              {product.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                  <span>1 — 2 of 2 results</span>
                  <div className="flex items-center gap-2">
                    <span>1 of 1 pages</span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="opacity-50 bg-transparent"
                    >
                      Prev
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="opacity-50 bg-transparent"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metadata Section */}
          {isLoading ? (
            <Card className="animate-in fade-in-50 slide-in-from-bottom-4 duration-700 delay-300">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-5 w-12 rounded-full" />
                </div>
                <Skeleton className="h-8 w-8 rounded-md" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ) : (
            <Card className="animate-in fade-in-50 slide-in-from-bottom-4 duration-700 delay-300">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle>Metadata</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    0 keys
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-accent transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </CardHeader>
            </Card>
          )}
        </div>
        {isLoading ? <SidebarSkeleton /> : <Sidebar result={result} />}
      </div>
    </div>
  );
};

export default SingleProductCategoryPage;
