import { Header } from "@/modules/layout/header/header";
import StoreEdit from "@/modules/settings/store/edit/store-edit";
import React from "react";

const Page = () => {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Settings", path: "/settings" },
          { label: "Store", path: "/settings/store" },
          { label: "Edit", path: "/settings/store/edit" },
        ]}
      />
      <StoreEdit />
    </>
  );
};

export default Page;
