import type { Metadata } from "next";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/modules/dashboard/file-manager/header";
import { Header as MainHeader } from "@/modules/layout/header/header";
import FileManagerNav from "@/modules/dashboard/file-manager/file-manager-nav";
export const metadata: Metadata = {
  title: "File Manager",
  description: "File Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MainHeader
        breadcrumbData={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "File manager", path: "/file-manager" },
        ]}
      />
      <SidebarProvider>
        <div className="hidden md:block">
          <FileManagerNav />
        </div>
        <SidebarInset>
          <Header />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
