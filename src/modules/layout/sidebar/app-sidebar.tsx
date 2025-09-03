"use client";

import * as React from "react";

import { NavMain } from "@/modules/layout/sidebar/nav-main";
import { NavProjects } from "@/modules/layout/sidebar/nav-projects";
import { NavUser } from "@/modules/layout/sidebar/nav-user";
import { TeamSwitcher } from "@/modules/layout/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { projectList } from "./project-list";
import { mainNavList } from "./main-nav-list";
import { teamList } from "./teams-list";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: teamList,
  navMain: mainNavList,
  projects: projectList,
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  return (
    <Sidebar collapsible="icon" {...props} variant={"floating"}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <Button
          className="bg-transparent hover:bg-gray-100 shadow-none text-gray-700 mb-2 w-full flex justify-start"
          onClick={() => router.push("/settings/store")}
        >
          <Settings />
          Settings
        </Button>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
