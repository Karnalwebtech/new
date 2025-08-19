"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CheckListSkeleton from "../skeletons/list-skeleton";
import { ListResult } from "@/types/list-type";

interface ListProps {
  className?: string;
  selectedList: string[];
  handleCategoryChange: (id: string) => void;
  result: ListResult[];
  isLoading: boolean;
  title:string;
}

export default function List({
  className = "",selectedList,
  handleCategoryChange,
  result,
  title,
  isLoading = false,
}: ListProps) {

  return (
    <Card className={`shadow-md ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {selectedList.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {selectedList.length} selected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-[4px]">
        <ScrollArea className="h-[250px]">
          <div className="space-y-1">
            {isLoading ? (
              <CheckListSkeleton />
            ) : result?.length === 0 ? (
              <p>Record not found</p>
            ) : (
              result.map((category) => (
                <div
                  key={category?._id}
                  className={`flex items-center space-x-3 rounded-md px-3 py-2 transition-colors hover:bg-muted ${
                    selectedList.includes(category?._id) ? "bg-muted" : ""
                  }`}
                >
                  <Checkbox
                    id={category._id}
                    checked={selectedList.includes(category?._id)}
                    onCheckedChange={() => handleCategoryChange(category._id)}
                    className="data-[state=checked]:bg-primary"
                  />
                  <Label
                    htmlFor={category?._id}
                    className="flex-1 text-sm cursor-pointer"
                  >
                    {category?.title}
                  </Label>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
