import Index from "@/modules/main/contact-us-queries";
import { Header } from "@/modules/layout/header/header";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
    title: "Site config",
    description: "Site config",
};

const Page = () => {
    return (
        <>
            <Header
                breadcrumbData={[
                    { label: "Dashboard", path: "/dashboard" },
                    { label: "Contact us queries", path: "/dashboard/contact-us-queries" },
                ]}
            />

            <Index />
        </>
    );
};

export default Page;
