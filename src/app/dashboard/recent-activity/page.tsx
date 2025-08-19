import { Header } from "@/modules/layout/header/header"
import type { Metadata } from "next"
import RecentActivityList from "@/modules/main/recent-activity/recent-activity"
export const metadata: Metadata = {
    title: "Recent activity",
    description: "Recent activitys",
}

export default function Page() {
    return (
        <>
            <Header
                breadcrumbData={[
                    { label: "Dashboard", path: "/dashboard" },
                    { label: "Recent activity", path: "/dashboard/activity" },
                ]}
            />
            <RecentActivityList />
        </>
    )
}