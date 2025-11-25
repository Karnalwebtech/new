import { Header } from "@/modules/layout/header/header";
import Regions from "@/modules/settings/regions/regions";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Regions",
  description:
    "A region is an area that you sell products in. It can cover multiple countries, and has different tax rates, providers, and currency.",
  openGraph: {
    title: "Regions",
    description:
      "A region is an area that you sell products in. It can cover multiple countries, and has different tax rates, providers, and currency.",
  },
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
