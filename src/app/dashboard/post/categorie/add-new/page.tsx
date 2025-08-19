import AddNewPostCategorie from "@/modules/main/categorie/add-new-categorie";
import { Header } from "@/modules/layout/header/header";
import { Metadata } from "next";
export const metadata:Metadata ={
  title:"Add new post categories"
}
const Page = () => {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Categorie", path: "/dashboard/post/categorie" },
          { label: "Add new categorie", path: "/dashboard/post/categorie" },
        ]}
      />
      <AddNewPostCategorie />
    </>

  );
};

export default Page;