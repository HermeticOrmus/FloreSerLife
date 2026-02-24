import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ContentCardSkeleton() {
  return (
    <Card className="bg-garden-card border-0 rounded-card shadow-card h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent className="pt-0 space-y-4 flex-1 flex flex-col">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="mt-auto pt-4 border-t border-garden-accent/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-4 w-10" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 flex-1 rounded-md" />
            <Skeleton className="h-8 w-10 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
