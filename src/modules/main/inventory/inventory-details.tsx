"use client";
import React, { memo, useMemo, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetInventoryDetailsQuery } from "@/state/inventory-api";
import ShadcnPagination from "@/components/pagination";
import { useRouter } from "next/navigation";

interface InventoryDetailsProps {
  ItemId?: string;
}
const InventoryDetails = ({ ItemId }: InventoryDetailsProps) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data, isLoading } = useGetInventoryDetailsQuery(
    { id: ItemId!, rowsPerPage: 1, page: currentPage },
    { skip: !ItemId }
  );
  const result = useMemo(() => {
    if (data && data.success) {
      return data.result;
    }
    return null;
  }, [data]);

  const reservations = [
    {
      sku: "ww",
      orderId: "-",
      description: "wwwwwwwwwwwwwwww",
      location: "-",
      created: "Sep 3, 2025 10:06 AM",
      quantity: 100,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-2">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main column: spans 2 on large screens */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader className="grid grid-cols-2 items-center">
              <div>
                <CardTitle>Inventory overview</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Totals across all locations
                </CardDescription>
              </div>
              <div className="">
                <h2 className="text-base text-muted-foreground font-semibold m-0 grid grid-cols-12">
                  <span className="col-span-2">Title :</span>{" "}
                  <span className="col-span-10">{result?.title}</span>{" "}
                </h2>
                <div className="text-xs text-muted-foreground font-semibold grid grid-cols-12">
                  <span className="col-span-2">Sku :</span>{" "}
                  <span className="col-span-10">{result?.sku}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-md bg-white shadow-sm">
                <p className="text-xs text-muted-foreground">In stock</p>
                <p className="text-lg font-semibold">
                  {result?.total_stocked_quantity || 0}{" "}
                  <span className="text-sm text-muted-foreground">
                    across {data?.total || 0} locations
                  </span>
                </p>
              </div>
              <div className="p-4 rounded-md bg-white shadow-sm">
                <p className="text-xs text-muted-foreground">Reserved</p>
                <p className="text-lg font-semibold">
                  {result?.total_reserved_quantity || 0}{" "}
                  <span className="text-sm text-muted-foreground">
                    across {data?.total || 0} locations
                  </span>
                </p>
              </div>
              <div className="p-4 rounded-md bg-white shadow-sm">
                <p className="text-xs text-muted-foreground">Available</p>
                <p className="text-lg font-semibold">
                  {(result?.total_stocked_quantity || 0) -
                    (result?.total_reserved_quantity || 0)}{" "}
                  <span className="text-sm text-muted-foreground">
                    across {data?.total || 0} locations
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Locations table */}
          <Card>
            <CardHeader>
              <CardTitle>Locations</CardTitle>
              <CardDescription>Manage stock per location</CardDescription>
            </CardHeader>
            <CardContent>
              {/* <div className="flex justify-end mb-4">
                <Button variant="outline">Manage locations</Button>
              </div> */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Location</TableHead>
                      <TableHead>Reserved</TableHead>
                      <TableHead>In stock</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result?.inventory_levels_preview?.map((l) => (
                      <TableRow key={l?.id || ""}>
                        <TableCell className="font-medium">
                          {l.location?.name || ""}
                        </TableCell>
                        <TableCell>{l.reserved_quantity || 0}</TableCell>
                        <TableCell>{l.stocked_quantity || 0}</TableCell>
                        <TableCell>
                          {(l.stocked_quantity || 0) -
                            (l.reserved_quantity || 0)}
                        </TableCell>
                        <TableCell className="text-right">
                          {" "}
                          <Button variant="ghost">...</Button>{" "}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="mt-4 text-sm text-muted-foreground">
                {data?.page || 0} — {data?.totalPages || 0} of{" "}
                {data?.total || 0} results
              </div>
              <div>
                {data && (data?.total || 0) > (data?.limit || 0) && (
                  <ShadcnPagination
                    currentPage={currentPage}
                    totalPages={data?.limit || 0}
                    setCurrentPage={setCurrentPage}
                    data_length={data?.total || 10}
                  />
                )}
              </div>
            </CardFooter>
          </Card>

          {/* Reservations */}
          <Card>
            <CardHeader>
              <CardTitle>Reservations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button variant="outline">Create</Button>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reservations.map((r, i) => (
                      <TableRow key={i}>
                        <TableCell>{r.sku}</TableCell>
                        <TableCell>{r.orderId}</TableCell>
                        <TableCell className="max-w-xl truncate">
                          {r.description}
                        </TableCell>
                        <TableCell>{r.location}</TableCell>
                        <TableCell>{r.created}</TableCell>
                        <TableCell className="text-right">
                          {r.quantity}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                1 — 1 of 1 results
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Attributes */}
        <div className="space-y-6">
          {/* Quick actions card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button
                variant="ghost"
                onClick={() =>
                  router.push(`/dashboard/inventory/${ItemId}/edit`)
                }
              >
                Edit item
              </Button>
              <Button variant="ghost">Adjust inventory</Button>
              <Button variant="ghost">Create reservation</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Attributes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <AttributeRow label="Height" value={result?.height || "-"} />
                <AttributeRow label="Width" value={result?.width || "-"} />
                <AttributeRow label="Length" value={result?.length || "-"} />
                <AttributeRow label="Weight" value={result?.weight || "-"} />
                <AttributeRow
                  label="MID code"
                  value={result?.mid_code || "-"}
                />
                <AttributeRow
                  label="Material"
                  value={result?.material || "-"}
                />
                <AttributeRow label="HS code" value={result?.hs_code || "-"} />
                <AttributeRow
                  label="Country of origin"
                  value={result?.country_info?.name || "-"}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

function AttributeRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-b-0">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
export default memo(InventoryDetails);
