import ActivityList from "@/modules/activity/activity-list"
import { Header } from "@/modules/layout/header/header"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Log activity",
    description: "UserLog activitys",
}

export default function Page() {
    return (
        <>
            <Header
                breadcrumbData={[
                    { label: "Dashboard", path: "/dashboard" },
                    { label: "Log activity", path: "/dashboard/activity" },
                ]}
            />
            <ActivityList />
        </>
    )
}