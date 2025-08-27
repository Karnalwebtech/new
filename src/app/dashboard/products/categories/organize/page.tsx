import { siteName } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { Header } from "@/modules/layout/header/header";
import Organize from "@/modules/main/products/categories/organze/organize";
import React from "react";
export const metadata = buildMetadata({
  title: "Organize categories ranking",
  description: "Organize categories ranking",
  siteName: siteName,
});
const Page = () => {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Products", path: "/dashboard/products" },
          { label: "Categories", path: "/dashboard/products/categories" },
          {
            label: "Organize",
            path: "/dashboard/products/categories/organize",
          },
        ]}
      />
      <Organize />
    </>
  );
};

export default Page;
