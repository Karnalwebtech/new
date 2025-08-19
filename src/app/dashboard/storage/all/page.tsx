import { Storages } from "@/modules/dashboard/storage/storages";
import { Header } from "@/modules/layout/header/header";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "All storage",
  description: "All storage",
};
export default function Page() {
  return (
    <>
      <Header
            breadcrumbData={[
              { label: "Dashboard", path: "/dashboard" },
              { label: "Storage", path: "/dashboard/storage" },
              { label: "View all", path: "/dashboard/storage/view-all" },
            ]}
          />
      <Storages />
    </>
  );
}
