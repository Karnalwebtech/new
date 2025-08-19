import CategorieList from "@/modules/main/categorie/categorie-list";
import { Header } from "@/modules/layout/header/header";
import { Metadata } from "next";
export const metadata:Metadata ={
    title:"Post categories list"
}
export default function Page() {
    return (
        <>
            <Header
                breadcrumbData={[
                    { label: "Dashboard", path: "/dashboard" },
                    { label: "Categorie", path: "/dashboard/post/categorie" },
                ]}
            />
            <CategorieList />
        </>
    );
};
