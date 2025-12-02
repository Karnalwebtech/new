"use client"
import { useGetAllShippingOptionsQuery } from '@/state/shipping-options-api'
import React, { useMemo, useState } from 'react'
import { MoreVertical, Edit, Copy, Trash2, Globe, Package } from 'lucide-react';
import { capitalizeFirstLetter } from '@/services/helpers';

const ShippingOption = () => {
    const { data } = useGetAllShippingOptionsQuery()
    const result = useMemo(() => data?.result || [], [data])
    console.log(data)
    // State for profiles data
    const [profiles, setProfiles] = useState([
        { id: 1, name: "India - Default Shipping Profile", type: "Manual", store: "Store", isDefault: true },
        { id: 2, name: "India - Default Shipping Profile", type: "Manual", store: "Store", isDefault: false },
        { id: 3, name: "India - Default Shipping Profile", type: "Manual", store: "Store", isDefault: false },
        { id: 4, name: "India - Default", type: "Manual", store: "Store", isDefault: false },
    ]);


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
                                <div className="text-sm text-gray-900">{capitalizeFirstLetter(item.name)} -  {capitalizeFirstLetter(item.shipping_profile_id?.name)} ({capitalizeFirstLetter(item?.provider_id?.name)})</div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-4 flex items-center justify-end relative">
                        <div className="col-span-3 flex items-center">
                            {/* <div className="text-sm text-gray-700">{item.store}</div> */}
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
        </div>
    );
}

export default ShippingOption