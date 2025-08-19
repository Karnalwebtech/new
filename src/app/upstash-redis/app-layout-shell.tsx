"use client";

import React from "react";
import { AppSidebar } from "@/modules/layout/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Footer from "@/modules/layout/footer/footer";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface AppLayoutShellProps {
    children: React.ReactNode;
}

export function AppLayoutShell({ children }: AppLayoutShellProps) {
    const isOpen = useSelector((state: RootState) => state.helper?.isSidebarOpen)
    return (
        <SidebarProvider open={isOpen}>
            <AppSidebar />
            <SidebarInset>
                {children}
                <Footer />
            </SidebarInset>
        </SidebarProvider>
    );
}
