import { Header } from "@/modules/layout/header/header";
import SalesChannels from "@/modules/settings/sales-channels/sales-channels";
import React from "react";

const Page = () => {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Settings", path: "/settings" },
          { label: "Sales Channels", path: "/settings/sales-channels" },
        ]}
      />
      <SalesChannels />
    </>
  );
};

export default Page;
