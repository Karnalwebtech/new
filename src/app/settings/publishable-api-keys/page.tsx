import { Header } from "@/modules/layout/header/header";
import Publishable_API_Keys from "@/modules/settings/publishable-api-keys/publishable-api-keys";
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
      <Publishable_API_Keys />
    </>
  );
};

export default Page;
