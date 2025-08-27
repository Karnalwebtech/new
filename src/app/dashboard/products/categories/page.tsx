import { siteName } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { Header } from "@/modules/layout/header/header";
import Categories from "@/modules/main/products/categories/categories";
import React from "react";
export const metadata = buildMetadata({
  title: "Product Categories",
  description: "Product Categories",
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
        ]}
      />
      <Categories />
    </>
  );
};

export default Page;
