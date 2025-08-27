import { siteName } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { Header } from "@/modules/layout/header/header";
import ProductCategoryForm from "@/modules/main/products/categories/create/category-create";
import React from "react";
export const metadata = buildMetadata({
  title: "Add new product Category",
  description: "Add new product Category",
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
            label: "Create category",
            path: "/dashboard/products/categories/create",
          },
        ]}
      />
      <ProductCategoryForm />
    </>
  );
};

export default Page;
