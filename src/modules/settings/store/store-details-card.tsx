"use client";
import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const rows: { label: string; value: React.ReactNode }[] = [
  { label: "Name", value: "Medusa Store" },
  {
    label: "Default currency",
    value: (
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="uppercase">
          INR
        </Badge>
        <span>Indian Rupee</span>
      </div>
    ),
  },
  {
    label: "Default region",
    value: <Badge variant="secondary">India</Badge>,
  },
  {
    label: "Default sales channel",
    value: <Badge variant="secondary">Default Sales Channel</Badge>,
  },
  {
    label: "Default location",
    value: <Badge variant="secondary">Indian Warehouse</Badge>,
  },
];

export function StoreDetailsCard() {
  const router = useRouter();
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 justify-between ">
          <div>
            <CardTitle>Store</CardTitle>
            <CardDescription>Manage your store&apos;s details</CardDescription>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Table actions">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push("/settings/store/edit")}
                className="cursor-pointer p-[4px]"
              >
                <SquarePen className="h-4 w-4" /> Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div role="table" className="border-t">
          {rows.map((r) => (
            <div
              role="row"
              key={r.label}
              className="grid grid-cols-12 items-center border-b"
            >
              <div className="col-span-12 md:col-span-3 px-6 py-4 text-sm text-muted-foreground">
                {r.label}
              </div>
              <div className="col-span-12 md:col-span-9 px-6 py-4">
                {r.value}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
