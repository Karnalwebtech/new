import { Header } from "@/modules/layout/header/header";
import Inventory from "@/modules/main/inventory/inventory";
import React from "react";

const Page = () => {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Blog post", path: "/dashboard/post" },
        ]}
      />
      <Inventory/>
    </>
  );
};

export default Page;
