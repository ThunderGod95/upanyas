import { prisma } from "@/lib/prisma";

const DEMO_USER_ID = "demo-seed-translator";
const DEMO_USER_EMAIL = "seed-translator@example.invalid";
const DEMO_DATE = new Date("2026-10-01T12:00:00.000Z");

const genres = [
    ["Fantasy", "fantasy"],
    ["Xianxia", "xianxia"],
    ["Xuanhuan", "xuanhuan"],
    ["Wuxia", "wuxia"],
    ["Adventure", "adventure"],
    ["Romance", "romance"],
    ["Mystery", "mystery"],
    ["Horror", "horror"],
    ["Science Fiction", "science-fiction"],
    ["Slice of Life", "slice-of-life"],
] as const;

const tags = [
    ["Cultivation", "cultivation"],
    ["Martial Arts", "martial-arts"],
    ["Reincarnation", "reincarnation"],
    ["Transmigration", "transmigration"],
    ["Regression", "regression"],
    ["Weak to Strong", "weak-to-strong"],
    ["Kingdom Building", "kingdom-building"],
    ["Clan Building", "clan-building"],
    ["Political Intrigue", "political-intrigue"],
    ["Academy", "academy"],
    ["Slow Burn", "slow-burn"],
    ["Found Family", "found-family"],
    ["Revenge", "revenge"],
    ["Immortality", "immortality"],
] as const;

// Fictional sample data for development only.
const demoSeries = [
    {
        title: "The Mirror Legacy",
        slug: "demo-the-mirror-legacy",
        coverUrl:
            "https://cfzkhwyhqtjluxmcsljw.supabase.co/storage/v1/object/public/novel_covers/tml.png",
        shortDescription:
            "A mysterious bronze mirror sets a humble family on the path of immortal cultivation, beginning a struggle for survival and power across generations.",
        longDescription:
            "Lu Jiangxian died after staying up late one night. Yet, he finds his soul trapped in a fractured, bluish-gray bronze mirror. He falls into a boundless world of immortal cultivation and finds himself in the perilous landscape of Mount Dali. There, a small family from a small village by Meiche River picked the mirror up and is bestowed with the ancient teachings of the immortal ways, heralding the dawn of a splendid new era.",
        author: {
            name: "Example Author One",
            slug: "demo-author-one",
        },
        genres: ["fantasy", "xianxia", "mystery"],
        tags: [
            "cultivation",
            "transmigration",
            "weak-to-strong",
            "clan-building",
            "kingdom-building",
            "political-intrigue",
            "immortality",
        ],
        visibility: "PUBLIC",
        originalStatus: "ONGOING",
        translationStatus: "ONGOING",
        originalLanguage: "CHINESE",
        volumes: [
            "Azure Profundity in the River",
            "The Great Whale Beneath the Waning Moon",
        ],
    },
    {
        title: "Journey through Myriad Paths",
        slug: "demo-myriad-paths",
        coverUrl:
            "https://cfzkhwyhqtjluxmcsljw.supabase.co/storage/v1/object/public/novel_covers/myriad_daos.webp",
        shortDescription:
            "Once resigned to an ordinary life, Li Qi discovers a chance to rise and embarks on a journey of cultivation through a world of competing Daos.",
        longDescription: `Lush grass overgrows the earthen mound;\nA thousand years may bury the bones, but not the shame.\nThe world today is rife with eyes and ears,\nYet how many truly possess the clarity to see?\n\nHeaven blinds the eye to spare the heart its sorrow,\nYet mortals persist, insisting on the sight.\nThe dazzling affairs of the world are hard to fathom—\nBeyond Mount Wu, how many autumns fade?\n\nThe chronicles record but a few lines of names,\nWhile Mount Beimang holds countless desolate graves.\nThe lands of the old are seized by the new;\nSuch is the end of all dragon struggles and tiger fights.\n\nJust behold: Heaven and Earth endure forever.\nTen thousand streams rush the ravines—vying to be first, fearing to be last.\nYet the whisper comes: “The myriad daos are endless, and the journey spans the ages.”`,
        author: {
            name: "Example Author Two",
            slug: "demo-author-two",
        },
        genres: ["fantasy", "adventure", "mystery", "romance", "xianxia"],
        tags: [
            "cultivation",
            "transmigration",
            "weak-to-strong",
            "political-intrigue",
            "immortality",
        ],
        visibility: "PUBLIC",
        originalStatus: "ONGOING",
        translationStatus: "ONGOING",
        originalLanguage: "CHINESE",
        volumes: ["First Steps into the Jianghu", "Journey to Tang"],
    },
    {
        title: "No Money to Cultivate Immortality",
        slug: "demo-no-money",
        coverUrl:
            "https://cfzkhwyhqtjluxmcsljw.supabase.co/storage/v1/object/public/novel_covers/nmtci.jpg",
        shortDescription:
            "In a world where cultivation is a business and spiritual power can be bought on credit, penniless Zhang Yu must fight to afford immortality.",
        longDescription: `The old man asked, “Do you want revenge?"\n\nThe youth replied, “I have been repeatedly humiliated by the strong and treated like trash by my master; how could I not want revenge?”\n\nThe old man patted the youth's head and sighed, “Good child, let me pass on my cultivation to you.”\n\nThe youth exclaimed in shock, “Senior! How can I accept this?”\n\nThe old man extended his hand, saying, “Give me your phone.”\n\nThe youth stared at the changes on his phone and cried out in astonishment, ”Senior! Where did this hundred years of cultivation come from?”\n\nThe old man smiled faintly, “Good child, this is your reserve power in the Heavenly Court. Withdraw it whenever you need it in an emergency, and never suffer humiliation again.”\n\nThe youth frowned, asking, “Isn't this a magic power loan? I'm afraid...”\n\nThe old man replied, "The Heavenly Court is a major platform. New users get thirty days interest-free on a hundred-year cultivation loan, with daily interest as low as half a day's cultivation—less than what you gain from a single cycle of breathing exercises.”\n\n...\n\nZhang Yu snorted coldly and closed the advertisement."`,
        author: {
            name: "Example Author Three",
            slug: "demo-author-three",
        },
        genres: ["fantasy", "xianxia", "romance"],
        tags: [
            "cultivation",
            "transmigration",
            "weak-to-strong",
            "academy",
            "martial-arts",
        ],
        visibility: "PUBLIC",
        originalStatus: "ONGOING",
        translationStatus: "ONGOING",
        originalLanguage: "CHINESE",
        volumes: ["The Cost of Cultivation", "A Debt to Heaven"],
    },
    {
        title: "Unlisted Development Series",
        slug: "demo-unlisted",
        coverUrl: null,
        shortDescription: "A series for testing direct-link access.",
        longDescription:
            "Synthetic content for verifying unlisted series navigation.",
        author: {
            name: "Demo Unlisted Author",
            slug: "demo-author-unlisted",
        },
        genres: ["fantasy", "adventure"],
        tags: ["slow-burn"],
        visibility: "UNLISTED",
        originalStatus: "COMPLETED",
        translationStatus: "ONGOING",
        originalLanguage: "JAPANESE",
        volumes: ["Volume One", "Volume Two"],
    },
    {
        title: "Private Development Series",
        slug: "demo-private",
        coverUrl: null,
        shortDescription: "A private series for access-control testing.",
        longDescription:
            "Synthetic content for testing private series and drafts.",
        author: {
            name: "Demo Private Author",
            slug: "demo-author-private",
        },
        genres: ["fantasy"],
        tags: ["slow-burn"],
        visibility: "PRIVATE",
        originalStatus: "NOT_STARTED",
        translationStatus: "NOT_STARTED",
        originalLanguage: "KOREAN",
        volumes: ["Volume One", "Volume Two"],
    },
] as const;

const demoChapters = [
    {
        position: 1,
        volume: 1,
        numberLabel: "1",
        title: "The First Step",
        text: "The first chapter introduces the setting and its central conflict.",
        kind: "published",
    },
    {
        position: 2,
        volume: 1,
        numberLabel: "2",
        title: "A Change of Plans",
        text: "An unexpected decision changes the direction of the journey.",
        kind: "published-with-draft",
    },
    {
        position: 3,
        volume: 2,
        numberLabel: "3",
        title: "Work in Progress",
        text: "This chapter exists only as an unpublished working draft.",
        kind: "draft",
    },
    {
        position: 4,
        volume: null,
        numberLabel: "Extra",
        title: "An Archived Interlude",
        text: "This old chapter is retained for archive-related testing.",
        kind: "archived",
    },
] as const;

// Mirroring ProseMirror / Tiptap document structure
function documentFor(text: string) {
    return {
        type: "doc",
        content: [
            {
                type: "paragraph",
                content: [{ type: "text", text }],
            },
        ],
    };
}

function textCounts(text: string) {
    return {
        wordCount: text.trim().split(/\s+/).filter(Boolean).length,
        characterCount: Array.from(text).length,
    };
}

async function seedDemoChapters(
    seriesId: string,
    seriesTitle: string,
    volumeTitles: readonly string[],
    privateSeries: boolean,
) {
    const volumes = [];

    for (const [index, title] of volumeTitles.entries()) {
        const position = index + 1;

        const volume = await prisma.volume.upsert({
            where: {
                seriesId_position: { seriesId, position },
            },
            update: {},
            create: { seriesId, position, title },
        });

        volumes.push(volume);
    }

    for (const fixture of demoChapters) {
        // Private series contain drafts only.
        const kind = privateSeries ? "draft" : fixture.kind;

        const volumeId =
            fixture.volume === null ? null : volumes[fixture.volume - 1]!.id;

        const firstPublishedAt =
            kind === "published" ||
            kind === "published-with-draft" ||
            kind === "archived"
                ? DEMO_DATE
                : null;

        const chapter = await prisma.chapter.upsert({
            where: {
                seriesId_position: {
                    seriesId,
                    position: fixture.position,
                },
            },
            update: {},
            create: {
                seriesId,
                volumeId,
                position: fixture.position,
                numberLabel: fixture.numberLabel,
                firstPublishedAt,
                archivedAt:
                    kind === "archived"
                        ? new Date("2026-10-20T12:00:00.000Z")
                        : null,
            },
        });

        const text = `${seriesTitle}: ${fixture.text}`;
        let baseRevisionId: string | null = null;

        if (kind !== "draft") {
            const revision1 = await prisma.chapterRevision.upsert({
                where: {
                    chapterId_revisionNumber: {
                        chapterId: chapter.id,
                        revisionNumber: 1,
                    },
                },
                update: {},
                create: {
                    chapterId: chapter.id,
                    revisionNumber: 1,
                    title: fixture.title,
                    content: documentFor(text),
                    ...textCounts(text),
                    changeSummary: "Initial revision",
                    createdById: DEMO_USER_ID,
                },
            });

            let activeRevision = revision1;

            if (kind === "published-with-draft") {
                const revisedText = `${text} The conclusion has been revised.`;

                activeRevision = await prisma.chapterRevision.upsert({
                    where: {
                        chapterId_revisionNumber: {
                            chapterId: chapter.id,
                            revisionNumber: 2,
                        },
                    },
                    update: {},
                    create: {
                        chapterId: chapter.id,
                        revisionNumber: 2,
                        title: fixture.title,
                        content: documentFor(revisedText),
                        ...textCounts(revisedText),
                        changeSummary: "Revised conclusion",
                        createdById: DEMO_USER_ID,
                    },
                });
            }

            if (kind !== "archived") {
                await prisma.chapterPublication.upsert({
                    where: { chapterId: chapter.id },
                    update: {},
                    create: {
                        chapterId: chapter.id,
                        revisionId: activeRevision.id,
                        publishedAt: DEMO_DATE,
                    },
                });
            }

            baseRevisionId = activeRevision.id;
        }

        if (kind === "draft" || kind === "published-with-draft") {
            await prisma.chapterDraft.upsert({
                where: { chapterId: chapter.id },
                update: {},
                create: {
                    chapterId: chapter.id,
                    baseRevisionId,
                    title: fixture.title,
                    content: documentFor(
                        `${text} Unpublished working changes.`,
                    ),
                    translatorNote: "Synthetic development draft.",
                    version: kind === "draft" ? 1 : 2,
                    lastEditedById: DEMO_USER_ID,
                },
            });
        }
    }
}

async function seedReferenceData() {
    for (const [name, slug] of genres) {
        await prisma.genre.upsert({
            where: { slug },
            update: {},
            create: { name, slug },
        });
    }

    for (const [name, slug] of tags) {
        await prisma.tag.upsert({
            where: { slug },
            update: {},
            create: { name, slug },
        });
    }

    console.log("[success] genres and tags seeded.");
}

async function seedDemoSeries() {
    await prisma.user.upsert({
        where: { id: DEMO_USER_ID },
        update: {},
        create: {
            id: DEMO_USER_ID,
            email: DEMO_USER_EMAIL,
            name: "Development Translator",
            emailVerified: false,
        },
    });

    const translator = await prisma.translator.upsert({
        where: { userId: DEMO_USER_ID },
        update: {},
        create: {
            userId: DEMO_USER_ID,
            penName: "Development Translator",
        },
    });

    for (const [position, entry] of demoSeries.entries()) {
        const author = await prisma.author.upsert({
            where: { slug: entry.author.slug },
            update: {},
            create: entry.author,
        });

        const series = await prisma.series.upsert({
            where: { slug: entry.slug },
            update: {},
            create: {
                title: entry.title,
                slug: entry.slug,
                coverUrl: entry.coverUrl,
                shortDescription: entry.shortDescription,
                longDescription: entry.longDescription,
                visibility: entry.visibility,
                originalStatus: entry.originalStatus,
                translationStatus: entry.translationStatus,
                language: "ENGLISH" as const,
                publishedAt: entry.visibility === "PRIVATE" ? null : DEMO_DATE,
            },
        });

        await prisma.seriesAuthor.upsert({
            where: {
                seriesId_authorId: {
                    seriesId: series.id,
                    authorId: author.id,
                },
            },
            update: {},
            create: {
                seriesId: series.id,
                authorId: author.id,
                position: 0,
            },
        });

        await prisma.seriesTranslator.upsert({
            where: {
                seriesId_translatorId: {
                    seriesId: series.id,
                    translatorId: translator.id,
                },
            },
            update: {},
            create: {
                seriesId: series.id,
                translatorId: translator.id,
                position: 0,
            },
        });

        await prisma.series.update({
            where: { id: series.id },
            data: {
                genres: {
                    set: entry.genres.map((slug) => ({ slug })),
                },
                tags: {
                    set: entry.tags.map((slug) => ({ slug })),
                },
            },
        });

        if (entry.visibility === "PUBLIC" && position < demoSeries.length) {
            await prisma.featuredSeries.upsert({
                where: { seriesId: series.id },
                update: { position },
                create: {
                    seriesId: series.id,
                    position,
                },
            });
        } else {
            await prisma.featuredSeries.deleteMany({
                where: { seriesId: series.id },
            });
        }

        await seedDemoChapters(
            series.id,
            series.title,
            entry.volumes,
            series.visibility === "PRIVATE",
        );

        console.log(`[seed] ${series.slug}`);
    }
}

async function main() {
    await seedReferenceData();

    if (process.argv.includes("--demo")) {
        if (process.env.NODE_ENV === "production") {
            throw new Error("demo seeding is disabled in production.");
        }

        await seedDemoSeries();
    }

    console.log("[success] database seeding completed.");
}

main()
    .catch((error) => {
        console.error("[error] database seeding failed:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
