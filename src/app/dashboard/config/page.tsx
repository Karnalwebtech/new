import Config from "@/modules/config/config";
import { Header } from "@/modules/layout/header/header";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Site config",
  description: "Site config",
};

const Page = () => {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Config", path: "/dashboard/config" },
        ]}
      />

      <Config />
    </>
  );
};

export default Page;
