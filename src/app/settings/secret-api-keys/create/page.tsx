import { Header } from "@/modules/layout/header/header";
import Create_api_keys from "@/modules/settings/api-keys/edit/create-api-keys";
import React from "react";

const Page = () => {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Settings", path: "/settings" },
          { label: "Secret Api Keys", path: "/settings/secret-api-keys" },
          { label: "Create", path: "/settings/secret-api-keys/create" },
        ]}
      />
      <Create_api_keys type="secret"/>
    </>
  );
};

export default Page;
