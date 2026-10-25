import { ArrowUpRight, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "@/components/shadcn/card";
import { DiscoverySeries } from "@/lib/series/discovery/search-functions";
import { LANGUAGE_OPTIONS, STATUS_OPTIONS } from "@/lib/series/discovery/pretty";

export function SeriesCard({ series }: { series: DiscoverySeries }) {
    const href = `/series/${series.slug}`;

    const authors =
        series.authors.map(({ author }) => author.name).join(", ") ||
        "Unknown author";

    const status = STATUS_OPTIONS.find(
        (item) => item.value === series.translationStatus,
    )?.label;

    const language = LANGUAGE_OPTIONS.find(
        (item) => item.value === series.language,
    )?.label;

    return (
        <Card
            // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
            role="article"
            className="border-none bg-transparent shadow-none ring-0"
        >
            <CardContent className="group grid grid-cols-[5.75rem_minmax(0,1fr)] gap-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-5">
                <Link
                    href={href}
                    className="relative aspect-5/7 self-start"
                    aria-label={`Read "${series.title}"`}
                >
                    {series.coverUrl ? (
                        <Image
                            src={series.coverUrl}
                            alt=""
                            fill
                            sizes="112px"
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.055]"
                        />
                    ) : (
                        <div className="flex size-full items-center justify-center text-muted-foreground/40">
                            <BookOpen className="size-7" />
                        </div>
                    )}
                </Link>

                <div className="flex min-w-0 flex-col">
                    <div className="flex items-start justify-between gap-3">
                        <h3 className="font-heading text-xl leading-tight tracking-tight sm:text-2xl">
                            <Link
                                href={href}
                                className="transition-colors hover:text-primary"
                            >
                                {series.title}
                            </Link>
                        </h3>

                        <Link
                            href={href}
                            aria-label={`Open "${series.title}"`}
                            className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                        >
                            <ArrowUpRight className="size-4" />
                        </Link>
                    </div>

                    <p className="mt-1 truncate text-xs text-muted-foreground">
                        {authors}
                    </p>

                    {series.shortDescription && (
                        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground sm:line-clamp-3">
                            {series.shortDescription}
                        </p>
                    )}

                    <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1.5 pt-3 text-xs">
                        {status && (
                            <span className="font-medium text-primary">
                                {status}
                            </span>
                        )}

                        {language && language !== "Unknown" && (
                            <span className="text-muted-foreground">
                                {language}
                            </span>
                        )}

                        {series.genres.slice(0, 2).map((genre) => (
                            <span
                                key={genre.slug}
                                className="rounded-md bg-secondary px-2 py-0.5 text-[0.7rem] text-secondary-foreground"
                            >
                                {genre.name}
                            </span>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
