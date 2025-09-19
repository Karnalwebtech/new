import { Header } from "@/modules/layout/header/header";
import React from "react";
import ProductTag from "@/modules/settings/product-tag/product-tag";

const Page = () => {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Settings", path: "/settings" },
          { label: "Product Tag", path: "/settings/product-tags" },
        ]}
      />
      <ProductTag />
    </>
  );
};

export default Page;
