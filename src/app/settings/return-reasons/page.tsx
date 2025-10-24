import { Header } from "@/modules/layout/header/header";
import ReturnReasons from "@/modules/settings/return-reasons/return-reasons";
import React from "react";

const Page = () => {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Settings", path: "/settings" },
          { label: "Return reasons", path: "/settings/return-reasons" },
        ]}
      />
      <ReturnReasons />
    </>
  );
};

export default Page;
