import { Header } from "@/modules/layout/header/header";
import CreateProductTag from "@/modules/settings/product-tag/edit/create-product-tag";
import React from "react";

const Page = () => {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Settings", path: "/settings" },
          { label: "Product tag", path: "/settings/product-tags" },
          { label: "Create", path: "/settings/product-tags/create" },
        ]}
      />
      <CreateProductTag />
    </>
  );
};

export default Page;
