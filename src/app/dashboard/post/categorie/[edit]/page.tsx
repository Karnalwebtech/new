import UpdateCategorie from "@/modules/main/categorie/update-categorie";
import { Header } from "@/modules/layout/header/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update Categorie",
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
          { label: "Categorie", path: "/dashboard/post/categorie" },
          { label: "Update categorie", path: "/dashboard/post/categorie" },
        ]}
      />
      <UpdateCategorie id={edit} />
    </>
  );
}
