"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  MoreHorizontal,
  Plus,
  Download,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Mock product data
const products = [
  {
    id: 1,
    name: '16" Ultra-Slim AI Laptop | 3K OLED',
    icon: "💻",
    collection: "Featured",
    salesChannel: "Default Sales Channel",
    variants: 2,
    status: "Published",
  },
  {
    id: 2,
    name: "1080p HD Pro Webcam | Superior Quality",
    icon: "📹",
    collection: "",
    salesChannel: "Default Sales Channel",
    variants: 2,
    status: "Published",
  },
  {
    id: 3,
    name: '6.5" Ultra HD Smartphone | 3x Zoom',
    icon: "📱",
    collection: "Featured",
    salesChannel: "Default Sales Channel",
    variants: 2,
    status: "Published",
  },
  {
    id: 4,
    name: '34" QD-OLED Curved Gaming Monitor',
    icon: "🖥️",
    collection: "Featured",
    salesChannel: "Default Sales Channel",
    variants: 2,
    status: "Published",
  },
  {
    id: 5,
    name: "Hi-Fi Gaming Headset | Pro-Grade Audio",
    icon: "🎧",
    collection: "Featured",
    salesChannel: "Default Sales Channel",
    variants: 2,
    status: "Published",
  },
  {
    id: 6,
    name: "Wireless Keyboard | Touch ID | Numeric",
    icon: "⌨️",
    collection: "",
    salesChannel: "Default Sales Channel",
    variants: 2,
    status: "Published",
  },
  {
    id: 7,
    name: "Wireless Rechargeable Mouse | Ergonomic",
    icon: "🖱️",
    collection: "",
    salesChannel: "Default Sales Channel",
    variants: 2,
    status: "Published",
  },
  {
    id: 8,
    name: "Conference Speaker | High-Performance",
    icon: "🔊",
    collection: "",
    salesChannel: "Default Sales Channel",
    variants: 2,
    status: "Published",
  },
  {
    id: 9,
    name: "test",
    icon: "📦",
    collection: "Featured",
    salesChannel: "Default Sales Channel",
    variants: 1,
    status: "Published",
  },
];

export const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Products</h1>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto bg-transparent"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto bg-transparent"
            >
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => router.push("/dashboard/products/create")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto bg-transparent"
          >
            <Filter className="mr-2 h-4 w-4" />
            Add filter
          </Button>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Responsive Table View */}
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[250px] sm:w-[300px]">
                    Product
                  </TableHead>
                  <TableHead className="min-w-[100px] sm:w-[120px]">
                    Collection
                  </TableHead>
                  <TableHead className="min-w-[180px] sm:w-[200px]">
                    Sales Channels
                  </TableHead>
                  <TableHead className="min-w-[80px] sm:w-[100px]">
                    Variants
                  </TableHead>
                  <TableHead className="min-w-[80px] sm:w-[100px]">
                    Status
                  </TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="text-lg sm:text-xl flex-shrink-0">
                          {product.icon}
                        </div>
                        <div className="font-medium text-sm sm:text-base leading-tight">
                          {product.name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.collection && (
                        <Badge variant="secondary" className="text-xs">
                          {product.collection}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {product.salesChannel}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {product.variants} variant
                      {product.variants !== 1 ? "s" : ""}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800 hover:bg-green-100 text-xs"
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
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
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">
            1 — {filteredProducts.length} of {filteredProducts.length} results
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">1 of 1 pages</span>
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
      </div>
    </div>
  );
};
