"use client";

import { memo, useState } from "react";
import { Search, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useGetRegionDetailsQuery } from "@/state/regions-api";
import { Header } from "@/modules/layout/header/header";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import { ProductsSkeleton } from "@/components/skeletons/single-page-skeleton";
interface RegionalSettingsProps {
  ItemId: string;
}
const RegionalSettings = ({ ItemId }: RegionalSettingsProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data,
    isLoading: dataLoader,
    error: dataLoadError,
  } = useGetRegionDetailsQuery({ id: ItemId as string }, { skip: !ItemId });

  useHandleNotifications({
    error: dataLoadError,
  });
  const result = data?.result;

  const filteredCountries = result?.countries.filter(
    (country) => country?.name.toLowerCase().includes(searchQuery.toLowerCase())
    //   country?.isoCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
        <h1>Pending</h1>
      {/* Header with breadcrumb */}
      <Header
        breadcrumbData={[
          { label: "Settings", path: "/settings" },
          { label: "Regions", path: "/settings/regions" },
          {
            label: result?.name || "Preview",
            path: "/settings/regions/preview",
          },
        ]}
      />
      {dataLoader ? (
        <ProductsSkeleton />
      ) : (
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Main content */}
          <div className="space-y-8">
            {/* Region Details Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold">
                  {result?.name}
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Currency */}
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-sm font-medium text-muted-foreground">
                    Currency
                  </span>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="secondary"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {result?.currency?.code}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {result?.currency?.name}
                    </span>
                  </div>
                </div>

                {/* Automatic Taxes */}
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-sm font-medium text-muted-foreground">
                    Automatic Taxes
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    {result?.automatic_taxes ? "True" : "False"}
                  </Badge>
                </div>

                {/* Tax Inclusive Pricing */}
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-sm font-medium text-muted-foreground">
                    Tax Inclusive pricing
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    {result?.includes_tax ? "True" : "False"}
                  </Badge>
                </div>

                {/* Payment Providers */}
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    Payment Providers
                  </span>
                  <span className="text-sm text-muted-foreground">-</span>
                </div>
              </CardContent>
            </Card>

            {/* Countries Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  Countries
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {/* Search */}
                <div className="flex items-center space-x-2 mb-6">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                {/* Countries Table */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-medium">Name</TableHead>
                        <TableHead className="font-medium">Code</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCountries?.map((country, index) => (
                        <TableRow key={index} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            {country.name}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {country.isoCode}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
export default memo(RegionalSettings);
