import { Header } from "@/modules/layout/header/header";
import React from "react";
import CreateLocation from "@/modules/settings/locations/edit/create-location";

const Page = () => {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Settings", path: "/settings" },
          { label: "Location", path: "/settings//ocations" },
          { label: "Create", path: "/settings/locations/create" },
        ]}
      />
      <CreateLocation />
    </>
  );
};

export default Page;
