import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import AuthScrollRegion from "@/components/auth/auth-scroll-region";
import { authServer } from "@/lib/auth/server";

export const instant = false;

export default async function AuthLayout({ children }: LayoutProps<"/auth">) {
    const session = await authServer.api.getSession({
        headers: await headers(),
    });

    if (session) {
        redirect("/");
    }

    return (
        <div className="auth-shell relative isolate h-dvh overflow-hidden">
            <div aria-hidden="true" className="auth-art absolute inset-0 hidden lg:block" />

            <div
                aria-hidden="true"
                className="auth-panel pointer-events-none absolute inset-y-0 left-0 w-full lg:w-[60%]"
            />

            <div className="relative z-10 flex h-full min-h-0 flex-col lg:w-[calc(60%-7rem)]">
                <header className="shrink-0 px-6 pt-8 sm:px-12 sm:pt-10 lg:pr-4 lg:pl-[clamp(3.5rem,9vw,10rem)]">
                    <Link
                        href="/"
                        className="inline-flex items-baseline font-heading text-[1.375rem] leading-none tracking-tighter text-foreground/75 transition-colors hover:text-foreground"
                    >
                        Upanyas<span className="text-ornament">.</span>
                    </Link>
                </header>

                <AuthScrollRegion>
                    <div className="flex min-h-full items-center px-6 py-8 sm:px-12 lg:pr-4 lg:pl-[clamp(3.5rem,9vw,10rem)]">
                        <div className="w-full max-w-105">{children}</div>
                    </div>
                </AuthScrollRegion>
            </div>
        </div>
    );
}
