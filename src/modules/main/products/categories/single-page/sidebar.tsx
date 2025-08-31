import { SidebarSkeleton } from "@/components/skeletons/single-page-skeleton";
import { TruncateText } from "@/components/truncate-text";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductCategoryFormData } from "@/types/product-type";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import React from "react";
interface SidebarProps {
  result: ProductCategoryFormData;
}
const Sidebar = ({ result }: SidebarProps) => {
  return (
    <div className="w-80">
      {false ? (
        <SidebarSkeleton />
      ) : (
        <Card className="animate-in fade-in-50 slide-in-from-right-4 duration-700 delay-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Organize</CardTitle>
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
                <DropdownMenuItem>Reorder categories</DropdownMenuItem>
                <DropdownMenuItem>Manage hierarchy</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Path
                </label>
                <p className="text-sm font-medium">
                  {" "}
                  <TruncateText
                    text={result?.name || ""}
                    maxLength={20}
                    className="group-hover:text-primary transition-colors duration-200"
                  />{" "}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Children
                </label>
                {result?.children && result?.children.length > 0 ? (
                  result?.children.map(
                    (item: ProductCategoryFormData, i: number) => (
                      <p
                        key={i}
                        className="text-sm text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                      >
                        <Link
                          href={`/dashboard/products/categories/${item?.id}`}
                        >
                          <TruncateText
                            text={result?.name || ""}
                            maxLength={20}
                            className="group-hover:text-primary transition-colors duration-200"
                          />
                        </Link>
                      </p>
                    )
                  )
                ) : (
                  <p className="text-xs text-gray-600">
                    No children&apos;s found
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Sidebar;
