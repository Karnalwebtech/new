import { siteName } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import RegionalSettings from "@/modules/settings/regions/regional-settings";
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
      <RegionalSettings ItemId={edit} />
    </>
  );
};

export default Page;
