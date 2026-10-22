"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/shadcn/button";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { authClient } from "@/lib/auth/client";
import { savePendingVerification } from "@/lib/auth/verification-context";

const signupSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters.")
        .max(30, "Username cannot exceed 30 characters.")
        .regex(
            /^[a-zA-Z0-9_.]+$/,
            "Only letters, numbers, underscores, and dots are allowed.",
        ),
    email: z.email(),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters.")
        .max(16, "Password cannot exceed 16 characters."),
});

type SignupData = z.infer<typeof signupSchema>;

export default function SignupForm() {
    const router = useRouter();
    const usernameCheckId = useRef(0);

    const form = useForm<SignupData>({
        resolver: zodResolver(signupSchema),
        mode: "onBlur",
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    const { isSubmitting, errors } = form.formState;

    const checkUsername = async (username: string) => {
        const checkId = ++usernameCheckId.current;

        if (!signupSchema.shape.username.safeParse(username).success) {
            return;
        }

        try {
            const { data, error } = await authClient.isUsernameAvailable({
                username,
            });

            // Ignore responses for outdated values or requests.
            if (
                checkId !== usernameCheckId.current ||
                form.getValues("username") !== username
            ) {
                return;
            }

            if (error || !data) return;

            if (!data.available) {
                form.setError("username", {
                    type: "availability",
                    message: "This username is already taken.",
                });
            } else if (
                form.getFieldState("username").error?.type === "availability"
            ) {
                form.clearErrors("username");
            }
        } catch {
            // The signup endpoint will enforce uniqueness.
        }
    };

    const onSubmit = async (data: SignupData) => {
        try {
            const { error } = await authClient.signUp.email({
                username: data.username,
                name: data.username,
                email: data.email,
                password: data.password,
                callbackURL: "/user/me",
            });

            if (error) {
                form.setError("root", {
                    message:
                        error.message ??
                        "Unable to create account. Please try again.",
                });
                return;
            }

            savePendingVerification(data.email);
            router.replace("/auth/verification");
        } catch {
            form.setError("root", {
                message: "Something went wrong. Please try again.",
            });
        }
    };

    return (
        <form
            id="signup-form"
            className="auth-form"
            onSubmit={form.handleSubmit(onSubmit)}
        >
            <FieldGroup>
                <FieldSet>
                    <FieldLegend>Sign up</FieldLegend>
                    <FieldDescription>
                        Join our community to discover new novels, track your
                        reading progress, and create personalized reading lists.
                    </FieldDescription>

                    <FieldGroup>
                        <Controller
                            name="username"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Username
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="Choose a username"
                                        autoComplete="username"
                                        autoCapitalize="none"
                                        spellCheck={false}
                                        aria-invalid={fieldState.invalid}
                                        disabled={isSubmitting}
                                        onChange={(event) => {
                                            ++usernameCheckId.current;
                                            field.onChange(event);

                                            if (
                                                form.getFieldState("username")
                                                    .error?.type ===
                                                "availability"
                                            ) {
                                                form.clearErrors("username");
                                            }
                                        }}
                                        onBlur={() => {
                                            field.onBlur();
                                            void checkUsername(field.value);
                                        }}
                                    />
                                    <FieldDescription>
                                        3–30 characters. Letters, numbers,
                                        underscores, and dots.
                                    </FieldDescription>
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Email
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        type="email"
                                        autoComplete="email"
                                        placeholder="you@example.com"
                                        aria-invalid={fieldState.invalid}
                                        disabled={isSubmitting}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Password
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder="Create a password"
                                        aria-invalid={fieldState.invalid}
                                        disabled={isSubmitting}
                                    />
                                    <FieldDescription>
                                        Must be 8–16 characters long.
                                    </FieldDescription>
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </FieldSet>

                {errors.root && (
                    <FieldError role="alert">{errors.root.message}</FieldError>
                )}

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                >
                    {isSubmitting ? "Creating account..." : "Create account"}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                        href="/auth/login"
                        className="font-medium text-primary hover:underline"
                    >
                        Log in
                    </Link>
                </p>
            </FieldGroup>
        </form>
    );
}
