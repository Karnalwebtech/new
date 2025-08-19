import React from "react";
import { QuickAccess } from "./quick-access";
import NavList from "./nav-list";

export const Header = () => {
  return (
    <div className="p-2 lg:p-4 py-2 md:p-6">
      <div className="pb-2 block md:hidden">
        <NavList style={""} />
      </div>
      <QuickAccess />
    </div>
  );
};
