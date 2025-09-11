import { Header } from "@/modules/layout/header/header";
import Regions from "@/modules/settings/regions/regions";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Regions",
  description: "Regions",
};
const Page = () => {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Settings", path: "/settings" },
          { label: "Regions", path: "/settings/regions" },
        ]}
      />
      <Regions />
    </>
  );
};

export default Page;
