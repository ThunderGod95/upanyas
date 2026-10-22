import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import { prisma } from "@/lib/prisma";

export const SERIES_PAGE_SIZE = 24;
export const CHAPTER_PAGE_SIZE = 50;

const publishedChapter = {
    archivedAt: null,
    publication: { isNot: null },
} as const;

export async function getDiscoverableSeries(page: number) {
    "use cache";

    cacheLife("minutes");
    cacheTag("series:discovery");

    const [items, total] = await Promise.all([
        prisma.series.findMany({
            where: { visibility: "PUBLIC" },
            orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }, { id: "asc" }],
            skip: (page - 1) * SERIES_PAGE_SIZE,
            take: SERIES_PAGE_SIZE,
            select: {
                id: true,
                slug: true,
                title: true,
                coverUrl: true,
                shortDescription: true,
                originalStatus: true,
                translationStatus: true,
                genres: {
                    select: { name: true, slug: true },
                },
            },
        }),
        prisma.series.count({ where: { visibility: "PUBLIC" } }),
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
export async function getPublishedVolumes(seriesId: string, orderBy: "asc" | "desc" = "asc") {
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
