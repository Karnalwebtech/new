import { Header } from "@/modules/layout/header/header";
import Store from "@/modules/settings/store/store";
import React from "react";

const Page = () => {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Settings", path: "/settings" },
          { label: "Store", path: "/settings/store" },
        ]}
      />
      <Store />
    </>
  );
};

export default Page;
