export default function DeliverySkeleton() {
  return (
    <div className="w-full max-w-2xl space-y-4">
      {/* Store Header Skeleton */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Avatar Skeleton */}
          <div className="h-12 w-12 rounded-lg bg-muted animate-pulse flex-shrink-0" />

          <div className="flex-1 min-w-0">
            {/* Store Name Skeleton */}
            <div className="h-5 w-24 bg-muted rounded animate-pulse mb-2" />

            {/* Address Line 1 Skeleton */}
            <div className="h-4 w-full bg-muted rounded animate-pulse mb-1" />

            {/* Address Line 2 Skeleton */}
            <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
          </div>

          {/* Menu Icon Skeleton */}
          <div className="h-6 w-6 bg-muted rounded animate-pulse flex-shrink-0" />
        </div>
      </div>

      {/* Pickup Section Skeleton */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <div>
            {/* Pickup Title Skeleton */}
            <div className="h-6 w-20 bg-muted rounded animate-pulse" />
          </div>

          <div className="flex items-center gap-3">
            {/* Disabled Badge Skeleton */}
            <div className="h-5 w-20 bg-muted rounded-full animate-pulse" />

            {/* Menu Icon Skeleton */}
            <div className="h-6 w-6 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Shipping Section Skeleton */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <div>
            {/* Shipping Title Skeleton */}
            <div className="h-6 w-24 bg-muted rounded animate-pulse" />
          </div>

          <div className="flex items-center gap-3">
            {/* Disabled Badge Skeleton */}
            <div className="h-5 w-20 bg-muted rounded-full animate-pulse" />

            {/* Menu Icon Skeleton */}
            <div className="h-6 w-6 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
