import { KeyRound } from "lucide-react";
const Settings = [
  {
    name: "Publishable API Keys",
    url: "/settings/publishable-api-keys",
    icon: KeyRound,
    type: "dashboard",
  },
  {
    name: "Secret Api Keys",
    url: "/settings/secret-api-keys",
    icon: KeyRound,
    type: "dashboard",
  },
];

export const developerList = [...Settings];
