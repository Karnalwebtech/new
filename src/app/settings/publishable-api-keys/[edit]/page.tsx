import { siteName } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import ApiKeysDetails from "@/modules/settings/api-keys/api-key-details/api-keys-details";
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
      <ApiKeysDetails type="publishable" ItemId={edit}/>
    </>
  );
};

export default Page;
