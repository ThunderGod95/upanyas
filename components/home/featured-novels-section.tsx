import { cacheLife, cacheTag } from "next/cache";

import { prisma } from "@/lib/prisma";

import FeaturedNovels from "./featured-novels-carousel";

export default async function FeaturedNovelsSection() {
    "use cache";

    cacheLife("days");
    cacheTag("home:featured");

    const featured = await prisma.featuredSeries.findMany({
        orderBy: [{ position: "asc" }, { seriesId: "asc" }],
        take: 5,
        select: {
            series: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    coverUrl: true,
                    shortDescription: true,
                },
            },
        },
    });

    const novels = featured.flatMap(({ series }) =>
        series.coverUrl
            ? [
                  {
                      id: series.id,
                      title: series.title,
                      description: series.shortDescription ?? "",
                      cover: series.coverUrl,
                      href: `/series/${series.slug}`,
                  },
              ]
            : [],
    );

    return <FeaturedNovels novels={novels} />;
}
