"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import VerificationPending from "@/components/auth/verification-pending";
import { authClient } from "@/lib/auth/client";
import { readPendingVerification } from "@/lib/auth/verification-context";

type VerificationContext = {
    email: string | null;
    invalidLink: boolean;
};

export default function VerificationPage() {
    const [context, setContext] = useState<VerificationContext | null>(null);

    useEffect(() => {
        setContext({
            email: readPendingVerification(),
            invalidLink: new URLSearchParams(window.location.search).has(
                "error",
            ),
        });
    }, []);

    if (!context) {
        return (
            <div
                role="status"
                className="h-64 animate-pulse rounded-xl bg-secondary/40"
                aria-label="Loading verification details"
            />
        );
    }

    if (!context.email) {
        return (
            <section className="auth-form space-y-7">
                <div className="space-y-3">
                    <h1 className="text-4xl font-heading">
                        {context.invalidLink
                            ? "Verification link expired."
                            : "Verify your account."}
                    </h1>

                    <p className="text-sm leading-relaxed text-muted-foreground">
                        {context.invalidLink
                            ? "That verification link is no longer usable."
                            : "We don't have a pending verification request in this browser tab."}{" "}
                        Log in with your username and password. If your account
                        still needs verification, we'll send a fresh link
                        automatically.
                    </p>
                </div>

                <Link
                    href="/auth/login"
                    className="inline-flex h-12 w-full items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                    Continue to login
                </Link>
            </section>
        );
    }

    async function resend() {
        if (!context?.email) return;

        const { error } = await authClient.sendVerificationEmail({
            email: context.email,
            callbackURL: "/auth/verification",
        });

        if (error) {
            throw new Error(
                error.message ?? "Unable to send verification email.",
            );
        }
    }

    return (
        <VerificationPending
            email={context.email}
            invalidLink={context.invalidLink}
            onResend={resend}
        />
    );
}
