import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/shadcn/pagination";
import { serializeDiscoveryParams } from "@/lib/series/discovery/search-params";
import type { DiscoveryFilters } from "@/lib/series/discovery/search-params";

type PageEntry = number | "ellipsis";

interface SeriesPaginationProps {
    filters: DiscoveryFilters;
    totalPages: number;
}

export function SeriesPagination({
    filters,
    totalPages,
}: SeriesPaginationProps) {
    if (totalPages <= 1) return null;

    const currentPage = filters.page;

    function pageHref(page: number) {
        return serializeDiscoveryParams("/series#catalogue", {
            ...filters,
            page,
        });
    }

    return (
        <Pagination aria-label="Series results pages">
            <PaginationContent>
                <PaginationItem>
                    {currentPage > 1 ? (
                        <PaginationPrevious href={pageHref(currentPage - 1)} />
                    ) : (
                        <Button
                            variant="ghost"
                            size="default"
                            disabled
                            aria-label="Go to previous page"
                            className="pl-2!"
                        >
                            <ChevronLeftIcon data-icon="inline-start" />
                            <span className="hidden sm:block">Previous</span>
                        </Button>
                    )}
                </PaginationItem>

                <PaginationItem className="sm:hidden">
                    <span
                        aria-current="page"
                        className="px-2 text-sm text-muted-foreground tabular-nums"
                    >
                        Page {currentPage} of {totalPages}
                    </span>
                </PaginationItem>

                {getPaginationRange(currentPage, totalPages).map(
                    (entry, index) => (
                        <PaginationItem
                            key={`${entry}-${index}`}
                            className="hidden sm:block"
                        >
                            {entry === "ellipsis" ? (
                                <PaginationEllipsis />
                            ) : (
                                <PaginationLink
                                    href={pageHref(entry)}
                                    isActive={entry === currentPage}
                                    aria-label={
                                        entry === currentPage
                                            ? `Page ${entry}, current page`
                                            : `Go to page ${entry}`
                                    }
                                >
                                    {entry}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ),
                )}

                <PaginationItem>
                    {currentPage < totalPages ? (
                        <PaginationNext href={pageHref(currentPage + 1)} />
                    ) : (
                        <Button
                            variant="ghost"
                            size="default"
                            disabled
                            aria-label="Go to next page"
                            className="pr-2!"
                        >
                            <span className="hidden sm:block">Next</span>
                            <ChevronRightIcon data-icon="inline-end" />
                        </Button>
                    )}
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

function getPaginationRange(
    currentPage: number,
    totalPages: number,
): PageEntry[] {
    const visible = [
        ...new Set([
            1,
            currentPage - 1,
            currentPage,
            currentPage + 1,
            totalPages,
        ]),
    ]
        .filter((page) => page >= 1 && page <= totalPages)
        .toSorted((a, b) => a - b);

    const result: PageEntry[] = [];

    for (const page of visible) {
        const previous = result.at(-1);

        if (typeof previous === "number") {
            const gap = page - previous;

            if (gap === 2) {
                result.push(previous + 1);
            } else if (gap > 2) {
                result.push("ellipsis");
            }
        }

        result.push(page);
    }

    return result;
}
