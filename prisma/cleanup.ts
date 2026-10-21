import { prisma } from "@/lib/prisma";

async function main() {
    await prisma.$transaction([
        prisma.series.deleteMany({
            where: { slug: { startsWith: "demo-" } },
        }),
        prisma.author.deleteMany({
            where: {
                slug: { startsWith: "demo-" },
                userId: null,
            },
        }),
    ]);

    console.log("[success] demo data removed.");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
