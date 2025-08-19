import { Header } from "@/modules/layout/header/header";
import TagList from "@/modules/main/tag/tag-list";
import { Metadata } from "next";
export const metadata:Metadata ={
    title:"Post tag list"
}
export default function Page() {
    return (
        <>
            <Header
                breadcrumbData={[
                    { label: "Dashboard", path: "/dashboard" },
                    { label: "Tag", path: "/dashboard/post/tag" },
                ]}
            />
            <TagList />
        </>
    );
};
