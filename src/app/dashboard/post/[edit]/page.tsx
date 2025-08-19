import { Header } from "@/modules/layout/header/header";
import UpdatePost from "@/modules/main/post/update-post";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update post",
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
          { label: "Post", path: "/dashboard/post" },
          { label: "Update post", path: "/dashboard/post" },
        ]}
      />
      <UpdatePost id={edit} />
    </>
  );
}
