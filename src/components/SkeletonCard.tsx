import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonIndexCard = () => (
  <div className="terminal-card p-4 space-y-3">
    <Skeleton className="h-3 w-24" />
    <Skeleton className="h-8 w-32" />
    <Skeleton className="h-3 w-20" />
    <Skeleton className="h-2 w-full" />
  </div>
);

export const SkeletonTableRow = () => (
  <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
    <div className="flex items-center gap-3">
      <Skeleton className="h-8 w-8 rounded" />
      <div className="space-y-1.5">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-2 w-16" />
      </div>
    </div>
    <Skeleton className="h-4 w-16" />
  </div>
);

export const SkeletonChart = () => (
  <div className="terminal-card p-4 space-y-3">
    <Skeleton className="h-4 w-32" />
    <div className="flex items-end gap-1 h-40">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton key={i} className="flex-1 rounded-t" style={{ height: `${30 + Math.random() * 70}%` }} />
      ))}
    </div>
  </div>
);

export const SkeletonTrendingCard = () => (
  <div className="terminal-card p-3 space-y-2 min-w-[140px]">
    <Skeleton className="h-32 w-full rounded" />
    <Skeleton className="h-3 w-20" />
    <Skeleton className="h-3 w-14" />
  </div>
);
