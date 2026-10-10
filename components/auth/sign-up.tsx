"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { z } from "zod";

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
        .min(8, {
            error: "Password must be atleast 8 characters.",
        })
        .max(16, {
            error: "Password cannot be more than 16 characters.",
        }),
});

export default function SignupForm() {
    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });
    const router = useRouter();

    const onSubmit = async (data: z.output<typeof signupSchema>) => {
        const { error } = await authClient.signUp.email({
            email: data.email,
            password: data.password,
            name: data.username,
            username: data.username,
        });

        if (error) {
            form.setError("root", {
                message: error.message ?? "Unable to create account.",
            });
            return;
        }

        router.replace("/");
    };

    return (
        <form id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <FieldSet>
                    <FieldLegend>Sign Up</FieldLegend>
                    <FieldDescription>
                        Create an account to discover new novels, track your
                        reading progress, build personalized reading lists, and
                        stay updated on the latest chapter releases.
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
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Type your {some adjective} username..."
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
                                        placeholder="alice@nu.io"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.error && (
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
                                <Field data-invalid={fieldState.error}>
                                    <FieldLabel htmlFor={field.name}>
                                        Password
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        type="password"
                                        placeholder="Type your secret password..."
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.error && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </FieldSet>

                {form.formState.errors.root && (
                    <FieldError role="alert">
                        {form.formState.errors.root.message}
                    </FieldError>
                )}

                <Field orientation="horizontal">
                    <Button type="submit" form="signup-form">
                        Sign Up
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    );
}
