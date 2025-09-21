import { siteName } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { Header } from "@/modules/layout/header/header";
import Create_api_keys from "@/modules/settings/api-keys/edit/create-api-keys";
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
            label: "Secret API Key",
            path: "/settings/secret-api-keys",
          },
          { label: "Edit", path: "/settings/secret-api-keys/create" },
        ]}
      />
      <Create_api_keys type={"secret"} ItemId={edit} />
    </>
  );
};

export default Page;
