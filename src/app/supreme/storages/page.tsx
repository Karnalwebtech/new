import { Header } from "@/modules/layout/header/header";
import CloudStorage from "@/modules/superme/storages/cloud-storage";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Cloud Storages",
    description: "Cloud Storages"
}
export default function Page() {
    return (
        <>
            <Header
                breadcrumbData={[
                    { label: "Dashboard", path: "/dashboard" },
                    { label: "Superme", path: "/dashboard/superme" },
                    { label: "Cloud storage", path: "/dashboard/supreme/storages" },
                ]}
            />
            <CloudStorage />
        </>
    )
}