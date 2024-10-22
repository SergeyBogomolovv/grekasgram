import { Skeleton } from '@/shared/ui/skeleton';

export default function UserSkeleton() {
  return (
    <div className="flex items-center gap-x-2">
      <Skeleton className="rounded-full aspect-square size-12" />
      <div className="flex flex-col gap-2">
        <Skeleton className="w-40 h-3" />
        <Skeleton className="w-32 h-3" />
      </div>
    </div>
  );
}
