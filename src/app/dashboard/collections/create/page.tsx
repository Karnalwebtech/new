import { siteName } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { Header } from "@/modules/layout/header/header";
import CollectionForm from "@/modules/main/collections/create/collection-create";
import React from "react";
export const metadata = buildMetadata({
  title: "Add new product Category",
  description: "Add new product Category",
  siteName: siteName,
});

const Page = () => {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Collections", path: "/dashboard/collections" },
          {
            label: "Create Collections",
            path: "/dashboard/collections/create",
          },
        ]}
      />
      <CollectionForm />
    </>
  );
};

export default Page;
