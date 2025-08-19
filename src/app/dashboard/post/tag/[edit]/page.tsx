import { Header } from "@/modules/layout/header/header";
import UpdateTag from "@/modules/main/tag/update-tag";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update Tag",
};

export default async function Page({
  params,
}: {
  params: Promise<{ edit: string }>;
}) {
  const { edit } = await params;

  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Tag", path: "/dashboard/post/tag" },
          { label: "Update tag", path: "/dashboard/post/tag" },
        ]}
      />
      <UpdateTag id={edit} />
    </>
  );
}
