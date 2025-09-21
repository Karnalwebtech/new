import { siteName } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { Header } from "@/modules/layout/header/header";
import Create_publishable_api_keys from "@/modules/settings/publishable-api-keys/edit/create-publishable-api-keys";
import React from "react";
export const metadata = buildMetadata({
  title: "Update region",
  description: "Update region",
  siteName: siteName,
});

const Page = async ({ params }: { params: Promise<{ edit: string }> }) => {
  const { edit } = await params; // 👈 await here
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Settings", path: "/settings" },
          {
            label: "Publishable API Key",
            path: "/settings/publishable-api-keys",
          },
          { label: "Edit", path: "/settings/publishable-api-keys/create" },
        ]}
      />
      <Create_publishable_api_keys ItemId={edit} />
    </>
  );
};

export default Page;
