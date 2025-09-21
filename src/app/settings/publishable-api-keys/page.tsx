import { Header } from "@/modules/layout/header/header";
import API_Keys from "@/modules/settings/api-keys/api-keys";
import React from "react";

const Page = () => {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Settings", path: "/settings" },
          { label: "Publishable API Keys", path: "/settings/publishable-api-keys" },
        ]}
      />
      <API_Keys type="publishable" />
    </>
  );
};

export default Page;
