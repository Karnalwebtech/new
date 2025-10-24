import { Header } from "@/modules/layout/header/header";
import CreateReturnReasons from "@/modules/settings/return-reasons/edit/create-return-reasons";
import React from "react";

const Page = () => {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Settings", path: "/settings" },
          { label: "Return reasons", path: "/settings/return-reasons" },
          { label: "Create", path: "/settings/return-reasons/create" },
        ]}
      />
      <CreateReturnReasons />
    </>
  );
};

export default Page;
