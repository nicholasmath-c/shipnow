import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonComment() {
  return (
    <div className="p-4 my-2">
      <div className="flex justify-between gap-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-xl flex items-center justify-center grayscale bg-neutral-100" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>

      <Skeleton className="h-32 w-full mt-4" />

      <div className="flex w-full justify-center">
        <Skeleton className="max-h-32" />
      </div>
    </div>
  );
}
