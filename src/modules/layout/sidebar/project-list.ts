import {
  File,
  Contact,
  PieChart,
  Activity,
  UsersRound,
} from "lucide-react";
const dashboard = [{
  name: "File Manager",
  url: "/dashboard/file-manager",
  icon: File,
  type: "dashboard",
},
{
  name: "Contact us queries",
  url: "/dashboard/contact-us-queries",
  icon: Contact,
  type: "dashboard",
},

{
  name: "Tracking Events",
  url: "/dashboard/tracking-events",
  icon: PieChart,
  type: "dashboard",
},
{
  name: "Config",
  url: "/dashboard/config",
  icon: PieChart,
  type: "dashboard",
},

{
  name: "Log Activity",
  url: "/dashboard/activity",
  icon: Activity,
  type: "dashboard",
},
{
  name: "Recent Activity",
  url: "/dashboard/recent-activity",
  icon: Activity,
  type: "dashboard",
},
{
  name: "Users",
  url: "/dashboard/users",
  icon: UsersRound,
  type: "dashboard",
},]

const redis = [
  {
    name: "Dashnoard",
    url: "/upstash-redis",
    icon: UsersRound,
    type: "upstash-redis",
  },
  {
    name: "Instances",
    url: "/upstash-redis/instances",
    icon: UsersRound,
    type: "upstash-redis",
  },
  {
    name: "Events",
    url: "/upstash-redis/events",
    icon: UsersRound,
    type: "upstash-redis",
  },
  {
    name: "Data browser",
    url: "/upstash-redis/data-browser",
    icon: UsersRound,
    type: "upstash-redis",
  },
  {
    name: "Manage",
    url: "/upstash-redis/manage",
    icon: UsersRound,
    type: "upstash-redis",
  },
]
export const projectList = [
  ...dashboard, ...redis

]
