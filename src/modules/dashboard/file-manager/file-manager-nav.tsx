"use client";
import { memo } from "react";
import Storage from "./storage";
import NavList from "./nav-list";

function FileManagerNav() {

  return (
    <div className="w-64 border-r pb-12 sticky top-2 h-screen">
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            File Manager
          </h2>
          <NavList />
        </div>
        <Storage />
      </div>
    </div>
  );
}

export default memo(FileManagerNav);
