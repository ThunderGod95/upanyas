"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/ui/utils";

export interface FeaturedNovel {
    id: string;
    title: string;
    description: string;
    cover: string;
    href: string;
}

export default function FeaturedNovels({ novels }: { novels: FeaturedNovel[] }) {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api) return;

        const update = () => {
            setCurrent(api.selectedScrollSnap());
        };

        update();
        api.on("select", update);
        api.on("reInit", update);

        return () => {
            api.off("select", update);
            api.off("reInit", update);
        };
    }, [api]);

    if (novels.length === 0) return null;

    return (
        <section
            aria-label="Featured novels"
            className="site-container grid h-[calc(100dvh-4.5rem)] min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-3 py-4 sm:gap-6 sm:py-7 lg:py-9"
        >
            <Carousel
                setApi={setApi}
                opts={{
                    align: "start",
                    loop: novels.length > 1,
                }}
                className="h-full min-h-0 w-full [&>div:first-child]:h-full"
            >
                <CarouselContent className="h-full">
                    {novels.map((novel, index) => (
                        <CarouselItem key={novel.id} className="h-full min-h-0">
                            <article className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:grid-rows-1 lg:gap-12">
                                <div className="order-2 flex min-h-0 min-w-0 flex-col justify-center gap-[clamp(0.4rem,1.8dvh,1.25rem)] lg:order-1 lg:pr-8">
                                    <h2 className="editorial-heading text-[clamp(1.75rem,4.5dvh,2.75rem)] lg:text-[clamp(2.25rem,min(5.5vw,8dvh),5rem)]">
                                        {novel.title}
                                    </h2>

                                    <p className="line-clamp-2 max-w-lg text-[clamp(0.75rem,1.7dvh,1rem)] leading-relaxed text-muted-foreground lg:line-clamp-3">
                                        {novel.description}
                                    </p>

                                    <Link
                                        href={novel.href}
                                        className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-foreground"
                                    >
                                        Explore the story
                                        <ArrowUpRight
                                            aria-hidden="true"
                                            className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                        />
                                    </Link>
                                </div>

                                <div className="relative order-1 flex min-h-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-secondary/40 p-[clamp(0.75rem,2.5dvh,2.5rem)] lg:order-2 lg:rounded-3xl">
                                    <div
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-4 rounded-xl border border-ornament/20 sm:inset-7"
                                    />

                                    <Image
                                        src={novel.cover}
                                        alt={`${novel.title} cover`}
                                        width={400}
                                        height={600}
                                        sizes="(max-width: 1024px) 60vw, 30vw"
                                        preload={index === 0}
                                        className="relative z-10 block h-auto max-h-full w-auto max-w-[75%] rounded-sm object-contain shadow-[0_20px_50px_-15px_rgb(0_0_0/0.35)]"
                                    />
                                </div>
                            </article>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            <div className="flex shrink-0 items-center justify-between gap-4 border-t border-border/80 pt-3 sm:pt-5">
                <div className="flex items-center gap-2">
                    <span className="mr-2 text-xs font-medium text-muted-foreground tabular-nums">
                        {String(current + 1).padStart(2, "0")}
                        <span className="mx-1.5 text-border">/</span>
                        {String(novels.length).padStart(2, "0")}
                    </span>

                    {novels.length > 1 && (
                        <div
                            role="group"
                            aria-label="Select featured novel"
                            className="flex items-center gap-1"
                        >
                            {novels.map((novel, index) => (
                                <button
                                    key={novel.id}
                                    type="button"
                                    onClick={() => api?.scrollTo(index)}
                                    aria-label={`Show ${novel.title}`}
                                    aria-pressed={current === index}
                                    className="flex size-9 items-center justify-center"
                                >
                                    <span
                                        className={cn(
                                            "h-0.75 rounded-full transition-all duration-300",
                                            current === index
                                                ? "w-7 bg-primary"
                                                : "w-3 bg-border hover:bg-muted-foreground",
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {novels.length > 1 && (
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => api?.scrollPrev()}
                            aria-label="Previous featured novel"
                            className="flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-ring"
                        >
                            <ArrowLeft className="size-4" />
                        </button>

                        <button
                            type="button"
                            onClick={() => api?.scrollNext()}
                            aria-label="Next featured novel"
                            className="flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-ring"
                        >
                            <ArrowRight className="size-4" />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
