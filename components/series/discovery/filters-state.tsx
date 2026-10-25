"use client";

import { X } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/shadcn/badge";
import type { DiscoveryFilters } from "@/lib/series/discovery/search-functions";

export interface FilterStateChip {
    key: Exclude<keyof DiscoveryFilters, "page" | "sort">;
    value: string;
    label: string;
}

export function FiltersState({
    chips,
    resetHref,
}: {
    chips: (FilterStateChip & { href: string })[];
    resetHref: string;
}) {
    return (
        <div className="flex min-w-0 flex-wrap items-center gap-2">
            {chips.length === 0 ? (
                <span className="text-sm text-muted-foreground">
                    No active filters
                </span>
            ) : (
                <>
                    {chips.map((chip) => (
                        <Badge
                            key={`${chip.key}:${chip.value}`}
                            variant="secondary"
                            asChild
                        >
                            <Link
                                href={chip.href}
                                scroll={false}
                                title={`Remove "${chip.label}" filter`}
                            >
                                <span>{chip.label}</span>
                                <X />
                            </Link>
                        </Badge>
                    ))}

                    <Link
                        href={resetHref}
                        scroll={false}
                        className="px-2 text-xs text-muted-foreground hover:text-primary"
                    >
                        Clear
                    </Link>
                </>
            )}
        </div>
    );
}
