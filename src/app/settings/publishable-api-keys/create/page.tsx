import { Header } from "@/modules/layout/header/header";
import Create_publishable_api_keys from "@/modules/settings/publishable-api-keys/edit/create-publishable-api-keys";
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
      <Create_publishable_api_keys />
    </>
  );
};

export default Page;
