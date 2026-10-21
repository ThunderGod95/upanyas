import Link from "next/link";
import { Suspense } from "react";

import AuthenticatedContent from "@/components/authenticated-content";
import { Spinner } from "@/components/ui/spinner";

export default async function MeLayout({ children }: LayoutProps<"/user/me">) {
    return (
        <div className="site-container pt-10 pb-20 lg:pt-14">
            <div className="grid items-start gap-y-8 xl:grid-cols-[13rem_minmax(0,48rem)_13rem] xl:justify-center xl:gap-x-8 2xl:gap-x-12">
                <aside className="mx-auto w-full max-w-3xl border-b border-border pb-6 xl:sticky xl:top-28 xl:mx-0 xl:border-0 xl:pb-0">
                    <nav aria-label="Account navigation">
                        <Link
                            href="/user/me"
                            aria-current="page"
                            className="group flex items-center gap-3 border-l-2 border-ornament bg-secondary/50 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                        >
                            <span className="font-heading">01</span>
                            <span>Personal Details</span>
                        </Link>
                    </nav>
                </aside>

                <div className="mx-auto w-full max-w-3xl min-w-0 xl:mx-0">
                    <Suspense fallback={<Loading />}>
                        <AuthenticatedContent>{children}</AuthenticatedContent>
                    </Suspense>
                </div>

                <div
                    aria-hidden="true"
                    className="pointer-events-none hidden justify-self-center pt-3 font-heading text-[clamp(11rem,15vw,14rem)] leading-none text-ornament/8 select-none xl:block"
                >
                    U
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
