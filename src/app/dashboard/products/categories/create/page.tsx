import { Header } from "@/modules/layout/header/header";
import ProductCategoryForm from "@/modules/main/products/categories/create/category-create";
import React from "react";

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
