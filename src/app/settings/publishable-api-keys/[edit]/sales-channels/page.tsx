import { siteName } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import PublishableApiSalesChanels from "@/modules/settings/publishable-api-keys/publishable-sales-channels/publishable-api-sales-chanels";
import React from "react";

export const metadata = buildMetadata({
  title: "Update region",
  description: "Update region",
  siteName: siteName,
});

const Page = async ({ params }: { params: Promise<{ edit: string }> }) => {
  const { edit } = await params;
  return (
    <>
      <PublishableApiSalesChanels pageId={edit} />
    </>
  );
};

export default Page;
