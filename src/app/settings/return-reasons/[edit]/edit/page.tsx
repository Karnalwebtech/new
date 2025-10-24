import { siteName } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { Header } from "@/modules/layout/header/header";
import CreateReturnReasons from "@/modules/settings/return-reasons/edit/create-return-reasons";
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
          { label: "Return reasons", path: "/settings/return-reasons" },
          { label: "Update", path: "/settings/return-reasons/edit" },
        ]}
      />
      <CreateReturnReasons ItemId={edit} />
    </>
  );
};

export default Page;
