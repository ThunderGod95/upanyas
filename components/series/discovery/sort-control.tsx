import { Check, ChevronDown } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import type { DiscoveryFilters } from "@/lib/series/discovery";
import { SORT_OPTIONS } from "@/lib/series/pretty";

export function SortControl({
    value,
    links,
}: {
    value: DiscoveryFilters["sort"];
    links: {
        value: DiscoveryFilters["sort"];
        href: string;
    }[];
}) {
    const current = SORT_OPTIONS.find((option) => option.value === value);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="shrink-0">
                    <span className="text-muted-foreground">Sort:</span>
                    <span>{current?.label}</span>
                    <ChevronDown className="text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={8} className="w-56">
                {links.map((link) => {
                    const option = SORT_OPTIONS.find(
                        (item) => item.value === link.value,
                    );

                    return (
                        <DropdownMenuItem key={link.value} asChild>
                            <Link
                                href={link.href}
                                scroll={false}
                                className="flex items-center justify-between gap-3"
                            >
                                <span>{option?.label}</span>

                                {value === link.value && (
                                    <Check className="text-primary" />
                                )}
                            </Link>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
