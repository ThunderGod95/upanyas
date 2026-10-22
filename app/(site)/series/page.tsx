import type { Metadata } from "next";

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { getDiscoverableSeries, SERIES_PAGE_SIZE } from "@/lib/series/queries";

export const metadata: Metadata = {
    title: "Discover Series | Upanyas",
    description: "Explore novels and discover your next read.",
};

type SearchParams = PageProps<"/series">["searchParams"];

export default function SeriesDiscoveryPage({ searchParams }: PageProps<"/series">) {
    return (
        <div className="site-container py-10 pb-20 lg:py-16">
            <header className="mb-10 space-y-3">
                <h1 className="editorial-heading text-4xl sm:text-5xl">Discover Series</h1>
                <p className="text-muted-foreground">Explore stories from our collection.</p>
            </header>

            <Suspense fallback={<DiscoverySkeleton />}>
                <DiscoveryResults searchParams={searchParams} />
            </Suspense>
        </div>
    );
}

async function DiscoveryResults({ searchParams }: { searchParams: SearchParams }) {
    const params = await searchParams;

    const requestedPage = Number(params.page ?? 1);
    const page =
        Number.isSafeInteger(requestedPage) && requestedPage > 0 && requestedPage <= 1000
            ? requestedPage
            : 1;

    const { items, total } = await getDiscoverableSeries(page);
    const totalPages = Math.ceil(total / SERIES_PAGE_SIZE);

    if (total === 0) {
        return <p className="py-16 text-center text-muted-foreground">No series available.</p>;
    }

    return (
        <section aria-label="series catalog" className="space-y-10">
            <p className="text-sm text-muted-foreground">{total} series found.</p>

            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {items.map((series) => (
                    <Link key={series.id} href={`/series/${series.slug}`} className="group min-w-0">
                        <div className="relative mb-3 aspect-5/7 overflow-hidden rounded-md bg-secondary">
                            {series.coverUrl && (
                                <Image
                                    src={series.coverUrl}
                                    alt=""
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            )}
                        </div>

                        <h2 className="line-clamp-2 font-heading text-lg leading-snug group-hover:text-primary">
                            {series.title}
                        </h2>

                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                            {series.shortDescription}
                        </p>
                    </Link>
                ))}
            </div>

            <nav aria-label="series pagination" className="flex items-center justify-center gap-6">
                {page > 1 && (
                    <Link
                        href={`/series?page=${page - 1}`}
                        scroll={false}
                        className="text-sm text-primary hover:underline"
                    >
                        Previous
                    </Link>
                )}

                <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                </span>

                {page < totalPages && (
                    <Link
                        href={`/series?page=${page + 1}`}
                        scroll={false}
                        className="text-sm text-primary hover:underline"
                    >
                        Next
                    </Link>
                )}
            </nav>
        </section>
    );
}

function DiscoverySkeleton() {
    return (
        <div role="status" aria-label="loading series">
            <div className="mb-10 h-4 w-32 animate-pulse rounded bg-secondary"></div>

            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {Array.from({ length: 12 }, (_, index) => (
                    <div key={index} className="animate-pulse">
                        <div className="aspect-5/7 rounded-md bg-secondary" />
                        <div className="mt-3 h-4 w-4/5 rounded bg-secondary" />
                        <div className="mt-2 h-3 w-2/3 rounded bg-secondary" />
                    </div>
                ))}
            </div>
        </div>
    );
}
