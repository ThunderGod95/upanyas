"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

const loginSchema = z.object({
    username: z.string().trim().min(1, "Enter your username."),
    password: z.string().min(1, "Enter your password."),
    rememberMe: z.boolean(),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const router = useRouter();

    const form = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
            rememberMe: true,
        },
    });

    const { isSubmitting, errors } = form.formState;

    const onSubmit = async (data: LoginData) => {
        try {
            const { error } = await authClient.signIn.username({
                username: data.username,
                password: data.password,
                rememberMe: data.rememberMe,
            });

            if (error) {
                if (error.code === "EMAIL_NOT_VERIFIED") {
                    router.push("/auth/verification");
                    return;
                }

                form.setError("root", {
                    message: error.message ?? "Unable to log in. Please try again.",
                });
                return;
            }

            router.replace("/");
            router.refresh();
        } catch {
            form.setError("root", {
                message: "Something went wrong. Please try again.",
            });
        }
    };

    return (
        <form id="login-form" className="auth-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <FieldSet>
                    <FieldLegend>Log in</FieldLegend>
                    <FieldDescription>
                        Welcome back! Log in to track your reading progress, manage your reading
                        lists, and discover new novels.
                    </FieldDescription>

                    <FieldGroup>
                        <Controller
                            name="username"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        autoComplete="username"
                                        placeholder="Enter your username"
                                        aria-invalid={fieldState.invalid}
                                        disabled={isSubmitting}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        type="password"
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                        aria-invalid={fieldState.invalid}
                                        disabled={isSubmitting}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="rememberMe"
                            control={form.control}
                            render={({ field }) => (
                                <Field orientation="horizontal">
                                    <Checkbox
                                        id={field.name}
                                        name={field.name}
                                        checked={field.value}
                                        onCheckedChange={(checked) =>
                                            field.onChange(checked === true)
                                        }
                                        onBlur={field.onBlur}
                                        ref={field.ref}
                                        disabled={isSubmitting}
                                    />
                                    <FieldLabel htmlFor={field.name} className="font-normal">
                                        Remember me
                                    </FieldLabel>
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </FieldSet>

                {errors.root && <FieldError role="alert">{errors.root.message}</FieldError>}

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Logging in..." : "Log in"}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href="/auth/signup" className="font-medium text-primary hover:underline">
                        Sign up
                    </Link>
                </p>
            </FieldGroup>
        </form>
    );
}
