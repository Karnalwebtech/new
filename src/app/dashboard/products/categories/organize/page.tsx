import { Header } from "@/modules/layout/header/header";
import Organize from "@/modules/main/products/categories/organze/organize";
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
