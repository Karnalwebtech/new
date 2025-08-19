import { Header } from "@/modules/layout/header/header";
import PostEventsList from "@/modules/tracking-events/post-events-list";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Post event tracking details",
    description: "Post event tracking details",
};

export default function Page() {

    return (
        <>
            <Header
                breadcrumbData={[
                    { label: "Dashboard", path: "/dashboard" },
                    { label: "Tracking events details", path: `/dashboard/tracking-events` },
                    { label: `Tracking events post Events`, path: `/dashboard/tracking-events/post-events` },
                ]}
            />
            <PostEventsList />
        </>
    )
}