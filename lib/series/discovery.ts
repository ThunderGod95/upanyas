import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/prisma/generated/client";

import { LANGUAGE_OPTIONS, SORT_OPTIONS, STATUS_OPTIONS } from "./pretty";

export const SERIES_PAGE_SIZE = 24;
export const CHAPTER_PAGE_SIZE = 50;

export type DiscoveryFilters = {
    page: number;
    q: string;
    author: string;
    translator: string;
    genres: string[];
    tags: string[];
    language?: DiscoveryLanguage;
    originalLanguage?: DiscoveryLanguage;
    originalStatus?: DiscoveryStatus;
    translationStatus?: DiscoveryStatus;
    sort: DiscoverySort;
};

const publishedChapter = {
    archivedAt: null,
    publication: { isNot: null },
} as const;

export async function getDiscoveryFacets() {
    "use cache";

    cacheLife("days");
    cacheTag("series:facets");

    const [genres, tags] = await Promise.all([
        prisma.genre.findMany({
            where: {
                series: {
                    some: { visibility: "PUBLIC" },
                },
            },
            orderBy: { name: "asc" },
            select: { slug: true, name: true },
        }),
        prisma.tag.findMany({
            where: {
                series: {
                    some: {
                        visibility: "PUBLIC",
                    },
                },
            },
        }),
    ]);

    return { genres, tags };
}

export async function getDiscoverableSeries(filters: DiscoveryFilters) {
    "use cache";

    cacheLife("minutes");
    cacheTag("series:discovery");

    const where: Prisma.SeriesWhereInput = {
        visibility: "PUBLIC",

        ...(filters.q && {
            OR: [
                {
                    title: {
                        contains: filters.q,
                        mode: "insensitive",
                    },
                },
                {
                    shortDescription: {
                        contains: filters.q,
                        mode: "insensitive",
                    },
                },
            ],
        }),

        ...(filters.author && {
            authors: {
                some: {
                    author: {
                        name: {
                            contains: filters.author,
                            mode: "insensitive",
                        },
                    },
                },
            },
        }),

        ...(filters.translator && {
            translators: {
                some: {
                    translator: {
                        OR: [
                            {
                                penName: {
                                    contains: filters.translator,
                                    mode: "insensitive",
                                },
                            },
                            {
                                user: {
                                    name: {
                                        contains: filters.translator,
                                        mode: "insensitive",
                                    },
                                },
                            },
                        ],
                    },
                },
            },
        }),

        ...(filters.genres.length > 0 && {
            genres: {
                some: { slug: { in: filters.genres } },
            },
        }),

        ...(filters.tags.length > 0 && {
            tags: {
                some: { slug: { in: filters.tags } },
            },
        }),

        ...(filters.language && { language: filters.language }),
        ...(filters.originalLanguage && {
            originalLanguage: filters.originalLanguage,
        }),
        ...(filters.originalStatus && {
            originalStatus: filters.originalStatus,
        }),
        ...(filters.translationStatus && {
            translationStatus: filters.translationStatus,
        }),
    };

    const orderBy: Prisma.SeriesOrderByWithRelationInput[] =
        filters.sort === "title-asc"
            ? [{ title: "asc" }, { id: "asc" }]
            : filters.sort === "title-desc"
              ? [{ title: "desc" }, { id: "asc" }]
              : filters.sort === "updated"
                ? [{ updatedAt: "desc" }, { id: "asc" }]
                : filters.sort === "oldest"
                  ? [{ createdAt: "asc" }, { id: "asc" }]
                  : [
                        { publishedAt: "desc" },
                        { createdAt: "desc" },
                        { id: "asc" },
                    ];

    const [items, total] = await Promise.all([
        prisma.series.findMany({
            where,
            orderBy,
            skip: (filters.page - 1) * SERIES_PAGE_SIZE,
            take: SERIES_PAGE_SIZE,
            select: {
                id: true,
                slug: true,
                title: true,
                coverUrl: true,
                shortDescription: true,
                originalStatus: true,
                translationStatus: true,
                language: true,
                genres: {
                    select: { name: true, slug: true },
                },
                authors: {
                    orderBy: { position: "asc" },
                    select: {
                        author: { select: { name: true } },
                    },
                },
            },
        }),
        prisma.series.count({ where }),
    ]);

    return { items, total };
}

export const getVisibleSeries = cache(async (slug: string) => {
    return prisma.series.findFirst({
        where: {
            slug,
            visibility: { in: ["PUBLIC", "UNLISTED"] },
        },
        select: {
            id: true,
            slug: true,
            title: true,
            coverUrl: true,
            shortDescription: true,
            longDescription: true,
            visibility: true,
            originalLanguage: true,
            language: true,
            originalStatus: true,
            translationStatus: true,
            publishedAt: true,
            authors: {
                orderBy: { position: "asc" },
                select: {
                    author: {
                        select: { name: true, slug: true },
                    },
                },
            },
            translators: {
                orderBy: { position: "asc" },
                select: {
                    translator: {
                        select: { penName: true },
                    },
                },
            },
            genres: {
                select: { name: true, slug: true },
            },
            tags: {
                select: { name: true, slug: true },
            },
        },
    });
});

/**
 * Visible volumes containing at least one published chapter.
 */
export async function getPublishedVolumes(
    seriesId: string,
    orderBy: "asc" | "desc" = "asc",
) {
    "use cache";

    cacheLife("minutes");
    cacheTag(`series:${seriesId}:volumes`);

    return prisma.volume.findMany({
        where: {
            seriesId,
            chapters: { some: publishedChapter },
        },
        orderBy: { position: orderBy },
        select: {
            id: true,
            title: true,
            description: true,
            position: true,
            _count: {
                select: {
                    chapters: { where: publishedChapter },
                },
            },
        },
    });
}

export async function getPublishedChapters(seriesId: string, page: number) {
    "use cache";

    cacheLife("minutes");
    cacheTag(`series:${seriesId}:chapters`);

    const where = {
        seriesId,
        ...publishedChapter,
    };

    const [items, total] = await Promise.all([
        prisma.chapter.findMany({
            where,
            orderBy: { position: "asc" },
            skip: (page - 1) * CHAPTER_PAGE_SIZE,
            take: CHAPTER_PAGE_SIZE,
            select: {
                id: true,
                position: true,
                numberLabel: true,
                volume: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
                publication: {
                    select: {
                        publishedAt: true,
                        revision: {
                            select: { title: true },
                        },
                    },
                },
            },
        }),
        prisma.chapter.count({ where }),
    ]);

    return { items, total };
}

export type DiscoverySort = (typeof SORT_OPTIONS)[number]["value"];
export type DiscoveryLanguage = (typeof LANGUAGE_OPTIONS)[number]["value"];
export type DiscoveryStatus = (typeof STATUS_OPTIONS)[number]["value"];
export type DiscoverySeries = Awaited<
    ReturnType<typeof getDiscoverableSeries>
>["items"][number];
export type DiscoveryVolume = Awaited<
    ReturnType<typeof getPublishedVolumes>
>[number];
export type DiscoveryChapter = Awaited<
    ReturnType<typeof getPublishedChapters>
>["items"][number];
