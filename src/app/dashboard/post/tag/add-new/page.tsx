import { Header } from "@/modules/layout/header/header";
import AddNewTag from "@/modules/main/tag/add-new-tag";
import { Metadata } from "next";
export const metadata:Metadata ={
  title:"Add new post tag"
}
const Page = () => {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Tag", path: "/dashboard/post/tag" },
          { label: "Add new tag", path: "/dashboard/post/tag" },
        ]}
      />
      <AddNewTag />
    </>

  );
};

export default Page;