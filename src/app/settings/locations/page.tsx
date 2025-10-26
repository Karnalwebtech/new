import { Header } from "@/modules/layout/header/header";
import Locations from "@/modules/settings/locations/locations";
import React from "react";

const Page = () => {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Settings", path: "/settings" },
          { label: "Locations & Shipping", path: "/settings/locations" },
        ]}
      />
      <Locations />
    </>
  );
};

export default Page;
