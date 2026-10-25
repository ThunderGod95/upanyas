"use client";

import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { useQueryStates } from "nuqs";
import { useState, useTransition, type SubmitEvent } from "react";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/shadcn/accordion";
import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import { FieldLegend, FieldSet } from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn/select";
import {
    LANGUAGE_OPTIONS,
    STATUS_OPTIONS,
} from "@/lib/series/discovery/pretty";
import type { DiscoveryFilters } from "@/lib/series/discovery/search-functions";
import {
    discoveryParsers,
    discoveryUrlKeys,
} from "@/lib/series/discovery/search-params";

type Facet = { name: string; slug: string };

const ANY_VALUE = "__any__";

const searchFields = [
    { name: "q", label: "Title", placeholder: "Search titles" },
    { name: "author", label: "Author", placeholder: "Author name" },
    {
        name: "translator",
        label: "Translator",
        placeholder: "Translator name",
    },
] as const;

const selectionGroups = [
    {
        name: "language",
        label: "Reading language",
        options: LANGUAGE_OPTIONS,
    },
    {
        name: "originalLanguage",
        label: "Original language",
        options: LANGUAGE_OPTIONS,
    },
    {
        name: "originalStatus",
        label: "Original status",
        options: STATUS_OPTIONS,
    },
    {
        name: "translationStatus",
        label: "Translation status",
        options: STATUS_OPTIONS,
    },
] as const;

export function FilterSidebar({
    filters,
    genres,
    tags,
    resetHref,
}: {
    filters: DiscoveryFilters;
    genres: Facet[];
    tags: Facet[];
    resetHref: string;
}) {
    const [expanded, setExpanded] = useState(false);
    const [pending, startTransition] = useTransition();

    const [, setQuery] = useQueryStates(discoveryParsers, {
        urlKeys: discoveryUrlKeys,
        shallow: false,
        history: "push",
        scroll: false,
        startTransition,
    });

    function apply(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        const get = (name: string) => {
            const value = data.get(name);
            return typeof value === "string" ? value.trim() : "";
        };

        const getAll = (name: string) =>
            data
                .getAll(name)
                .filter((value): value is string => typeof value === "string");

        void setQuery({
            page: 1,

            q: get("q"),
            author: get("author"),
            translator: get("translator"),

            genres: discoveryParsers.genres.parse(getAll("genre")) ?? [],
            tags: discoveryParsers.tags.parse(getAll("tag")) ?? [],

            language: discoveryParsers.language.parse(get("language")),

            originalLanguage: discoveryParsers.originalLanguage.parse(
                get("originalLanguage"),
            ),

            originalStatus: discoveryParsers.originalStatus.parse(
                get("originalStatus"),
            ),

            translationStatus: discoveryParsers.translationStatus.parse(
                get("translationStatus"),
            ),
        });

        setExpanded(false);
    }

    return (
        <div>
            <Button
                type="button"
                variant="outline"
                className="w-full justify-between lg:hidden"
                aria-expanded={expanded}
                aria-controls="discovery-filter-form"
                onClick={() => setExpanded((value) => !value)}
            >
                <span className="flex items-center gap-2">
                    <SlidersHorizontal />
                    Filter series
                </span>

                <ChevronDown
                    className={`transition-transform ${expanded ? "rotate-180" : ""}`}
                />
            </Button>

            <form
                id="discovery-filter-form"
                onSubmit={apply}
                className={`${expanded ? "block" : "hidden"} pt-5 lg:block lg:pt-0`}
            >
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="font-sans text-base font-semibold">
                        Filters
                    </h2>

                    <Button
                        variant="link"
                        className="text-muted-foreground transition-colors hover:text-primary"
                        size="sm"
                        asChild
                    >
                        <Link href={resetHref} scroll={false}>
                            Clear All
                        </Link>
                    </Button>
                </div>

                <div className="mb-6 space-y-4">
                    {searchFields.map((field) => (
                        <div key={field.name} className="space-y-2">
                            <Label htmlFor={`filter-${field.name}`}>
                                {field.label}
                            </Label>

                            <Input
                                id={`filter-${field.name}`}
                                name={field.name}
                                type="search"
                                defaultValue={filters[field.name]}
                                maxLength={100}
                                placeholder={field.placeholder}
                            />
                        </div>
                    ))}
                </div>

                {genres.length > 0 && (
                    <FieldSet className="mb-6 border-t pt-5">
                        <FieldLegend className="sr-only">Genres</FieldLegend>

                        <p className="mb-3 text-sm font-semibold">Genres</p>

                        <div className="max-h-56 space-y-3 overflow-y-auto pr-1">
                            {genres.map((genre) => (
                                <div
                                    key={genre.slug}
                                    className="flex items-center gap-2.5"
                                >
                                    <Checkbox
                                        id={`genre-${genre.slug}`}
                                        name="genre"
                                        value={genre.slug}
                                        defaultChecked={filters.genres.includes(
                                            genre.slug,
                                        )}
                                    />

                                    <Label
                                        htmlFor={`genre-${genre.slug}`}
                                        className="cursor-pointer"
                                    >
                                        {genre.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </FieldSet>
                )}

                {tags.length > 0 && (
                    <Accordion
                        type="single"
                        collapsible
                        defaultValue={
                            filters.tags.length > 0 ? "tags" : undefined
                        }
                        className="border-t"
                    >
                        <AccordionItem value="tags" className="border-b-0">
                            <AccordionTrigger className="font-sans text-sm font-semibold">
                                Tags
                            </AccordionTrigger>

                            <AccordionContent>
                                <div className="max-h-56 space-y-3 overflow-y-auto pr-1">
                                    {tags.map((tag) => {
                                        const id = `tag-${tag.slug}`;

                                        return (
                                            <div
                                                key={tag.slug}
                                                className="flex items-center gap-2.5"
                                            >
                                                <Checkbox
                                                    id={id}
                                                    name="tag"
                                                    value={tag.slug}
                                                    defaultChecked={filters.tags.includes(
                                                        tag.slug,
                                                    )}
                                                />

                                                <Label
                                                    htmlFor={id}
                                                    className="cursor-pointer"
                                                >
                                                    {tag.name}
                                                </Label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                )}

                <div className="border-borders space-y-4 border-t pt-5">
                    {selectionGroups.map((group) => (
                        <div key={group.name} className="space-y-2">
                            <Label htmlFor={`filter-${group.name}`}>
                                {group.label}
                            </Label>

                            <Select
                                name={group.name}
                                defaultValue={filters[group.name] || ANY_VALUE}
                            >
                                <SelectTrigger
                                    id={`filter-${group.name}`}
                                    className="w-full"
                                >
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value={ANY_VALUE}>
                                        Any
                                    </SelectItem>

                                    {group.options.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ))}
                </div>

                <Button
                    type="submit"
                    disabled={pending}
                    className="mt-7 w-full"
                >
                    {pending ? "Applying..." : "Apply filters"}
                </Button>
            </form>
        </div>
    );
}

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
