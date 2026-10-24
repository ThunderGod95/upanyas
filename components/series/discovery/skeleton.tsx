import { Skeleton } from "@/components/shadcn/skeleton";

export function DiscoverySkeleton() {
    return (
        <output aria-label="Loading series catalogue" aria-busy="true">
            <div className="flex items-center justify-between gap-4 border-b border-border pb-5">
                <Skeleton className="h-7 w-40 rounded-full" />
                <Skeleton className="h-10 w-44 rounded-md" />
            </div>

            <div className="mt-8 grid items-start gap-x-8 gap-y-8 lg:grid-cols-[13rem_minmax(0,1fr)] xl:grid-cols-[13rem_minmax(0,1fr)_14.5rem]">
                <div className="space-y-6 lg:border-r lg:border-border lg:pr-6">
                    <Skeleton className="h-5 w-24" />

                    {Array.from({ length: 4 }, (_, index) => (
                        <div key={index} className="space-y-3">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full rounded-md" />
                        </div>
                    ))}
                </div>

                <div className="min-w-0">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                        <Skeleton className="h-7 w-24" />
                        <Skeleton className="h-4 w-20" />
                    </div>

                    {Array.from({ length: 4 }, (_, index) => (
                        <div
                            key={index}
                            className="flex gap-5 border-b border-border py-6"
                        >
                            <Skeleton className="aspect-5/7 w-24 shrink-0 rounded-md sm:w-28" />

                            <div className="flex-1 space-y-3">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-3 w-1/3" />
                                <Skeleton className="mt-5 h-3 w-full" />
                                <Skeleton className="h-3 w-4/5" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="hidden border-l border-border pl-6 xl:block">
                    <Skeleton className="h-7 w-28" />
                    <Skeleton className="mt-5 h-64 w-full rounded-lg" />
                </div>
            </div>
        </output>
    );
}
