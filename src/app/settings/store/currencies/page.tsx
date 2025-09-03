import { siteName } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { Header } from "@/modules/layout/header/header";
import Currencies from "@/modules/settings/store/currencies/currencies";
import React from "react";
export const metadata = buildMetadata({
  title: "Add new Currencies",
  description: "Add new Currencies",
  siteName: siteName,
});
const Page = () => {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Settings", path: "/settings" },
          { label: "Store", path: "/settings/store" },
          { label: "Currencies", path: "/settings/currencies" },
        ]}
      />
      <Currencies />
    </>
  );
};

export default Page;
