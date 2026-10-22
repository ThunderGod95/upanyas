"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type Props = {
    email?: string;
    username?: string;
    invalidLink?: boolean;
    onResend: () => Promise<void>;
    onBack?: () => void;
};

export default function VerificationPending({
    email,
    username,
    invalidLink = false,
    onResend,
    onBack,
}: Props) {
    const [busy, setBusy] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (cooldown === 0) return;

        const timer = setTimeout(() => {
            setCooldown((value) => Math.max(value - 1, 0));
        }, 1000);

        return () => clearTimeout(timer);
    }, [cooldown]);

    async function resend() {
        if (busy || cooldown > 0) return;

        setBusy(true);
        setMessage("");
        setError("");

        try {
            await onResend();

            setMessage(
                "If your account still needs verification, another link is on its way.",
            );
            setCooldown(60);
        } catch (cause) {
            setError(
                cause instanceof Error
                    ? cause.message
                    : "Unable to send another email.",
            );
        } finally {
            setBusy(false);
        }
    }

    return (
        <section className="auth-form space-y-7">
            <div className="space-y-3">
                <h1 className="text-4xl font-heading">
                    {invalidLink
                        ? "That link is no longer valid."
                        : "Check your inbox."}
                </h1>

                <p className="text-sm leading-relaxed text-muted-foreground">
                    {invalidLink
                        ? "The verification link may have expired or already been used. You can request another one below."
                        : "We've sent you a verification link. Open the email and follow the link to activate your account."}
                </p>
            </div>

            <div className="rounded-xl border border-border bg-card px-5 py-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {email ? "Email address" : "Account"}
                </p>

                <p className="mt-1 break-all text-sm font-semibold text-foreground">
                    {email ?? `@${username}`}
                </p>

                {!email && (
                    <p className="mt-2 text-xs text-muted-foreground">
                        The link was sent to the email address associated with
                        this account.
                    </p>
                )}
            </div>

            <div className="space-y-4">
                <Button
                    type="button"
                    className="w-full"
                    disabled={busy || cooldown > 0}
                    onClick={resend}
                >
                    {busy
                        ? "Sending..."
                        : cooldown > 0
                          ? `Resend available in ${cooldown}s`
                          : "Resend verification email"}
                </Button>

                {message && (
                    <p role="status" className="text-sm text-muted-foreground">
                        {message}
                    </p>
                )}

                {error && (
                    <p role="alert" className="text-sm text-destructive">
                        {error}
                    </p>
                )}

                <p className="text-center text-sm text-muted-foreground">
                    {onBack ? (
                        <button
                            type="button"
                            onClick={onBack}
                            className="font-medium text-primary hover:underline"
                        >
                            Back to login
                        </button>
                    ) : (
                        <Link
                            href="/auth/login"
                            className="font-medium text-primary hover:underline"
                        >
                            Return to login
                        </Link>
                    )}
                </p>
            </div>
        </section>
    );
}
