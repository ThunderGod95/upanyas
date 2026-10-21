import { prisma } from "@/lib/prisma";

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
    },
    {
        title: "Journey through Myriad Paths",
        slug: "demo-myriad-paths",
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
    },
    {
        title: "No Money to Cultivate Immortality",
        slug: "demo-no-money",
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
    },
] as const;

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
    for (const entry of demoSeries) {
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
                shortDescription: entry.shortDescription,
                longDescription: entry.longDescription,
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

        console.log(`seeded: ${entry.title}`);
    }
}

async function main() {
    await seedReferenceData();

    if (process.argv.includes("--demo")) {
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
