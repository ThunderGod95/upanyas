"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import zod from "zod";

import { authClient } from "@/lib/auth/client";

import { Button } from "../shadcn/button";
import { Input } from "../shadcn/input";
import { Label } from "../shadcn/label";

const emailSchema = zod.object({
    newEmail: zod
        .string()
        .trim()
        .toLowerCase()
        .pipe(zod.email("Enter a valid email address.")),
});

const passwordSchema = zod
    .object({
        currentPassword: zod.string().min(1, "Enter your current password."),
        newPassword: zod
            .string()
            .min(8, "Password must be at least 8 characters.")
            .max(128, "Password cannot exceed 128 characters."),
        confirmPassword: zod.string().min(1, "Confirm your new password."),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        path: ["confirmPassword"],
        error: "Passwords do not match.",
    })
    .refine((data) => data.newPassword !== data.currentPassword, {
        path: ["newPassword"],
        error: "Choose a different password.",
    });

type EmailData = zod.infer<typeof emailSchema>;
type PasswordData = zod.infer<typeof passwordSchema>;

interface AccountSecurityProps {
    email: string;
    emailVerified: boolean;
}

export default function AccountSecurity({
    email,
    emailVerified,
}: AccountSecurityProps) {
    return (
        <section aria-labelledby="security-heading" className="mt-12">
            <div className="border-b border-border pb-6">
                <h2 id="security-heading" className="font-heading text-3xl">
                    Account Security
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    Manage your email address and password.
                </p>
            </div>

            <EmailSettings email={email} emailVerified={emailVerified} />

            <PasswordSettings />
        </section>
    );
}

function EmailSettings({ email, emailVerified }: AccountSecurityProps) {
    const [pendingEmail, setPendingEmail] = useState<string | null>(null);

    const form = useForm<EmailData>({
        resolver: zodResolver(emailSchema),
        mode: "onBlur",
        defaultValues: { newEmail: "" },
    });

    const { errors, isSubmitting, isDirty } = form.formState;

    async function onSubmit({ newEmail }: EmailData) {
        if (newEmail === email.trim().toLowerCase()) {
            form.setError("newEmail", {
                message: "This is already your current email address.",
            });
            return;
        }

        try {
            const { error } = await authClient.changeEmail({
                newEmail,
                callbackURL: "/user/me",
            });

            if (error) {
                form.setError("root", {
                    message: error.message ?? "Unable to request email change.",
                });
            }

            setPendingEmail(newEmail);
            form.reset();
        } catch {
            form.setError("root", {
                message: "Something went wrong. Please try again.",
            });
        }
    }

    const awaitingVerification =
        pendingEmail !== null &&
        pendingEmail.toLowerCase() !== email.toLowerCase();

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 border-b border-border py-8 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
                <div className="pt-1">
                    <Label htmlFor="security-email">Email address</Label>
                </div>

                <div className="max-w-md space-y-4">
                    <div className="space-y-1">
                        <p className="text-sm break-all">{email}</p>
                        <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            {emailVerified ? (
                                <>
                                    <Check className="size-3.5" /> Verified
                                </>
                            ) : (
                                "Not Verified"
                            )}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="security-email">
                            New email address
                        </Label>

                        <Input
                            id="security-email"
                            type="email"
                            autoComplete="email"
                            autoCapitalize="none"
                            spellCheck={false}
                            placeholder="you@example"
                            aria-invalid={!!errors.newEmail}
                            disabled={isSubmitting}
                            {...form.register("newEmail")}
                        />

                        {errors.newEmail && (
                            <p
                                role="alert"
                                className="text-xs text-destructive"
                            >
                                {errors.newEmail.message}
                            </p>
                        )}

                        <p className="text-xs leading-relaxed text-muted-foreground">
                            {emailVerified
                                ? "You'll first confirm the change through your current email, then verify the new address."
                                : "You'll need to verify the new address before the change takes effect."}
                        </p>

                        {errors.root && (
                            <p
                                role="alert"
                                className="text-sm text-destructive"
                            >
                                {errors.root.message}
                            </p>
                        )}

                        {awaitingVerification && (
                            <output className="text-sm text-muted-foreground">
                                Request received for {pendingEmail}.{" "}
                                {emailVerified
                                    ? `Check ${email} to approve the change.`
                                    : "Check the new address for a verification link."}
                            </output>
                        )}

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={!isDirty || isSubmitting}
                            >
                                {isSubmitting && <LoaderCircle />}
                                {isSubmitting ? "Sending..." : "Change email"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

function PasswordSettings() {
    const [changed, setChanged] = useState(false);

    const form = useForm<PasswordData>({
        resolver: zodResolver(passwordSchema),
        mode: "onBlur",
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const { errors, isSubmitting, isDirty } = form.formState;

    async function onSubmit(data: PasswordData) {
        setChanged(false);

        try {
            const { error } = await authClient.changePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
                revokeOtherSessions: true,
            });

            if (error) {
                form.setError("root", {
                    message: error.message ?? "Unable to change password.",
                });
                return;
            }

            form.reset();
            setChanged(true);
        } catch {
            form.setError("root", {
                message: "Something went wrong. Please try again.",
            });
        }
    }

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            onChange={() => setChanged(false)}
        >
            <div className="sm-gap-6 grid gap-4 py-8 sm:grid-cols-[10rem_minmax(0,1fr)]">
                <div className="pt-1">
                    <p className="text-sm font-medium">Password</p>
                </div>

                <div className="max-w-md space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="current-password">
                            Current password
                        </Label>
                        <Input
                            id="current-password"
                            type="password"
                            autoComplete="current-password"
                            aria-invalid={!!errors.currentPassword}
                            disabled={isSubmitting}
                            {...form.register("currentPassword")}
                        />

                        {errors.currentPassword && (
                            <p
                                role="alert"
                                className="text-xs text-destructive"
                            >
                                {errors.currentPassword.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="new-password">New password</Label>
                        <Input
                            id="new-password"
                            type="password"
                            autoComplete="new-password"
                            aria-invalid={!!errors.newPassword}
                            disabled={isSubmitting}
                            {...form.register("newPassword")}
                        />

                        <p className="text-xs text-muted-foreground">
                            8–128 characters.
                        </p>

                        {errors.newPassword && (
                            <p
                                role="alert"
                                className="text-xs text-destructive"
                            >
                                {errors.newPassword.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">
                            Confirm new password
                        </Label>
                        <Input
                            id="confirm-password"
                            type="password"
                            autoComplete="new-password"
                            aria-invalid={!!errors.confirmPassword}
                            disabled={isSubmitting}
                            {...form.register("confirmPassword")}
                        />

                        {errors.confirmPassword && (
                            <p
                                role="alert"
                                className="text-xs text-destructive"
                            >
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                        Changing your password will sign out your other active
                        sessions.
                    </p>

                    {errors.root && (
                        <p role="alert" className="text-sm text-destructive">
                            {errors.root.message}
                        </p>
                    )}

                    {changed && (
                        <output className="text-sm text-muted-foreground">
                            Password updated. Your other sessions have been
                            revoked.
                        </output>
                    )}

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={!isDirty || isSubmitting}
                        >
                            {isSubmitting && (
                                <LoaderCircle className="size-4 animate-spin" />
                            )}
                            {isSubmitting ? "Updating..." : "Update password"}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
