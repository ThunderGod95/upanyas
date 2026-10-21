"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";

export default function VerificationPage() {
    const [email, setEmail] = useState("");
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState("");

    async function resend(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        if (busy) return;

        setBusy(true);
        setMessage("");

        try {
            const { error } = await authClient.sendVerificationEmail({
                email: email.trim(),
                callbackURL: "/user/me",
            });

            if (error) {
                setMessage(error.message ?? "Unable to send verification email.");
                return;
            }

            setMessage(
                "If this address has an unverified account, a verification link has been sent.",
            );
        } catch {
            setMessage("Unable to send email. Please try again.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <h1 className="font-heading text-3xl">Check your inbox</h1>

                <p className="text-sm text-muted-foreground">
                    We've sent a verification link to your email address. Follow the link to
                    activate your account.
                </p>
            </div>

            <form onSubmit={resend} className="space-y-4">
                <Input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    disabled={busy}
                />

                <Button type="submit" variant="outline" disabled={busy} className="w-full">
                    {busy ? "Sending..." : "Resend verification email"}
                </Button>
            </form>

            {message && (
                <p role="status" className="text-sm text-muted-foreground">
                    {message}
                </p>
            )}
        </div>
    );
}
