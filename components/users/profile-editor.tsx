"use client";

import z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth/client";
import { Button } from "../ui/button";
import { Camera, Check, LoaderCircle, Trash } from "lucide-react";
import { Input } from "../ui/input";

const profileSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Enter your display name.")
        .max(60, "Display name cannot exceed 60 characters."),
    username: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters.")
        .max(30, "Username cannot exceed 30 characters.")
        .regex(
            /^[a-zA-Z0-9_.]+$/,
            "Only letters, numbers, underscores, and dots are allowed.",
        ),
});

type ProfileData = z.infer<typeof profileSchema>;

interface ProfileUser {
    name: string;
    username: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
}

interface ProfileEditorProps {
    user: ProfileUser;
    memberSince: string;
}

export default function ProfileEditor({
    user,
    memberSince,
}: ProfileEditorProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const usernameCheckId = useRef(0);

    const [avatar, setAvatar] = useState(user.image);
    const [avatarBusy, setAvatarBusy] = useState(false);
    const [avatarError, setAvatarError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const form = useForm<ProfileData>({
        resolver: zodResolver(profileSchema),
        mode: "onBlur",
        defaultValues: {
            name: user.name,
            username: user.username,
        },
    });

    const { errors, isDirty, isSubmitting } = form.formState;
    const usernameField = form.register("username");

    async function checkUsername(value: string) {
        const checkId = ++usernameCheckId.current;
        const candidate = value.trim().toLowerCase();

        if (
            candidate === user.username.toLowerCase() ||
            !profileSchema.shape.username.safeParse(candidate).success
        ) {
            return;
        }

        try {
            const { data, error } = await authClient.isUsernameAvailable({
                username: candidate,
            });

            if (
                checkId !== usernameCheckId.current ||
                form.getValues("username").trim().toLowerCase() !== candidate
            ) {
                return;
            }

            if (!error && data && !data.available) {
                form.setError("username", {
                    type: "availability",
                    message: "This username is already taken.",
                });
            }
        } catch {}
    }

    async function saveProfile(data: ProfileData) {
        setSuccess(false);

        const name = data.name.trim();
        const username = data.username.trim().toLowerCase();

        const updates: { name?: string; username?: string } = {};

        if (name != user.name) updates.name = name;
        if (username !== user.username) updates.username = username;

        if (Object.keys(updates).length === 0) {
            form.reset({ name, username });
            return;
        }

        try {
            const { error } = await authClient.updateUser(updates);

            if (error) {
                form.setError("root", {
                    message: error.message ?? "Unable to update your profile.",
                });
                return;
            }

            form.reset({ name, username });
            setSuccess(true);
            router.refresh();
        } catch {
            form.setError("root", {
                message: "Something went wrong. Please try again.",
            });
        }
    }

    async function uploadAvatar(file: File) {
        setAvatarError(null);

        if (file.size > 2 * 1024 * 1024) {
            setAvatarError("The image must be 2 MiB or smaller.");
            return;
        }

        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            setAvatarError("Choose a JPEG, PNG, or WebP image.");
            return;
        }

        setAvatarBusy(true);

        try {
            const body = new FormData();
            body.append("file", file);

            const response = await fetch("/api/storage/avatars", {
                method: "POST",
                body,
            });

            const result = await response.json();

            if (!response.ok || typeof result.url !== "string") {
                throw new Error(result.error ?? "Unable to upload portrait.");
            }

            setAvatar(result.url);
            router.refresh();
        } catch (error) {
            setAvatarError(
                error instanceof Error ? error.message : "Upload failed.",
            );
        } finally {
            setAvatarBusy(false);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    }

    async function removeAvatar() {
        setAvatarError(null);
        setAvatarBusy(true);

        try {
            const response = await fetch("/api/storage/avatars", {
                method: "DELETE",
            });

            if (!response.ok) {
                const result = await response.json().catch(() => null);
                throw new Error(result?.error ?? "Unable to remove potrait.");
            }

            setAvatar(null);
            router.refresh();
        } catch (error) {
            setAvatarError(
                error instanceof Error ? error.message : "Removed failed.",
            );
        } finally {
            setAvatarBusy(false);
        }
    }

    return (
        <div className="max-w-3xl">
            <section
                aria-labelledby="potrait-heading"
                className="border-b border-border pb-7 sm:pb-9"
            >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 flex-1 items-center gap-5">
                        <div className="rounded-xl border border-ornament/25 p-1">
                            <Avatar className="size-19 rounded-lg sm:size-24">
                                <AvatarImage
                                    src={avatar ?? undefined}
                                    alt={`${user.name}'s portrait`}
                                    className="rounded-lg object-cover"
                                />
                                <AvatarFallback className="rounded-lg bg-accent font-heading text-4xl text-accent-foreground">
                                    {user.name.charAt(0).toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="min-w-0">
                            <h3
                                id="potrait-heading"
                                className="truncate font-heading text-2xl"
                            >
                                {user.name}
                            </h3>
                            <p className="truncate text-sm text-muted-foreground">
                                @{user.username}
                            </p>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Member since {memberSince}
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="sr-only"
                            accept="image/jpeg,image/png,image/webp"
                            aria-label="Choose a profile potrait"
                            disabled={avatarBusy}
                            onChange={(event) => {
                                const file = event.target.files?.[0];

                                if (file) void uploadAvatar(file);
                            }}
                        />

                        <Button
                            type="button"
                            variant="outline"
                            className="gap-2"
                            disabled={avatarBusy}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {avatarBusy ? (
                                <LoaderCircle className="size-4 animate-spin" />
                            ) : (
                                <Camera className="size-4" />
                            )}
                            change portrait
                        </Button>

                        {avatar && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label="Remove potrait"
                                title="Remove potrait"
                                disabled={avatarBusy}
                                onClick={removeAvatar}
                            >
                                <Trash className="size-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {avatarError && (
                    <p role="alert" className="mt-4 text-sm text-destructive">
                        {avatarError}
                    </p>
                )}

                <p className="mt-5 text-xs text-muted-foreground">
                    JPEG, PNG or WebP. Maximum 2 MiB. Images are cropped to a
                    square.
                </p>
            </section>

            <form onSubmit={form.handleSubmit(saveProfile)}>
                <div className="grid gap-4 border-b border-border py-8 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
                    <div className="pt-1">
                        <label
                            htmlFor="profile-name"
                            className="text-sm font-medium"
                        >
                            Display name
                        </label>
                    </div>

                    <div className="max-w-md space-y-2">
                        <Input
                            id="profile-name"
                            autoComplete="nickname"
                            placeholder="Your display name"
                            aria-invalid={!!errors.name}
                            disabled={isSubmitting}
                            className="h-11 border-input bg-card px-3.5 shadow-none"
                            {...form.register("name", {
                                onChange: () => setSuccess(false),
                            })}
                        />

                        {errors.name && (
                            <p
                                role="alert"
                                className="text-xs text-destructive"
                            >
                                {errors.name.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid gap-4 border-b border-border py-8 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
                    <div className="pt-1">
                        <label
                            htmlFor="profile-username"
                            className="text-sm font-medium"
                        >
                            Username
                        </label>
                    </div>

                    <div className="max-w-md space-y-2">
                        <Input
                            {...usernameField}
                            id="profile-username"
                            autoComplete="username"
                            autoCapitalize="none"
                            spellCheck={false}
                            aria-invalid={!!errors.username}
                            disabled={isSubmitting}
                            className="h-11 border-input bg-card px-3.5 shadow-none"
                            onChange={(event) => {
                                ++usernameCheckId.current;
                                usernameField.onChange(event);
                                setSuccess(false);

                                if (
                                    form.getFieldState("username").error
                                        ?.type === "availability"
                                ) {
                                    form.clearErrors("username");
                                }
                            }}
                            onBlur={(event) => {
                                usernameField.onBlur(event);
                                void checkUsername(event.currentTarget.value);
                            }}
                        />

                        <p className="text-xs text-muted-foreground">
                            3–30 characters. Letters, numbers, underscores and
                            periods.
                        </p>

                        {errors.username && (
                            <p
                                role="alert"
                                className="text-xs text-destructive"
                            >
                                {errors.username.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid gap-4 border-b border-border py-8 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
                    <p className="pt-1 text-sm font-medium">Email address</p>

                    <div className="min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                            <span className="break-all text-sm text-foreground">
                                {user.email}
                            </span>

                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                {user.emailVerified ? (
                                    <>
                                        <Check className="size-3.5" />
                                        Verified
                                    </>
                                ) : (
                                    "Not verified"
                                )}
                            </span>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            Email changes are not available yet.
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 pt-7 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 sm:col-start-2">
                        <div aria-live="polite" className="text-sm">
                            {errors.root && (
                                <p role="alert" className="text-destructive">
                                    {errors.root.message}
                                </p>
                            )}

                            {success && !errors.root && (
                                <p className="text-muted-foreground">
                                    Changes saved.
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={!isDirty || isSubmitting}
                            className="ml-auto h-10 px-5"
                        >
                            {isSubmitting && (
                                <LoaderCircle className="size-4 animate-spin" />
                            )}
                            {isSubmitting ? "Saving..." : "Save changes"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
