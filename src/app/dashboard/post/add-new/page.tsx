import { Header } from '@/modules/layout/header/header'
import AddNewPost from '@/modules/main/post/add-new/add-new-post'
import { Metadata } from 'next'
import React from 'react'
export const metadata:Metadata={
    title:"Add new post",
    description:"Add new post"
}
export default function Page () {
  return (
    <>
     <Header
            breadcrumbData={[
              { label: "Dashboard", path: "/dashboard" },
              { label: "Post", path: "/dashboard/post" },
              { label: "Add new post", path: "/dashboard/post" },
            ]}
          />
   <AddNewPost/>
    </>
  )
}