"use client";
import * as React from "react";
import { NavUser } from "@/modules/layout/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { projectList } from "./project-list";
import { NavProjects } from "./nav-projects";
import { developerList } from "./developer-list";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  return (
    <Sidebar collapsible="icon" {...props} variant={"floating"}>
      <SidebarHeader>
        <Button
          className="bg-transparent hover:bg-gray-100 shadow-none text-gray-700 flex justify-start"
          onClick={() => router.push("/dashboard")}
        >
          <ChevronLeft />
          Settings
        </Button>
        {/* <TeamSwitcher teams={data.teams} /> */}
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={data.navMain} /> */}
        <NavProjects projects={projectList} />
        <NavProjects projects={developerList} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
