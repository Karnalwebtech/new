import { Header } from "@/modules/layout/header/header";
import React from "react";
import ProductTypes from "../../../modules/settings/product-types/product-types";

const Page = () => {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Settings", path: "/settings" },
          { label: "Product Type", path: "/settings/product-types" },
        ]}
      />
      <ProductTypes />
    </>
  );
};

export default Page;
