import React from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { FolderUp } from "lucide-react";

interface ExportDataProps<T extends Record<string, unknown>> {
  data: T[];
  isLoading: boolean;
  title?:string;
}

export const ExportData = <T extends Record<string, unknown>>({
  data, isLoading,title="Policy-holders"
}: ExportDataProps<T>) => {

  function getNestedKeys<T extends Record<string, unknown>>(obj: T[]): string[] {
    const keysSet = new Set<string>();
    const ignoredKeys = new Set(["_id", "no", "__v", "is_active", "createdAt", "updatedAt", "user"]);

    obj.forEach(item => {
      Object.entries(item).forEach(([key, value]) => {
        if (ignoredKeys.has(key)) return;

        if (key === "custom_fields" && value && typeof value === "object") {
          Object.keys(value).forEach(subkey => keysSet.add(`custom_field_${subkey}`));
        } else {
          keysSet.add(key);
        }
      });
    });

    return Array.from(keysSet);
  }

  function convertToCSV<T extends Record<string, unknown>>(
    obj: T[],
    getKeys: (obj: T[]) => string[]
  ): string {
    if (!obj.length) return ""; // Return empty string if no data

    const headers = getKeys(obj); // Extract headers dynamically
    const csvRows: string[] = [];
    const driveFields = new Set(["pan_card", "aadhaar_card", "profile_image", "document"]);

    // Add header row
    csvRows.push(headers.join(","));

    // Generate rows
    obj.forEach(item => {
      const row: string[] = headers.map(header => {
        if (header.startsWith("custom_field_") && "custom_fields" in item) {
          const subkey = header.replace("custom_field_", "");
          const value = (item.custom_fields as Record<string, unknown>)?.[subkey];

          return typeof value === "string" || typeof value === "number" ? String(value) : "";
        }

        if (driveFields.has(header)) {
          const fileField = item[header as keyof T] as { public_id?: string } | undefined;
          return fileField?.public_id
            ? `https://drive.google.com/uc?export=download&id=${fileField.public_id}`
            : "";
        }

        const value = item[header as keyof T];
        return typeof value === "string" || typeof value === "number" ? String(value) : "";
      });

      csvRows.push(row.join(",")); // Join row values with commas
    });

    return csvRows.join("\n"); // Join all rows with new lines
  }

  function downloadCSV<T extends Record<string, unknown>>(
    filteredItems: T[],
    getKeys: (obj: T[]) => string[],
    filename: string = "data.csv"
  ) {
    if (filteredItems.length === 0) {
      toast.error("No data to download")
      return;
    }

    const csvData = convertToCSV(filteredItems, getKeys);
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url); // Clean up
  }


  return (
    <Button
      size={"sm"}
      disabled={isLoading}
      onClick={() =>
        downloadCSV(
          data, // ✅ Converts to plain object
          getNestedKeys,
         `${title}.csv`
        )
      }
    >
      <FolderUp />
      Export
    </Button>
  );
};
