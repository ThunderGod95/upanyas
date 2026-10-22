import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { authServer } from "@/lib/auth/server";
import AuthScrollRegion from "@/components/auth/auth-scroll-region";

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
            <div
                aria-hidden="true"
                className="auth-art absolute inset-0 hidden lg:block"
            />

            <div
                aria-hidden="true"
                className="auth-panel pointer-events-none absolute inset-y-0 left-0 w-full lg:w-[60%]"
            />

            <AuthScrollRegion>
                <div className="flex min-h-full items-center px-6 py-12 sm:px-12 lg:pr-4 lg:pl-[clamp(3.5rem,9vw,10rem)]">
                    <div className="w-full max-w-105">
                        <Link
                            href="/"
                            className="mb-14 inline-flex items-baseline font-heading text-[2rem] leading-none tracking-[-0.06em] text-foreground"
                        >
                            Upanyas<span className="text-ornament">.</span>
                        </Link>

                        {children}
                    </div>
                </div>
            </AuthScrollRegion>
        </div>
    );
}
