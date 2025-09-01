import { siteName } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { Header } from "@/modules/layout/header/header";
import Collection from "@/modules/main/collections/collection";
import React from "react";
export const metadata = buildMetadata({
  title: "Collections",
  description: "Collections",
  siteName: siteName,
});
const Page = () => {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Collections", path: "/dashboard/collections" },
        ]}
      />
      <Collection />
    </>
  );
};

export default Page;
