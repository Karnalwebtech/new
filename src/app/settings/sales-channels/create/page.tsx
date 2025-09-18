import { Header } from "@/modules/layout/header/header";
import CreateSalesChannels from "@/modules/settings/sales-channels/edit/create-sales-channels";
import React from "react";

const Page = () => {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Settings", path: "/settings" },
          { label: "Sales Channels", path: "/settings/sales-channels" },
          { label: "Create", path: "/settings/sales-channels/create" },
        ]}
      />
      <CreateSalesChannels />
    </>
  );
};

export default Page;
