import { Header } from "@/modules/layout/header/header";
import CreateProductType from "@/modules/settings/product-types/edit/create-product-type";
import React from "react";

const Page = () => {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Settings", path: "/settings" },
          { label: "Product type", path: "/settings/product-types" },
          { label: "Create", path: "/settings/product-types/create" },
        ]}
      />
      <CreateProductType />
    </>
  );
};

export default Page;
