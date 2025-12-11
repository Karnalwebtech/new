import React from "react";

const InventoryPageSkeleton = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Top: Inventory overview + Quick actions */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        <div className="col-span-9">
          <div className="animate-pulse bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="space-y-3">
                <div className="h-6 w-48 bg-gray-200 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-8 w-36 bg-gray-200 rounded"></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="h-5 w-40 bg-gray-200 rounded mb-3"></div>
                <div className="h-8 w-28 bg-gray-200 rounded"></div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="h-5 w-40 bg-gray-200 rounded mb-3"></div>
                <div className="h-8 w-28 bg-gray-200 rounded"></div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="h-5 w-40 bg-gray-200 rounded mb-3"></div>
                <div className="h-8 w-28 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        <aside className="col-span-3">
          <div className="animate-pulse bg-white rounded-2xl shadow-sm p-6 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-5 w-24 bg-gray-200 rounded"></div>
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
            </div>
          </div>
        </aside>
      </div>

      {/* Main content: Locations, Reservation list, Attributes */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-7 space-y-6">
          {/* Locations card */}
          <div className="animate-pulse bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-5 w-40 bg-gray-200 rounded"></div>
              <div className="h-8 w-20 bg-gray-200 rounded"></div>
            </div>

            <div className="space-y-4">
              {[0, 1].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 w-40 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded"></div>
                  </div>
                  <div className="w-56 flex justify-between">
                    <div className="h-6 w-14 bg-gray-200 rounded"></div>
                    <div className="h-6 w-14 bg-gray-200 rounded"></div>
                    <div className="h-6 w-14 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reservation list */}
          <div className="animate-pulse bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="h-5 w-36 bg-gray-200 rounded"></div>
              <div className="h-8 w-20 bg-gray-200 rounded"></div>
            </div>

            <div className="space-y-4">
              {[0, 1, 2].map((r) => (
                <div
                  key={r}
                  className="flex items-center justify-between py-3 border-b border-gray-100"
                >
                  <div className="w-1/3">
                    <div className="h-4 w-40 bg-gray-200 rounded"></div>
                  </div>
                  <div className="w-1/3">
                    <div className="h-4 w-24 bg-gray-200 rounded ml-6"></div>
                  </div>
                  <div className="w-1/3 flex justify-end">
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-5 space-y-6">
          {/* Attributes card */}
          <div className="animate-pulse bg-white rounded-2xl shadow-sm p-6">
            <div className="h-5 w-32 bg-gray-200 rounded mb-4"></div>

            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>

          {/* Small actions / secondary widgets */}
          <div className="animate-pulse bg-white rounded-2xl shadow-sm p-6">
            <div className="h-5 w-36 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-8 w-full bg-gray-200 rounded"></div>
              <div className="h-8 w-full bg-gray-200 rounded"></div>
              <div className="h-8 w-full bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default InventoryPageSkeleton;
