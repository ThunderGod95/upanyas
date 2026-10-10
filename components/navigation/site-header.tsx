import { LogIn, Search } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";

import ThemeToggle from "@/components/theme-toggle";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { authServer } from "@/lib/auth/server";

import { AccountMenu, DesktopNavigation, MobileNavigation } from "./site-header-client";

export default function SiteHeader() {
    return (
        <header className="site-header sticky top-0 z-50">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2"
            >
                Skip to content
            </a>

            <div className="site-container flex h-18 items-center gap-4 lg:gap-7">
                <Link
                    href="/"
                    aria-label="NovelUpdates home"
                    className="shrink-0 font-heading text-[2rem] leading-none tracking-[-0.07em] text-foreground"
                >
                    NU<span className="text-ornament">.</span>
                </Link>

                <DesktopNavigation />

                <div className="flex-1" />

                <form role="search" action="/search">
                    <InputGroup className="hidden h-10 w-[clamp(13rem,20vw,18rem)] xl:flex">
                        <InputGroupInput
                            type="search"
                            name="q"
                            aria-label="Search novels"
                            placeholder="Search novels..."
                            className="h-full"
                        />
                        <InputGroupAddon>
                            <Search aria-hidden="true" className="size-4 text-muted-foreground" />
                        </InputGroupAddon>
                    </InputGroup>
                </form>

                <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                    <ThemeToggle />

                    <Suspense
                        fallback={
                            <div className="h-9 w-9 animate-pulse rounded-lg bg-secondary sm:w-24" />
                        }
                    >
                        <HeaderAccount />
                    </Suspense>

                    <MobileNavigation />
                </div>
            </div>
        </header>
    );
}

async function HeaderAccount() {
    const session = await authServer.api.getSession({
        headers: await headers(),
    });

    if (session?.user) {
        return <AccountMenu name={session.user.name} email={session.user.email} />;
    }

    return (
        <>
            <Link
                href="/auth/login"
                className="hidden h-10 items-center rounded-lg px-3.5 text-[0.825rem] font-medium text-foreground transition-colors hover:bg-secondary sm:inline-flex"
            >
                Log in
            </Link>

            <Link
                href="/auth/login"
                aria-label="Log in"
                className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground sm:hidden"
            >
                <LogIn className="size-4.5" />
            </Link>
        </>
    );
}
