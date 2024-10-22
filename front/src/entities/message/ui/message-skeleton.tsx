import { cn } from '@/shared/lib/utils';
import { Skeleton } from '@/shared/ui/skeleton';

export default function MessageSkeleton({ className }: { className?: string }) {
  return <Skeleton className={cn('p-6 rounded-2xl max-w-full', className)} />;
}
