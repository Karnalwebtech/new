import { Header } from "@/modules/layout/header/header"
import UserList from "@/modules/main/users/user-list"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Users",
  description: "Users",
}

export default function Page() {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Users", path: "/dashboard/users" },
        ]}
      />
      <UserList />
    </>
  )
}