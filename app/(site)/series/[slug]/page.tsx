import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import {
    CHAPTER_PAGE_SIZE,
    getPublishedChapters,
    getPublishedVolumes,
    getVisibleSeries,
} from "@/lib/series/discovery/search-functions";

type Props = PageProps<"/series/[slug]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const series = await getVisibleSeries(slug);

    if (!series) notFound();

    return {
        title: `${series.title} | Upanyas`,
        description:
            series.shortDescription ?? series.longDescription.slice(0, 160),
        robots:
            series.visibility === "UNLISTED"
                ? { index: false, follow: false }
                : undefined,
    };
}

export default async function SeriesPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const series = await getVisibleSeries(slug);

    if (!series) notFound();

    return (
        <div className="site-container space-y-12 py-10">
            <article className="grid items-start gap-8 select-none md:grid-cols-[12rem_minmax(0,1fr)] lg:gap-12">
                <div className="relative aspect-5/7 overflow-hidden rounded-lg bg-secondary">
                    {series.coverUrl && (
                        <Image
                            src={series.coverUrl}
                            alt=""
                            fill
                            priority
                            sizes="192px"
                            className="object-cover"
                        />
                    )}
                </div>

                <div className="min-w-0 space-y-5">
                    <h1 className="editorial-heading text-4xl sm:text-5xl">
                        {series.title}
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        {series.authors
                            .map(({ author }) => author.name)
                            .join(", ") || "Unknown author"}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {series.genres.map((genre) => (
                            <span
                                key={genre.slug}
                                className="rounded-full bg-secondary px-3 py-1 text-xs"
                            >
                                {genre.name}
                            </span>
                        ))}
                    </div>

                    <p className="leading-relaxed whitespace-pre-line text-muted-foreground select-text">
                        {series.longDescription}
                    </p>

                    <dl className="grid gap-3 text-sm sm:grid-cols-2">
                        <div>
                            <dt className="text-muted-foreground">
                                Status in COO
                            </dt>
                            <dd>
                                {series.originalStatus.replaceAll("_", " ")}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground">
                                Translation Status
                            </dt>
                            <dd>
                                {series.translationStatus.replaceAll("_", " ")}
                            </dd>
                        </div>
                    </dl>
                </div>
            </article>

            <Suspense fallback={<SectionSkeleton title="Volumes" />}>
                <VolumeSection seriesId={series.id} />
            </Suspense>

            <Suspense fallback={<SectionSkeleton title="Chapters" />}>
                <ChapterSection
                    seriesId={series.id}
                    slug={series.slug}
                    searchParams={searchParams}
                />
            </Suspense>
        </div>
    );
}

async function VolumeSection({ seriesId }: { seriesId: string }) {
    const volumes = await getPublishedVolumes(seriesId);

    return (
        <section className="space-y-5">
            <h2 className="font-heading text-3xl">Volumes</h2>

            {volumes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                    No published volumes yet.
                </p>
            ) : (
                <div className="divide-y divide-border rounded-lg border border-border">
                    {volumes.map((volume) => (
                        <article key={volume.id} className="p-5">
                            <h3 className="text-lg">{volume.title}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {volume._count.chapters} published chapters
                            </p>
                            {volume.description && (
                                <p className="mt-3 text-sm text-muted-foreground">
                                    {volume.description}
                                </p>
                            )}
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}

async function ChapterSection({
    seriesId,
    slug,
    searchParams,
}: {
    seriesId: string;
    slug: string;
    searchParams: Props["searchParams"];
}) {
    const params = await searchParams;
    const requestedPage = Number(params.chapterPage ?? 1);
    const page =
        Number.isSafeInteger(requestedPage) &&
        requestedPage > 0 &&
        requestedPage <= 1000
            ? requestedPage
            : 1;

    const { items, total } = await getPublishedChapters(seriesId, page);

    const totalPages = Math.ceil(total / CHAPTER_PAGE_SIZE);

    return (
        <section className="space-y-5">
            <div className="flex items-baseline justify-between">
                <h2 className="font-heading text-3xl">Chapters</h2>
                <span className="text-sm text-muted-foreground">
                    {total} published
                </span>
            </div>

            {total === 0 ? (
                <p className="text-sm text-muted-foreground">
                    No published chapters yet.
                </p>
            ) : (
                <>
                    <ol className="divide-y divide-border rounded-lg border border-border">
                        {items.map((chapter) => (
                            <li key={chapter.id} className="px-5 py-4">
                                <p className="text-sm font-medium">
                                    {chapter.numberLabel ??
                                        `Chapter ${chapter.position}`}{" "}
                                    - {chapter.publication?.revision.title}
                                </p>

                                {chapter.volume && (
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {chapter.volume.title}
                                    </p>
                                )}
                            </li>
                        ))}
                    </ol>
                    <nav
                        aria-label="chapter pagination"
                        className="flex items-center justify-center gap-6"
                    >
                        {page > 1 && (
                            <Link
                                href={`/series/${slug}?chapterPage=${page - 1}`}
                                scroll={false}
                            >
                                Previous
                            </Link>
                        )}

                        <span className="text-sm text-muted-foreground">
                            Page {page} of {totalPages}
                        </span>

                        {page < totalPages && (
                            <Link
                                href={`/series/${slug}?chapterPage=${page + 1}`}
                                scroll={false}
                            >
                                Next
                            </Link>
                        )}
                    </nav>
                </>
            )}
        </section>
    );
}

function SectionSkeleton({ title }: { title: string }) {
    return (
        <output
            aria-label={`loading ${title.toLowerCase()}`}
            className="space-y-5"
        >
            <h2 className="font-heading text-3xl">{title}</h2>
            <div className="h-48 animate-pulse rounded-lg bg-secondary" />
        </output>
    );
}
