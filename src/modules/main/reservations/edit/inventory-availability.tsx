import React, { useMemo, memo } from "react";
import { useGetAllStockLocationQuery } from "@/state/stock-location-api";
import { TableSkeletonFullRow } from "@/components/skeletons/tabel-skeleton-full-row";

interface InventoryAvailabilityProps {
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

const InventoryAvailability = ({
  quantities,
  setQuantities,
}: InventoryAvailabilityProps) => {
  const { data, isLoading } = useGetAllStockLocationQuery({
    rowsPerPage: 100,
    page: 1,
  });

  // fix memo dependency to data (not data?.result)
  const result = useMemo(() => data?.result || [], [data]);

  // local state to hold quantities keyed by location id

  // initialize quantities from result if present
//   useEffect(() => {
//     if (result.length > 0) {
//       const initial: Record<string, number> = {};
//       result.forEach((r) => {
//         // if API has an "inStock" field you can use that instead of 0
//         initial[String(r._id)] = 0;
//       });
//       setQuantities((prev) => ({ ...initial, ...prev }));
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [result.length]); // only when result length changes

  const onQtyChange = (id: string | number, value: string) => {
    const n = value === "" ? 0 : Math.max(0, Number(value));
    setQuantities((prev) => ({ ...prev, [String(id)]: n }));
  };

  return (
    <div className="bg-white border max-w-[400px] h-full overflow-auto">
      {/* Table header (sticky inside container) */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="grid grid-cols-12 gap-4 items-center text-xs text-slate-600 font-medium px-4 py-3">
          <div className="col-span-7">
            <h3 className="text-sm">Location</h3>
          </div>
          <div className="col-span-5">
            <h3 className="text-sm">In stock</h3>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="">
        {/* Loading skeleton */}
        {isLoading && (
          <div className="p-4 space-y-3">
            {[...Array(6)].map((_, i) => (
              <TableSkeletonFullRow key={i} />
            ))}
          </div>
        )}

        {/* Result rows */}
        {!isLoading && result.length === 0 && (
          <div className="p-6 text-center text-slate-500">
            No locations found
          </div>
        )}

        {!isLoading && result.length > 0 && (
          <div>
            {result.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-12 gap-4 items-center px-4 py-3 border-b last:border-b-0"
              >
                <div className="col-span-7">
                  <div className="text-sm font-medium text-slate-800">
                    {row.name}
                  </div>
                  {/* Optional: small meta */}
                  {/* <div className="text-xs text-slate-400">address / code</div> */}
                </div>

                <div className="col-span-5">
                  <label htmlFor={`qty-${row._id}`} className="sr-only">
                    Quantity for {row.name}
                  </label>
                  <input
                    id={`qty-${row._id}`}
                    type="number"
                    min={0}
                    value={quantities[String(row._id)] ?? ""}
                    onChange={(e) => onQtyChange(row._id!, e.target.value)}
                    className="w-full rounded border px-2 py-1 text-sm"
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default memo(InventoryAvailability);
