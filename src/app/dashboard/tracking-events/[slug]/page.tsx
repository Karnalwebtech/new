import { Header } from "@/modules/layout/header/header";
import EventTrackingList from "@/modules/tracking-events/event-tracking-list";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "Post event tracking details",
    description: "Post event tracking details",
};

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const paths = ["share", "download"]
    const { slug } = await params;
    if (!paths.includes(slug)) {
        notFound();
    }
    return (
        <>
            <Header
                breadcrumbData={[
                    { label: "Dashboard", path: "/dashboard" },
                    { label: "Tracking events details", path: `/dashboard/tracking-events` },
                    { label: `Tracking events ${slug} details`, path: `/dashboard/tracking-events/${slug}` },
                ]}
            />
            <EventTrackingList type={slug} />
        </>
    )
}