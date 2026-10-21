import AuthenticatedContent from "@/components/authenticated-content";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { Suspense } from "react";

export default async function MeLayout({ children }: LayoutProps<"/user/me">) {
    return (
        <div className="site-container pb-20">
            <header className="relative isolate overflow-hidden border-b border-border py-12 sm:py-16 lg:py-20">
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-4 -top-20 -z-10 select-none font-heading text-[20rem] leading-none text-ornament/5.5 max-sm:hidden"
                >
                    U
                </span>
                <h1 className="editorial-heading mt-5 text-[clamp(3.25rem,7vw,6rem)]">
                    Your reading room<span className="text-ornament">.</span>
                </h1>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                    A personal corner of Upanyas, shaped around you.
                </p>
            </header>

            <div className="grid items-start gap-10 pt-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-18 lg:pt-14">
                <aside className="border-b border-border pb-6 lg:sticky lg:top-28 lg:border-0 lg:pb-0">
                    <nav aria-label="Account navigation">
                        <Link
                            href="/user/me"
                            className="group flex items-center gap-3 border-l-2 border-ornament bg-secondary/50 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                        >
                            <span className="font-heading">01</span>
                            <span>Personal Details</span>
                        </Link>
                    </nav>
                </aside>

                <div className="min-w-0">
                    <Suspense fallback={<Loading />}>
                        <AuthenticatedContent>{children}</AuthenticatedContent>
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

function Loading() {
    return (
        <div
            role="status"
            aria-label="Verifying your session"
            className="flex min-h-[50dvh] items-center justify-center"
        >
            <Spinner />
        </div>
    );
}
