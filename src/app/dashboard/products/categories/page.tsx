import { Header } from "@/modules/layout/header/header";
import Categories from "@/modules/main/products/categories/categories";
import React from "react";

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
