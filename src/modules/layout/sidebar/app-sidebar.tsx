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

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: teamList,
  navMain: mainNavList,
  projects: projectList
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
