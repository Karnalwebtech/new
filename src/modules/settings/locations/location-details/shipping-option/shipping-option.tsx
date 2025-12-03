"use client";
import { useGetAllShippingOptionsQuery } from "@/state/shipping-options-api";
import React, { useMemo, useState } from "react";
import { MoreVertical, Edit, Copy, Trash2, Globe, Package } from "lucide-react";
import { capitalizeFirstLetter } from "@/services/helpers";
import ShadcnPagination from "@/components/pagination";
interface ShippingOptionProps {
  is_return?: boolean;
  serviseZone_id?: string;
}
const ShippingOption = ({ serviseZone_id, is_return }: ShippingOptionProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const query = is_return
    ? {
        is_return: "true",
        service_zone_id: serviseZone_id,
        rowsPerPage: 10,
        page: currentPage,
      }
    : { rowsPerPage: 10, service_zone_id: serviseZone_id, page: currentPage };
  const { data } = useGetAllShippingOptionsQuery(query);
  const result = useMemo(() => data?.result || [], [data]);

  return (
    <div className="overflow-x-auto">
      {/* Table Body */}
      {result.map((item) => (
        <div
          key={item.id}
          className={`grid grid-cols-12 border-b border-gray-100 py-4 px-4 hover:bg-gray-50 transition-colors`}
        >
          {/* Profile Name */}
          <div className="col-span-8 flex items-center">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-gray-100 text-gray-600`}>
                <Package size={14} />
              </div>
              <div>
                <div className="text-sm text-gray-900">
                  {capitalizeFirstLetter(item.name)} -{" "}
                  {capitalizeFirstLetter(item.shipping_profile?.name)} (
                  {capitalizeFirstLetter(item?.provider?.name || "Not set")})
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-4 flex items-center justify-end relative">
            <div className="col-span-3 flex items-center">
              <div className="text-sm text-gray-700">
                {item.shipping_option_rules
                  .filter(
                    (filterRule) => filterRule?.attribute === "enabled_in_store"
                  )
                  .map((rule, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded bg-blue-100 text-blue-600 text-xs mr-1"
                    >
                      {rule.value ? "Store" : "Admin"}
                    </span>
                  ))}
              </div>
            </div>
            <button
              // onClick={() => toggleDropdown(profile.id)}
              className="p-1 rounded-lg hover:bg-gray-200 transition-colors"
              aria-label="More options"
            >
              <MoreVertical size={20} className="text-gray-500" />
            </button>
          </div>
        </div>
      ))}
      {data && data.dataCounter > 10 && (
        <div className="my-4 overflow-hidden">
          <ShadcnPagination
            leftRightBtn={true}
            currentPage={currentPage}
            totalPages={10}
            setCurrentPage={setCurrentPage}
            data_length={data.dataCounter || 10}
          />
        </div>
      )}
    </div>
  );
};

export default ShippingOption;
