import { prisma } from "@/lib/prisma";

const DEMO_SERIES_SLUGS = [
    "demo-the-mirror-legacy",
    "demo-myriad-paths",
    "demo-no-money",
    "demo-unlisted",
    "demo-private",
];

const DEMO_AUTHOR_SLUGS = [
    "demo-author-one",
    "demo-author-two",
    "demo-author-three",
    "demo-author-unlisted",
    "demo-author-private",
];

const DEMO_USER_ID = "demo-seed-translator";
const DEMO_USER_EMAIL = "seed-translator@example.invalid";

async function main() {
    if (process.env.NODE_ENV === "production") {
        throw new Error("Demo cleanup is disabled in production.");
    }

    await prisma.$transaction(
        async (tx) => {
            const series = await tx.series.findMany({
                where: { slug: { in: DEMO_SERIES_SLUGS } },
                select: { id: true },
            });

            const seriesIds = series.map(({ id }) => id);

            const chapters = await tx.chapter.findMany({
                where: { seriesId: { in: seriesIds } },
                select: { id: true },
            });

            const chapterIds = chapters.map(({ id }) => id);

            // Remove restrictive references before revisions.
            await tx.chapterPublication.deleteMany({
                where: { chapterId: { in: chapterIds } },
            });

            await tx.chapterDraft.deleteMany({
                where: { chapterId: { in: chapterIds } },
            });

            await tx.chapterRevision.deleteMany({
                where: { chapterId: { in: chapterIds } },
            });

            // Cascades remove volumes, chapters,
            // featured entries and contributor associations.
            await tx.series.deleteMany({
                where: { id: { in: seriesIds } },
            });

            // Keep author records referenced by other series.
            await tx.author.deleteMany({
                where: {
                    slug: { in: DEMO_AUTHOR_SLUGS },
                    userId: null,
                    series: { none: {} },
                },
            });

            // Keep translator profiles still in use.
            await tx.translator.deleteMany({
                where: {
                    userId: DEMO_USER_ID,
                    series: { none: {} },
                },
            });

            // Remove the synthetic user only if unused.
            await tx.user.deleteMany({
                where: {
                    id: DEMO_USER_ID,
                    email: DEMO_USER_EMAIL,
                    sessions: { none: {} },
                    accounts: { none: {} },
                    authorProfile: { is: null },
                    translatorProfile: { is: null },
                    chapterDraftEdits: { none: {} },
                    chapterRevisions: { none: {} },
                },
            });
        },
        { timeout: 30_000 },
    );

    console.log("[success] demo records removed.");
}

main()
    .catch((error) => {
        console.error("[error] cleanup failed:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
