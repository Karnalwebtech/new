export function BusinessCardSkeleton() {
  return (
    <div className="w-full rounded-lg border border-border bg-card p-6">
      {/* Header Section */}
      <div className="flex items-start justify-between gap-4 pb-6 border-b border-border">
        <div className="flex items-start gap-3 flex-1">
          {/* Icon Skeleton */}
          <div className="mt-1">
            <div className="w-10 h-10 rounded-lg bg-muted animate-pulse" />
          </div>

          {/* Text Content */}
          <div className="flex-1 space-y-3">
            {/* Title Skeleton */}
            <div className="h-6 w-32 bg-muted rounded animate-pulse" />

            {/* Address Skeleton */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-muted animate-pulse" />
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-4 w-full bg-muted rounded animate-pulse" />
              <div className="h-4 w-96 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* View Details Link Skeleton */}
        <div className="h-4 w-24 bg-muted rounded animate-pulse flex-shrink-0" />
      </div>

      {/* Connected Sales Channels Section */}
      <div className="pt-6 space-y-4">
        {/* Section Title */}
        <div className="h-5 w-40 bg-muted rounded animate-pulse" />

        {/* Pickup Channel */}
        <div className="flex items-center justify-between py-3">
          <div className="h-4 w-20 bg-muted rounded animate-pulse" />
          <div className="h-4 w-20 bg-muted rounded animate-pulse" />
        </div>

        {/* Shipping Channel */}
        <div className="flex items-center justify-between py-3 border-t border-border">
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          <div className="h-4 w-20 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}
