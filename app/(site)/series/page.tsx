import type { Metadata } from "next";

import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import {
    FilterSidebar,
    FiltersState,
    FilterStateChip,
} from "@/components/series/discovery/filters";
import { SeriesCard } from "@/components/series/discovery/series-card";
import { DiscoverySkeleton } from "@/components/series/discovery/skeleton";
import { SortControl } from "@/components/series/discovery/sort-control";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from "@/components/shadcn/empty";
import {
    DiscoveryFilters,
    getDiscoverableSeries,
    getDiscoveryFacets,
    SERIES_PAGE_SIZE,
} from "@/lib/series/discovery";
import {
    LANGUAGE_OPTIONS,
    SORT_OPTIONS,
    STATUS_OPTIONS,
} from "@/lib/series/pretty";
import { multiple, single } from "@/lib/utils/misc";

export const metadata: Metadata = {
    title: "Discover Series | Upanyas",
    description: "Explore novels and discover your next read.",
};

type SearchParams = PageProps<"/series">["searchParams"];
type RawParams = Awaited<SearchParams>;

function parseFilters(params: RawParams): DiscoveryFilters {
    const requestedPage = Number(single(params.page));

    return {
        page:
            Number.isSafeInteger(requestedPage) &&
            requestedPage > 0 &&
            requestedPage <= 1000
                ? requestedPage
                : 1,
        q: single(params.q),
        author: single(params.author),
        translator: single(params.translator),
        genres: multiple(params.genre),
        tags: multiple(params.tag),
        language: LANGUAGE_OPTIONS.find(
            (item) => item.value === single(params.language),
        )?.value,
        originalLanguage: LANGUAGE_OPTIONS.find(
            (item) => item.value === single(params.originalLanguage),
        )?.value,
        originalStatus: STATUS_OPTIONS.find(
            (item) => item.value === single(params.originalStatus),
        )?.value,
        translationStatus: STATUS_OPTIONS.find(
            (item) => item.value === single(params.translationStatus),
        )?.value,
        sort:
            SORT_OPTIONS.find((item) => item.value === single(params.sort))
                ?.value ?? "recent",
    };
}

function catalogueHref(params: URLSearchParams) {
    const query = params.toString();

    return `/series${query ? `?${query}` : ""}#catalogue`;
}

export default function SeriesDiscoveryPage({
    searchParams,
}: PageProps<"/series">) {
    return (
        <div className="site-container pb-20">
            <header className="border-b border-border pt-12 pb-12 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-20">
                <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-16">
                    <h1 className="editorial-heading max-w-3xl text-[clamp(3.25rem,6vw,5.5rem)]">
                        Find your next{" "}
                        <em className="font-normal text-primary">world.</em>
                    </h1>

                    <p className="max-w-sm text-sm leading-7 text-muted-foreground sm:text-base">
                        A growing collection of stories to explore. Discover
                        extraordinary worlds, unforgettable characters, and your
                        next great read.
                    </p>
                </div>
            </header>

            <div id="catalogue" className="scroll-mt-28 py-5">
                <Suspense fallback={<DiscoverySkeleton />}>
                    <DiscoveryResults searchParams={searchParams} />
                </Suspense>
            </div>
        </div>
    );
}

async function DiscoveryResults({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const filters = parseFilters(await searchParams);

    const [{ items, total }, { genres, tags }] = await Promise.all([
        getDiscoverableSeries(filters),
        getDiscoveryFacets(),
    ]);

    const base = new URLSearchParams();

    const scalarFilters = {
        q: filters.q,
        author: filters.author,
        translator: filters.translator,
        language: filters.language,
        originalLanguage: filters.originalLanguage,
        originalStatus: filters.originalStatus,
        translationStatus: filters.translationStatus,
    };

    for (const [key, value] of Object.entries(scalarFilters)) {
        if (value) base.set(key, value);
    }

    for (const genre of filters.genres) {
        base.append("genre", genre);
    }

    for (const tag of filters.tags) {
        base.append("tag", tag);
    }

    if (filters.sort !== "recent") {
        base.set("sort", filters.sort);
    }

    const chips: FilterStateChip[] = [];

    if (filters.q) {
        chips.push({
            key: "q",
            value: filters.q,
            label: `Title: ${filters.q}`,
        });
    }

    if (filters.author) {
        chips.push({
            key: "author",
            value: filters.author,
            label: `Author: ${filters.author}`,
        });
    }

    if (filters.translator) {
        chips.push({
            key: "translator",
            value: filters.translator,
            label: `Translator: ${filters.translator}`,
        });
    }

    for (const slug of filters.genres) {
        chips.push({
            key: "genre",
            value: slug,
            label: genres.find((g) => g.slug === slug)?.name ?? slug,
            multi: true,
        });
    }

    for (const slug of filters.tags) {
        chips.push({
            key: "tag",
            value: slug,
            label: tags.find((t) => t.slug === slug)?.name ?? slug,
            multi: true,
        });
    }

    for (const key of [
        "language",
        "originalLanguage",
        "originalStatus",
        "translationStatus",
    ] as const) {
        const value = filters[key];
        if (!value) continue;

        const options = key.endsWith("Status")
            ? STATUS_OPTIONS
            : LANGUAGE_OPTIONS;

        const label = options.find((option) => option.value === value)?.label;

        const prefix = {
            language: "Language",
            originalLanguage: "Original",
            originalStatus: "Original status",
            translationStatus: "Translation",
        }[key];

        chips.push({
            key,
            value,
            label: `${prefix}: ${label ?? value}`,
        });
    }

    function removeFilter(chip: (typeof chips)[number]) {
        const next = new URLSearchParams(base);

        if (chip.multi) {
            const remaining = next
                .getAll(chip.key)
                .filter((value) => value !== chip.value);

            next.delete(chip.key);
            for (const value of remaining) {
                next.append(chip.key, value);
            }
        } else {
            next.delete(chip.key);
        }

        return catalogueHref(next);
    }

    const linkedChips = chips.map((chip) => ({
        ...chip,
        href: removeFilter(chip),
    }));

    const resetParams = new URLSearchParams();

    if (filters.sort !== "recent") {
        resetParams.set("sort", filters.sort);
    }

    const resetHref = catalogueHref(resetParams);

    const sortLinks = SORT_OPTIONS.map((option) => {
        const next = new URLSearchParams(base);

        if (option.value === "recent") {
            next.delete("sort");
        } else {
            next.set("sort", option.value);
        }

        return {
            value: option.value,
            href: catalogueHref(next),
        };
    });

    function pageHref(page: number) {
        const next = new URLSearchParams(base);
        next.set("page", String(page));
        return catalogueHref(next);
    }

    const totalPages = Math.ceil(total / SERIES_PAGE_SIZE);
    const first = (filters.page - 1) * SERIES_PAGE_SIZE + 1;
    const last = Math.min(filters.page * SERIES_PAGE_SIZE, total);

    return (
        <section aria-labelledby="catalogue-title">
            <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-b border-border pb-5">
                <FiltersState chips={linkedChips} resetHref={resetHref} />

                <SortControl value={filters.sort} links={sortLinks} />
            </div>

            <div className="mt-8 grid items-start gap-x-8 gap-y-8 lg:grid-cols-[13rem_minmax(0,1fr)] xl:grid-cols-[13rem_minmax(0,1fr)_14.5rem]">
                <aside className="min-w-0 lg:border-r lg:border-border lg:pr-6">
                    <FilterSidebar
                        key={base.toString()}
                        filters={filters}
                        genres={genres}
                        tags={tags}
                        resetHref={resetHref}
                    />
                </aside>

                <div className="min-w-0">
                    <div className="mb-4 flex items-baseline justify-between gap-4 border-b border-border pb-4">
                        <h2
                            id="catalog-title"
                            className="font-heading text-2xl"
                        >
                            Stories
                        </h2>

                        <span className="text-xs text-muted-foreground tabular-nums">
                            {total === 0
                                ? "0 results"
                                : `${first}-${last} of ${total}`}
                        </span>
                    </div>

                    {items.length > 0 ? (
                        <div className="divie-y space-y-4 divide-border">
                            {items.map((series) => (
                                <SeriesCard key={series.id} series={series} />
                            ))}
                        </div>
                    ) : (
                        <Empty>
                            <EmptyHeader>
                                <EmptyTitle className="font-sans">
                                    No stories found.
                                </EmptyTitle>
                                <EmptyDescription>
                                    Try adjusting your filters or searching for
                                    something else.
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    )}

                    {totalPages > 1 && (
                        <nav
                            aria-label="series pagination"
                            className="mt-8 flex items-center justify-between border-t border-border pt-6"
                        >
                            {filters.page > 1 ? (
                                <Link
                                    href={pageHref(filters.page - 1)}
                                    scroll={false}
                                    className="inline-flex items-center gap-2 text-sm hover:text-primary"
                                >
                                    <ArrowLeft className="size-4" />
                                    Previous
                                </Link>
                            ) : (
                                <span />
                            )}

                            <span className="text-xs text-muted-foreground tabular-nums">
                                {filters.page} / {totalPages}
                            </span>

                            {filters.page < totalPages ? (
                                <Link
                                    href={pageHref(filters.page + 1)}
                                    scroll={false}
                                    className="inline-flex items-center gap-2 text-sm hover:text-primary"
                                >
                                    Next
                                    <ArrowRight className="size-4" />
                                </Link>
                            ) : (
                                <span />
                            )}
                        </nav>
                    )}
                </div>

                <aside
                    aria-label="Series preview"
                    className="hidden min-w-0 border-l border-border pl-6 xl:block"
                >
                    <div className="sticky top-28">
                        <h2 className="font-heading text-2xl">Preview</h2>

                        <div className="mt-5 flex min-h-64 flex-col items-center justify-center rounded-lg border border-border bg-secondary/20 px-5 text-center">
                            <BookOpen className="size-7 text-muted-foreground/40" />

                            <p className="mt-4 text-sm font-medium">
                                No series selected
                            </p>

                            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                                Select a story to explore its details.
                            </p>
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    );
}
