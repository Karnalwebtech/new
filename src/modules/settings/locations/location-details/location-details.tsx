import React from 'react'
import StockLocationDetails from './stock-location-details'
import SalesChannelsCard from './sales-channels-card'
import FulfillmentCard from './fulfillment-card'

const LocationDetails = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <StockLocationDetails />
          </div>

          {/* Right Column - Side Panels */}
          <div className="space-y-6">
            <SalesChannelsCard />
            <FulfillmentCard />
          </div>
        </div>
  )
}

export default LocationDetails